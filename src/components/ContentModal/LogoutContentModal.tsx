
import React from "react";
import RadioButton from "../Common/RadioButton";

interface LogoutContentModalProps {
  title: string;
  message?: string;
  allDevices: boolean;
  setAllDevices: (value: boolean) => void;
}

const LogoutContentModal: React.FC<LogoutContentModalProps> = ({
  title,
  message,
  allDevices,
  setAllDevices,
}) => {
  return (
    <div className="space-y-4 text-start">
      <h3 className="text-lg font-semibold text-text-main">{title}</h3>
      {message && <p className="text-sm font-normal text-text-main">{message}</p>}

      <div className="flex flex-row gap-10 mt-4">
        <RadioButton
          checked={!allDevices}
          onChange={() => setAllDevices(false)}
          label="Current Device Only"
          size="sm"
          activeColor="bg-primary"
          borderColor="border-gray-400"
          labelColor="text-text-main"
          hoverGlow
        />

        <RadioButton
          checked={allDevices}
          onChange={() => setAllDevices(true)}
          label="All Devices"
          size="sm"
          activeColor="bg-primary"
          borderColor="border-gray-400"
          labelColor="text-text-main"
          hoverGlow
        />
      </div>
    </div>
  );
};

export default LogoutContentModal;
