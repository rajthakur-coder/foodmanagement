import React, { useEffect } from "react";
import clsx from "clsx";

type SkeletonType = "form" | "table" | "card" | "tabs" | "text";
type SkeletonShape = "rounded" | "circle";

interface SkeletonProps {
  type: SkeletonType;
  rows?: number;
  columns?: number | string[];
  cardPerRow?: number;
  cardHeight?: number;
  width?: number | string;
  height?: number;
  shape?: SkeletonShape;
}

const Skeleton: React.FC<SkeletonProps> = ({
  type,
  rows = 5,
  columns = 5,
  cardPerRow = 2, // Set to 2 for mobile grid default
  cardHeight = 180,
  width = "100%",
  height = 14,
  shape = "rounded",
}) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const head = document.head;
      if (head.contains(style)) head.removeChild(style);
    };
  }, []);

  const baseClass = "relative overflow-hidden " + (shape === "circle" ? "rounded-full" : "rounded-md");

  const shimmerClass =
    baseClass +
    " bg-gray-100 before:via-gray-200/60 dark:bg-gray-700 dark:before:via-gray-600/60 " +
    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite_linear] before:bg-gradient-to-r before:from-transparent before:to-transparent";

  // CARD SKELETON - Matches the grid of MenuItems
  if (type === "card") {
    return (
      <div className={`grid gap-4 grid-cols-${cardPerRow} md:grid-cols-3 lg:grid-cols-4`}>
        {Array.from({ length: rows * 2 }, (_, idx) => (
          <div
            key={idx}
            className="p-3 border border-gray-100 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl"
          >
            <div
              className={clsx(shimmerClass, "w-full mb-3 rounded-lg")}
              style={{ height: cardHeight }}
            />
            <div className="space-y-2">
              <div className={clsx(shimmerClass, "h-4 w-3/4")} />
              <div className={clsx(shimmerClass, "h-3 w-1/2")} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // TABS / CATEGORY SKELETON - Matches the circular categories
  if (type === "tabs") {
    const tabCount = typeof columns === "number" ? columns : 5;
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: tabCount }, (_, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className={clsx(shimmerClass, "w-16 h-16 md:w-20 md:h-20")} />
            <div className={clsx(shimmerClass, "h-2 w-12")} />
          </div>
        ))}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }, (_, idx) => (
          <div
            key={idx}
            className={clsx(shimmerClass)}
            style={{ width, height, borderRadius: shape === "circle" ? "50%" : "6px" }}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default Skeleton;