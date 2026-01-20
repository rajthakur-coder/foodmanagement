
import { useEffect, useState } from "react";
import TopbarLeft from "./TopbarLeft";
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
        "fixed top-0 h-16 flex items-center justify-end px-4 shadow-md transition-all duration-300 z-10",
        headerWidthClass,
        scrolled ? `${baseBgClass}/90 backdrop-blur` : baseBgClass
      )}
    >
      <TopbarRight />
    </header>
  );
};

export default Topbar;
