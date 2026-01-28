

import React, { useState } from "react";
import BaseModal from "../BaseModals/BaseModal";
import LogoutContentModal from "../ContentModal/LogoutContentModal";

interface LogoutModalProps {
  isOpen: boolean;
  toggle: () => void;
  onLogout: (allDevices: boolean) => Promise<void>; // async
  isLoading?: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  toggle,
  onLogout,
  isLoading = false,
}) => {
  const [allDevices, setAllDevices] = useState<boolean>(false);

  const handleConfirm = async (): Promise<void> => {
    await onLogout(allDevices); // modal stays open until API resolves
  };

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      headerText="Logout From Devices"
      onConfirm={handleConfirm}
      onCancel={toggle}
      confirmText="Logout"
      cancelText="Cancel"
      confirmColor="bg-red-600 text-white"
      widthClass="w-[420px]"
      isLoading={isLoading} // loader now works
    >
      <LogoutContentModal
        allDevices={allDevices}
        setAllDevices={setAllDevices}
      />
    </BaseModal>
  );
};

export default LogoutModal;
