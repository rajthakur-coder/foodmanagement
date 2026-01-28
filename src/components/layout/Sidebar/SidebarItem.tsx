import { useState, FC, ReactNode } from "react";
import ProgressLink from "../../ui/ProgressLink";
import Icon from "../../ui/Icon";
import clsx from "clsx";
import Cookies from "js-cookie";

interface SidebarChild {
  name: string;
  path: string;
}

interface SidebarItemProps {
  item: {
    name: string;
    path?: string;
    icon: ReactNode;
    children?: SidebarChild[];
  };
  isCollapsed: boolean;
  isActive: boolean;
  openManagementMenu?: string | null;
  toggleManagementMenu?: (name: string) => void;
  onItemClick?: () => void;
}

const SidebarItem: FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  isActive,
  openManagementMenu,
  toggleManagementMenu,
  onItemClick,
}) => {
  const hasChildren = !!item.children?.length;
  const [activeChild, setActiveChild] = useState<string | null>(null);
  const currentPath = window.location.pathname;

const token = Cookies.get("customertoken"); 
  const isProtected = item.name === "My Orders"; // Protected page
  const isDisabled = isProtected && !token;

  const handleClickChild = (childName: string) => {
    setActiveChild(childName);
    onItemClick?.();
  };

  const handleClickItem = () => {
    setActiveChild(item.name);
    onItemClick?.();
  };

  return (
    <div className="relative w-full">
      {hasChildren ? (
        <button
          onClick={() => !isDisabled && toggleManagementMenu?.(item.name)}
          data-ripple
          disabled={isDisabled}
          title={isDisabled ? "Login to access this page" : ""}
          className={clsx(
            "sidebar-item transition-all duration-200",
            isDisabled && "cursor-not-allowed opacity-50",
            isCollapsed
              ? "flex-col py-2 px-1 gap-1"
              : "flex-row px-4 py-3 gap-2 justify-between",
            isActive
              ? "sidebar-item-active"
              : "text-[#637381] dark:text-[#919EAB] hover:bg-surface-hover"
          )}
        >
          {/* Icon + Label */}
          <div
            className={clsx(
              "flex items-center",
              isCollapsed ? "flex-col gap-1" : "flex-row gap-2 flex-1"
            )}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="ml-1 text-sm">{item.name}</span>}
          </div>

          {/* Arrow */}
          <span
            className={clsx(
              "absolute right-3 top-[22px] -translate-y-1/2 text-sm transition-transform duration-200",
              !isCollapsed && openManagementMenu === item.name && "rotate-180"
            )}
          >
            <Icon
              name={isCollapsed ? "bx:chevron-right" : "bx:chevron-down"}
              size={20}
            />
          </span>

          {isCollapsed && <span className="text-[10px] mt-1">{item.name}</span>}
        </button>
      ) : (
        <ProgressLink
          to={isDisabled ? "#" : item.path ?? "#"}
          data-ripple
          onClick={(e) => {
            if (isDisabled) e.preventDefault(); // prevent navigation
            else handleClickItem();
          }}
          title={isDisabled ? "Login to access this page" : ""}
          className={clsx(
            "sidebar-item mt-1 transition-all duration-200",
            isCollapsed
              ? "flex-col justify-center py-2 px-1 gap-1"
              : "flex-row px-4 py-3 gap-2",
            isDisabled && "cursor-not-allowed opacity-50",
            isActive
              ? "sidebar-item-active"
              : "text-[#637381] dark:text-[#919EAB] hover:bg-surface-hover"
          )}
        >
          <span className="text-xl">{item.icon}</span>
          <span className={clsx(isCollapsed ? "text-[10px]" : "ml-1 text-sm")}>
            {item.name}
          </span>
        </ProgressLink>
      )}

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <div
          className={clsx(
            "flex flex-col ml-10 mt-1 mb-1 space-y-0 border-l-2 border-border-secondary overflow-hidden transition-all duration-300",
            openManagementMenu === item.name ? "max-h-max" : "max-h-0"
          )}
        >
          {item.children?.map((child) => (
            <div key={child.name} className="relative flex items-center">
              <span className="absolute -left-[2px] w-3 h-2 border-l-2 border-b-2 border-border-secondary bg-surface-card z-10 rounded-bl-full"></span>

              <ProgressLink
                key={child.name}
                to={child.path}
                className={clsx(
                  "sidebar-submenu-item ml-2.5 mt-1 relative flex items-center w-full overflow-hidden text-sm rounded-lg hover:bg-surface-hover",
                  "text-[#637381] dark:text-[#919EAB]",
                  activeChild === child.name || currentPath.startsWith(child.path)
                    ? "bg-surface-hover sidebar-submenu-item-active"
                    : ""
                )}
                onClick={() => handleClickChild(child.name)}
              >
                <span className="py-2 pl-4">{child.name}</span>
              </ProgressLink>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
