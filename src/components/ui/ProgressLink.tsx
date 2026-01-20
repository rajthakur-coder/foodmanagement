// import { useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import NProgress from "nprogress";
// import 'nprogress/nprogress.css';

// interface ProgressLinkProps {
//   to: string;
//   children: React.ReactNode;
//   className?: string;
//   onClick?: (e: React.MouseEvent) => void;
// }

// const ProgressLink = ({ to, children, className, onClick }: ProgressLinkProps) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleClick = (e: React.MouseEvent) => {
//     e.preventDefault();


//     NProgress.start();
//     navigate(to);
//     if (onClick) onClick(e);
//   };

//   useEffect(() => {
//     const timeout = setTimeout(() => NProgress.done(), 200);
//     return () => clearTimeout(timeout);
//   }, [location.pathname]);

//   return (
//     <Link
//       to={to}
//       onClick={handleClick}
//       className={className} 
//     >
//       {children}
//     </Link>
//   );
// };

// export default ProgressLink;














import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

interface ProgressLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const ProgressLink: React.FC<ProgressLinkProps> = ({
  to,
  children,
  className,
  onClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    NProgress.start();
    navigate(to);
    if (onClick) onClick(e);
  };

  useEffect(() => {
    const timeout = setTimeout(() => NProgress.done(), 200);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default ProgressLink;
