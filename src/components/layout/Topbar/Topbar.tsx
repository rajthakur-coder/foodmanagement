
import logo from "../../../assets/Images/logo.webp";
import { useEffect, useState, useRef } from "react"; // useRef add kiya
import TopbarRight from "./TopbarRight";
import clsx from "clsx";
import { RiQrCodeLine, RiCloseLine, RiImageLine } from "react-icons/ri"; // RiImageLine icon add kiya
import { Html5Qrcode } from "html5-qrcode";

interface TopbarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Topbar = ({ isCollapsed, toggleSidebar, isMobile }: TopbarProps) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Gallery file input ke liye ref

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper function: Scan results ko handle karne ke liye (Camera aur Gallery dono ke liye)
  const handleScanSuccess = (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      const rId = url.searchParams.get("restaurant_id");
      const tId = url.searchParams.get("table_id");

      if (rId && tId) {
        sessionStorage.clear();
        sessionStorage.setItem("restaurant_id", rId);
        sessionStorage.setItem("table_id", tId);
        setShowScanner(false);
        window.location.reload();
      }
    } catch (e) {
      alert("Invalid QR Code: Please scan a valid restaurant QR.");
      console.error("Invalid QR", e);
    }
  };

  // Scanner Logic inside Topbar
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (showScanner) {
      html5QrCode = new Html5Qrcode("topbar-reader");
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => handleScanSuccess(decodedText),
        () => {}
      ).catch((err) => console.error(err));
    }

    return () => {
      if (html5QrCode?.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [showScanner]);

  // Gallery Se Image Scan Karne Ka Function
  const handleGalleryScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      const html5QrCode = new Html5Qrcode("topbar-reader"); // Reader id use karenge scan process ke liye
      
      try {
        const decodedText = await html5QrCode.scanFile(imageFile, true);
        handleScanSuccess(decodedText);
      } catch (err) {
        alert("QR Code not found in this image.");
        console.error("Scan error:", err);
      }
    }
  };

  const headerWidthClass: string = isMobile
    ? "left-0 w-full"
    : isCollapsed
    ? "left-24 w-[calc(100%-6rem)]"
    : "left-64 w-[calc(100%-16rem)]";

  const baseBgClass: string = "bg-surface-card";

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 h-16 flex items-center px-4 shadow-md transition-all duration-300 z-[100]",
          isMobile ? "justify-between" : "justify-end",
          headerWidthClass,
          scrolled ? `${baseBgClass} backdrop-blur` : baseBgClass
        )}
      >
        {isMobile && (
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
          </div>
        )}

        <div className="flex items-center gap-0 md:gap-4">
          <button
            onClick={() => setShowScanner(true)} 
            className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-200 transition-colors"
            title="Scan Table QR"
          >
            <RiQrCodeLine size={24} />
          </button>
          <TopbarRight />
        </div>
      </header>

      {showScanner && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 max-w-sm w-full relative shadow-2xl">
            <button
            data-no-ripple
              onClick={() => setShowScanner(false)}
              className="absolute -top-12 right-0 text-white flex items-center gap-1 font-bold"
            >
              <RiCloseLine size={28} /> Close
            </button>

            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold dark:text-white">Scan New Table</h3>
              <p className="text-xs text-gray-500">Scanning will reset your current session</p>
            </div>

            <div
              id="topbar-reader"
              className="overflow-hidden rounded-2xl border-4 border-orange-500 bg-black aspect-square"
            ></div>

            {/* Gallery Button UI */}
            <div className="mt-4 flex flex-col items-center gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
              >
                <RiImageLine size={20} className="text-orange-500" />
                Upload from Gallery
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleGalleryScan} 
              />

              <p className="text-[10px] text-orange-500 text-center animate-pulse font-black uppercase tracking-widest">
                Align QR within frame or Upload
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;