import { useLocation, useNavigate } from "react-router-dom";
import { sidebarSections } from "./sideData";
import ProgressLink from "../../ui/ProgressLink";
import clsx from "clsx";
import Cookies from "js-cookie";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const flatItems = sidebarSections.flatMap((s) => s.items);
  const token = Cookies.get("customertoken"); // cookie se token

  return (
    // Show only on small/medium screens, hide on lg+
    <nav className="fixed bottom-0 left-0 right-0 z-[2000] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg block lg:hidden">
      <div className="flex justify-center overflow-x-auto no-scrollbar">
        {flatItems.map((item) => {
          const isProtected = item.name === "My Orders";
          const isDisabled = isProtected && !token;

          return (
            <ProgressLink
              key={item.name}
              to={isDisabled ? "#" : item.path || "#"}
              onClick={(e) => {
                if (isDisabled) e.preventDefault(); // navigation block
                else navigate(item.path || "#"); // normal navigation
              }}
              title={isDisabled ? "Login to access this page" : ""}
              className={clsx(
                "flex flex-col items-center justify-center h-16 text-sm transition-colors",
                "min-w-[70px] sm:min-w-[90px] md:min-w-[120px] lg:min-w-[130px] xl:min-w-[150px]",
                activePath.startsWith(item.path || "")
                  ? "text-primary font-semibold"
                  : "text-gray-500 dark:text-gray-300",
                isDisabled && "cursor-not-allowed opacity-50"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] text-center">{item.name}</span>
            </ProgressLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
