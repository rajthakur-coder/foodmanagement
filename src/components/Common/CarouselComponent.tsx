import React, { useState, useEffect } from "react";

interface CarouselProps {
  images: string[];
  autoSlide?: boolean;
  slideInterval?: number;
  showIndicators?: boolean;
  height?: string;
  rounded?: boolean;
}

const CarouselComponent: React.FC<CarouselProps> = ({
  images,
  autoSlide = true,
  slideInterval = 3000,
  showIndicators = true,
  height = "h-64",
  rounded = true,
}) => {
  const [current, setCurrent] = useState(0);

  // Auto slide logic
  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      slideInterval
    );
    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, images.length]);

  return (
    <div
      className={`relative overflow-hidden shadow-md ${
        rounded ? "rounded-2xl" : ""
      }`}
    >
      <img
        src={images[current]}
        alt={`slide-${current}`}
        className={`w-full ${height} object-cover transition-all duration-700`}
      />

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute flex px-3 py-1 space-x-2 rounded-full bottom-3 right-3 bg-white/30 backdrop-blur-sm">
          {images.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrent(index)}
              className={`cursor-pointer w-3 h-3 rounded-full transition-all ${
                current === index ? "bg-blue-600 scale-110" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselComponent;