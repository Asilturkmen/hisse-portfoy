import { useState, useEffect, useRef } from 'react';
import AddStockForm from './components/AddStockForm';
import StockCard from './components/StockCard';
import EditStockForm from './components/EditStockForm';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Pasta grafiği için renk paleti
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

function App() {
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem("stocks");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingStock, setEditingStock] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const installPromptShown = useRef(false);

  // Portföy geçmişini kaydet
  useEffect(() => {
    const totalValue = stocks.reduce((total, stock) => total + stock.quantity * stock.price, 0);
    setPortfolioHistory(prev => [...prev, {
      date: new Date().toISOString(),
      value: totalValue
    }]);
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      if (!installPromptShown.current) {
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
        installPromptShown.current = true;
      }
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleAddStock = (newStock) => {
    setStocks((prevStocks) => {
      const existingIndex = prevStocks.findIndex(
        (s) => s.symbol === newStock.symbol
      );

      if (existingIndex !== -1) {
        const existingStock = prevStocks[existingIndex];
        
        const totalQuantity = existingStock.quantity + newStock.quantity;
        
        const totalCost = (existingStock.price * existingStock.quantity) + (newStock.buyPrice * newStock.quantity);
        const averagePrice = totalCost / totalQuantity;

        const updatedStock = {
          ...existingStock,
          quantity: totalQuantity,
          price: averagePrice
        };

        const updatedStocks = [...prevStocks];
        updatedStocks[existingIndex] = updatedStock;
        return updatedStocks;
      } else {
        return [...prevStocks, {
          ...newStock,
          name: newStock.instrument_name,
          price: newStock.buyPrice
        }];
      }
    });
  };

  const handleDeleteStock = (symbol) => {
    setStocks(prevStocks => prevStocks.filter(stock => stock.symbol !== symbol));
  };

  const handleEditStock = (stock) => {
    setEditingStock(stock);
  };

  const handleSaveEdit = (updatedStock) => {
    setStocks(prevStocks => 
      prevStocks.map(stock => 
        stock.symbol === updatedStock.symbol ? updatedStock : stock
      )
    );
    setEditingStock(null);
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
  };

  // Pasta grafiği için veri hazırlama
  const pieData = stocks.map((stock, index) => ({
    name: stock.symbol,
    quantity: stock.quantity,
    value: stock.quantity * stock.price,
    color: COLORS[index % COLORS.length]
  }));

  // Toplam portföy değeri
  const totalPortfolioValue = stocks.reduce((total, stock) => total + stock.quantity * stock.price, 0);

  // Özel tooltip bileşeni
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-gray-600">Adet: {data.quantity}</p>
          <p className="text-gray-600">Değer: ₺{data.value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            📈 Hisse Portföyü
          </h1>
        </motion.div>
        
        {/* Pasta Grafiği */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <ChartBarIcon className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold">Portföy Dağılımı</h2>
          </div>
          
          <div className="h-[450px] flex items-center justify-center">
            {stocks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine
                    outerRadius={window.innerWidth < 768 ? 100 : 150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelStyle={{ fontSize: window.innerWidth < 768 ? '10px' : '12px' }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-secondary-400 text-center">
                Henüz hisse eklenmemiş
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-secondary-400">Toplam Portföy Değeri:</span>
            <span className="text-xl font-bold text-primary-400">
              ₺{totalPortfolioValue.toFixed(2)}
            </span>
          </div>
        </motion.div>

        <AddStockForm onStockAdd={handleAddStock} />

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.name}
                quantity={stock.quantity}
                price={stock.price}
                onDelete={handleDeleteStock}
                onEdit={handleEditStock}
              />
            ))}
          </div>
        </AnimatePresence>

        {editingStock && (
          <EditStockForm
            stock={editingStock}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}

        {showInstallPrompt && (
          <button
            onClick={() => {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(() => {
                  setDeferredPrompt(null);
                  setShowInstallPrompt(false);
                });
              }
            }}
            className="fixed bottom-5 right-5 bg-primary-500 text-white px-4 py-2 rounded shadow-lg z-50"
          >
            📲 Uygulamayı Yükle
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
