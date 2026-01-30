


import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import BottomNav from "./Sidebar/BottomNav";

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const location = useLocation();
  const hideLayoutPaths = ["/auth/login", "/restaurant-onboarding"];
  const hideLayout = hideLayoutPaths.includes(location.pathname);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkScreen = (): void => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const collapsedWidth = "6rem";
  const expandedWidth = "16rem";

  const mainMarginLeft: string | number = isMobile
    ? 0
    : isCollapsed
    ? collapsedWidth
    : expandedWidth;

  if (hideLayout) {
    // Login or onboarding pages → full screen
    return <main className="flex-1 overflow-auto bg-surface-body">{children}</main>;
  }

  // Dashboard / other pages → sidebar + topbar
  return (
    <div className="flex h-screen">
      {/* <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onItemClick={() => isMobile && setIsMobileOpen(false)}
      />

      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )} */}


         {!isMobile ? (
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onItemClick={() => isMobile && setIsMobileOpen(false)}
        />
      ) : (
        <BottomNav /> // 👈 new component for mobile/tablet
      )}

      <div
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out w-36"
        style={{
          marginLeft: mainMarginLeft,
        }}
      >
        <Topbar
          isCollapsed={isCollapsed}
          toggleSidebar={() =>
            isMobile ? setIsMobileOpen(!isMobileOpen) : setIsCollapsed(!isCollapsed)
          }
          isMobile={isMobile}
        />

    

          <main className="flex-1  bg-surface-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
