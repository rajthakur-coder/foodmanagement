import React, { useState, type FormEvent } from "react";
import Icon from "../../components/ui/Icon";
import InputField from "../../components/Common/inputField";
import Checkbox from "../../components/Common/Checkbox";
import { ToasterUtils } from "../../components/ui/toast";
import { useResetPasswordMutation } from "../../features/auth/authApi";

export interface ResetPasswordProps {
  token: string;
  onPasswordSave: () => void;
  onCancel: () => void;
  setLoading: (isLoading: boolean) => void;
  loading: boolean;
}

interface TouchedState {
  newPassword: boolean;
  confirmPassword: boolean;
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  token,
  onPasswordSave,
  onCancel,
  setLoading,
  loading,
}) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);

  const [touched, setTouched] = useState<TouchedState>({
    newPassword: false,
    confirmPassword: false,
  });

  const [resetPasswordApi] = useResetPasswordMutation();

  // Validation
  const validateNewPassword = (value: string): string => {
    if (!value.trim()) return "New password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateConfirmPassword = (value: string): string => {
    if (!value.trim()) return "Confirm password is required";
    if (value !== newPassword) return "Passwords do not match";
    return "";
  };

  const newPasswordError = touched.newPassword ? validateNewPassword(newPassword) : "";
  const confirmPasswordError = touched.confirmPassword ? validateConfirmPassword(confirmPassword) : "";

  const isSaveValid = !newPasswordError && !confirmPasswordError;

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({ newPassword: true, confirmPassword: true });
    if (!isSaveValid) return;

    setLoading(true);

    try {
      const response: ResetPasswordResponse = await resetPasswordApi({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      ToasterUtils.success(response.message || "");

      if (response.success) onPasswordSave();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      ToasterUtils.error(error?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl p-2 mx-auto sm:p-5 md:p-0 animate__animated animate__slideInRight faster-slideInRight">
      <div className="flex items-center pb-6">
        <button
          onClick={onCancel}
          className="p-1 mr-4 text-gray-500 transition hover:text-gray-700"
          aria-label="Back"
        >
          <Icon name="bx bx-arrow-back" size={24} />
        </button>
        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Set New Password</h2>
      </div>

      <p className="mb-6 text-sm text-gray-700 sm:text-base">
        Enter and confirm your new password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          themeMode="light"
          label="New Password (min 6 chars)"
          type={showPass ? "text" : "password"}
          value={newPassword}
          onChange={setNewPassword}
          onBlur={() => setTouched(prev => ({ ...prev, newPassword: true }))}
          leftIcon="ri-lock-2-line"
          error={!!newPasswordError}
          helperText={newPasswordError}
        />

        <InputField
          themeMode="light"
          label="Confirm Password"
          type={showPass ? "text" : "password"}
          value={confirmPassword}
          onChange={setConfirmPassword}
          onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
          leftIcon="ri-lock-2-line"
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
        />

        <div className="flex items-center">
          <Checkbox
            checked={showPass}
            onChange={() => setShowPass(!showPass)}
            label="Show Passwords"
            size="xs"
            shape="rounded"
            checkedColor="bg-primary"
            uncheckedColor="bg-white"
            showLabel
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={!isSaveValid || loading}
            className={`relative flex items-center justify-center font-medium shadow-md transition-all overflow-hidden
              ${!isSaveValid || loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white"}
              ${loading ? "w-12 h-12 rounded-full" : "w-full h-12 rounded-xl"}
            `}
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
              "Save Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
