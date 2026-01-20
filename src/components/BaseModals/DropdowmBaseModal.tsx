

// import React, { useEffect, useCallback } from "react";
// import { motion, AnimatePresence, useAnimation, type AnimationControls } from "framer-motion";
// import Icon from "../ui/Icon";
// import { shakeAnimation } from "../../assets/functions/modalShake";

// interface CenteredSearchModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
//   maxWidth?: string;
// }


// const CenteredSearchModal: React.FC<CenteredSearchModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   maxWidth = "max-w-sm",
// }) => {
//   const controls: AnimationControls = useAnimation();

//   // Handle ESC key to close
//   const handleKeyDown = useCallback(
//     (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//     },
//     [onClose]
//   );

//   useEffect(() => {
//     if (isOpen) {
//       window.addEventListener("keydown", handleKeyDown);
//     } else {
//       window.removeEventListener("keydown", handleKeyDown);
//     }

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [isOpen, handleKeyDown]);

//   // Prevent scroll when modal open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           key="backdrop"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm"
//           onClick={() => shakeAnimation(controls)}
//           role="presentation"
//           aria-hidden="true"
//         >
//           <motion.div
//             key="modal"
//             initial={{ y: 0, opacity: 1, scale: 1 }}
//             animate={controls}
//             exit={{ y: 0, opacity: 0, scale: 1 }}
//             className={`w-full ${maxWidth} overflow-hidden rounded-xl shadow-2xl bg-surface-card`}
//             onClick={(e) => e.stopPropagation()}
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="modal-title"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b border-border-primary">
//               <h3
//                 id="modal-title"
//                 className="text-lg font-semibold select-none text-text-main"
//               >
//                 {title}
//               </h3>
//               <button
//                 type="button"
//                 aria-label="Close"
//                 className="p-1.5 rounded-full text-text-subtle hover:bg-surface-hover hover:text-text-main transition-colors"
//                 onClick={onClose}
//               >
//                 <Icon name="x" className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="max-h-[80vh] overflow-y-auto">{children}</div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default CenteredSearchModal;









import React, { useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  type AnimationControls,
} from "framer-motion";
import Icon from "../ui/Icon";
import { shakeAnimation } from "../../assets/functions/modalShake";

interface CenteredSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const CenteredSearchModal: React.FC<CenteredSearchModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-sm",
}) => {
  const controls: AnimationControls = useAnimation();

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    else window.removeEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Prevent scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/35 backdrop-blur-sm"
          onClick={() => shakeAnimation(controls)}
          role="presentation"
          aria-hidden="true"
        >
          <motion.div
            key="modal"
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={controls}
            exit={{ y: 0, opacity: 0, scale: 1 }}
            className={`
              w-full 
              max-w-[95%]          /* ⭐ Mobile responsive width */
              sm:max-w-sm          /* Small screens */
              md:max-w-md          /* Tablets */
              lg:max-w-lg          /* Larger desktops */
              ${maxWidth}          /* User custom maxWidth still works */
              overflow-hidden 
              rounded-xl 
              shadow-2xl 
              bg-surface-card
            `}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b sm:p-4 border-border-primary">
              <h3
                id="modal-title"
                className="text-base font-semibold select-none sm:text-lg text-text-main"
              >
                {title}
              </h3>

              <button
                type="button"
                aria-label="Close"
                className="p-1.5 rounded-full text-text-subtle hover:bg-surface-hover hover:text-text-main transition-colors"
                onClick={onClose}
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[80vh] overflow-y-auto p-3 sm:p-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CenteredSearchModal;
