

import { MouseEvent as ReactMouseEvent } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import 'animate.css';
import { store } from "./components/app/store";
import { Provider } from "react-redux";
import { createRipple } from './hooks/useRipple';

// Ripple effect
document.addEventListener("mousedown", (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  // Skip elements with data-no-ripple
  if (target.closest("[data-no-ripple]")) return;

  // Find clickable element
  const clickable = target.closest("button, a, [data-ripple]") as HTMLElement | null;
  if (clickable) {
    if (!clickable.hasAttribute("data-ripple")) {
      clickable.setAttribute("data-ripple", "");
    }

    // Type assertion for createRipple
    createRipple({ ...e, currentTarget: clickable } as unknown as ReactMouseEvent<HTMLElement>);
  }
});

const root = createRoot(document.getElementById('root')!);

root.render(
  <Provider store={store}>
      <App />
  </Provider>
);

