
// import Icon from "../../ui/Icon";
// import clsx from "clsx";

// const TopbarNotification = ({ count }: { count: number }) => (
//   <div className="relative">
//     <button
//       className={clsx(
//         "flex items-center justify-center p-2 transition duration-200 transform rounded-full hover:scale-110 active:scale-95",
//         "text-text-subtle", 
//         "hover:bg-surface-hover"
//       )}
//     >
//       <Icon name="bx:bx-bell" size={20} />
//     </button>

//     {count > 0 && (
//       <span 
//         className={clsx(
//           "absolute -top-1 -right-1 text-[10px] rounded-full px-1 text-white",
//           "bg-action-danger" 
//         )}
//       >
//         {count}
//       </span>
//     )}
//   </div>
// );

// export default TopbarNotification;










import Icon from "../../ui/Icon";
import clsx from "clsx";
import type { FC } from "react";

interface TopbarNotificationProps {
  count: number;
}

const TopbarNotification: FC<TopbarNotificationProps> = ({ count }) => (
  <div className="relative">
    <button
      className={clsx(
        "flex items-center justify-center p-2 transition duration-200 transform rounded-full hover:scale-110 active:scale-95",
        "text-text-subtle",
        "hover:bg-surface-hover"
      )}
      aria-label="Notifications"
    >
      <Icon name="bx:bx-bell" size={20} />
    </button>

    {count > 0 && (
      <span
        className={clsx(
          "absolute -top-1 -right-1 text-[10px] rounded-full px-1 text-white",
          "bg-action-danger"
        )}
      >
        {count}
      </span>
    )}
  </div>
);

export default TopbarNotification;
