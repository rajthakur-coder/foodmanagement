import logo from "../../../assets/Images/logoooo1.png"
import { useEffect, useState } from "react";
import TopbarRight from "./TopbarRight";
import clsx from "clsx";

interface TopbarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Topbar = ({ isCollapsed, toggleSidebar, isMobile }: TopbarProps) => {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerWidthClass: string = isMobile
    ? "left-0 w-full"
    : isCollapsed
    ? "left-24 w-[calc(100%-6rem)]"
    : "left-64 w-[calc(100%-16rem)]";

  const baseBgClass: string = "bg-surface-card";

  return (
    <header
      className={clsx(
        "fixed top-0 h-16 flex items-center px-2 shadow-md transition-all duration-300 z-[100]",
        // Mobile par logo aur content ke beech space, desktop par sirf right side components
        isMobile ? "justify-between" : "justify-end",
        headerWidthClass,
        scrolled ? `${baseBgClass} backdrop-blur` : baseBgClass
      )}
    >
      {/* --- Left Side: Logo (Sirf Mobile par dikhega) --- */}
      {isMobile && (
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-10 w-auto object-contain" 
          />
        </div>
      )}

      {/* --- Right Side: Components --- */}
      <TopbarRight />
    </header>
  );
};

export default Topbar;