
// import React, { useState } from "react";
// import BaseModal from "../BaseModals/BaseModal";
// import ContentModal from "../ContentModal/DeleteContentModal";

// interface DeleteModalProps {
//   isOpen: boolean;
//   toggle: () => void;
//   id?: string | number;
//   confirmColor?: string;
//   cancelColor?: string;
//   itemsToDelete?: number;
//   message?: string;
//   onConfirm?: () => Promise<void> | void;
// }

// const DeleteModal: React.FC<DeleteModalProps> = ({
//   isOpen,
//   toggle,
//   id,
//   confirmColor,
//   cancelColor,
//   itemsToDelete,
//   message,
//   onConfirm,
// }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleConfirm = async () => {
//     try {
//       setIsLoading(true);
//       if (onConfirm) await onConfirm();
//       toggle(); // close modal
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const finalMessage =
//     message ??
//     (itemsToDelete && itemsToDelete > 0
//       ? `Are you sure you want to permanently delete ${itemsToDelete} item${itemsToDelete > 1 ? "s" : ""
//       }?`
//       : "Are you sure you want to delete?");

//   return (
//     <BaseModal
//       isOpen={isOpen}
//       toggle={toggle}
//       showCloseIcon={false}
//       onConfirm={handleConfirm}
//       onCancel={toggle}
//       confirmText="Delete"
//       cancelText="Cancel"
//       confirmColor={confirmColor}
//       cancelColor={cancelColor}
//       isLoading={isLoading}
//       widthClass="w-[450px]"
//     >
//       <ContentModal title="Delete" message={finalMessage} />
//     </BaseModal>
//   );
// };

// export default DeleteModal;











import React, { useState } from "react";
import BaseModal from "../BaseModals/BaseModal";
import ContentModal from "../ContentModal/DeleteContentModal";

interface DeleteModalProps {
  isOpen: boolean;
  toggle: () => void;
  id?: string | number;
  confirmColor?: string;
  cancelColor?: string;
  itemsToDelete?: number;
  message?: string;
  onConfirm?: () => Promise<void> | void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  toggle,
  id,
  confirmColor,
  cancelColor,
  itemsToDelete,
  message,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      if (onConfirm) await onConfirm();
      toggle(); // close modal
    } finally {
      setIsLoading(false);
    }
  };

  const finalMessage: string =
    message ??
    (itemsToDelete && itemsToDelete > 0
      ? `Are you sure you want to permanently delete ${itemsToDelete} item${
          itemsToDelete > 1 ? "s" : ""
        }?`
      : "Are you sure you want to delete?");

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      showCloseIcon={false}
      onConfirm={handleConfirm}
      onCancel={toggle}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor={confirmColor}
      cancelColor={cancelColor}
      isLoading={isLoading}
      widthClass="w-[450px]"
    >
      <ContentModal title="Delete" message={finalMessage} />
    </BaseModal>
  );
};

export default DeleteModal;
