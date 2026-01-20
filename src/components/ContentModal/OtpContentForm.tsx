import React, { useEffect, useRef, useState } from "react";

interface OtpContentFormProps {
  otp: string;
  setOtp: (v: string) => void;
  isLoading: boolean;
  labelText?: string;
  onResend?: () => void; // 👈 new
}

const OtpContentForm = ({ otp, setOtp, isLoading, labelText, onResend }: OtpContentFormProps) => {
  const otpArray = otp.split("").concat(Array(6 - otp.length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // ⏳ TIMER
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const m = String(Math.floor(timer / 60)).padStart(2, "0");
    const s = String(timer % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleResendClick = () => {
    if (!onResend) return;
    onResend();     // API call
    setTimer(120);  // restart timer  
  };

  // Autofocus logic
  useEffect(() => {
    const firstEmpty = otpArray.findIndex((d) => d === "");
    const index = firstEmpty === -1 ? 5 : firstEmpty;
    inputRefs.current[index]?.focus();
  }, [otp]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 6).replace(/\D/g, "");
      setOtp(pasted);
      const focusIndex = pasted.length === 6 ? 5 : pasted.length;
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    if (!/^\d?$/.test(value)) return;

    const updated = otpArray.map((v, i) => (i === index ? value : v)).join("");
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      if (otpArray[index] !== "") {
        const updated = otpArray.map((v, i) => (i === index ? "" : v)).join("");
        setOtp(updated);
      } else if (index > 0) {
        const updated = otpArray.map((v, i) => (i === index - 1 ? "" : v)).join("");
        setOtp(updated);
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (!/^[0-9]$/.test(e.key) && !["ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  return (
    <div className="space-y-4">
      {labelText && (
        <p className="text-sm text-text-subtle">{labelText}</p>
      )}

      <label className="block font-medium text-text-main text-md">
        Enter OTP
      </label>

      <div className="flex justify-between space-x-2">
        {otpArray.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            maxLength={1}
            inputMode="numeric"
            disabled={isLoading}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-12 h-12 text-xl text-center text-gray-700 border-2 border-gray-300 shadow-md rounded-xl focus:outline-none focus:border-gray-500"
          />
        ))}
      </div>

      {/* Resend + Timer */}
      <div className="text-xs text-gray-600 text-start">
        {timer > 0 ? (
          <span>Resend OTP in <b>{formatTime()}</b></span>
        ) : (
          <button
            onClick={handleResendClick}
            className="font-semibold text-blue-600 hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpContentForm;
