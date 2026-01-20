import type { AnimationControls } from "framer-motion";

// Reusable shake function
export const shakeAnimation = (controls: AnimationControls, duration = 0.7) => {
  controls.start({
    x: [-10, 10, -7, 7, -5, 5, 0],
    transition: { duration },
  });
};





