// import React, { useState, useEffect, useMemo,useRef } from "react";
// import { useNavigate } from "react-router-dom";

// import { useGetMenuQuery } from "../../../features/menu/menuApi";

// import SearchBar from "../../../components/Common/SearchInput";
// import ToggleButton from "../../../components/Common/ToggleButton";
// import ItemSuccessModal from "../../../components/Modal/AddOrderModal";
// import Skeleton from "../../../components/Common/Skeleton";

// import banner from "../../../assets/Images/banner.avif";
// import mobileBanner from "../../../assets/Images/logo2.jpg";
// import nofound from "../../../assets/Images/nofound.png";

// const Menu: React.FC = () => {
//   const navigate = useNavigate();

//   // ===========================
//   // SESSION DATA (QR FLOW)
//   // ===========================
//   const restaurantId = sessionStorage.getItem("restaurant_id");
//   const tableId = sessionStorage.getItem("table_id");

//   // ===========================
//   // API CALL (BODY BASED)
//   // ===========================
// const {
//   data: menuData,
//   isLoading,
//   error,
// } = useGetMenuQuery(
//   { restaurant_id: restaurantId! },
//   {
//     skip: !restaurantId || !tableId,
//     refetchOnMountOrArgChange: false,
//   }
// );


// useEffect(() => {
//   if (!restaurantId || !tableId) {
//     navigate("/error/404", { replace: true });
//   }
// }, [restaurantId, tableId, navigate]);


//   // ===========================
//   // DATA
//   // ===========================
//   const categories = menuData?.data?.data || [];

//   // ===========================
//   // UI STATES
//   // ===========================
//   const [activeTab, setActiveTab] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [vegOnly, setVegOnly] = useState(true);

//   // MODAL STATES
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<any>(null);

//   const toggleModal = () => setIsModalOpen((prev) => !prev);

//   // ===========================
//   // SET DEFAULT CATEGORY
//   // ===========================
//   useEffect(() => {
//     if (categories.length > 0 && !activeTab) {
//       setActiveTab(categories[0].category_id);
//     }
//   }, [categories, activeTab]);

//   // ===========================
//   // ACTIVE CATEGORY
//   // ===========================
//   const activeCategory = useMemo(() => {


//     return categories.find((cat: any) => cat.category_id === activeTab);
//   }, [categories, activeTab]);

//   const items = activeCategory?.items || [];

// // Inside your Menu component
// const categoriesRef = useRef<HTMLDivElement[]>([]);

// // Clear refs on new categories
// useEffect(() => {
//   categoriesRef.current = categoriesRef.current.slice(0, categories.length);
// }, [categories]);

// // When activeTab changes, scroll it into view
// useEffect(() => {
//   const idx = categories.findIndex(cat => cat.category_id === activeTab);
//   if (idx !== -1 && categoriesRef.current[idx]) {
//     categoriesRef.current[idx].scrollIntoView({
//       behavior: "smooth",
//       inline: "center",
//       block: "nearest",
//     });
//   }
// }, [activeTab, categories]);
//   // ===========================
//   // FILTER ITEMS
//   // ===========================
//   const filteredItems = items
//     .filter((item: any) => (vegOnly ? item.type === "Veg" : true))
//     .filter((item: any) =>
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   // ===========================
//   // ADD BUTTON HANDLER
//   // ===========================
//   const handleAddClick = (item: any) => {
//     setSelectedItem(item);
//     setIsModalOpen(true);
//   };

//   // ===========================
//   // LOADING / ERROR STATES
//   // ===========================
//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-red-500">Failed to load menu</p>
//       </div>
//     );
//   }




//   // ===========================
//   // UI
//   // ===========================
//   return (
    
//     <div className="min-h-full space-y-3 pb-8 lg:pb-0 bg-surface-card">
//       {/* HEADER */}
//       <div>
//         {/* Desktop Image */}
//         <img src={banner} className="hidden md:block" alt="Desktop Banner" />
//         {/* Mobile Image */}
//         <img
//           src={mobileBanner}
//           className="block md:hidden rounded-lg"
//           alt="Mobile Banner"
//         />
//       </div>

//       <div className="p-3">
//         {/* SEARCH + TOGGLE */}
//         <div className="flex items-center gap-3">
//           <div className="flex-1">
//             <SearchBar
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search items..."
//             />
//           </div>

//           <ToggleButton
//             isOn={vegOnly}
//             onToggle={() => setVegOnly(!vegOnly)}
//             size="sm"
//             onColor="bg-green-500"
//             offColor="bg-blue-500"
//             showLabels
//             onLabel="Veg"
//             offLabel="All"
//           />
//         </div>

    
// {/* CATEGORIES */}
// <div className="sticky top-0 z-0 lg:top-0 bg-white dark:bg-[#1F2937] py-3">
//   <h4 className="mb-2 font-semibold">Categories</h4>

//   <div className="flex gap-4 pb-3 overflow-x-auto hide-scrollbar ">
//  {isLoading
//   ? Array.from({ length: 15 }).map((_, idx) => (
//       <div key={idx} className="flex flex-col items-center ">
//         <Skeleton type="tabs" shape="circle" columns={1} /> 
//       </div>
//     ))
//   : 
//   categories.map((cat, idx) => (
//   <div
//     key={cat.category_id}
//     ref={el => (categoriesRef.current[idx] = el!)}
//     onClick={() => setActiveTab(cat.category_id)}
//     className="text-center cursor-pointer"
//   >
//     <div
//       className={`w-16 h-16 rounded-full border-2 overflow-hidden transition-all duration-300 `}
//     >
//       <img
//         src={cat.category_icon || "/images/default-category.png"}
//         alt={cat.category_name}
//         className="object-cover w-full h-full"
//       />
//     </div>
// <p
//   className={`mt-1 text-xs font-semibold transition-all duration-300 truncate max-w-[4.5rem] ${
//     activeTab === cat.category_id
//       ? "text-red-500 border-b-2 border-red-500 scale-105"
//       : "text-text-main"
//   }`}
//   title={cat.category_name}
// >
//   {cat.category_name}
// </p>

//   </div>
// ))
// }
//   </div>
// </div>


//         {/* ITEMS */}
//         <div className="grid grid-cols-2 gap-3 mt-4 pb-8 lg:p-0 lg:grid-cols-4">
//           {isLoading
//             ? // Show skeleton cards while loading
//               Array.from({ length: 8 }).map((_, idx) => (
//                 <Skeleton key={idx} type="card" rows={1} cardPerRow={1} cardHeight={180} />
//               ))
//             : filteredItems.map((item: any) => (
//                 <div
//                   key={item.id}
//                   className="flex flex-col overflow-hidden bg-white border shadow dark:bg-gray-800 rounded-xl"
//                 >
//                   <img
//                     src={item.item_icon || "/images/default-food.jpg"}
//                     alt={item.name}
//                     className="object-cover w-full h-28 sm:h-32 lg:h-36"
//                   />

//                   <div className="flex flex-col flex-1 p-2 lg:p-4">
//                     <h5 className="flex items-center gap-2 text-xs lg:text-sm font-bold">
//                       {item.name}

//                       {item.type === "Veg" ? (
//                         <span className="flex items-center justify-center w-4 h-4 border-2 border-green-600 rounded">
//                           <span className="w-2 h-2 bg-green-600 rounded-full"></span>
//                         </span>
//                       ) : (
//                         <span className="flex items-center justify-center w-4 h-4 border-2 border-red-600 rounded">
//                           <span
//                             className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-red-600"
//                           />
//                         </span>
//                       )}
//                     </h5>

//                     <p className="text-[11px] lg:text-xs text-text line-clamp-2">
//                       {item.description}
//                     </p>

//                     <div className="flex items-center justify-between mt-auto pt-2">
//                       <p className="text-md font-bold ">
//                         ₹{item.min_price ?? item.max_price}
//                       </p>

//                       <button
//                         onClick={() => handleAddClick(item)}
//                         className="px-4 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-full hover:bg-red-600"
//                       >
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//           {/* NO ITEMS FOUND */}
//           {!isLoading && filteredItems.length === 0 && (
//             <div className="flex flex-col items-center justify-center col-span-2 lg:col-span-4">
//               <img
//                 src={nofound} // imported image
//                 alt="No items found"
//                 className="w-60 lg:w-60"
//               />
//             </div>
//           )}
//         </div>

//         {/* ADD ITEM MODAL */}
//         {selectedItem && (
//           <ItemSuccessModal
//             isOpen={isModalOpen}
//             toggle={toggleModal}
//             itemId={selectedItem.id}
//             itemName={selectedItem.name}
//             itemImage={selectedItem.item_icon}
//             itemPriceFull={Number(selectedItem.max_price ?? selectedItem.min_price)}
//             itemPriceHalf={Number(selectedItem.min_price ?? selectedItem.max_price)}
//   itemVariants={selectedItem.variants} // ✅ pass variants

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
import banner from "../../../assets/Images/banner.avif";
import mobileBanner from "../../../assets/Images/logo2.jpg";
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

  const categoriesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].category_id);
    }
  }, [categories, activeTab]);

  // 1. Performance: Memoize active category
  const activeCategory = useMemo(() => {
    return categories.find((cat: any) => cat.category_id === activeTab);
  }, [categories, activeTab]);

  const items = activeCategory?.items || [];

  // 2. Performance: Memoize filtered items to prevent heavy re-calculation on image loads
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

  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-500">
      Failed to load menu
    </div>
  );

  return (
    <div className="min-h-full space-y-3 pb-8 lg:pb-0 bg-surface-card">
      {/* HEADER - Optimized with priority for LCP */}
      <div>
        <img src={banner} className="hidden md:block w-full h-auto" alt="Banner" fetchPriority="high" />
        <img src={mobileBanner} className="block md:hidden rounded-lg w-full h-auto" alt="Mobile Banner" fetchPriority="high" />
      </div>

      <div className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search items..." />
          </div>
          <ToggleButton isOn={vegOnly} onToggle={() => setVegOnly(!vegOnly)} size="sm" onColor="bg-green-500" offColor="bg-blue-500" showLabels onLabel="Veg" offLabel="All" />
        </div>

        {/* CATEGORIES */}
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1F2937] py-3">
          <h4 className="mb-2 font-semibold">Categories</h4>
          <div className="flex gap-4 pb-3 overflow-x-auto hide-scrollbar">
            {isLoading ? Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} type="tabs" shape="circle" columns={1} />
            )) : categories.map((cat, idx) => (
              <div key={cat.category_id} ref={el => (categoriesRef.current[idx] = el!)} onClick={() => setActiveTab(cat.category_id)} className="text-center cursor-pointer flex-shrink-0">
                <div className={`w-16 h-16 rounded-full border-2 overflow-hidden transition-all ${activeTab === cat.category_id ? "border-red-500" : "border-gray-200"}`}>
                  <img src={cat.category_icon || "/images/default-category.png"} alt={cat.category_name} className="object-cover w-full h-full" loading="lazy" />
                </div>
                <p className={`mt-1 text-xs font-semibold truncate max-w-[4.5rem] ${activeTab === cat.category_id ? "text-red-500" : ""}`}>
                  {cat.category_name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ITEMS - Using Grid with Lazy Loading */}
        <div className="grid grid-cols-2 gap-3 mt-4 pb-8 lg:p-0 lg:grid-cols-4">
          {isLoading ? Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} type="card" rows={1} cardPerRow={1} cardHeight={180} />
          )) : filteredItems.map((item: any) => (
            <div key={item.id} className="flex flex-col overflow-hidden bg-white border shadow dark:bg-gray-800 rounded-xl">
              {/* Image with Lazy Loading and Aspect Ratio */}
              <div className="relative w-full h-28 sm:h-32 lg:h-36 bg-gray-100">
                <img
                  src={item.item_icon || "/images/default-food.jpg"}
                  alt={item.name}
                  loading="lazy"
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col flex-1 p-2 lg:p-4">
                <h5 className="flex items-center gap-2 text-xs lg:text-sm font-bold">
                  {item.name}
                  <span className={`flex items-center justify-center w-4 h-4 border-2 rounded ${item.type === "Veg" ? "border-green-600" : "border-red-600"}`}>
                    <span className={`w-2 h-2 rounded-full ${item.type === "Veg" ? "bg-green-600" : "bg-red-600"}`}></span>
                  </span>
                </h5>
                <p className="text-[11px] lg:text-xs text-gray-500 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <p className="text-md font-bold">₹{item.min_price ?? item.max_price}</p>
                  <button onClick={() => handleAddClick(item)} className="px-3 py-1.5 text-xxs md:text-xs font-semibold text-white bg-orange-500 rounded-md hover:bg-red-600 transition-colors">
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center col-span-2 lg:col-span-4 py-10">
              <img src={nofound} alt="No items" className="w-40 opacity-70" />
              <p className="text-gray-400 mt-2">No items match your filter</p>
            </div>
          )}
        </div>

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
