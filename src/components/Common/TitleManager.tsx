// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { PAGE_TITLES, COMPANY_NAME } from "../../../src/components/Config/pageTitles";

// const TitleManager = () => {
//   const location = useLocation();

//   useEffect(() => {
//     const path = location.pathname;
//     const pageTitle = PAGE_TITLES[path] || "Nerotix Technology";
//     document.title = `${pageTitle} | ${COMPANY_NAME}`;
//   }, [location.pathname]);

//   return null;
// };

// export default TitleManager;



import React, { useEffect } from "react";

interface TitleManagerProps {
  title: string;
  children: React.ReactNode;
}

const TitleManager: React.FC<TitleManagerProps> = ({ title, children }) => {
  useEffect(() => {
    document.title = `${title} | Nerotix`;
  }, [title]);

  return <>{children}</>;
};

export default TitleManager;

