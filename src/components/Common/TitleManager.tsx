

import React, { useEffect } from "react";

interface TitleManagerProps {
  title: string;
  children: React.ReactNode;
}

const TitleManager: React.FC<TitleManagerProps> = ({ title, children }) => {
  useEffect(() => {
    document.title = `${title} | Cravy QR`;
  }, [title]);

  return <>{children}</>;
};

export default TitleManager;

