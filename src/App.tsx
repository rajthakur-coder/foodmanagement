import React from "react";
import AppProviders from "./component/AppProviders";
import AppLayout from "./component/AppLayout";
import AudioUnlockListener from "./component/AudioUnlockListener";

import "./assets/styles/scss/globals.scss";

const App: React.FC = () => {
  return (
    <AppProviders>
      <AudioUnlockListener />
      <AppLayout />
    </AppProviders>
  );
};

export default App;
