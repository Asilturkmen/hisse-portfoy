import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

function EditStockForm({ stock, onSave, onCancel }) {
  const [quantity, setQuantity] = useState(stock.quantity);
  const [price, setPrice] = useState(stock.price);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="card w-full max-w-sm relative"
        >
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 text-secondary-400 hover:text-white transition-colors duration-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <h3 className="text-lg font-semibold mb-4">{stock.symbol} Hisse Düzenle</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-secondary-400 mb-1">
                Adet
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="input w-full"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-400 mb-1">
                Ortalama Alış Fiyatı
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="input w-full"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onSave({ ...stock, quantity, price })}
              className="button button-primary flex-1"
            >
              Kaydet
            </button>
            <button
              onClick={onCancel}
              className="button button-secondary flex-1"
            >
              İptal
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default EditStockForm; 