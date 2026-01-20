// // PrintImportExportModal.tsx
// import BasePopup from "../BaseModals/BasePopup";
// import { ContentModal, ContentModalItem } from "../ContentModal/PrintImportExportContentModal";
// import Icon from "../../components/ui/Icon";

// interface PrintImportExportModalProps {
//   open: boolean;
//   position: { top: number; left: number };
//   onClose: () => void;
//   onPrint: () => void;
//   onImport: () => void;
//   onExport: () => void;
// }

// const PrintImportExportModal = ({
//   open,
//   position,
//   onClose,
//   onPrint,
//   onImport,
//   onExport,
// }: PrintImportExportModalProps) => {
//   return (
//     <BasePopup
//       open={open}
//       position={position}
//       width={160}
//       zIndex={100}
//       animation="scale"
//       onClose={onClose}
//     >
//       <ContentModal>
//         <ContentModalItem
//           icon={<Icon name="ri-printer-fill" className="w-6 h-5" />}
//           label="Print"
//           onClick={() => {
//             onPrint();
//             onClose();
//           }}
//         />
//         <ContentModalItem
//           icon={<Icon name="bx bx-import" className="w-6 h-5" />}
//           label="Import"
//           onClick={() => {
//             onImport();
//             onClose();
//           }}
//         />
//         <ContentModalItem
//           icon={<Icon name="bx bx-export" className="w-6 h-5" />}
//           label="Export"
//           onClick={() => {
//             onExport();
//             onClose();
//           }}
//         />
//       </ContentModal>
//     </BasePopup>
//   );
// };

// export default PrintImportExportModal;
















// PrintImportExportModal.tsx
import React from "react";
import BasePopup from "../BaseModals/BasePopup";
import { ContentModal, ContentModalItem } from "../ContentModal/PrintImportExportContentModal";
import Icon from "../../components/ui/Icon";

interface PrintImportExportModalProps {
  open: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  onPrint: () => void;
  onImport: () => void;
  onExport: () => void;
}

const PrintImportExportModal: React.FC<PrintImportExportModalProps> = ({
  open,
  position,
  onClose,
  onPrint,
  onImport,
  onExport,
}) => {
  return (
    <BasePopup
      open={open}
      position={position}
      width={160}
      zIndex={100}
      animation="scale"
      onClose={onClose}
    >
      <ContentModal>
        <ContentModalItem
          icon={<Icon name="ri-printer-fill" className="w-6 h-5" />}
          label="Print"
          onClick={() => {
            onPrint();
            onClose();
          }}
        />
        <ContentModalItem
          icon={<Icon name="bx bx-import" className="w-6 h-5" />}
          label="Import"
          onClick={() => {
            onImport();
            onClose();
          }}
        />
        <ContentModalItem
          icon={<Icon name="bx bx-export" className="w-6 h-5" />}
          label="Export"
          onClick={() => {
            onExport();
            onClose();
          }}
        />
      </ContentModal>
    </BasePopup>
  );
};

export default PrintImportExportModal;
