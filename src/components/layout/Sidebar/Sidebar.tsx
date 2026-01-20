import { useState, useRef, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import type { RootState } from '../../../components/app/store';

import { sidebarSections } from "./sideData";
import SidebarItem from "./SidebarItem";
import SidebarSubmenu from "./SidebarSubmenu";
import Icon from "../../ui/Icon";
import clsx from "clsx";
import logosidebar from "../../../assets/Images/logosidebar.png"
import logosidebar1 from "../../../assets/Images/logo1.png"


// -------------------- Types --------------------
export type SidebarItemType = {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  children?: SidebarItemType[];
  roles?: ('Admin'  | 'Guest' | string)[];
};

type SidebarSectionType = {
  section: string;
  items: SidebarItemType[];
};

type Position = { top: number; left: number; height: number };

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onItemClick?: () => void;
};

type SidebarHeaderProps = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

// -------------------- Sidebar Header --------------------
const SidebarHeader = ({ isCollapsed, toggleCollapse }: SidebarHeaderProps) => (
   <div className="relative flex items-center h-16 px-4">

    {/* 👉 Expanded Sidebar → Full Logo */}
    {!isCollapsed ? (
       <img
    src={logosidebar1}
    alt="Logo"
    width="230"
    height="40"
    className="object-contain "
/>

    ) : (
        /* 👉 Collapsed Sidebar → Favicon */
       <img
    src={logosidebar}
    alt="Favicon"
    width="50"
    height="50"
    className="ml-3"
/>

    )}

    <button
        data-no-ripple
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={toggleCollapse}
        className={clsx(
            "absolute flex items-center justify-center w-6 h-6 rounded-full hover:bg-surface-hover",
            "bg-surface-card text-text-subtle",
            "transition-transform duration-300 transform hover:scale-110 active:scale-95 overflow-hidden -right-3 hidden lg:flex"
        )}
    >
        <Icon
            name={isCollapsed ? "bx:chevron-right" : "bx:chevron-left"}
            size={16}
        />
    </button>
</div>
);

const MemoizedSidebarItem = memo(SidebarItem);

// -------------------- Helper Function --------------------
const hasAccess = (item: SidebarItemType, userRole: string | null | undefined): boolean => {
  if (!item.roles || item.roles.length === 0) return true; // No role = accessible
  if (!userRole) return false;
  return item.roles.includes(userRole);
};

// -------------------- Sidebar Component --------------------
const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  onItemClick,
}: SidebarProps) => {
  const location = useLocation();
  const activePath = location.pathname;

  // Fetch user role from Redux OR fallback to sessionStorage for QR guests
  const reduxRole = useSelector((state: RootState) => state.auth.user?.role);
  const guestRole = sessionStorage.getItem("user_type"); // "Guest" for QR
  const userRole = reduxRole || guestRole || null;

  const [filteredSections, setFilteredSections] = useState<SidebarSectionType[]>([]);

  const getInitialOpenMenu = (): string | null => {
    for (const section of filteredSections.length > 0 ? filteredSections : sidebarSections) {
      for (const item of section.items) {
        if (item.children?.some((child) => activePath.startsWith(child.path ?? ""))) {
          return item.name;
        }
      }
    }
    return null;
  };

  const [openManagementMenu, setOpenManagementMenu] = useState<string | null>(getInitialOpenMenu());
  const [hoveredManagementMenu, setHoveredManagementMenu] = useState<SidebarItemType | null>(null);
  const [hoveredElementPos, setHoveredElementPos] = useState<Position>({ top: 0, left: 0, height: 0 });
  const [showScroll, setShowScroll] = useState(false);

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------- Filter Sections by Role --------------------
  useEffect(() => {
    if (!userRole) {
      setFilteredSections([]);
      return;
    }

    const newFilteredSections = sidebarSections
      .map(section => {
        const filteredItems = section.items
          .filter(item => hasAccess(item, userRole))
          .map(item => {
            if (item.children) {
              const filteredChildren = item.children.filter(child => hasAccess(child, userRole));
              return { ...item, children: filteredChildren };
            }
            return item;
          });
        return { ...section, items: filteredItems };
      })
      .filter(section => section.items.length > 0);

    setFilteredSections(newFilteredSections);
    setOpenManagementMenu(getInitialOpenMenu());
  }, [userRole, activePath]);

  // -------------------- Scroll detection --------------------
  useEffect(() => {
    const sidebarEl = document.getElementById("sidebar-scroll");
    if (!sidebarEl) return;

    const handleScroll = () => {
      setShowScroll(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setShowScroll(false), 800);
    };

    sidebarEl.addEventListener("scroll", handleScroll);
    return () => sidebarEl.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleManagementMenu = (name: string) => {
    setOpenManagementMenu(openManagementMenu === name ? null : name);
  };

  const handleHoverEnter = (e: React.MouseEvent<HTMLDivElement>, item: SidebarItemType) => {
    if (isCollapsed && item.children && item.children.length > 0) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredElementPos({ top: rect.top, left: rect.right + 8, height: rect.height });
      setHoveredManagementMenu(item);
    }
  };

  const handleHoverLeave = () => {
    if (isCollapsed) {
      hoverTimeoutRef.current = setTimeout(() => setHoveredManagementMenu(null), 300);
    }
  };

  const handleItemClick = () => setHoveredManagementMenu(null);

  // -------------------- Render --------------------
  return (
    <>
      <aside
        className={clsx(
          "h-screen fixed top-0 left-0 transition-all duration-300 z-50",
          "bg-surface-card border-r border-border-primary",
          "w-64",
          isCollapsed ? "lg:w-24" : "lg:w-64",
          "sidebar-dark",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        <nav
          id="sidebar-scroll"
          className={clsx(
            "mt-2 flex flex-col overflow-y-auto h-[calc(100vh-80px)] pb-8 ",
            isCollapsed ? "px-1 space-y-1 no-scrollbar" : "px-2 space-y-3 scrollbar-hidden",
            showScroll && "show-scroll"
          )}
        >
          {filteredSections.map((section, index) => (
            <div key={index}>
              {!isCollapsed && (
                <h2 className="px-3 mb-2 text-xs font-semibold uppercase dark:text-[#637381] text-[#919EAB]">
                  {section.section}
                </h2>
              )}
              {section.items.map((item) => (
                <div
                  key={item.name}
                  onMouseEnter={(e) => handleHoverEnter(e, item)}
                  onMouseLeave={handleHoverLeave}
                >
                  <MemoizedSidebarItem
                    item={item}
                    isCollapsed={isCollapsed}
                    isActive={
                      item.children && item.children.length > 0
                        ? item.children.some((c) => activePath.startsWith(c.path ?? ""))
                        : activePath.startsWith(item.path ?? "")
                    }
                    openManagementMenu={openManagementMenu}
                    toggleManagementMenu={toggleManagementMenu}
                    onItemClick={onItemClick}
                  />
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <SidebarSubmenu
        hoveredElementPos={hoveredElementPos}
        item={hoveredManagementMenu}
        handleHoverLeave={handleHoverLeave}
        handleItemClick={handleItemClick}
        activePath={activePath}
        isCollapsed={isCollapsed}
        hoverTimeoutRef={hoverTimeoutRef}
        onItemClick={onItemClick}
      />
    </>
  );
};

export default Sidebar;
