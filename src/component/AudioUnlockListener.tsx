import { useEffect } from "react";
import { useCustomerSocket } from "../services/useCustomerSocket";

const AudioUnlockListener = () => {
  const { unlockAudio } = useCustomerSocket();

  useEffect(() => {
    const hasPref =
      localStorage.getItem("customer_sound_pref") === "enabled";

    if (!hasPref) return;

    const handleFirstInteraction = () => {
      unlockAudio();
      // console.log("🔊 Global Audio Unlocked via User Interaction");
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [unlockAudio]);

  return null;
};

export default AudioUnlockListener;
