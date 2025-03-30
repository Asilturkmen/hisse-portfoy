import { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function AddStockForm({ onStockAdd }) {
  const [stockName, setStockName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [buyPrice, setBuyPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const API_KEY = import.meta.env.VITE_API_KEY;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.twelvedata.com/symbol_search?symbol=${stockName}&apikey=${API_KEY}`
      );
      const data = await res.json();

      const bistStock = data.data?.find((item) =>
        item.exchange === "BIST" && item.country === "Turkey"
      );

      if (!bistStock) {
        setError("Böyle bir hisse bulunamadı.");
      } else {
        onStockAdd({
          ...bistStock,
          buyPrice: parseFloat(buyPrice),
          quantity: parseInt(quantity)
        });
        setStockName("");
        setBuyPrice("");
        setQuantity("");
      }
    } catch (err) {
      console.error(err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }

    setLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card mb-8"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            placeholder="Hisse adı gir (örn: aselsan)"
            className="input w-full pl-10"
            required
          />
        </div>
        
        <div className="flex-1">
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            placeholder="Alış fiyatı"
            className="input w-full"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="flex-1">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Adet"
            className="input w-full"
            min="1"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="button button-primary whitespace-nowrap"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Aranıyor...</span>
            </div>
          ) : (
            "Ekle"
          )}
        </button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm mt-4"
        >
          {error}
        </motion.p>
      )}
    </motion.form>
  );
}

export default AddStockForm;