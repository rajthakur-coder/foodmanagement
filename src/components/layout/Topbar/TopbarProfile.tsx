import { useState, useRef, useEffect, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import defaultAvatar from "../../../assets/Images/avator.jfif";
// ya relative path:
// import defaultAvatar from "../../assets/images/default-avatar.png";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMessageCircle,
  FiCalendar,
  FiHelpCircle,
  FiSettings,
  FiLock,
  FiLogOut,
} from "react-icons/fi";
import LogoutModal from "../../Modal/LogoutModal";
import { useLogoutMutation } from "../../../features/auth/authApi";
import { logout } from "../../../features/auth/authSlice";
import { ToasterUtils } from "../../ui/toast";

interface User {
  name?: string;
  avatar?: string;
  role?: string;
}

interface RootState {
  auth: {
    user?: User;
    isAuthenticated: boolean;
  };
}

interface DropdownItem {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}

const TopbarProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutLoading, setLogoutLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const [logoutApi] = useLogoutMutation();

  // Guest or User role fallback
  const userRole = user?.role || sessionStorage.getItem("user_type"); // "Guest" fallback
  // const PROFILE_PAGE_ROUTE = "/profile";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent<Document>) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener(
      "mousedown",
      handleClickOutside as unknown as (event: Event) => void
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside as unknown as (event: Event) => void
      );
  }, []);

  const handleLogoutConfirm = async (allDevices: boolean) => {
    try {
      setLogoutLoading(true);
      const response = await logoutApi({ all_device: allDevices }).unwrap();
      if (response.success) {
        ToasterUtils.success(response.message || "Logout successful.");
        dispatch(logout());
        navigate("/auth/login", { replace: true });
      } else {
        ToasterUtils.error(response.message || "Logout unsuccessful. Please try again.");
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.data?.message || (err as Error)?.message || "Logout failed. Server issue.";
      ToasterUtils.error(errorMessage);
    } finally {
      setLogoutLoading(false);
      setLogoutModalOpen(false);
    }
  };

  // Dropdown items
  // const items: DropdownItem[] = [
  //   // { label: "Profile", icon: <FiUser />, onClick: () => navigate(PROFILE_PAGE_ROUTE) },
  
  //   // ✅ Logout only for User or PlatformAdmin
  //   ...(userRole !== "Guest"
  //     ? [{ label: "Logout", icon: <FiLogOut />, onClick: () => setLogoutModalOpen(true) }]
  //     : []),
  // ];

  return (
    <>
      <div ref={dropdownRef} className="relative ">
        <div onClick={() => setDropdownOpen(!isDropdownOpen)}>
          <div className="flex items-center gap-2 cursor-pointer">
            <div
              data-ripple
              className={clsx(
                "relative w-10 h-10 overflow-hidden rounded-full cursor-pointer",
                "transition duration-200 ease-in-out transform",
                "hover:scale-105 active:scale-95 hover:bg-gray-800"
              )}
            >
            <img
  src={user?.avatar || defaultAvatar}
  alt="User Avatar"
  className="w-10 h-10 rounded-full object-cover"
/>

            </div>
            <div className="hidden md:block">
              <h4 className="text-sm font-medium text-text-main">{user?.name || "Guest User"}</h4>
              <p className="text-xs text-text-main">{userRole || "Guest"}</p>
            </div>
          </div>
        </div>

        {/* Dropdown Menu
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 z-50 w-48 p-2 mt-2 overflow-hidden rounded-lg shadow-lg bg-surface-card"
            >
              {items.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    item.onClick();
                    setDropdownOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition",
                    item.label === "Logout"
                      ? "bg-danger text-white hover:bg-red-700"
                      : "text-text-main hover:bg-surface-hover"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        toggle={() => setLogoutModalOpen(false)}
        onLogout={handleLogoutConfirm}
        isLoading={isLogoutLoading}
      />
    </>
  );
};

export default TopbarProfile;
