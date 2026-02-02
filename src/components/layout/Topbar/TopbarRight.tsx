

import { useState } from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import ToggleTheme from "../../ui/ToggleTheme";
import TopbarNotification from "./TopbarNotification";
import TopbarProfile from "./TopbarProfile";
import IconButton from "../../ui/IconButton";

const TopbarRight = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex items-center gap-0 md:gap-4">
      <IconButton onClick={toggleFullscreen}>
        {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
      </IconButton>
      <TopbarNotification count={5} />
      <ToggleTheme />
      <TopbarProfile />
    </div>
  );
};

export default TopbarRight;
