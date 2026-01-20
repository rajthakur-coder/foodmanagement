// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import NProgress from "nprogress";

// const ProgressWatcher: React.FC = () => {
//   const location = useLocation();

//   useEffect(() => {

//     const timeout = setTimeout(() => {
//       NProgress.done();
//     }, 300); 

//     return () => clearTimeout(timeout);
//   }, [location]);

//   return null;
// };

// export default ProgressWatcher;












import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";

const ProgressWatcher: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // TypeScript strict mode ke liye timeout ko type karein
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => clearTimeout(timeout);
  }, [location]);

  return null;
};

export default ProgressWatcher;

