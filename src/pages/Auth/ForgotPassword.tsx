import React, { useState, type FormEvent } from "react";
import { ToasterUtils } from "../../components/ui/toast";
import Icon from "../../components/ui/Icon";
import CustomInput from "../../components/Common/inputField";
import { useForgotPasswordMutation } from "../../features/auth/authApi";

// --- Type Definitions ---
interface ForgotPasswordSuccessResponse {
  success: true;
  message: string;
}

interface ForgotPasswordError {
  status: number;
  data: {
    message: string;
  };
}

export interface ForgotPasswordProps {
  onOtpRequest: (contact: string, method: "email" | "mobile") => void;
  onCancel: () => void;
  setLoading: (isLoading: boolean) => void;
  loading: boolean;
}

type ContactMethod = "email" | "mobile";
type ForgotPasswordPayload = { username: string } | { username: string };

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onOtpRequest,
  onCancel,
  setLoading,
  loading,
}) => {
  const [method, setMethod] = useState<ContactMethod>("email");
  const [contactValue, setContactValue] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);

  const [forgotPasswordApi] = useForgotPasswordMutation<
    any,
    ForgotPasswordPayload,
    ForgotPasswordSuccessResponse,
    ForgotPasswordError
  >();

  // --- Validation ---
  const validateContact = (value: string): string => {
    if (!value.trim()) return "This field is required";
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Invalid email address";
    if (method === "mobile" && !/^\d{10}$/.test(value))
      return "Mobile number must be 10 digits";
    return "";
  };

  const contactError: string = touched ? validateContact(contactValue) : "";

  //  ✅ UPDATED — enable button live (no blur required)
  const isProcessValid: boolean =
    contactValue.trim() !== "" && validateContact(contactValue) === "";

  // --- Handle Submit ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isProcessValid) return;

    setLoading(true);

    const contact: string = contactValue.trim();
    const body: ForgotPasswordPayload =
      method === "email" ? { username: contact } : { username: contact };

    try {
      const res: ForgotPasswordSuccessResponse = await forgotPasswordApi(
        body
      ).unwrap();

      if (res.success) {
        const masked =
          method === "email"
            ? contact.replace(/(.{2}).+(@.+)/, "$1****$2")
            : contact.replace(/(\d{2})\d{4}(\d{4})/, "$1****$2");

        onOtpRequest(contact, method);
        ToasterUtils.success(res.message || `OTP sent to ${masked}`);
      } else {
        ToasterUtils.error(res.message || "Unable to send OTP. Try again.");
      }
    } catch (err) {
      const error = err as ForgotPasswordError;
      const msg = error?.data?.message || "Something went wrong while sending OTP.";
      ToasterUtils.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Method Options ---
  const methodOptions: { label: string; value: ContactMethod }[] = [
    { label: "Email Address", value: "email" },
    { label: "Mobile Number", value: "mobile" },
  ];

  const inputLabel = method === "email" ? "Email" : "Mobile Number";
  const inputType = method === "email" ? "email" : "tel";
  const leftIcon = method === "email" ? "ri-mail-line" : "bx bx-mobile";
  const inputPlaceholder =
    method === "email" ? "e.g., your@email.com" : "e.g., 9876543210";

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod as ContactMethod);
    setContactValue("");
    setTouched(false);
  };

  return (
    <div className="flex flex-col p-2 lg:p-0 md:p-0 animate__animated animate__slideInRight faster-slideInRight">
      {/* Header */}
      <div className="flex items-center pb-6">
        <button
          onClick={onCancel}
          className="p-1 mr-4 text-gray-500 transition duration-150 hover:text-gray-700"
          aria-label="Back to Sign In"
        >
          <Icon name="bx bx-arrow-back" size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-700">Forgot Password</h2>
      </div>

      <p className="mb-6 text-sm text-gray-500 md:text-md">
        Select a method and enter your contact details to receive a verification code.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Sliding Tabs --- */}
        <div className="flex items-center justify-center p-2 border-2 rounded-xl">
          <div className="relative flex w-full overflow-hidden bg-gray-200 h-11 rounded-xl">
            {/* Sliding Indicator */}
            <div
              className={`absolute top-0 left-0 h-full w-1/2 bg-black rounded-xl transition-all duration-300`}
              style={{
                transform:
                  method === "email" ? "translateX(0%)" : "translateX(100%)",
              }}
            />

            {methodOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleMethodChange(opt.value)}
                className={`relative z-10 flex-1 flex items-center justify-center font-medium text-sm transition-colors duration-300
                  ${method === opt.value ? "text-white" : "text-gray-700"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <CustomInput
          themeMode="light"
          label={inputLabel}
          type={inputType}
          placeholder={inputPlaceholder}
          value={contactValue}
          onChange={(val) => {
            if (method === "mobile") {
              const onlyNumbers = val.replace(/\D/g, "").slice(0, 10);
              setContactValue(onlyNumbers);
            } else {
              setContactValue(val);
            }
          }}
          leftIcon={leftIcon}
          error={!!contactError}
          helperText={contactError}
          onBlur={() => setTouched(true)}
        />

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={!isProcessValid || loading}
            className={`relative flex items-center justify-center font-medium shadow-md transition-all duration-300 ease-in-out overflow-hidden
              ${
                !isProcessValid || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white"
              }
              ${
                loading
                  ? "w-12 h-12 rounded-full bg-gray-900"
                  : "w-full h-12 rounded-xl"
              }`}
          >
            {loading ? (
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
              </svg>
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
