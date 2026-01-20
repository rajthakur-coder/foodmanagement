// export const createRipple = (event: MouseEvent & { currentTarget: HTMLElement }) => {
//   const el = event.currentTarget;
//   const rect = el.getBoundingClientRect();

//   const circle = document.createElement("span");
//   circle.className = "ripple-circle";

//   const size = Math.max(rect.width, rect.height);
//   circle.style.width = circle.style.height = size + "px";

//   // Center se ripple
//   circle.style.left = rect.width / 2 - size / 2 + "px";
//   circle.style.top = rect.height / 2 - size / 2 + "px";

//   el.appendChild(circle);

//   setTimeout(() => circle.remove(), 600);
// };





export const createRipple = (event: MouseEvent & { currentTarget: HTMLElement }): void => {
  const el: HTMLElement = event.currentTarget;
  const rect = el.getBoundingClientRect();

  const circle = document.createElement("span");
  circle.className = "ripple-circle";

  const size = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = `${size}px`;

  // Center se ripple
  circle.style.left = `${rect.width / 2 - size / 2}px`;
  circle.style.top = `${rect.height / 2 - size / 2}px`;

  el.appendChild(circle);

  setTimeout(() => circle.remove(), 600);
};
