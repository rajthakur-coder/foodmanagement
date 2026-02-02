
import React, { useState, useEffect, useMemo } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useGetMenuQuery } from "../../features/menu/menuApi";

// Components
import SearchBar from "../../components/Common/SearchInput";
import ToggleButton from "../../components/Common/ToggleButton";
import ItemSuccessModal from "../../components/Modal/AddOrderModal";
import Skeleton from "../../components/Common/Skeleton";
import MenuScanner from "./MenuScanner";
import MenuItemCard from "./MenuItemCard";
import ImagePreviewModal from "./ImagePreviewModal";

// Assets
import banner from "../../assets/Images/bannner.webp";
import mobileBanner from "../../assets/Images/mobilebanner.webp";

const Menu: React.FC = () => {
  const [restaurantId, setRestaurantId] = useState<string | null>(sessionStorage.getItem("restaurant_id"));
  const [tableId, setTableId] = useState<string | null>(sessionStorage.getItem("table_id"));
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [vegOnly, setVegOnly] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);

useEffect(() => {
  const rId = sessionStorage.getItem("restaurant_id");
  const tId = sessionStorage.getItem("table_id");

  setRestaurantId(rId);
  setTableId(tId);

  if (!rId || !tId) {
    setShowScanner(true);
  }
}, []);


  const { data: menuData, isLoading, error } = useGetMenuQuery(
    { restaurant_id: restaurantId! },
    { skip: !restaurantId || !tableId, refetchOnMountOrArgChange: true }
  );

  // QR Scanner Logic - Camera Only & Session Clear
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (showScanner) {
      html5QrCode = new Html5Qrcode("reader");
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          try {
            const url = new URL(decodedText);
            const rId = url.searchParams.get("restaurant_id");
            const tId = url.searchParams.get("table_id");

            if (rId && tId) {
              // Purana session data saaf karna
              sessionStorage.removeItem("restaurant_id");
              sessionStorage.removeItem("table_id");

              // Naya data set karna
              sessionStorage.setItem("restaurant_id", rId);
              sessionStorage.setItem("table_id", tId);

              // States reset aur update
              setRestaurantId(rId);
              setTableId(tId);
              setActiveTab(null);
              setSearchTerm("");
              setShowScanner(false);

              if (html5QrCode) {
                html5QrCode.stop().catch((err) => console.error(err));
              }
            }
          } catch (e) {
            console.error("Invalid QR Link", e);
          }
        },
        () => {} // Silent error on scan attempt
      ).catch((err) => console.error("Camera Start Error:", err));
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [showScanner]);

  const categories = menuData?.data?.data || [];
  useEffect(() => {
    if (categories.length > 0 && !activeTab) setActiveTab(categories[0].category_id);
  }, [categories, activeTab]);

  const filteredItems = useMemo(() => {
    const activeCategory = categories.find((cat: any) => cat.category_id === activeTab);
    return (activeCategory?.items || [])
      .filter((item: any) => (vegOnly ? item.type === "Veg" : true))
      .filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [categories, activeTab, vegOnly, searchTerm]);

  if (!restaurantId || !tableId) return <MenuScanner showScanner={showScanner} setShowScanner={setShowScanner} />;
  
  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-500 bg-white dark:bg-gray-900 px-4 text-center">
      Failed to load menu. Please scan QR again.
    </div>
  );

  return (
    <div className="min-h-full bg-white mt-16 dark:bg-gray-900">
      <div className="relative">
        <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden">
          <img src={banner} className="hidden md:block w-full h-full object-cover" alt="Banner" />
          <img src={mobileBanner} className="block md:hidden w-full h-full object-cover" alt="Mobile Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 w-[92%] max-w-4xl z-30">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-2 md:p-3 flex items-center gap-2 md:gap-4">
            <div className="flex-1"><SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <ToggleButton isOn={vegOnly} onToggle={() => setVegOnly(!vegOnly)} size="sm" showLabels onLabel="Veg" offLabel="All" />
          </div>
        </div>
      </div>

      <div className="px-4 mt-12">
        <div className="sticky top-4 z-20 bg-white dark:bg-gray-900 pt-4 pb-2">
          <h4 className="text-lg font-bold text-gray-800 dark:text-white px-1">Explore Categories</h4>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 pt-4">
            {isLoading ? (
              <Skeleton type="tabs" columns={6} shape="circle" />
            ) : (
              categories.map((cat: any) => (
                <div key={cat.category_id} onClick={() => setActiveTab(cat.category_id)} className="text-center cursor-pointer flex-shrink-0">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 overflow-hidden ${activeTab === cat.category_id ? "border-orange-500 scale-105" : "border-gray-100 dark:border-gray-700"}`}>
                    <img src={cat.category_icon || "/images/default-category.png"} className="object-cover w-full h-full" alt={cat.category_name} />
                  </div>
                  <p className={`mt-2 text-[11px] font-bold truncate max-w-[5rem] ${activeTab === cat.category_id ? "text-orange-600" : "text-gray-500"}`}>{cat.category_name}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 pb-4">
          {isLoading ? (
            <Skeleton type="card" rows={2} cardPerRow={2} cardHeight={140} />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredItems.map((item: any) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onImageClick={(it) => { setPreviewItem(it); setIsPreviewOpen(true); }} 
                  onAddClick={(it) => { setSelectedItem(it); setIsModalOpen(true); }} 
                />
              ))}
            </div>
          )}
        </div>

        {isPreviewOpen && previewItem && (
          <ImagePreviewModal 
            item={previewItem} 
            onClose={() => setIsPreviewOpen(false)} 
            onAdd={(it) => { setSelectedItem(it); setIsModalOpen(true); }} 
          />
        )}
        
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