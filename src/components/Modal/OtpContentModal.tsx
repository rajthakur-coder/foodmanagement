import React, { useState, useEffect } from "react";
import BaseModal from "../BaseModals/BaseModal";
import OtpContentForm from "../ContentModal/OtpContentForm";
import { ToasterUtils } from "../../components/ui/toast";

import {
  useVerifyOtpMutation,
  useSendOtpMutation,
} from "../../features/DeveloperApi/TokenGenerate";

import {
  useChangeStatusMutation,   // ⭐ WHITELIST STATUS CHANGE API
} from "../../features/DeveloperApi/WhitelistedIp";

interface OtpContentModalProps {
  isOpen: boolean;
  toggle: () => void;
  orderId: string | number;
  type: "ip_list" | "api_key";
  onOtpSuccess?: () => void; // Parent optional
}

const OtpContentModal = ({
  isOpen,
  toggle,
  orderId,
  type,
  onOtpSuccess,
}: OtpContentModalProps) => {
  const [otp, setOtp] = useState("");
  const [contactInfo, setContactInfo] = useState("your Mobile");

  const [verifyOtp, { isLoading: apiKeyLoading }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: resendLoading }] = useSendOtpMutation();

  const [changeStatus, { isLoading: whitelistLoading }] =
    useChangeStatusMutation(); // ⭐ WHITELIST API

  const isLoading = apiKeyLoading || whitelistLoading;

  // ⭐ SEND OTP
  const sendOtpRequest = async () => {
    try {
      const res = await sendOtp({ orderId, type }).unwrap();

      if (res.statusCode === 1) {
        ToasterUtils.success(res.message || "OTP sent successfully");
        setContactInfo(res.contactInfo || "your Mobile");
      } else {
        ToasterUtils.error(res.message || "Failed to send OTP");
      }
    } catch (err: any) {
      ToasterUtils.error(err?.data?.message || "Failed to send OTP");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setOtp("");
    sendOtpRequest();
  }, [isOpen]);

  // ⭐ VERIFY OTP (MAIN LOGIC)
  const handleConfirm = async () => {
    if (otp.length !== 6) {
      ToasterUtils.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      let res;

      if (type === "api_key") {
        // ⭐ API KEY VERIFY
        res = await verifyOtp({
          otp,
        }).unwrap();
      } else {
        // ⭐ WHITELIST VERIFY
        res = await changeStatus({
          id:orderId,
          otp,
        }).unwrap();
      }

      if (res.statusCode === 1 || res.success) {
        ToasterUtils.success(res.message || "OTP verified");

        toggle(); // Close modal

        if (onOtpSuccess) onOtpSuccess();
      } else {
        ToasterUtils.error(res.message || "Invalid OTP");
      }
    } catch (err: any) {
      ToasterUtils.error(err?.data?.message || "Invalid OTP");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      headerText="Authenticate"
      onConfirm={handleConfirm}
      confirmText="Verify"
      cancelText="Close"
      onCancel={toggle}
      isLoading={isLoading}
      widthClass="w-[380px]"
      headerBgClass="bg-black"
      headerTextColor="text-white"
    >
      <OtpContentForm
        otp={otp}
        setOtp={setOtp}
        isLoading={isLoading || resendLoading}
        labelText={`Enter the 6-digit OTP sent to ${contactInfo}`}
        onResend={sendOtpRequest}
      />
    </BaseModal>
  );
};

export default OtpContentModal;
