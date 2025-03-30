import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { s } from "framer-motion/client";

function StockCard({ symbol, name, quantity, price, onDelete, onEdit }) {
    const totalValue = quantity * price;
    const [currentPrice, setCurrentPrice] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                console.log(symbol);
                
                const res = await fetch(
                    `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${import.meta.env.VITE_API_KEY}`
                );
                const data = await res.json();
                console.log(data);
                if (data.price) {
                    setCurrentPrice(parseFloat(data.price));
                } else {
                    setError("Fiyat bulunamadı.");
                }
            } catch (err) {
                setError("Fiyat alınamadı.");
            }
        };

        fetchPrice();
    }, [symbol]);

    const profitRatio = currentPrice
        ? ((currentPrice - price) / price) * 100
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card relative group"
        >
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => onEdit({ symbol, name, quantity, price })}
                    className="p-1.5 rounded-full bg-primary-500/20 hover:bg-primary-500/30 transition-colors duration-300"
                >
                    <PencilIcon className="w-4 h-4 text-primary-400" />
                </button>
                <button
                    onClick={() => onDelete(symbol)}
                    className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors duration-300"
                >
                    <TrashIcon className="w-4 h-4 text-red-400" />
                </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <span className="text-xl">📈</span>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">{symbol}</h2>
                    <p className="text-secondary-400 text-sm">{name}</p>
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <span className="text-secondary-400 text-sm">Adet:</span>
                    <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-secondary-400 text-sm">Ortalama Alış Fiyatı:</span>
                    <span className="font-medium">₺{price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-secondary-400 text-sm">Toplam Değer:</span>
                    <span className="font-medium">₺{totalValue.toFixed(2)}</span>
                </div>

                {currentPrice !== null ? (
                    <>
                        <div className="flex justify-between items-center">
                            <span className="text-secondary-400 text-sm">Güncel Fiyat:</span>
                            <span className="font-medium">₺{currentPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-secondary-400 text-sm">Kar/Zarar:</span>
                            <span className={`font-medium ${profitRatio >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                %{profitRatio.toFixed(2)}
                            </span>
                        </div>
                    </>
                ) : error ? (
                    <p className="text-red-400 text-sm">{error}</p>
                ) : (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default StockCard;