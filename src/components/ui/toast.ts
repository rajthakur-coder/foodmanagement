
import { TOASTER_LIBRARY } from "../Config/toaster.config";
import * as HotToast from "react-hot-toast";
import * as SonnerToast from "sonner";
import * as Toastify from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Standard interface
export interface ToastInterface {
  [x: string]: any;
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  loading: (msg: string) => string | number;
  dismiss: (id?: string | number) => void;
}

// Factory function
const createToastInterface = (libName: string): ToastInterface => {
  switch (libName) {
    case "hot-toast":
      return {
        success: (msg: string) => HotToast.toast.success(msg),
        error: (msg: string) => HotToast.toast.error(msg),
        info: (msg: string) => HotToast.toast(msg),
        loading: (msg: string) => HotToast.toast.loading(msg),
        dismiss: (id?: string | number) => HotToast.toast.dismiss(id),
      };

    case "sonner":
      return {
        success: (msg: string) => SonnerToast.toast.success(msg),
        error: (msg: string) => SonnerToast.toast.error(msg),
        info: (msg: string) => SonnerToast.toast(msg),
        loading: (msg: string) => SonnerToast.toast.loading(msg),
        dismiss: (id?: string | number) => SonnerToast.toast.dismiss(id),
      };

    case "toastify":
      return {
        success: (msg: string) => Toastify.toast.success(msg),
        error: (msg: string) => Toastify.toast.error(msg),
        info: (msg: string) => Toastify.toast.info(msg),
        loading: (msg: string) => Toastify.toast.info(msg + " ⏳"),
        dismiss: (id?: string | number) => Toastify.toast.dismiss(id),
      };

    default:
      throw new Error(`Unsupported toaster library: ${libName}`);
  }
};

export const ToasterUtils: ToastInterface = createToastInterface(TOASTER_LIBRARY);
