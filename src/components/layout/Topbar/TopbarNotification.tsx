import { useState, useRef, useEffect } from "react";
import Icon from "../../ui/Icon";
import clsx from "clsx";
import type { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store"; 
import { markAllAsRead, clearNotifications } from "../../../features/notification/notificationSlice";

const TopbarNotification: FC = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      dispatch(markAllAsRead());
    }
  };

  const renderStatusBadge = (message: string) => {
    const msg = message.toLowerCase();
    let badgeStyle = "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    let statusText = "";

    if (msg.includes("confirm")) {
      badgeStyle = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      statusText = "Confirmed";
    } else if (msg.includes("prepar")) {
      badgeStyle = "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
      statusText = "Preparing";
    } else if (msg.includes("ready") || msg.includes("pickup")) {
      badgeStyle = "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      statusText = "Ready for Pickup";
    } else if (msg.includes("complet") || msg.includes("serv")) {
      badgeStyle = "bg-emerald-500 text-white shadow-sm";
      statusText = "Completed";
    } else if (msg.includes("cancel")) {
      badgeStyle = "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      statusText = "Cancelled";
    }

    return statusText ? (
      <span className={clsx("px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ml-1", badgeStyle)}>
        {statusText}
      </span>
    ) : null;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL BUTTON */}
      <button
        onClick={toggleDropdown}
        className={clsx(
          "flex items-center justify-center p-2 rounded-full transition-all duration-200",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isOpen ? "text-primary-main bg-gray-100 dark:bg-gray-800" : "text-gray-500 dark:text-gray-400"
        )}
      >
        <Icon name="bx:bx-bell" size={22} />
      </button>

      {/* BADGE */}
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-pulse">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}

      {/* DROPDOWN */}
      {isOpen && (
        <div className={clsx(
          "fixed inset-x-4 top-16 mt-1 origin-top-right rounded-2xl border shadow-2xl transition-all",
          "md:absolute md:right-0 md:left-auto md:w-80 md:inset-x-auto md:top-full",
          "bg-white dark:bg-[#1F2937] border-gray-100 dark:border-gray-700",
          "z-[999]" // Yahan z-index ko high kiya hai taaki ye sticky elements ke upar dikhe
        )}>
          
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-2xl">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display">Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={() => dispatch(clearNotifications())} className="text-[11px] font-semibold text-red-500 hover:text-red-600">
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-[60vh] md:max-h-96 overflow-y-auto scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Icon name="bx bx-bell-off" size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-xs font-medium text-gray-400">No new alerts for you</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {notifications.map((n) => (
                  <div key={n.id} className={clsx("relative flex gap-3 p-4 transition-colors", !n.isRead ? "bg-blue-50/30 dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-gray-800/40")}>
                    
                    <div className={clsx(
                      "mt-1.5 h-2 w-2 flex-shrink-0 rounded-full",
                      n.message.toLowerCase().includes("confirm") && "bg-blue-500 shadow-[0_0_6px_#3b82f6]",
                      n.message.toLowerCase().includes("prepar") && "bg-orange-500 shadow-[0_0_6px_#f97316]",
                      (n.message.toLowerCase().includes("ready") || n.message.toLowerCase().includes("complet")) && "bg-green-500 shadow-[0_0_6px_#22c55e]"
                    )} />

                    <div className="flex flex-col gap-2">
                      <div className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-gray-400 dark:text-gray-500">Order Update:</span>
                        <div className="mt-1 font-medium">
                           {n.message.split('now')[0]} now {renderStatusBadge(n.message)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                        <Icon name="bx bx-time-five" size={12} />
                        {n.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopbarNotification;