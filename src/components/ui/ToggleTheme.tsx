
// import { FiSun, FiMoon } from "react-icons/fi";
// import { useTheme } from "../context/ThemeContext";

// const ToggleTheme = () => {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <button
//       onClick={toggleTheme}

//       className="p-2 transition duration-200 ease-in-out transform rounded-full hover:bg-surface-hover hover:scale-110 active:scale-95"
//     >
//       {theme === "light" ? (
//         <FiMoon className="text-lg" />
//       ) : (
//         <FiSun className="text-lg" />
//       )}
//     </button>
//   );
// };

// export default ToggleTheme;











import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import React from "react";

// Component typed with React.FC
const ToggleTheme: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 transition duration-200 ease-in-out transform rounded-full hover:bg-surface-hover hover:scale-110 active:scale-95"
    >
      {theme === "light" ? (
        <FiMoon className="text-lg" />
      ) : (
        <FiSun className="text-lg" />
      )}
    </button>
  );
};

export default ToggleTheme;

