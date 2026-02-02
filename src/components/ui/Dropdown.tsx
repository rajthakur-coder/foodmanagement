

import { useState, MouseEvent } from "react";
import type { ReactNode } from "react";
import { createRipple } from "../../hooks/useRipple";

type DropdownItem = {
  label: string;
  icon?: ReactNode;
  badge?: string;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
};

type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
};

const Dropdown: React.FC<DropdownProps> = ({ trigger, items }) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <div className="relative inline-block text-left">
      {/* Trigger */}
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 w-48 mt-2 origin-top-right bg-surface-card z-[9999] ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {items.map((item, idx) =>
              item.separator ? (
                <hr key={idx} className="my-1 border-border-primary" />
              ) : (
                <button
                  key={idx}
                  onClick={() => {
                    if (!item.disabled && item.onClick) item.onClick();
                    setActiveItem(item.label);
                    setOpen(false);
                  }}
                  disabled={item.disabled}
                  data-ripple
                  onMouseDown={(e: MouseEvent<HTMLButtonElement>) => createRipple(e)}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm rounded-md transition
                    ${item.disabled
                      ? "text-text-subtle opacity-50"
                      : activeItem === item.label
                      ? "sidebar-item-active"
                      : "text-text-subtle hover:text-text-main hover:bg-surface-hover"
                    }`}
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1 ml-auto text-xs text-white rounded bg-primary">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

