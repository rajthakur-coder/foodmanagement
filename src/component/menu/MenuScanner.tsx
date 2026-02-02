import React, { useRef } from "react"; // useRef add kiya
import { RiQrCodeLine, RiCloseLine, RiImageLine } from "react-icons/ri"; // RiImageLine icon add kiya
import { Html5Qrcode } from "html5-qrcode";

interface MenuScannerProps {
  showScanner: boolean;
  setShowScanner: (val: boolean) => void;
}

const MenuScanner: React.FC<MenuScannerProps> = ({ showScanner, setShowScanner }) => {
  const fileInputRef = useRef<HTMLInputElement>(null); // Hidden input ke liye ref

  // Gallery se scan karne ka logic
  const handleGalleryScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      const html5QrCode = new Html5Qrcode("reader"); // "reader" id use ki hai jo neeche div ki hai
      
      try {
        const decodedText = await html5QrCode.scanFile(imageFile, true);
        
        // Scan success logic (Wahi logic jo aap Topbar mein use kar rahe hain)
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
      } catch (err) {
        alert("QR Code nahi mila. Kripya saaf photo select karein.");
        console.error("Scan error:", err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900 p-6">
      <div className={`bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transition-all ${showScanner ? 'p-4' : 'p-8'}`}>
        {!showScanner ? (
          <>
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <RiQrCodeLine size={40} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Welcome Back!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
              Your session has expired. Please scan the QR Code on your table.
            </p>
            <button 
              onClick={() => setShowScanner(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RiQrCodeLine size={20} /> SCAN QR CODE
            </button>
          </>
        ) : (
          <div className="relative">
            {/* Header with Close button */}
            <div className="flex justify-between items-center mb-4">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Camera</span>
               <button 
                onClick={() => setShowScanner(false)} 
                className="text-gray-500 dark:text-white flex items-center gap-1 font-bold text-sm"
              >
                <RiCloseLine size={20}/> Close
              </button>
            </div>

            {/* Camera Container */}
            <div 
              id="reader" 
              className="overflow-hidden rounded-2xl border-4 border-orange-500 bg-black aspect-square"
            ></div>
            
            {/* Gallery Button - Styled to match your theme */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
            >
              <RiImageLine size={20} className="text-orange-500" />
              CHOOSE FROM GALLERY
            </button>

            {/* Hidden File Input */}
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleGalleryScan}
            />
            
            <p className="mt-4 text-[10px] text-orange-500 animate-pulse font-black uppercase tracking-[0.2em]">
              Scanning Table QR...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuScanner;







// import React from "react";
// import { RiQrCodeLine, RiCloseLine } from "react-icons/ri";

// interface MenuScannerProps {
//   showScanner: boolean;
//   setShowScanner: (val: boolean) => void;
// }

// const MenuScanner: React.FC<MenuScannerProps> = ({ showScanner, setShowScanner }) => {
//   return (
//     <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900 p-6">
//       <div className={`bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transition-all ${showScanner ? 'p-4' : 'p-8'}`}>
//         {!showScanner ? (
//           <>
//             <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
//               <RiQrCodeLine size={40} className="text-orange-500" />
//             </div>
//             <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Welcome Back!</h2>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
//               Your session has expired. Please scan the QR Code on your table.
//             </p>
//             <button 
//               onClick={() => setShowScanner(true)}
//               className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
//             >
//               <RiQrCodeLine size={20} /> SCAN QR CODE
//             </button>
//           </>
//         ) : (
//           <div className="relative">
//             {/* Header with Close button */}
//             <div className="flex justify-between items-center mb-4">
//                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Camera</span>
//                <button 
//                 onClick={() => setShowScanner(false)} 
//                 className="text-gray-500 dark:text-white flex items-center gap-1 font-bold text-sm"
//               >
//                 <RiCloseLine size={20}/> Close
//               </button>
//             </div>

//             {/* Camera Container */}
//             <div 
//               id="reader" 
//               className="overflow-hidden rounded-2xl border-4 border-orange-500 bg-black aspect-square"
//             ></div>
            
//             <p className="mt-4 text-[10px] text-orange-500 animate-pulse font-black uppercase tracking-[0.2em]">
//               Scanning Table QR...
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MenuScanner;