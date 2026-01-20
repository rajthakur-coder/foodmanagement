

import React, { useEffect, useState } from "react";
import Logo from "../../assets/Images/logosidebar.png";

type Phase = "intro" | "rotate" | "circle" | "zoom" | "squareLoop";

const Preloader: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("intro");

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [
      setTimeout(() => setPhase("rotate"), 1500),
      setTimeout(() => setPhase("circle"), 2000),
      setTimeout(() => setPhase("zoom"), 2000),
      setTimeout(() => setPhase("squareLoop"), 3000),
    ];

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  const outerClass = (): string => {
    switch (phase) {
      case "intro":
        return "animate-spin-reverse";
      case "rotate":
        return "animate-rotate-once-reverse";
      case "circle":
        return "animate-morph-to-circle";
      case "zoom":
        return "animate-zoom-out-in";
      case "squareLoop":
        return "animate-square-loop-reverse";
      default:
        return "";
    }
  };

  const innerClass = (): string => {
    switch (phase) {
      case "intro":
        return "animate-spin-slow";
      case "rotate":
        return "animate-rotate-once";
      case "circle":
        return "animate-morph-to-circle";
      case "zoom":
        return "animate-zoom-in-out";
      case "squareLoop":
        return "animate-square-loop";
      default:
        return "";
    }
  };

  const borderRadiusStyle = (): string | undefined => {
    if (phase === "intro" || phase === "rotate") return "3rem";
    if (phase === "circle" || phase === "zoom") return "50%";
    return undefined;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-body">
      <div className="relative flex items-center justify-center h-36 w-36">
        <div
          className={`absolute w-36 h-36 border-[5px] border-preloader-outer ${outerClass()}`}
          style={{
            borderRadius: borderRadiusStyle(),
            transition:
              phase !== "squareLoop"
                ? "border-radius 1s ease-in-out, transform 1.5s ease-in-out"
                : undefined,
          }}
        />
        <div
          className={`absolute w-32 h-32 border-[9px] border-preloader-inner ${innerClass()}`}
          style={{
            borderRadius: borderRadiusStyle(),
            transition:
              phase !== "squareLoop"
                ? "border-radius 1s ease-in-out, transform 1.5s ease-in-out"
                : undefined,
          }}
        />
        <img
          src={Logo}
          alt="Loading Logo"
          className="z-10 w-16 h-16 animate-pulse"
        />
      </div>
    </div>
  );
};

export default Preloader;
