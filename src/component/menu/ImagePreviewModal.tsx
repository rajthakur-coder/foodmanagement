import React from "react";
import { RiStarFill } from "react-icons/ri";

interface PreviewProps {
  item: any;
  onClose: () => void;
  onAdd: (item: any) => void;
}

const ImagePreviewModal: React.FC<PreviewProps> = ({ item, onClose, onAdd }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="relative max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button data-no-ripple onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md">✕</button>
        <div className="w-full h-64 md:h-96 relative">
          <img src={item.item_icon || "/images/default-food.jpg"} className="w-full h-full object-cover" alt={item.name} />
          {item.rating && (
            <div className="absolute bottom-4 left-6 bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 font-black shadow-xl">
              {item.rating} <RiStarFill size={14} />
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{item.name}</h2>
            <div className={`mt-2 flex items-center justify-center w-4 h-4 border-2 rounded-sm ${item.type === "Veg" ? "border-green-600" : "border-red-600"}`}>
              <div className={`w-2 h-2 rounded-full ${item.type === "Veg" ? "bg-green-600" : "bg-red-600"}`}></div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">{item.description || "Freshly sourced ingredients with authentic flavors."}</p>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-black text-gray-900 dark:text-white">₹{item.min_price ?? item.max_price}</p>
            <button  onClick={() => { onClose(); onAdd(item); }} className="bg-orange-500 text-white px-8 py-2.5 rounded-xl font-bold active:scale-95 transition-transform">ADD TO CART</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;