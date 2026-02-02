import React from "react";
import { RiStarFill } from "react-icons/ri";

interface MenuItemCardProps {
  item: any;
  onImageClick: (item: any) => void;
  onAddClick: (item: any) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onImageClick, onAddClick }) => {
  return (
    <div className="group flex flex-col overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
      <div className="relative w-full h-32 md:h-40 overflow-hidden bg-gray-100 cursor-zoom-in" onClick={() => onImageClick(item)}>
        <img src={item.item_icon || "/images/default-food.jpg"} alt={item.name} loading="lazy" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
        {item.rating && (
          <div className="absolute bottom-2 left-2 bg-green-700 text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-lg">
            <span className="text-[10px] font-black">{item.rating}</span>
            <RiStarFill className="text-white" size={10} />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h5 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-100 leading-tight line-clamp-1">{item.name}</h5>
          <div className={`flex-shrink-0 mt-1 flex items-center justify-center w-3.5 h-3.5 border-2 rounded-sm ${item.type === "Veg" ? "border-green-600" : "border-red-600"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.type === "Veg" ? "bg-green-600" : "bg-red-600"}`}></div>
          </div>
        </div>

        {item.rating_count > 0 && (
          <p className="text-[9px] text-gray-400 font-bold mb-1 uppercase tracking-tight">{item.rating_count}+ Ratings</p>
        )}

<p className="text-[10px] md:text-xs text-gray-400 mb-2 truncate">
  {item.description}
</p>
        
        <div className="flex items-center justify-between mt-auto">
          <p className="text-sm md:text-lg font-black text-gray-900 dark:text-white">₹{item.min_price ?? item.max_price}</p>
          <button onClick={() => onAddClick(item)} className="px-4 py-1.5 text-[10px] md:text-xs font-bold text-white bg-orange-500 rounded-lg shadow-sm active:scale-95 transition-transform">ADD</button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;