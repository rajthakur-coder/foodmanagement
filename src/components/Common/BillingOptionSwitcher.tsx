import React from "react";

interface Props {
  selectedOption: "gst" | "pan";
  onOptionChange: (value: "gst" | "pan") => void;
}

const BillingOptionSwitcher: React.FC<Props> = ({
  selectedOption,
  onOptionChange,
}) => {
  const options = [
    { label: "GST Registered", value: "gst" },
    { label: "Unregistered", value: "pan" },
  ];

  return (
    <div className="flex items-center justify-start p-2 mb-4 border-2 rounded-xl">
      <div className="relative flex w-full bg-surface-card ov1/2erflow-hidden h-11 rounded-xl">
        {/* Sliding Indicator */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full transition-all duration-300 bg-black rounded-xl"
          style={{
            transform:
              selectedOption === "gst" ? "translateX(0%)" : "translateX(100%)",
          }}
        />

        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onOptionChange(opt.value as "gst" | "pan")}
            className={`relative z-10 flex-1 flex items-center justify-center font-medium text-sm transition-colors duration-300
                ${selectedOption === opt.value ? "text-white" : "text-text-main"}
              `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BillingOptionSwitcher;
