
// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetMenuQuery } from "../../../features/menu/menuApi";

// // Components
// import SearchBar from "../../../components/Common/SearchInput";
// import ToggleButton from "../../../components/Common/ToggleButton";
// import ItemSuccessModal from "../../../components/Modal/AddOrderModal";
// import Skeleton from "../../../components/Common/Skeleton";

// // Assets
// import banner from "../../../assets/Images/banner.avif";
// import mobileBanner from "../../../assets/Images/logo2.jpg";
// import nofound from "../../../assets/Images/nofound.png";

// const Menu: React.FC = () => {
//   const navigate = useNavigate();
//   const restaurantId = sessionStorage.getItem("restaurant_id");
//   const tableId = sessionStorage.getItem("table_id");

//   const { data: menuData, isLoading, error } = useGetMenuQuery(
//     { restaurant_id: restaurantId! },
//     { skip: !restaurantId || !tableId, refetchOnMountOrArgChange: false }
//   );

//   useEffect(() => {
//     if (!restaurantId || !tableId) {
//       navigate("/error/404", { replace: true });
//     }
//   }, [restaurantId, tableId, navigate]);

//   const categories = menuData?.data?.data || [];
//   const [activeTab, setActiveTab] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [vegOnly, setVegOnly] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<any>(null);

//   const categoriesRef = useRef<HTMLDivElement[]>([]);

//   useEffect(() => {
//     if (categories.length > 0 && !activeTab) {
//       setActiveTab(categories[0].category_id);
//     }
//   }, [categories, activeTab]);

//   const activeCategory = useMemo(() => {
//     return categories.find((cat: any) => cat.category_id === activeTab);
//   }, [categories, activeTab]);

//   const items = activeCategory?.items || [];

//   const filteredItems = useMemo(() => {
//     return items
//       .filter((item: any) => (vegOnly ? item.type === "Veg" : true))
//       .filter((item: any) =>
//         item.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//   }, [items, vegOnly, searchTerm]);

//   useEffect(() => {
//     const idx = categories.findIndex(cat => cat.category_id === activeTab);
//     if (idx !== -1 && categoriesRef.current[idx]) {
//       categoriesRef.current[idx].scrollIntoView({
//         behavior: "smooth",
//         inline: "center",
//         block: "nearest",
//       });
//     }
//   }, [activeTab, categories]);

//   const handleAddClick = (item: any) => {
//     setSelectedItem(item);
//     setIsModalOpen(true);
//   };

//   if (error) return (
//     <div className="flex items-center justify-center h-screen text-red-500 font-medium">
//       Failed to load menu. Please try again.
//     </div>
//   );

//   return (
//     <div className="min-h-full bg-white dark:bg-gray-900">
      
//       {/* SECTION 1: BANNER WITH OVERLAPPING SEARCH */}
//       <div className="relative">
//         <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden">
//           <img 
//             src={banner} 
//             className="hidden md:block w-full h-full object-cover" 
//             alt="Restaurant Banner" 
//           />
//           <img 
//             src={mobileBanner} 
//             className="block md:hidden w-full h-full object-cover" 
//             alt="Restaurant Mobile Banner" 
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
//         </div>

//         <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 w-[92%] max-w-4xl z-30">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-2 md:p-3 flex items-center gap-2 md:gap-4">
//             <div className="flex-1">
//               <SearchBar 
//                 value={searchTerm} 
//                 onChange={(e) => setSearchTerm(e.target.value)} 
//                 placeholder="Search for food, drinks..." 
//               />
//             </div>
//             <div className="h-10 w-[1px] bg-gray-200 dark:bg-gray-600 hidden sm:block"></div>
//             <div className="flex-shrink-0">
//               <ToggleButton 
//                 isOn={vegOnly} 
//                 onToggle={() => setVegOnly(!vegOnly)} 
//                 size="sm" 
//                 onColor="bg-green-600" 
//                 offColor="bg-gray-300" 
//                 showLabels 
//                 onLabel="Veg" 
//                 offLabel="All" 
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="px-4 mt-12">
//         <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 pt-4 pb-2">
//           <h4 className="mb-0 text-lg font-bold text-gray-800 dark:text-white px-1">Explore Categories</h4>
//           <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 pt-4">
//             {isLoading ? Array.from({ length: 6 }).map((_, idx) => (
//               <div key={idx} className="flex-shrink-0 flex flex-col items-center gap-2">
//                  <Skeleton type="tabs" shape="circle" columns={1} />
//               </div>
//             )) : categories.map((cat, idx) => (
//               <div 
//                 key={cat.category_id} 
//                 ref={el => (categoriesRef.current[idx] = el!)} 
//                 onClick={() => setActiveTab(cat.category_id)} 
//                 className="text-center cursor-pointer flex-shrink-0 group"
//               >
//                 <div className={`w-16 h-16 md:w-20 md:h-20  rounded-full border-2 overflow-hidden transition-transform duration-200 active:scale-90 ${activeTab === cat.category_id ? "border-orange-500 scale-105" : "border-gray-100 dark:border-gray-700"}`}>
//                   <img src={cat.category_icon || "/images/default-category.png"} alt={cat.category_name} className="object-cover w-full h-full" loading="lazy" />
//                 </div>
//                 <p className={`mt-2 text-[11px] md:text-sm font-bold truncate max-w-[5rem] ${activeTab === cat.category_id ? "text-orange-600" : "text-gray-500"}`}>
//                   {cat.category_name}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mt-6 pb-24 md:grid-cols-3 lg:grid-cols-4">
//           {isLoading ? Array.from({ length: 8 }).map((_, idx) => (
//             <Skeleton key={idx} type="card" rows={1} cardPerRow={1} cardHeight={200} />
//           )) : filteredItems.map((item: any) => (
//             <div key={item.id} className="group flex flex-col overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
//               <div className="relative w-full h-32 md:h-40 overflow-hidden bg-gray-100">
//                 <img
//                   src={item.item_icon || "/images/default-food.jpg"}
//                   alt={item.name}
//                   loading="lazy"
//                   className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
//                 />
//               </div>

//               <div className="flex flex-col flex-1 p-3">
//                 <div className="flex items-start justify-between gap-1 mb-1">
//                   <h5 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-100 leading-tight line-clamp-1">
//                     {item.name}
//                   </h5>
//                   <div className={`flex-shrink-0 mt-1 flex items-center justify-center w-3.5 h-3.5 border-2 rounded-sm ${item.type === "Veg" ? "border-green-600" : "border-red-600"}`}>
//                     <div className={`w-1.5 h-1.5 rounded-full ${item.type === "Veg" ? "bg-green-600" : "bg-red-600"}`}></div>
//                   </div>
//                 </div>

//                 {/* RATING SECTION ADDED HERE */}
//                 {item.rating && (
//                   <div className="flex items-center gap-1 mb-1">
//                     <span className="flex items-center gap-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
//                       {item.rating} ★
//                     </span>
//                     <span className="text-[9px] text-gray-400">({item.rating_count})</span>
//                   </div>
//                 )}

//                 <p className="text-[10px] md:text-xs text-gray-400 line-clamp-2 min-h-[2.5rem] mb-2">{item.description}</p>
//                 <div className="flex items-center justify-between mt-auto">
//                   <p className="text-sm md:text-lg font-black text-gray-900 dark:text-white">₹{item.min_price ?? item.max_price}</p>
//                   <button 
//                     onClick={() => handleAddClick(item)} 
//                     className="px-4 py-1.5 text-[10px] md:text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-sm active:scale-95 transition-all"
//                   >
//                     ADD
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {!isLoading && filteredItems.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <img src={nofound} alt="Not found" className="w-32 md:w-48 grayscale opacity-50 mb-4" />
//             <p className="text-gray-500 font-medium">No items found for this filter</p>
//           </div>
//         )}

//         {selectedItem && (
//           <ItemSuccessModal
//             isOpen={isModalOpen}
//             toggle={() => setIsModalOpen(false)}
//             itemId={selectedItem.id}
//             itemName={selectedItem.name}
//             itemImage={selectedItem.item_icon}
//             itemPriceFull={Number(selectedItem.max_price ?? selectedItem.min_price)}
//             itemPriceHalf={Number(selectedItem.min_price ?? selectedItem.max_price)}
//             itemVariants={selectedItem.variants}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Menu;



















import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMenuQuery } from "../../../features/menu/menuApi";

// Components
import SearchBar from "../../../components/Common/SearchInput";
import ToggleButton from "../../../components/Common/ToggleButton";
import ItemSuccessModal from "../../../components/Modal/AddOrderModal";
import Skeleton from "../../../components/Common/Skeleton";

// Assets
import banner from "../../../assets/Images/bannner.jpeg";
import mobileBanner from "../../../assets/Images/banner3.png";
import nofound from "../../../assets/Images/nofound.png";

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const restaurantId = sessionStorage.getItem("restaurant_id");
  const tableId = sessionStorage.getItem("table_id");

  const { data: menuData, isLoading, error } = useGetMenuQuery(
    { restaurant_id: restaurantId! },
    { skip: !restaurantId || !tableId, refetchOnMountOrArgChange: false }
  );

  useEffect(() => {
    if (!restaurantId || !tableId) {
      navigate("/error/404", { replace: true });
    }
  }, [restaurantId, tableId, navigate]);

  const categories = menuData?.data?.data || [];
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [vegOnly, setVegOnly] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // New State for Full Screen Image Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);

  const categoriesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].category_id);
    }
  }, [categories, activeTab]);

  const activeCategory = useMemo(() => {
    return categories.find((cat: any) => cat.category_id === activeTab);
  }, [categories, activeTab]);

  const items = activeCategory?.items || [];

  const filteredItems = useMemo(() => {
    return items
      .filter((item: any) => (vegOnly ? item.type === "Veg" : true))
      .filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [items, vegOnly, searchTerm]);

  useEffect(() => {
    const idx = categories.findIndex(cat => cat.category_id === activeTab);
    if (idx !== -1 && categoriesRef.current[idx]) {
      categoriesRef.current[idx].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab, categories]);

  const handleAddClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Function to open image preview
  const handleImageClick = (item: any) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-500 font-medium">
      Failed to load menu. Please try again.
    </div>
  );

  return (
    <div className="min-h-full bg-white mt-16 dark:bg-gray-900">
      
      {/* SECTION 1: BANNER */}
      <div className="relative">
        <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden">
          <img src={banner} className="hidden md:block w-full h-full object-cover" alt="Banner" />
          <img src={mobileBanner} className="block md:hidden w-full h-full object-cover" alt="Mobile Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 w-[92%] max-w-4xl z-30">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-2 md:p-3 flex items-center gap-2 md:gap-4">
            <div className="flex-1">
              <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for food..." />
            </div>
            <div className="flex-shrink-0">
              <ToggleButton isOn={vegOnly} onToggle={() => setVegOnly(!vegOnly)} size="sm" onColor="bg-green-600" offColor="bg-gray-300" showLabels onLabel="Veg" offLabel="All" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-12">
        {/* CATEGORIES SECTION */}
        <div className="sticky top-4 z-20 bg-white dark:bg-gray-900 pt-4 pb-2">
          <h4 className="mb-0 text-lg font-bold text-gray-800 dark:text-white px-1">Explore Categories</h4>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 pt-4">
            {isLoading ? Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} type="tabs" shape="circle" columns={1} />
            )) : categories.map((cat, idx) => (
              <div 
                key={cat.category_id} 
                ref={el => (categoriesRef.current[idx] = el!)} 
                onClick={() => setActiveTab(cat.category_id)} 
                className="text-center cursor-pointer flex-shrink-0 group"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 overflow-hidden transition-transform duration-200 ${activeTab === cat.category_id ? "border-orange-500 scale-105" : "border-gray-100 dark:border-gray-700"}`}>
                  <img src={cat.category_icon || "/images/default-category.png"} alt={cat.category_name} className="object-cover w-full h-full" loading="lazy" />
                </div>
                <p className={`mt-2 text-[11px] md:text-sm font-bold truncate max-w-[5rem] ${activeTab === cat.category_id ? "text-orange-600" : "text-gray-500"}`}>
                  {cat.category_name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ITEMS GRID */}
        <div className="grid grid-cols-2 gap-4 mt-6 pb-4 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} type="card" rows={1} cardPerRow={1} cardHeight={200} />
          )) : filteredItems.map((item: any) => (
            <div key={item.id} className="group flex flex-col overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
              {/* CLICKABLE IMAGE */}
              <div 
                className="relative w-full h-32 md:h-40 overflow-hidden bg-gray-100 cursor-zoom-in"
                onClick={() => handleImageClick(item)}
              >
                <img
                  src={item.item_icon || "/images/default-food.jpg"}
                  alt={item.name}
                  loading="lazy"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col flex-1 p-3">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h5 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-100 leading-tight line-clamp-1">{item.name}</h5>
                  <div className={`flex-shrink-0 mt-1 flex items-center justify-center w-3.5 h-3.5 border-2 rounded-sm ${item.type === "Veg" ? "border-green-600" : "border-red-600"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.type === "Veg" ? "bg-green-600" : "bg-red-600"}`}></div>
                  </div>
                </div>

                {item.rating && (
                  <div className="flex items-center gap-1 mb-1">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">{item.rating} ★</span>
                  </div>
                )}

                <p className="text-[10px] md:text-xs text-gray-400 line-clamp-2 min-h-[2.5rem] mb-2">{item.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-sm md:text-lg font-black text-gray-900 dark:text-white">₹{item.min_price ?? item.max_price}</p>
                  <button onClick={() => handleAddClick(item)} className="px-4 py-1.5 text-[10px] md:text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600">ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- FULL SCREEN IMAGE & INGREDIENTS MODAL --- */}
        {isPreviewOpen && previewItem && (
          <div
        className="fixed inset-0 z-[100] flex items-center justify-center
             bg-black/60 backdrop-blur-sm
             p-4 animate-in fade-in duration-300"
            onClick={() => setIsPreviewOpen(false)}>
            <div 
              className="relative max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsPreviewOpen(false)}
                data-no-ripple
                className="absolute top-4 right-4 z-10 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md"
              >
                ✕
              </button>

              <div className="w-full h-64 md:h-96">
                <img 
                  src={previewItem.item_icon || "/images/default-food.jpg"} 
                  className="w-full h-full object-cover" 
                  alt={previewItem.name} 
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{previewItem.name}</h2>
                  <div className={`flex items-center justify-center w-5 h-5 border-2 rounded-sm ${previewItem.type === "Veg" ? "border-green-600" : "border-red-600"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${previewItem.type === "Veg" ? "bg-green-600" : "bg-red-600"}`}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider">Ingredients</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {/* Agar API se ingredients list nahi aa rahi, toh default description use karein ya hardcoded placeholder */}
                      {previewItem.ingredients || "Freshly sourced vegetables, authentic spices, and our secret chef's special sauce."}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <span className="text-xs text-gray-400">Price starts from</span>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">₹{previewItem.min_price ?? previewItem.max_price}</p>
                    </div>
                    <button 
                      onClick={() => { setIsPreviewOpen(false); handleAddClick(previewItem); }}
                      className="bg-orange-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODALS */}
        {selectedItem && (
          <ItemSuccessModal
            isOpen={isModalOpen}
            toggle={() => setIsModalOpen(false)}
            itemId={selectedItem.id}
            itemName={selectedItem.name}
            itemImage={selectedItem.item_icon}
            itemPriceFull={Number(selectedItem.max_price ?? selectedItem.min_price)}
            itemPriceHalf={Number(selectedItem.min_price ?? selectedItem.max_price)}
            itemVariants={selectedItem.variants}
          />
        )}
      </div>
    </div>
  );
};

export default Menu;