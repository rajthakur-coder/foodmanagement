import type { IconType } from "react-icons";
import { RiHomeLine, RiShoppingBagLine, RiUserLine, RiBriefcase2Fill, RiPencilFill, RiPrinterFill, RiCheckFill, RiSubtractLine, RiSubtractFill, RiEyeCloseFill, RiEyeCloseLine, RiEyeOffLine, RiEyeFill, RiSearchLine, RiLock2Line, RiMailLine, RiArrowLeftLine, RiCornerRightUpFill, RiAddFill, RiKeyFill, RiSettingsLine, RiSendPlane2Line, RiLoader4Line, RiWalletLine, RiRefund2Line, RiInformationLine, RiUserUnfollowLine, RiUserAddLine, RiStopCircleLine, RiDeleteBin2Line, RiTeamFill, RiMoneyRupeeCircleLine, RiAddCircleFill, RiIndeterminateCircleFill, RiGlobalLine, RiFileCopy2Line, RiUser3Line, RiBuilding4Fill, RiPhoneFill, RiCheckDoubleFill, RiFileList3Fill, RiAppsFill, RiShoppingCart2Fill, RiEditLine } from "react-icons/ri";
import { BiUser, BiChevronRight, BiChevronLeft, BiChevronDown, BiBell, BiBriefcaseAlt2, BiPoll, BiTrash, BiDotsVerticalRounded, BiChevronUp, BiExport, BiImport, BiArrowBack, BiMobile, BiUserCheck, BiShoppingBag, BiSolidBellOff, BiTimeFive, } from "react-icons/bi";
import { FiCamera, FiRefreshCw, FiX } from "react-icons/fi";
import { SiBitcoin } from "react-icons/si";

// Correct import for Vite
import * as mdi from "@mdi/js";

type IconEntry = string | IconType;

export const iconMap: Record<string, IconEntry> = {
  // Material Design Icons
  "mdi:apps": mdi.mdiApps,
  "mdi:shopping-bag": mdi.mdiShopping,
  "mdi:chart-bar": mdi.mdiChartBar,
  "mdi:bank-outline": mdi.mdiBankOutline,
  "mdi:calendar-check-outline": mdi.mdiCalendarCheckOutline,
  "mdi:file-outline": mdi.mdiFileOutline,
  "mdi:monitor": mdi.mdiMonitor,
  "mdi:account-outline": mdi.mdiAccountOutline,
  "mdi:package-variant": mdi.mdiPackageVariant,
  "mdi:arrow-left-thin": mdi.mdiArrowLeftThin,

  // Remix Icons
  "ri:home-line": RiHomeLine,
  "ri:shopping-bag-line": RiShoppingBagLine,
  "ri:user-line": RiUserLine,
  "ri:briefcase-2-fill": RiBriefcase2Fill,
  "ri-pencil-fill": RiPencilFill,
  "ri-printer-fill": RiPrinterFill,
  "ri-check-fill": RiCheckFill,
  "ri-subtract-line": RiSubtractLine,
  "ri-subtract-fill": RiSubtractFill,
  "ri-eye-close-fill": RiEyeCloseFill,
  "ri-eye-close-line": RiEyeCloseLine,
  "ri-eye-off-line": RiEyeOffLine,
  "ri-eye-fill": RiEyeFill,
  "ri-search-line": RiSearchLine,
  "ri-lock-2-line": RiLock2Line,
  "ri-user-line": RiUserLine,
  "ri-mail-line": RiMailLine,
  "ri-settings-line": RiSettingsLine,
  "ri-add-fill": RiAddFill,
  "ri-key-fill": RiKeyFill,
  "ri-loader-4-line": RiLoader4Line,
  "ri-send-plane-2-line": RiSendPlane2Line,
  "ri-refund-2-line": RiRefund2Line,
  "ri:wallet-line": RiWalletLine,
  "ri:information-line": RiInformationLine,
  "ri:user-unfollow-line": RiUserUnfollowLine,
  "ri:user-add-line": RiUserAddLine,
  "ri:arrow-left-line": RiArrowLeftLine,
  "ri:corner-right-up-fill": RiCornerRightUpFill,
  "ri-team-fill": RiTeamFill,
  "ri-stop-circle-line": RiStopCircleLine,
  "ri-delete-bin-line": RiDeleteBin2Line,
  "ri-money-rupee-circle-line": RiMoneyRupeeCircleLine,
  " ri-add-fill": RiAddFill,
  "ri-indeterminate-circle-fill": RiIndeterminateCircleFill,
  "ri-add-circle-fill": RiAddCircleFill,
    "ri-file-copy-line": RiFileCopy2Line,
  "ri-global-line": RiGlobalLine,
  "ri:user-3-line": RiUser3Line,
  "ri:building-4-fill": RiBuilding4Fill,
  "ri:phone-fill": RiPhoneFill,
  "ri:key-fill": RiKeyFill,
  "ri-loader-3-line": RiLoader4Line,
  "ri-wallet-line":RiWalletLine,
  "ri-check-double-line":RiCheckDoubleFill,
  "ri-file-list-3-fill":RiFileList3Fill,
  "ri-apps-fill":RiAppsFill,
  "ri-shopping-cart-2-fill":RiShoppingCart2Fill,






  // Boxicons
  "bx:user": BiUser,
  "bx:chevron-right": BiChevronRight,
  "bx:chevron-left": BiChevronLeft,
  "bx:chevron-down": BiChevronDown,
  "bx:chevron-up": BiChevronUp,
  "bx:bx-bell": BiBell,
  "bx:bxs-briefcase-alt-2": BiBriefcaseAlt2,
  "bx bx-poll": BiPoll,
  "bx bx-trash": BiTrash,
  "bx bx-dots-vertical-rounded": BiDotsVerticalRounded,
  "bx bx-export": BiExport,
  "bx bx-import": BiImport,
  "bx bx-arrow-back": BiArrowBack,
  "bx bx-mobile": BiMobile,
  "bx bx-user-check": BiUserCheck,
   "bx bxs-shopping-bag":BiShoppingBag,
   "bx bx-bell-off": BiSolidBellOff,
   "bx bx-time-five": BiTimeFive,
   "ri-edit-line": RiEditLine,



  // Feather
  "fi:camera": FiCamera,
  "x": FiX,
  "fi:refresh-cw": FiRefreshCw,

  // SimpleIcons
  "si:bitcoin": SiBitcoin,
};
