
// src/components/SidebarMenu/DynamicSidebarMenu.tsx
import React from "react";
import BasePopup from "../BaseModals/BasePopup";
import { ContentModal, ContentModalItem } from "../../components/ContentModal/SidebarSubmenuContent";

interface ActionItem {
  icon?: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}

interface DynamicSidebarMenuProps {
  open: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  actions: ActionItem[];
  width?: number | string;
  zIndex?: number;
}

const DynamicSidebarMenu: React.FC<DynamicSidebarMenuProps> = ({
  open,
  position,
  onClose,
  actions,
  width = 140,
  zIndex = 100,
}) => {
  return (
    <BasePopup
      open={open}
      position={position}
      width={width}
      zIndex={zIndex}
      animation="scale"
      onClose={onClose}
    >
      <ContentModal>
        {actions.map((action, index) => (
          <ContentModalItem
            key={index}
            icon={action.icon}
            label={action.label}
            danger={action.danger}
            onClick={() => {
              action.onClick();
              onClose();
            }}
          />
        ))}
      </ContentModal>
    </BasePopup>
  );
};

export default DynamicSidebarMenu;
