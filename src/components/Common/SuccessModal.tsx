import React from "react";
import Icon from "../ui/Icon";

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  icon?: string;
  iconColor?: string;
    onConfirm?: () => void;  // <-- NEW

}

const AppModal: React.FC<AppModalProps> = ({
  open,
  onClose,
  title = "Success",
  message = "Action completed successfully!",
  buttonText = "OK",
  icon = "ri-checkbox-circle-line",
  iconColor = "text-white",
    onConfirm, // <-- NEW

}) => {
  if (!open) return null;
  
  const handleClick = () => {
    if (onConfirm) {
      onConfirm(); // <-- logout call
    }
    onClose(); // modal close
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] px-4">
      <div className="w-full max-w-sm p-6 text-center bg-white shadow-xl rounded-xl animate-fadeIn">
        
        {/* Circular Green Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-600 rounded-full">
          <Icon name={icon} size={24} className={`${iconColor}`} />
        </div>

        <h2 className="text-xl font-bold text-gray-800">{title}</h2>

        <p className="mt-2 text-gray-600">{message}</p>

          <button
          className="w-full px-4 py-2 mt-5 text-white bg-green-600 rounded-lg"
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default AppModal;
