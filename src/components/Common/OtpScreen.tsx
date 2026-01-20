

import React, {
  useState,
  useEffect,
  useRef,
  type FormEvent,
} from "react";

import { ToasterUtils } from "../../components/ui/toast";

import Icon from "../ui/Icon";
import maskContact from "../../utils/maskContact";

// 1. Updated OtpScreenProps interface
export interface OtpScreenProps {
  onOtpConfirm: (
    data: { email?: string; mobile_no?: string; otp: string }
  ) => Promise<void> | void;
  onCancel: () => void;
  phoneNumber: string;
  flowType: "signin" | "forgot" | "signup";
  onResendOtp: () => Promise<void> | void; // <-- Added Resend OTP Handler
  loading: boolean; // <-- Added overall loading state from parent
}

const OtpScreen: React.FC<OtpScreenProps> = ({
  onOtpConfirm,
  onCancel,
  phoneNumber,
  flowType,
  onResendOtp,
  loading: parentLoading,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isOtpValid = otp.every((digit) => digit.length === 1);
  const isLoading = localLoading || parentLoading;

  const getFirstEmptyIndex = (): number => {
    const emptyIndex = otp.findIndex((v) => v === "");
    return emptyIndex === -1 ? otp.length - 1 : emptyIndex;
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const id = window.setInterval(() => setResendTimer((t) => t - 1), 1000);
      return () => clearInterval(id);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (!isLoading) {
      const firstEmptyIndex = getFirstEmptyIndex();
      inputRefs.current[firstEmptyIndex]?.focus();
    }
  }, [otp, isLoading]);

  const handleChange = (
    el: HTMLInputElement,
    index: number,
    value: string
  ): void => {
    if (value.length > 1) {
      const pasted = value.slice(0, otp.length).split("");
      if (pasted.every((c) => /^\d$/.test(c))) {
        const filled = pasted.concat(
          Array(otp.length - pasted.length).fill("")
        );
        setOtp(filled);
        inputRefs.current[Math.min(pasted.length - 1, otp.length - 1)]?.focus();
      }
      return;
    }

    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (e.key >= "0" && e.key <= "9") {
      if (otp[index] !== "" && index < otp.length - 1) {
        e.preventDefault();
        handleChange(e.currentTarget, index, e.key);
      }
    }

    if (
      !/^\d$|^Tab$|^Enter$|^ArrowLeft$|^ArrowRight$|^Delete$|^Backspace$/.test(
        e.key
      )
    ) {
      e.preventDefault();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isOtpValid) {
      ToasterUtils.error("Please enter complete 6-digit OTP.");
      return;
    }

    setLocalLoading(true);
    const fullOtp = otp.join("");

    try {
      if (flowType === "signin") {
        await onOtpConfirm({ otp: fullOtp });
      } else if (flowType === "forgot" || flowType === "signup") {
        const payload =
          phoneNumber.includes("@")
            ? { email: phoneNumber, mobile_no: "", otp: fullOtp }
            : { email: "", mobile_no: phoneNumber, otp: fullOtp };

        await onOtpConfirm(payload);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "OTP verification failed";
      ToasterUtils.error(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    if (resendTimer === 0 && !isLoading) {
      try {
        await onResendOtp();
        setOtp(Array(6).fill(""));
        setResendTimer(30);
        inputRefs.current[0]?.focus();
      } catch (error) {
        console.error("Resend OTP failed:", error);
      }
    }
  };

  const formatTime = (s: number): string => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="flex flex-col p-3 lg:p-0 animate__animated animate__slideInRight faster-slideInRight">
      
      <div className="flex items-center pb-4 lg:pb-6">
        <button
          onClick={onCancel}
          className="p-1 mr-3 text-gray-500 transition duration-150 hover:text-gray-700"
        >
          <Icon name="bx bx-arrow-back" size={22} />
        </button>

        <h2 className="text-xl font-semibold text-gray-700 lg:text-2xl">
          Enter OTP
        </h2>
      </div>

      <p className="mb-4 text-sm text-gray-700 lg:mb-6 lg:text-md">
        Enter the 6-digit OTP sent to{" "}
        <span className="font-semibold text-gray-900">
          {maskContact(phoneNumber)}
        </span>
      </p>

      <form onSubmit={handleConfirm} className="space-y-6">

        {/* OTP BOXES */}
        <div className="flex justify-start space-x-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              maxLength={1}
              inputMode="numeric"
              pattern="[0-9]"
              value={digit}
              onChange={(e) => handleChange(e.currentTarget, i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-10 h-10 text-lg text-center text-gray-600 transition-all duration-150 border-2 border-gray-300 shadow-md lg:w-12 lg:h-12 lg:text-xl rounded-xl focus:outline-none focus:border-gray-400 focus:border-4"
            />
          ))}
        </div>

        {/* RESEND */}
        <div className="flex items-center justify-between text-xs lg:text-sm">
          {resendTimer > 0 ? (
            <p className="font-medium text-gray-500">
              Send OTP after {formatTime(resendTimer)}
            </p>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              className={`font-medium transition-colors ${
                isLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-600 hover:text-indigo-500"
              }`}
              onClick={handleResendOtp}
            >
              {parentLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {/* CONFIRM BUTTON */}
        <div className="flex justify-center pt-0">
          <button
            type="submit"
            disabled={!isOtpValid || isLoading}
            className={`
              relative flex items-center justify-center font-medium shadow-lg transition-all duration-300
              ${
                !isOtpValid || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white"
              }
              ${isLoading ? "w-12 h-12 rounded-full" : "w-full h-12 rounded-xl"}
            `}
          >
            {isLoading ? (
              <svg
                className="absolute w-8 h-8 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-100"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="31.4"
                  strokeDashoffset="0"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpScreen;
