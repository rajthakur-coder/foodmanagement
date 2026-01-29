
import React, { useState, useEffect } from "react";
import type { FormEvent, Dispatch, SetStateAction, JSX } from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from "../../components/Common/Checkbox";
import hero from "../../assets/Images/loginHome2.jpeg";
import InputField from "../../components/Common/inputField";
import { ToasterUtils } from "../../components/ui/toast";
import logo from "../../assets/Images/logo1.png";
// import hero3 from "../../assets/login1.jpeg";
// import hero4 from "../../assets/login4.jpeg";
import Cookies from "js-cookie";
import { useForgotPasswordMutation, useLoginMutation, type LoginResponseData } from "../../features/auth/authApi";
import { loginStart, loginSuccess, setError, type User, type LoginPayload } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import OtpScreen from "../../components/Common/OtpScreen";
import ForgotPassword from "../../pages/Auth/ForgotPassword";
import ResetPassword from "../../pages/Auth/ResetPassword";
import { useLoginVerifyOtpMutation, useVerifyForgotPasswordOtpMutation } from "../../features/auth/authApi";
import indianflag from "../../assets/indianflag.png";
import { RegisterUserWithTokenRequest, SendOtpRequest, useRegisterUserWithTokenMutation, useSendOtpMutation, useVerifyOtpMutation, VerifyOtpRequest } from "../../features/userManagement/userManagementApi";




interface SignInFormData {
    username: string;
    password: string;
}

interface SignUpFormData {
    name: string;
    username: string;
    password: string;
    mobile: string;
    email: string;
}

// Validation helper type
type FormErrors<T> = { [P in keyof T]?: string };
type FormTouched<T> = { [P in keyof T]?: boolean };

// Type for the view state
type AuthView = 'form' | 'forgot' | 'otp' | 'reset';

// Type for the OTP flow state
type OtpFlowType = 'signin' | 'forgot' | 'signup';

// Type for the Carousel Slide objects







const SignInForm: React.FC = () => {
    // State with explicit types
    const [slideFromLeft, setSlideFromLeft] = useState<boolean>(false);
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [animateSlide, setAnimateSlide] = useState<boolean>(false);
    const [inputIdentifierType, setInputIdentifierType] = useState<'email' | 'mobile'>('email');
    const [slideDirection, setSlideDirection] = useState<'down' | 'up'>("down");
    const [signInData, setSignInData] = useState<SignInFormData>({
        username: "",
        password: "",
    });
    const [signUpData, setSignUpData] = useState<SignUpFormData>({
      name: "",
        mobile: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false); // This seems unused, but kept for type
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

    const [currentView, setCurrentView] = useState<AuthView>('form');
    const [otpContact, setOtpContact] = useState<string>("");
    const [otpFlowType, setOtpFlowType] = useState<OtpFlowType>('signin');
const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [forgotOtpApi, { isLoading: isForgotOtp }] = useForgotPasswordMutation();

    // Explicitly typing the returned mutation functions and state
    const [loginVerifyOtpApi, { isLoading: isVerifyingLoginOtp }] = useLoginVerifyOtpMutation();
    const [forgotVerifyOtpApi, { isLoading: isVerifyingForgotOtp }] = useVerifyForgotPasswordOtpMutation();

    // Explicitly typed null possibility
    const [otpResponse, setOtpResponse] = useState<{ token: string } | null>(null);
    const [signInErrors, setSignInErrors] = useState<FormErrors<SignInFormData>>({});
    const [signInTouched, setSignInTouched] = useState<FormTouched<SignInFormData>>({});
    const [signUpErrors, setSignUpErrors] = useState<FormErrors<SignUpFormData>>({});
    const [signUpTouched, setSignUpTouched] = useState<FormTouched<SignUpFormData>>({});
 const [sendOtpApi, { isLoading: isSendingOtp }] = useSendOtpMutation();
    const [verifyOtpApi, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
    const [registerUserApi, { isLoading: isRegisteringUser }] = useRegisterUserWithTokenMutation();
const [location, setLocation] = useState<{
  latitude: number | null;
  longitude: number | null;
}>({
  latitude: null,
  longitude: null,
});


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loginApi, { isLoading }] = useLoginMutation();


    /**
     * --- VALIDATION LOGIC ---
     */
    const validateSignIn = (data: SignInFormData): FormErrors<SignInFormData> => {
        const errors: FormErrors<SignInFormData> = {};
        if (!data.username.trim()) errors.username = "Email is required";
        if (!data.password.trim()) errors.password = "Password is required";
        return errors;
    };

    
    const handleResendOtp = async (): Promise<void> => {
        if (loading) return;

        setLoading(true);
        try {
            let response: any;
            let successMessage = "New OTP sent successfully!";
            // 1. Sign Up Flow (आपका मौजूदा Logic)
            if (otpFlowType === 'signup') {
                if (!signUpData.mobile) throw new Error("Mobile number missing for Sign Up OTP.");
                const otpPayload: SendOtpRequest = { mobile_no: signUpData.mobile };
                response = await sendOtpApi(otpPayload).unwrap();
            }
            // 2. Sign In Flow
            else if (otpFlowType === 'signin') {
                const tempUserStr: string | null = localStorage.getItem("tempUser");
                if (!tempUserStr) throw new Error("Temporary login data missing for Sign In OTP resend.");
                const tempUser = JSON.parse(tempUserStr);
                if (!otpContact) throw new Error("Contact number missing for Sign In OTP resend.");

                response = await loginApi(tempUser).unwrap();
            }
            // 3. Forgot Password Flow
            else if (otpFlowType === 'forgot') {
                if (!otpContact) throw new Error("Contact number missing for Forgot Password OTP resend.");

                // Forgot Password flow में, हम username (email) या mobile_no दोनों भेज सकते हैं।
                const otpPayload: SendOtpRequest = otpContact.includes("@")
                    ? { username: otpContact }
                    : { username: otpContact };

                response = await forgotOtpApi(otpPayload).unwrap();
            }
            else {
                throw new Error("Invalid OTP flow type for resend operation.");
            }

            if (response.success) {
                ToasterUtils.success(response.message || successMessage);
            } else {
                ToasterUtils.error(response.message || "Failed to resend OTP.");
            }
        } catch (err: any) {
            const errorMessage = err?.data?.message || err.message || "Failed to resend OTP.";
            ToasterUtils.error(errorMessage);
            dispatch(setError(errorMessage));
        } finally {
            setLoading(false);
        }
    };

  const validateSignUp = (data: SignUpFormData): FormErrors<SignUpFormData> => {
        const errors: FormErrors<SignUpFormData> = {};
        if (!data.name.trim()) errors.name = "Name is required";
        if (!data.mobile.trim()) {
            errors.mobile = "Mobile Number is required";
        } else if (data.mobile.trim().length !== 10 || !/^\d+$/.test(data.mobile.trim())) {
            errors.mobile = "Mobile Number must be 10 digits";
        }
        if (!data.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email.trim())) {
            errors.email = "Invalid email format";
        }
        if (!data.password.trim()) errors.password = "Password is required";

        return errors;
    };


    // Derive validity from validation results (boolean derived state)
    const isSignInValid: boolean = Object.keys(validateSignIn(signInData)).length === 0;
    const isSignUpValid: boolean = Object.keys(validateSignUp(signUpData)).length === 0;

    /**
     * --- LIFECYCLE & HANDLERS ---
     */

   




    const handleSignInChange = (name: keyof SignInFormData, value: string): void => {
        setSignInData((prev) => ({ ...prev, [name]: value }));

        if (name === 'username') {

            const containsOnlyDigits = /^\d*$/.test(value.trim());

            if (containsOnlyDigits && value.length > 0 && value.length <= 15) {
                setInputIdentifierType('mobile');
            } else {
                setInputIdentifierType('email');
            }
        }

        // Clear error as soon as user starts typing
        if (signInErrors[name]) {
            setSignInErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    // Note: handleSignUpChange is for Sign Up, so we only update handleSignInChange

    const handleSignUpChange = (name: keyof SignUpFormData, value: string): void => {
        setSignUpData((prev) => ({ ...prev, [name]: value }));
        // Clear error as soon as user starts typing
        if (signUpErrors[name]) {
            setSignUpErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSignInBlur = (name: keyof SignInFormData): void => {
        setSignInTouched(prev => ({ ...prev, [name]: true }));
        const errors = validateSignIn(signInData);
        setSignInErrors(errors);
    };

    const handleSignUpBlur = (name: keyof SignUpFormData): void => {
        setSignUpTouched(prev => ({ ...prev, [name]: true }));
        const errors = validateSignUp(signUpData);
        setSignUpErrors(errors);
    };


     const handleToggle = (): void => {
        setSlideDirection(slideDirection === "down" ? "up" : "down");
        setAnimateSlide(true);
        setIsSignUp(!isSignUp);
        setCurrentView('form');
        setOtpFlowType('signin');
        setOtpContact("");
          setSignInData({
    username: "",
    password: "",
  });

setSignUpData({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });
        setSignInTouched({});
        setSignInErrors({});
        setSignUpTouched({});
        setSignUpErrors({});
        setTimeout(() => setAnimateSlide(false), 500);
    };
  

const finalizeLogin = (
  token: string,
  user: User,
  expiresAtStr: string
): void => {
  // ================= TOKEN EXPIRY =================
  const parseDurationToMs = (duration: string): number => {
    const matches = duration.match(/^(\d+)([smhd])$/);
    if (!matches) return 0;

    const value = parseInt(matches[1]);
    const unit = matches[2];

    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  };

  const durationMs = parseDurationToMs(expiresAtStr);
  const expiryDate = new Date(Date.now() + durationMs);

  // ================= SAVE TOKEN =================
  Cookies.set("customertoken", token, {
    expires: expiryDate,
    secure: true,
    sameSite: "Strict",
  });

  // ================= REDUX AUTH (optional but OK) =================
  const payload: LoginPayload = {
    token,
    user,
    expires_at: expiresAtStr,
  };
  dispatch(loginSuccess(payload));

  localStorage.removeItem("tempToken");
  localStorage.removeItem("tempUser");

  setLoading(false);
  setCurrentView("form");

  // ================= GUEST SESSION =================
//   sessionStorage.setItem("user_type", "Guest");

  // ================= POST LOGIN REDIRECT =================
  const redirectPath =
    sessionStorage.getItem("post_login_redirect") || "/menu";

  sessionStorage.removeItem("post_login_redirect");

  navigate(redirectPath, { replace: true });
};


    // OTP confirmation handler
     const handleOtpConfirm = async (data: { otp: string }): Promise<void> => {
        setLoading(true);
        try {
            if (otpFlowType === "signin") {
                const tempUserStr: string | null = localStorage.getItem("tempUser");
                if (!tempUserStr) throw new Error("No login data found.");
                const tempUser: SignInFormData & {
                    latitude: number;
                    longitude: number;
                    user: User;
                    expires_at: string;
                } = JSON.parse(tempUserStr);
                const payload = {
                    username: tempUser.username,
                    password: tempUser.password,
                    latitude: tempUser.latitude,
                    longitude: tempUser.longitude,
                    otp: data.otp,
                };
                const response: LoginResponseData = await loginVerifyOtpApi(payload).unwrap();
                if (response.success && response.data?.token && response.data.user && response.data.expires_at) {
                    ToasterUtils.success(response.message || "Login successful!");
                    finalizeLogin(response.data.token, response.data.user, response.data.expires_at);
                    localStorage.removeItem("tempUser");
                } else {
                    ToasterUtils.error(response.message || "OTP verification failed");
                }
            } else if (otpFlowType === "forgot") {
                const payload: { username?: string; mobile_no?: string; otp: string } = otpContact.includes("@")
                    ? { username: otpContact, otp: data.otp }
                    : { mobile_no: otpContact, otp: data.otp };
                const response: { success: boolean, message: string, data: { token: string } } = await forgotVerifyOtpApi(payload).unwrap();

                if (response.success) {
                    ToasterUtils.success(response.message || "OTP verified successfully!");

                    setOtpResponse({ token: response.data.token });

                    setCurrentView("reset");
                } else {
                    ToasterUtils.error(response.message || "OTP verification failed");
                }
            }
            else if (otpFlowType === "signup") {
                if (!otpContact) throw new Error("Mobile number missing for OTP verification.");
                const verifyPayload: VerifyOtpRequest = {
                    mobile_no: otpContact,
                    mobileOtp: data.otp,
                };
                const response: { success: boolean, message: string, data: { token: string } } = await verifyOtpApi(verifyPayload).unwrap();
                if (response.success && response.data?.token) {
                    ToasterUtils.success(response.message || "OTP verified successfully! Finalizing registration...");
                    setOtpResponse({ token: response.data.token });
                    await finalizeRegistration(response.data.token);
                } else {
                    ToasterUtils.error(response.message || "OTP verification failed");
                }
            } else {
                throw new Error("Invalid OTP flow type.");
            }
        } catch (err: any) {
            const errorMessage = err?.data?.message || err.message || "OTP verification error";
            ToasterUtils.error(errorMessage);
            dispatch(setError(errorMessage));
        } finally {
            setLoading(false);
        }
    };


    
     const finalizeRegistration = async (otpToken: string): Promise<void> => {
        setLoading(true);
        try {
            const registrationPayload: RegisterUserWithTokenRequest = {
                name: signUpData.name,
                email: signUpData.email,
                password: signUpData.password,
                mobile_no: signUpData.mobile,
                token: otpToken,
            };
            const response: any = await registerUserApi(registrationPayload).unwrap();
            if (response.success) {
                ToasterUtils.success(response.message || "Account registered successfully! Please sign in.");
                handleToggle();
                setCurrentView("form");

            } else {
                ToasterUtils.error(response.message || "Final registration failed.");
            }
        } catch (err: any) {
            const errorMessage = err?.data?.message || err.message || "Final registration error";
            ToasterUtils.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };




//     useEffect(() => {
//   const getLocationOnLoad = async () => {
//     try {
//       // permission check
//       const permissionStatus = await navigator.permissions.query({
//         name: "geolocation",
//       });

//       if (permissionStatus.state === "denied") {
//         ToasterUtils.error(
//           "Location access denied. Please enable location to login."
//         );
//         return;
//       }

//       const position: GeolocationPosition =
//         await new Promise<GeolocationPosition>((resolve, reject) =>
//           navigator.geolocation.getCurrentPosition(resolve, reject, {
//             timeout: 10000,
//             enableHighAccuracy: false,
//           })
//         );

//       setLocation({
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//       });
//     } catch (err) {
//       console.error("Location error:", err);
//     }
//   };

//   getLocationOnLoad();
// }, []);








//     const handleSubmit = async (e: FormEvent): Promise<void> => {
//         e.preventDefault();

//         // Validate form
//         const currentErrors: FormErrors<SignInFormData | SignUpFormData> = isSignUp
//             ? validateSignUp(signUpData)
//             : validateSignIn(signInData);
//         const hasErrors: boolean = Object.keys(currentErrors).length > 0;

//         if (hasErrors) {
//             if (isSignUp) {
//                 setSignUpErrors(currentErrors as FormErrors<SignUpFormData>);
//                 setSignUpTouched({ name: true, username: true, password: true });
//             } else {
//                 setSignInErrors(currentErrors as FormErrors<SignInFormData>);
//                 setSignInTouched({ username: true, password: true });
//             }
//             ToasterUtils.error("Please fill in all required fields.");
//             return;
//         }

//         if (isSignUp) {
//             setLoading(true);
//             // Ensure you have all necessary data for Sign Up and OTP sending
//             const currentErrors = validateSignUp(signUpData);
//             if (Object.keys(currentErrors).length > 0) {
//                 setSignUpErrors(currentErrors as FormErrors<SignUpFormData>);
//                 setSignUpTouched({ name: true, mobile: true, email: true, password: true }); // Assuming these fields are now in signUpData
//                 ToasterUtils.error("Please fill in all required fields for Sign Up.");
//                 setLoading(false);
//                 return;
//             }
//             try {
//                 const otpPayload: SendOtpRequest = {
//                     mobile_no: signUpData.mobile,
//                 };
//                 const response: any = await sendOtpApi(otpPayload).unwrap();

//                 if (response.success) {
//                     setOtpFlowType("signup");
//                     setOtpContact(signUpData.mobile);
//                     setCurrentView("otp");
//                     ToasterUtils.success(response.message || "OTP sent for registration verification.");
//                 } else {
//                     ToasterUtils.error(response.message || "Failed to send OTP for registration.");
//                 }

//             } catch (err: any) {
//                 const errorMessage = err?.data?.message || err.message || "Sign Up failed: Failed to send OTP.";
//                 ToasterUtils.error(errorMessage);
//                 dispatch(setError(errorMessage));
//             } finally {
//                 setLoading(false);
//             }
//             return;
//         }

//         setLoading(true);
//         dispatch(loginStart());

//         try {
         

//             // Step 3: Call login API
//           if (!location.latitude || !location.longitude) {
//   ToasterUtils.error("Location not available. Please allow location access.");
//   setLoading(false);
//   return;
// }

// const response: LoginResponseData = await loginApi({
//   username: signInData.username,
//   password: signInData.password,
//   latitude: location.latitude,
//   longitude: location.longitude,
// }).unwrap();


//             if (response.success && response.statusCode === 5) {
//                 // OTP required
//               const tempUserData = {
//   username: signInData.username,
//   password: signInData.password,
//   latitude: location.latitude,
//   longitude: location.longitude,
//   user: response.data?.user as User,
//   expires_at: response.data?.expires_at as string,
// };

//                 localStorage.setItem("tempUser", JSON.stringify(tempUserData));

//                 setOtpFlowType("signin");
//                 setOtpContact(
//                     response.data?.mobile || response.data?.username || signInData.username
//                 );
//                 setCurrentView("otp");
//                 ToasterUtils.info(response.message || "OTP sent for verification.");
//             } else if (response.success && response.statusCode === 1) {
//                 if (!response.data?.token || !response.data?.user || !response.data?.expires_at) {
//                     throw new Error("Missing required login data in successful response.");
//                 }
//                 finalizeLogin(response.data.token, response.data.user, response.data.expires_at);
//                 ToasterUtils.success(response.message || "Login successful!");
//             } else {
//                 ToasterUtils.error(response.message || "Login failed");
//             }
//         } catch (err: any) {
//     let errorMessage = "Login failed";

//     // GeoLocation deny
//     if (err.code === 1) {
//         errorMessage = "Location access denied. Please enable location in your browser settings.";
//     }
//     // RTK Query backend error
//     else if (err?.data?.message) {
//         errorMessage = err.data.message;  // backend ka message
//     }
//     // Fallback: RTK Query error string
//     else if (err?.error) {
//         errorMessage = err.error;
//     }

//     ToasterUtils.error(errorMessage);
//     dispatch(setError(errorMessage));
// }
//  finally {
//             setLoading(false);
//         }
//     };









const DUMMY_LOCATION = {
  latitude: 28.6139,   // New Delhi
  longitude: 77.2090,
};


useEffect(() => {
  const getLocationOnLoad = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "denied") {
        ToasterUtils.warning(
          "Location access denied. Using default location."
        );

        // ✅ dummy location set
        setLocation(DUMMY_LOCATION);
        return;
      }

      const position: GeolocationPosition =
        await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false,
          })
        );

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      console.error("Location error:", err);

      // ✅ error me bhi dummy
      setLocation(DUMMY_LOCATION);
    }
  };

  getLocationOnLoad();
}, []);







    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        // Validate form
        const currentErrors: FormErrors<SignInFormData | SignUpFormData> = isSignUp
            ? validateSignUp(signUpData)
            : validateSignIn(signInData);
        const hasErrors: boolean = Object.keys(currentErrors).length > 0;

        if (hasErrors) {
            if (isSignUp) {
                setSignUpErrors(currentErrors as FormErrors<SignUpFormData>);
                setSignUpTouched({ name: true, username: true, password: true });
            } else {
                setSignInErrors(currentErrors as FormErrors<SignInFormData>);
                setSignInTouched({ username: true, password: true });
            }
            ToasterUtils.error("Please fill in all required fields.");
            return;
        }

        if (isSignUp) {
            setLoading(true);
            // Ensure you have all necessary data for Sign Up and OTP sending
            const currentErrors = validateSignUp(signUpData);
            if (Object.keys(currentErrors).length > 0) {
                setSignUpErrors(currentErrors as FormErrors<SignUpFormData>);
                setSignUpTouched({ name: true, mobile: true, email: true, password: true }); // Assuming these fields are now in signUpData
                ToasterUtils.error("Please fill in all required fields for Sign Up.");
                setLoading(false);
                return;
            }
            try {
                const otpPayload: SendOtpRequest = {
                    mobile_no: signUpData.mobile,
                };
                const response: any = await sendOtpApi(otpPayload).unwrap();

                if (response.success) {
                    setOtpFlowType("signup");
                    setOtpContact(signUpData.mobile);
                    setCurrentView("otp");
                    ToasterUtils.success(response.message || "OTP sent for registration verification.");
                } else {
                    ToasterUtils.error(response.message || "Failed to send OTP for registration.");
                }

            } catch (err: any) {
                const errorMessage = err?.data?.message || err.message || "Sign Up failed: Failed to send OTP.";
                ToasterUtils.error(errorMessage);
                dispatch(setError(errorMessage));
            } finally {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        dispatch(loginStart());

        try {
         

            // Step 3: Call login API
const finalLocation = {
  latitude: location.latitude || DUMMY_LOCATION.latitude,
  longitude: location.longitude || DUMMY_LOCATION.longitude,
};


const response: LoginResponseData = await loginApi({
  username: signInData.username,
  password: signInData.password,
  latitude: finalLocation.latitude,
  longitude: finalLocation.longitude,
}).unwrap();



            if (response.success && response.statusCode === 5) {
                // OTP required
const tempUserData = {
  username: signInData.username,
  password: signInData.password,
  latitude: finalLocation.latitude,
  longitude: finalLocation.longitude,
  user: response.data?.user as User,
  expires_at: response.data?.expires_at as string,
};


                localStorage.setItem("tempUser", JSON.stringify(tempUserData));

                setOtpFlowType("signin");
                setOtpContact(
                    response.data?.mobile || response.data?.username || signInData.username
                );
                setCurrentView("otp");
                ToasterUtils.info(response.message || "OTP sent for verification.");
            } else if (response.success && response.statusCode === 1) {
                if (!response.data?.token || !response.data?.user || !response.data?.expires_at) {
                    throw new Error("Missing required login data in successful response.");
                }
                finalizeLogin(response.data.token, response.data.user, response.data.expires_at);
                ToasterUtils.success(response.message || "Login successful!");
            } else {
                ToasterUtils.error(response.message || "Login failed");
            }
        } catch (err: any) {
    let errorMessage = "Login failed";

    // GeoLocation deny
    if (err.code === 1) {
        errorMessage = "Location access denied. Please enable location in your browser settings.";
    }
    // RTK Query backend error
    else if (err?.data?.message) {
        errorMessage = err.data.message;  // backend ka message
    }
    // Fallback: RTK Query error string
    else if (err?.error) {
        errorMessage = err.error;
    }

    ToasterUtils.error(errorMessage);
    dispatch(setError(errorMessage));
}
 finally {
            setLoading(false);
        }
    };











    

    const handleCancelOtp = (): void => {
        if (otpFlowType === "forgot") {
            setCurrentView("forgot");
        } else {
            setCurrentView("form");
        }
        setLoading(false);
    };

    // Forgot / Reset password handlers 
    const handleOtpRequest = (contact: string): void => {
        setCurrentView('otp');
        setOtpFlowType('forgot');
        setOtpContact(contact);
        setLoading(false);
    };


    // ...
    const handleCancelForgotPassword = (): void => {
        setCurrentView('form');
        setOtpContact("");
        setLoading(false);


        setSlideFromLeft(true);
        setTimeout(() => {
            setSlideFromLeft(false);
        }, 600);
    };
    // ...



    const handlePasswordSave = (): void => {
        localStorage.removeItem("tempToken");
        setCurrentView('form');
        setSignInData(prev => ({ ...prev, password: "" }));
        setOtpContact("");
        setLoading(false);


        setSlideFromLeft(true);
        setTimeout(() => {
            setSlideFromLeft(false); // एनिमेशन खत्म होने के बाद इसे रीसेट करें
        }, 600);

        ToasterUtils.success("Password updated successfully. Please sign in.");
    };


    const handleCancelResetPassword = (): void => {
        setCurrentView('forgot');
        setLoading(false);
        setSlideFromLeft(true);
        setTimeout(() => {
            setSlideFromLeft(false);
        }, 600);
    };
    // ...


    /**
     * --- RENDERER ---
     */
        const renderContent = (): JSX.Element => {
        if (currentView === 'otp') {
            return (
                <div className="p-2 lg:p-3">
                    <OtpScreen
                        onOtpConfirm={handleOtpConfirm}
                        onCancel={handleCancelOtp}
                        phoneNumber={otpContact}
                        flowType={otpFlowType}
                        onResendOtp={handleResendOtp}
                        loading={isVerifyingLoginOtp || isVerifyingForgotOtp || loading || isVerifyingOtp || isRegisteringUser} />
                </div>
            );
        }

        if (currentView === 'forgot') {
            return (
                <div className="p-2 lg:p-3">
                    <ForgotPassword
                        onOtpRequest={handleOtpRequest}
                        onCancel={handleCancelForgotPassword}
                        setLoading={setLoading as Dispatch<SetStateAction<boolean>>}
                        loading={loading}
                    />
                </div>
            );
        }

        if (currentView === 'reset') {
            return (
                <div className="p-2 lg:p-3">
                    {otpResponse && (
                        <ResetPassword
                            token={otpResponse.token}
                            onPasswordSave={handlePasswordSave}
                            onCancel={handleCancelResetPassword}
                            setLoading={setLoading as Dispatch<SetStateAction<boolean>>}
                            loading={loading}
                        />
                    )}
                </div>
            );
        }

        return (
            <div
                key={currentView === 'form' ? (isSignUp ? "signup" : "signin") : currentView}
                className={
                    animateSlide
                        ? `animate__animated ${isSignUp
                            ? slideDirection === "down"
                                ? "animate__flipOutYRight"
                                : "animate__flipInYRight"
                            : slideDirection === "down"
                                ? "animate__flipOutYLeft"
                                : "animate__flipInYLeft"
                        }`
                        : slideFromLeft
                            ? "animate__animated animate__slideInLeft faster-slideInLeft"
                            : ""
                }
                style={{ ["--animate-duration" as any]: "0.6s" }}   >
                <div className="flex sm:justify-center md:justify-center lg:justify-center md:pl-6 ">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-auto duration-500 drop-shadow-md ransition-transform hover:scale-105"
                    />
                </div>
                <h2 className="pl-3 mb-5 text-2xl font-semibold text-gray-700 sm:text-2xl text-start md:pl-6 lg:pl-0">
                    {isSignUp ? "Sign Up" : "Sign In"}
                    <p className="mt-1 text-base tracking-wider text-gray-500 sm:text-lg sm:pl-0 md:pl-0 lg:pl-0">
                        {isSignUp ? "Create your account" : "Welcome Back!"}
                    </p>

                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="px-3 space-y-4 sm:px-6 lg:px-0 "
                >

                    {/* SIGN UP — NAME FIELD */}
                    {isSignUp && (
                        <>
                            <InputField
                                label="Name"
                                type="text"
                                value={signUpData.name}
                                onChange={(val: string) => handleSignUpChange("name", val)}
                                leftIcon="ri-user-line"
                                error={!!signUpTouched.name && !!signUpErrors.name}
                                helperText={signUpTouched.name ? signUpErrors.name : ""}
                                onBlur={() => handleSignUpBlur("name")}
                                themeMode="light"
                            />
                            <div>
                                <InputField
                                    label="Mobile Number"
                                    type="number"
                                    leftIcon="ri-phone-line"
                                    value={signUpData.mobile}
                                    onChange={(val: string) => handleSignUpChange("mobile", val)}
                                    error={!!signUpTouched.mobile && !!signUpErrors.mobile}
                                    helperText={signUpTouched.mobile ? signUpErrors.mobile : ""}
                                    onBlur={() => handleSignUpBlur("mobile")}
                                    themeMode="light"
                                />
                            </div>
                            <InputField
                                label="Email"
                                type="text"
                                value={signUpData.email}
                                onChange={(val: string) => handleSignUpChange("email", val)}
                                leftIcon="ri-mail-line"
                                error={!!signUpTouched.email && !!signUpErrors.email}
                                helperText={signUpTouched.email ? signUpErrors.email : ""}
                                onBlur={() => handleSignUpBlur("email")}
                                themeMode="light"
                            />
                        </>
                    )}

                    {/* USERNAME / MOBILE FIELD FOR LOGIN MODE */}
                    {!isSignUp && (
                        <div className={`relative ${inputIdentifierType === "mobile" ? "[&_input]:pl-20" : "[&_input]:pl-0"}`} >
                            <InputField
                                label={inputIdentifierType === 'mobile' ? "Mobile Number" : "Username"}
                                themeMode="light"
                                type="text"
                                value={signInData.username}
                                leftIcon={inputIdentifierType === 'mobile' ? "" : "ri:user-3-line"}
                                className={inputIdentifierType === 'mobile' ? 'pl-28' : ''}
                                onChange={(val: string) => handleSignInChange("username", val)}
                                error={!!signInTouched.username && !!signInErrors.username}
                                helperText={signInTouched.username ? signInErrors.username : ""}
                                onBlur={() => handleSignInBlur("username")}
                            />

                            {inputIdentifierType === 'mobile' && (
                                <div className="absolute top-0 left-0 z-10 flex items-center h-full pl-4 pr-2 text-sm text-gray-500 pointer-events-none">
                                    <img
                                        src={indianflag}
                                        alt="India Flag"
                                        className="object-cover w-5 h-5 mr-2 rounded-sm"
                                    />
                                    <span className="font-medium">+91</span>
                                    <span className="ml-1 text-gray-300">|</span>
                                </div>
                            )}
                        </div>
                    )}
                    {/* PASSWORD FIELD */}
                    <InputField
                        label={isSignUp ? "Create Password" : "Password"}
                        type="password"
                        value={isSignUp ? signUpData.password : signInData.password}
                        themeMode="light"
                        leftIcon="ri-lock-2-line"
                        onChange={(val: string) =>
                            isSignUp
                                ? handleSignUpChange("password", val)
                                : handleSignInChange("password", val)
                        }
                        error={
                            isSignUp
                                ? (!!signUpTouched.password && !!signUpErrors.password)
                                : (!!signInTouched.password && !!signInErrors.password)
                        }

                        helperText={
                            isSignUp
                                ? (signUpTouched.password ? signUpErrors.password : "")
                                : (signInTouched.password ? signInErrors.password : "")
                        }
                        onBlur={() =>
                            isSignUp ? handleSignUpBlur("password") : handleSignInBlur("password")
                        }
                    />

                    {/* FORGOT PASSWORD — ONLY LOGIN MODE */}
                    {!isSignUp && (
                        <div className="flex items-center justify-between">
                            <Checkbox
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                label="Remember me"
                                size="xs"
                                shape="rounded"
                                checkedColor="bg-green-600"
                                uncheckedColor="bg-white"
                                showLabel
                                themeMode="light"
                            />
                            <button
                                type="button"
                                onClick={() => setCurrentView('forgot')}
                                className="text-sm font-medium text-indigo-600 underline hover:text-indigo-500"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <div className="flex justify-center ">
                        <button
                            type="submit"
                            disabled={
                                (isSignUp && !isSignUpValid) ||
                                (!isSignUp && !isSignInValid) ||
                                loading || isLoading || isVerifyingLoginOtp || isVerifyingForgotOtp
                            }
                            className={`relative flex items-center justify-center font-medium shadow-md transition-all duration-300 ease-in-out overflow-hidden
                ${((!isSignUp && !isSignInValid) || (isSignUp && !isSignUpValid))
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-black text-white "
                                }
                ${loading || isLoading || isVerifyingLoginOtp || isVerifyingForgotOtp
                                    ? "w-12 h-12 rounded-full"
                                    : "w-full h-12 rounded-xl"
                                }
            `}
                        >
                            {(loading || isLoading || isVerifyingLoginOtp || isVerifyingForgotOtp) && (
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
                            )}

                            {/* BUTTON TEXT */}
                            {!(loading || isLoading || isVerifyingLoginOtp || isVerifyingForgotOtp) && (
                                <span>{isSignUp ? "Continue" : "Sign In"}</span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Toggle Sign In / Up */}
                <div className="mt-4 mb-3 text-center md:mb-0">
                    <p className="text-sm text-gray-900">
                        {isSignUp
                            ? "Already have an account?"
                            : "Don’t have an account?"}{" "}
                        <button
                            type="button"
                            onClick={handleToggle}
                            className="relative inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        );
    };

    {showVerificationModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="p-6 text-center bg-white rounded shadow-md w-96">
      <h2 className="mb-4 text-xl font-bold">Verification Pending</h2>
      <p>Your account or restaurant information is not verified yet. Please wait for verification.</p>
      <button
        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
        onClick={() => setShowVerificationModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

    return (
//         <div className="flex flex-col h-screen bg-white lg:flex-row">
//             <div className="hidden lg:flex w-[60%] relative bg-gradient-to-br from-[#00AD7D] via-[#0A5C4F] text-white">
//                 <div className="relative sticky top-0 w-full h-screen overflow-hidden">
//                     <div className="relative w-full h-full ">
//                         {carouselSlides.map((slide, index) => (
//                             <img
//                                 key={index}
//                                 src={slide.img}
//                                 alt={`Slide ${index + 1}`}
//                                 className={`absolute inset-0 object-fit w-full h-full transition-opacity duration-1000 ease-in-out ${index === activeImageIndex ? "opacity-100" : "opacity-0"
//                                     }`}
//                             />
//                         ))}
//                         <div className="absolute inset-0 bg-gradient-to-br from-[#00AD7D]/10 via-[#1F1F1F]/20 to-[#000000]/10"></div>
//                     </div>
//                     <div className="absolute w-full max-w-lg px-4 text-center text-white transform -translate-x-1/2 bottom-10 left-1/2">
//                         <h1
//                             key={activeImageIndex + "-title"}
//                             className="text-4xl font-bold drop-shadow-lg animate__animated animate__backInUp"
//                             style={{ ["--animate-duration" as any]: "0.8s" }}
//                         >
//                             {carouselSlides[activeImageIndex].title}
//                         </h1>
//                         <p
//                             key={activeImageIndex + "-desc"}
//                             className="mt-2 text-lg drop-shadow-md animate__animated animate__bounceIn"
//                             style={{ ["--animate-duration" as any]: "1s" }}
//                         >
//                             {carouselSlides[activeImageIndex].description}
//                         </p>
//                         <div className="flex justify-center mt-6 space-x-2">
//                             {carouselSlides.map((_, index) => (
//                                 <button
//                                     key={index}
//                                     onClick={() => handleDotClick(index)}
//                                     className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
//                                         }`}
//                                     aria-label={`Go to slide ${index + 1}`}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>

// <div className="flex flex-1 min-h-screen overflow-y-visible conditional-scrollbar animate__animated animate__zoomIn">

//         <div className="flex items-center justify-center w-full min-h-[100dvh] px-4 lg:hidden">
//             <div className="w-full max-w-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-visible">
//                 <div className=" rotating-neon-wrapper mobile-neon rounded-2xl">
//                     <div className="p-1 rotating-neon-card rounded-2xl">
//                         {renderContent()}
//                     </div>
//                 </div>
//             </div>
//         </div>


//   {/* DESKTOP (1024px+) */}

//         {/* DESKTOP: Centered card with max-width and general padding */}
//         <div className="items-center justify-center flex-1 hidden p-8 lg:flex"> 
//             <div className="w-full max-w-lg mx-auto"> 
//                 <div className="rotating-neon-wrapper desktop-neon border-2 shadow-[0_4px_25px_rgba(0,0,0,0.18)] overflow-hidden">
//                     <div className="p-8 rotating-neon-card rounded-2xl"> 
//                         {renderContent()}
//                     </div>
//                 </div>
//             </div>
//         </div>

// </div>

//         </div>



<div
  className="relative flex items-center justify-center min-h-screen animate__animated animate__zoomIn"
  style={{
    backgroundImage: `url(${hero})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
    {/* OVERLAY (halka red-orange) */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-red-600/20 to-orange-500/10 "></div>

    {/* CONTENT */}
    <div className="relative flex items-center justify-center w-full">

        {/* MOBILE */}
        <div className="w-full px-4 lg:hidden">
            <div className="w-full max-w-md mx-auto rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <div className="rotating-neon-wrapper mobile-neon rounded-2xl">
                    <div className="p-1 bg-white rotating-neon-card rounded-2xl">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>

        {/* DESKTOP */}
          <div className="items-center justify-center flex-1 hidden p-8 lg:flex"> 
             <div className="w-full max-w-lg mx-auto"> 
                 <div className="rotating-neon-wrapper desktop-neon border-2 shadow-[0_4px_25px_rgba(0,0,0,0.18)] overflow-hidden">
                     <div className="p-8 rotating-neon-card rounded-2xl"> 
                         {renderContent()}
                     </div>
                 </div>
             </div>
         </div>

    </div>
</div>


    );
};

export default SignInForm;

