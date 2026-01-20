// import React, { useEffect } from "react";
// import clsx from "clsx";

// type SkeletonType = "form" | "table" | "card" | "tabs" | "text";

// interface SkeletonProps {
//   type: SkeletonType;
//   rows?: number;
//   columns?: number | string[];
//   cardPerRow?: number;
//   cardHeight?: number;
//   width?: number | string;
//   height?: number;
// }

// const Skeleton: React.FC<SkeletonProps> = ({
//   type,
//   rows = 5,
//   columns = 5,
//   cardPerRow = 3,
//   cardHeight = 180,
//   width = "100%",
//   height = 14,
// }) => {
//   // 🪄 Shimmer gradient animation (unchanged)
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//       @keyframes shimmer {
//         100% { transform: translateX(100%); }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   // Shimmer base style (💡 Dark theme colors added)
//   const shimmerClass =
//     "relative overflow-hidden rounded-md " +
//     // Light Theme: Base bg-gray-100, Gradient via-gray-200/60
//     "bg-gray-100 before:via-gray-200/60 " +
//     // Dark Theme: Base bg-gray-700, Gradient via-gray-600/60
//     "dark:bg-gray-700 dark:before:via-gray-600/60 " +
//     // Animation and gradient structure (common)
//     "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite_linear] before:bg-gradient-to-r before:from-transparent before:to-transparent";

//   // TABLE SKELETON
//   if (type === "table") {
//     const headers: (string | undefined)[] = Array.isArray(columns)
//       ? columns
//       : Array.from({ length: columns as number }, (_, i) => `col-${i}`);

//     return (
//       <div 
//         // 💡 Table container background and border
//         className="overflow-hidden border border-gray-100 shadow-sm bg-surface-card dark:bg-gray-800 dark:border-gray-700 rounded-2xl"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border-collapse">
//             <thead 
//               // 💡 Table header background and border
//               className="border-b border-gray-100/80 dark:border-gray-700/80 bg-gray-50/70 dark:bg-gray-700/70"
//             >
//               <tr>
//                 {headers.map((_, idx) => (
//                   <th key={idx} className="p-3 font-medium text-left text-gray-400">
//                     <div className={clsx(shimmerClass, "h-4 w-20")} />
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {Array.from({ length: rows }, (_, rowIdx) => (
//                 <tr
//                   key={rowIdx}
//                   className={clsx(
//                     // 💡 Table row border
//                     "border-b border-gray-100/80 dark:border-gray-700/80",
//                     rowIdx === rows - 1 && "border-b-0"
//                   )}
//                 >
//                   {headers.map((_, colIdx) => (
//                     <td key={colIdx} className="p-3">
//                       <div
//                         className={clsx(shimmerClass, "h-3.5")}
//                         style={{ width: `${70 + Math.random() * 25}%` }}
//                       />
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   }

//   // FORM SKELETON
//   if (type === "form") {
//     const colCount: number = typeof columns === "number" ? columns : 2;
//     return (
//       <div 
//         // 💡 Form container background and border
//         className="p-5 space-y-5 border border-gray-100 shadow-sm bg-surface-card dark:bg-gray-800 dark:border-gray-700 rounded-2xl"
//       >
//         {Array.from({ length: rows }, (_, rowIdx) => (
//           <div key={rowIdx} className={`grid grid-cols-1 md:grid-cols-${colCount} gap-4`}>
//             {Array.from({ length: colCount }, (_, colIdx) => (
//               <div key={colIdx} className="flex flex-col space-y-2">
//                 {/* Label skeleton */}
//                 <div className={clsx(shimmerClass, "h-3 w-2/5")} />
//                 {/* Input skeleton */}
//                 <div className={clsx(shimmerClass, "h-9 w-full")} />
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // CARD SKELETON
//   if (type === "card") {
//     return (
//       <div className={`grid gap-5 md:grid-cols-${cardPerRow}`}>
//         {Array.from({ length: rows * cardPerRow }, (_, idx) => (
//           <div
//             key={idx}
//             // 💡 Card background and border
//             className="p-4 transition-shadow duration-300 border border-gray-100 shadow-sm bg-surface-card dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md"
//           >
//             <div
//               className={clsx(shimmerClass, "w-full mb-3")}
//               style={{ height: cardHeight }}
//             />
//             <div className="space-y-2">
//               <div className={clsx(shimmerClass, "h-3.5 w-3/5")} />
//               <div className={clsx(shimmerClass, "h-3.5 w-4/5")} />
//               <div className={clsx(shimmerClass, "h-3 w-1/2")} />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // TABS SKELETON
//   if (type === "tabs") {
//     const tabCount: number = typeof columns === "number" ? columns : 4;
//     return (
//       <div 
//         // 💡 Tabs container background and border
//         className="flex gap-3 p-2 border border-gray-100 shadow-sm bg-surface-card dark:bg-gray-800 dark:border-gray-700 rounded-xl"
//       >
//         {Array.from({ length: tabCount }, (_, idx) => (
//           <div key={idx} className={clsx(shimmerClass, "h-8 w-24 rounded-full")} />
//         ))}
//       </div>
//     );
//   }

//   // TEXT SKELETON
//   if (type === "text") {
//     return (
//       <div className="space-y-2">
//         {Array.from({ length: rows }, (_, idx) => (
//           <div
//             key={idx}
//             className={clsx(shimmerClass)}
//             style={{
//               width,
//               height,
//               borderRadius: "6px",
//             }}
//           />
//         ))}
//       </div>
//     );
//   }

//   return null;
// };

// export default Skeleton;












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
  shape?: SkeletonShape; // ✅ New prop
}

const Skeleton: React.FC<SkeletonProps> = ({
  type,
  rows = 5,
  columns = 5,
  cardPerRow = 3,
  cardHeight = 180,
  width = "100%",
  height = 14,
  shape = "rounded", // default
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
      document.head.removeChild(style);
    };
  }, []);

  const baseClass = "relative overflow-hidden " + (shape === "circle" ? "rounded-full" : "rounded-md");

  const shimmerClass =
    baseClass +
    " bg-gray-100 before:via-gray-200/60 dark:bg-gray-700 dark:before:via-gray-600/60 " +
    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite_linear] before:bg-gradient-to-r before:from-transparent before:to-transparent";

  // CARD SKELETON
  if (type === "card") {
    return (
      <div className={`grid gap-5 md:grid-cols-${cardPerRow}`}>
        {Array.from({ length: rows * cardPerRow }, (_, idx) => (
          <div
            key={idx}
            className="p-4 transition-shadow duration-300 border border-gray-100 shadow-sm bg-surface-card dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md"
          >
            <div
              className={clsx(shimmerClass, "w-full mb-3")}
              style={{ height: cardHeight }}
            />
            <div className="space-y-2">
              <div className={clsx(shimmerClass, "h-3.5 w-3/5")} />
              <div className={clsx(shimmerClass, "h-3.5 w-4/5")} />
              <div className={clsx(shimmerClass, "h-3 w-1/2")} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // TABS / CATEGORY SKELETON
  if (type === "tabs") {
    const tabCount: number = typeof columns === "number" ? columns : 4;
    return (
      <div className="flex gap-3 p-2 bg-surface-card dark:bg-gray-800 dark:border-gray-700 rounded-xl">
        {Array.from({ length: tabCount }, (_, idx) => (
          <div
            key={idx}
            className={clsx(shimmerClass, shape === "circle" ? "w-16 h-16" : "h-8 w-24")}
          />
        ))}
      </div>
    );
  }

  // TEXT SKELETON
  if (type === "text") {
    return (
      <div className="space-y-2 bg-surface-card">
        {Array.from({ length: rows }, (_, idx) => (
          <div
            key={idx}
            className={clsx(shimmerClass)}
            style={{
              width,
              height,
              borderRadius: shape === "circle" ? "50%" : "6px",
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default Skeleton;
