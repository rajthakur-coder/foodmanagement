

import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../ui/Icon";

interface LoaderContextType {
  showLoader: () => void;
  hideLoader: () => void;
}

const GlobalLoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useGlobalLoader = (): LoaderContextType => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error("useGlobalLoader must be used within a GlobalLoaderProvider");
  }
  return context;
};

interface GlobalLoaderProviderProps {
  children: ReactNode;
}

export const GlobalLoaderProvider: React.FC<GlobalLoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const contextValue: LoaderContextType = {
    showLoader: () => setIsLoading(true),
    hideLoader: () => setIsLoading(false),
  };

  const spinner = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="flex items-center justify-center rounded-xl">
        <Icon name="ri-loader-4-line" size={44} className="animate-spin text-primary" />
      </div>
    </div>
  );

  return (
    <GlobalLoaderContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="global-loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            {spinner}
          </motion.div>
        )}
      </AnimatePresence>
    </GlobalLoaderContext.Provider>
  );
};

