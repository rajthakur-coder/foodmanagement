
import ProgressLink from "../../ui/ProgressLink";
import { useState, useEffect } from "react";
import clsx from "clsx";
import BasePopup from "../../BaseModals/BasePopup";
import { createRipple } from "../../../hooks/useRipple";
import type { ReactNode, MouseEvent } from "react";

interface SidebarItemType {
    name: string;
    path?: string;
    icon?: ReactNode;
    children?: SidebarItemType[];
}

interface SidebarSubmenuProps {
    hoveredElementPos: { height: number; top: number; left: number };
    item: SidebarItemType | null;
    handleHoverLeave: () => void;
    handleItemClick: () => void;
    activePath: string;
    isCollapsed: boolean;
    hoverTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
    onItemClick?: () => void;
}

const SidebarSubmenu = ({
    hoveredElementPos,
    item,
    handleHoverLeave,
    handleItemClick,
    activePath,
    isCollapsed,
    hoverTimeoutRef,
    onItemClick,
}: SidebarSubmenuProps) => {
    const [show, setShow] = useState(false);
    const [clickedItem, setClickedItem] = useState<string | null>(null);

    useEffect(() => {
        if (item && isCollapsed) {
            const timeout = setTimeout(() => setShow(true), 20);
            return () => clearTimeout(timeout);
        } else {
            setShow(false);
            setClickedItem(null);
        }
    }, [item, isCollapsed]);

    if (!isCollapsed || !item || !item.children) return null;

    const handleClick = (childName: string) => {
        setClickedItem(childName);
        handleItemClick();
        onItemClick?.();
    };

    const handleMouseDown = (e: MouseEvent<HTMLAnchorElement>) => createRipple(e);

    return (
        <BasePopup
            open={!!item && isCollapsed}
            position={{
                top: hoveredElementPos.top - hoveredElementPos.height * 1.2,
                left: hoveredElementPos.left,
            }}
            width="200px"
            zIndex={10001}
            animation="scale"
            className="origin-top-left rounded-xl bg-surface-card"
            withOverlay={false}
            lockScroll={false}
        >
            <div
                role="menu"
                onMouseEnter={() =>
                    hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current)
                }
                onMouseLeave={handleHoverLeave}
                className="p-3 shadow-xl sidebar-dark sidebar-submenu rounded-xl text-text-primary"
            >
                {/* Header */}
                <div className="flex items-center gap-2 mb-3 sidebar-submenu-header">
                    <span className="text-lg text-primary">{item.icon}</span>
                    <h4 className="text-sm font-semibold">{item.name}</h4>
                </div>

                {/* Children */}
                <div className="flex flex-col space-y-1">
                    {item.children.map((child) => (
                        <ProgressLink
                            key={child.name}
                            to={child.path ?? "#"}
                            role="menuitem"
                            data-ripple
                            onMouseDown={handleMouseDown}
                            className={clsx(
                                "block px-4 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer",
                                clickedItem === child.name
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : activePath.startsWith(child.path ?? "")
                                        ? "bg-surface-active font-semibold text-text-primary"
                                        : "text-text-secondary hover:bg-surface-hover"
                            )}
                            onClick={() => handleClick(child.name)}
                        >
                            {child.name}
                        </ProgressLink>
                    ))}
                </div>
            </div>
        </BasePopup>
    );
};

export default SidebarSubmenu;
