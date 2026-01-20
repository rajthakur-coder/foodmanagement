
// import React, { useEffect, useState, type ReactNode } from "react";
// import ReactDOM from "react-dom";
// import clsx from "clsx";
// import { X } from "lucide-react";
// import { motion, AnimatePresence, type Variants } from "framer-motion";

// interface ExtraButtonProps {
//   text: string;
//   onClick: () => void;
//   colorClass?: string;
//   disabled?: boolean;
// }

// interface BaseModalProps {
//   isOpen: boolean;
//   toggle: () => void;
//   children: ReactNode;

//   headerText?: string;
//   onConfirm?: () => void;
//   onCancel?: () => void;
//   confirmText?: string;
//   cancelText?: string;

//   confirmColor?: string;
//   cancelColor?: string;
//   widthClass?: string;
//   showCloseIcon?: boolean;

//   headerTextColor?: string;
//   headerBgClass?: string;

//   isLoading?: boolean;

//   extraButton?: ExtraButtonProps;

//   useInternalLoader?: boolean; // ⭐ NEW FLAG
// }

// const modalVariants: Variants = {
//   hidden: { scale: 0.95, opacity: 0, y: -30 },
//   visible: {
//     scale: 1,
//     opacity: 1,
//     y: 0,
//     transition: { type: "spring", damping: 20, stiffness: 200 },
//   },
//   exit: { scale: 0.9, opacity: 0, y: 40, transition: { duration: 0.2 } },
// };

// const backdropVariants: Variants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1 },
//   exit: { opacity: 0 },
// };

// const BaseModal = ({
//   isOpen,
//   toggle,
//   children,
//   headerText,
//   onConfirm,
//   onCancel,
//   confirmText = "Confirm",
//   cancelText = "Cancel",
//   confirmColor = "bg-black hover:bg-gray-900 text-white",
//   cancelColor = "bg-gray-200 hover:bg-gray-100 text-black",
//   widthClass = "w-96",
//   showCloseIcon = true,
//   headerBgClass = "bg-transparent",
//   headerTextColor = "text-text-main",
//   isLoading = false,
//   extraButton,

//   useInternalLoader = false, // ⭐ DEFAULT FALSE
// }: BaseModalProps) => {
//   const [showContent, setShowContent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // ⭐ INTERNAL LOADER CONTROL
//   useEffect(() => {
//     let timer: NodeJS.Timeout;

//     if (!isOpen) {
//       setShowContent(false);
//       setLoading(false);
//       return;
//     }

//     if (!useInternalLoader) {
//       // Direct show content (no loader)
//       setLoading(false);
//       setShowContent(true);
//       return;
//     }

//     // When internal loader is enabled
//     setLoading(true);
//     timer = setTimeout(() => {
//       setShowContent(true);
//       setLoading(false);
//     }, 250);

//     return () => clearTimeout(timer);
//   }, [isOpen, useInternalLoader]);

//   // Keyboard events
//   useEffect(() => {
//     if (!isOpen) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         e.preventDefault();
//         e.stopPropagation();
//       }

//       if (e.key === "Enter" && onConfirm && !isLoading) {
//         e.preventDefault();
//         onConfirm();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isOpen, onConfirm, isLoading]);

//   if (!isOpen) return null;

//   const modalContent = (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 backdrop-blur-sm"
//           onClick={(e) => e.stopPropagation()}
//           variants={backdropVariants}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//         >
//           <motion.div
//             onClick={(e) => e.stopPropagation()}
//             className={clsx(
//               "rounded-2xl shadow-xl bg-surface-card text-text-main overflow-hidden",
//               widthClass
//             )}
//             variants={modalVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//           >
//             {(headerText || showCloseIcon) && (
//               <div
//                 className={clsx(
//                   "flex items-center justify-between p-3 pt-5 px-8",
//                   headerBgClass
//                 )}
//               >
//                 {headerText && (
//                   <h3 className={clsx("text-lg font-semibold", headerTextColor)}>
//                     {headerText}
//                   </h3>
//                 )}

//                 {showCloseIcon && (
//                   <button
//                     onClick={toggle}
//                     className="p-2 transition rounded-full hover:bg-surface-hover"
//                     disabled={isLoading}
//                   >
//                     <X className="w-5 h-5 text-text-subtle hover:text-text-main" />
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* ⭐ INTERNAL LOADER ONLY IF useInternalLoader = true */}
//             {loading ? (
//               <div className="flex items-center justify-center p-10">
//                 <div className="w-10 h-10 border-4 border-gray-300 rounded-full border-t-green-500 animate-spin" />
//               </div>
//             ) : (
//               showContent && (
//                 <motion.div
//                   key="modal-content"
//                   className="p-5 px-8"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.25 }}
//                 >
//                   {children}
//                 </motion.div>
//               )
//             )}

//             {(onCancel || onConfirm || extraButton) && (
//               <div className="flex justify-end gap-3 p-5 px-8">
//                 {onCancel && (
//                   <button
//                     onClick={onCancel}
//                     className={clsx(
//                       "px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-colors duration-200 border-2 hover:border-gray-900 dark:hover:border-white",
//                       cancelColor
//                     )}
//                     disabled={isLoading}
//                   >
//                     {cancelText}
//                   </button>
//                 )}

//                 {extraButton && (
//                   <button
//                     onClick={extraButton.onClick}
//                     disabled={extraButton.disabled || isLoading}
//                     className={clsx(
//                       "px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-colors duration-200 border-2",
//                       extraButton.colorClass || "bg-gray-300 hover:bg-gray-200"
//                     )}
//                   >
//                     {extraButton.text}
//                   </button>
//                 )}

//                 {onConfirm && (
//                   <button
//                     onClick={onConfirm}
//                     disabled={isLoading}
//                     className={clsx(
//                       "px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center",
//                       confirmColor,
//                       isLoading && "opacity-70 cursor-not-allowed"
//                     )}
//                   >
//                     {isLoading ? <div className="loader"></div> : confirmText}
//                   </button>
//                 )}
//               </div>
//             )}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );

//   return ReactDOM.createPortal(modalContent, document.body);
// };

// export default BaseModal;













import React, { useEffect, useState, type ReactNode } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import { X } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* ---------- TYPES ---------- */

interface ExtraButtonProps {
  text: string;
  onClick: () => void;
  colorClass?: string;
  disabled?: boolean;
}

interface BaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  children: ReactNode;

  headerText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;

  confirmColor?: string;
  cancelColor?: string;
  widthClass?: string;
  showCloseIcon?: boolean;

  headerTextColor?: string;
  headerBgClass?: string;

  isLoading?: boolean;
  extraButton?: ExtraButtonProps;
  useInternalLoader?: boolean;
}

/* ---------- ANIMATIONS ---------- */

const modalVariants: Variants = {
  hidden: { y: 80, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 22, stiffness: 220 },
  },
  exit: { y: 120, opacity: 0, transition: { duration: 0.2 } },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/* ---------- COMPONENT ---------- */

const BaseModal = ({
  isOpen,
  toggle,
  children,
  headerText,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "bg-black hover:bg-gray-900 text-white",
  cancelColor = "bg-gray-200 hover:bg-gray-100 text-black",
  widthClass = "",
  showCloseIcon = true,
  headerBgClass = "bg-transparent",
  headerTextColor = "text-text-main",
  isLoading = false,
  extraButton,
  useInternalLoader = false,
}: BaseModalProps) => {
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------- LOADER ---------- */
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isOpen) {
      setShowContent(false);
      setLoading(false);
      return;
    }

    if (!useInternalLoader) {
      setShowContent(true);
      return;
    }

    setLoading(true);
    timer = setTimeout(() => {
      setLoading(false);
      setShowContent(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [isOpen, useInternalLoader]);

  /* ---------- ESC / ENTER ---------- */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle();
      if (e.key === "Enter" && onConfirm && !isLoading) onConfirm();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onConfirm, isLoading, toggle]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center 
                   bg-black/40 backdrop-blur-sm p-2 sm:p-3"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={toggle}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            "bg-white dark:bg-gray-800 text-text-main shadow-xl overflow-hidden",
            "w-full sm:max-w-[500px]",
            "rounded-t-2xl sm:rounded-2xl",
            "max-h-[90vh]",
            widthClass
          )}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ---------- HEADER ---------- */}
          {(headerText || showCloseIcon) && (
            <div
              className={clsx(
                "flex items-center justify-between px-4 py-3 border-b border-surface-hover",
                headerBgClass
              )}
            >
              {headerText && (
                <h3 className={clsx("text-lg font-extrabold ", headerTextColor)}>
                  {headerText}
                </h3>
              )}

              {showCloseIcon && (
                <button
                  onClick={toggle}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* ---------- CONTENT ---------- */}
          {loading ? (
            <div className="flex items-center justify-center p-10">
              <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-orange-500 animate-spin" />
            </div>
          ) : (
            showContent && (
              <div className="p-4 sm:p-5 max-h-[65vh] overflow-y-auto">
                {children}
              </div>
            )
          )}

          {/* ---------- FOOTER (STICKY) ---------- */}
          {(onCancel || onConfirm || extraButton) && (
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t">
              <div className="flex justify-end gap-3 p-4">
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className={clsx(
                      "px-4 py-2 text-xs font-semibold rounded-full",
                      cancelColor
                    )}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </button>
                )}

                {extraButton && (
                  <button
                    onClick={extraButton.onClick}
                    disabled={extraButton.disabled || isLoading}
                    className={clsx(
                      "px-4 py-2 text-xs font-semibold rounded-full",
                      extraButton.colorClass ||
                        "bg-gray-200 hover:bg-gray-300"
                    )}
                  >
                    {extraButton.text}
                  </button>
                )}

                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={clsx(
                      "px-5 py-2 text-xs font-semibold rounded-full",
                      confirmColor,
                      isLoading && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {confirmText}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default BaseModal;
