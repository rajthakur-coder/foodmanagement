
import { createPortal } from "react-dom";
import { type ReactNode, useEffect, useState, useCallback } from "react";
import clsx from "clsx";

interface BasePopupProps {
  open: boolean;
  children: ReactNode;
  position: { top: number; left: number };
  width?: string | number;
  height?: string | number;
  zIndex?: number;
  className?: string;
  animation?: "fade" | "scale" | "slide";
  onClose?: () => void;
  withOverlay?: boolean;
  lockScroll?: boolean;
}

/**
 * BasePopup — reusable popup container with optional overlay and animations.
 * Strictly typed, safe, and minimal re-renders.
 */
const BasePopup: React.FC<BasePopupProps> = ({
  open,
  children,
  position,
  width = "auto",
  height = "auto",
  zIndex = 80,
  className,
  animation = "scale",
  onClose,
  withOverlay = true,
  lockScroll = true,
}) => {
  const [show, setShow] = useState<boolean>(false);

  // Handle scroll lock + animation timing
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (open) {
      if (lockScroll) document.body.style.overflow = "hidden";
      timer = setTimeout(() => setShow(true), 20);
    } else {
      setShow(false);
      if (lockScroll) document.body.style.overflow = "";
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (!open && lockScroll) document.body.style.overflow = "";
    };
  }, [open, lockScroll]);

  // Handle ESC key to close popup (optional UX)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <>
      {withOverlay && (
        <div
          className={clsx(
            "fixed inset-0 transition-colors duration-300",
            "bg-black/20 dark:bg-black/40"
          )}
          style={{ zIndex: zIndex - 1 }}
          onClick={onClose}
          role="presentation"
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          "absolute transition-all duration-300 ease-out rounded-xl",
          animation === "scale" &&
            (show
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 translate-y-2"),
          animation === "fade" &&
            (show ? "opacity-100" : "opacity-0"),
          animation === "slide" &&
            (show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
          "bg-surface-card border border-border-primary shadow-lg dark:shadow-black/40",
          className
        )}
        style={{
          top: position.top,
          left: position.left,
          width,
          height,
          zIndex,
        }}
      >
        {children}
      </div>
    </>,
    document.body
  );
};

export default BasePopup;
