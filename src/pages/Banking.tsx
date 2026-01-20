import React, { useState } from "react";
import ToggleButton from "../components/Common/ToggleButton";
import Checkbox from "../components/Common/Checkbox";
import RadioButton from "../components/Common/RadioButton"; //  Import the new reusable RadioButton

const App: React.FC = () => {
  const [active, setActive] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState("option1"); //  For RadioButton group

  return (
    <div className="flex flex-col items-start justify-start min-h-screen p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      {/*  Toggle Button */}
      <ToggleButton
        isOn={active}
        onToggle={() => setActive(!active)}
        size="sm"
        onColor="bg-primary"
        offColor="bg-surface-card"
        knobColor="bg-white"
        animationSpeed={300}
        showLabels
        onLabel="On"
        offLabel="Off"
      />

      {/* ☑️ Checkbox */}
      <Checkbox
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        size="sm"
        shape="rounded"
        checkedColor="bg-primary"
        uncheckedColor="bg-surface-card"
        showLabel
      />

      {/* 🔘 Radio Buttons */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Choose an Option:
        </h2>

        <RadioButton
          checked={selectedOption === "option1"}
          onChange={() => setSelectedOption("option1")}
          label="Option 1"
          size="sm"
  activeColor="bg-primary" 
          borderColor="border-gray-400"
          labelColor="text-text-main"
          hoverGlow
        />

        <RadioButton
          checked={selectedOption === "option2"}
          onChange={() => setSelectedOption("option2")}
          label="Option 2"
          size="sm"
  activeColor="bg-primary"  
          borderColor="border-gray-400"
          labelColor="text-text-main"
          hoverGlow
        />



      </div>
    </div>
  );
};

export default App;
