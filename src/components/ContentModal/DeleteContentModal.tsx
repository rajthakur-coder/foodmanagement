
// import React from "react";

// interface ContentModalProps {
//   title: string;
//   message: string;
// }

// const ContentModal: React.FC<ContentModalProps> = ({ title, message }) => {
//   return (
//     <div className="p-2 space-y-4 text-start">
//       <h3 className="text-lg font-semibold text-text-main">{title}</h3>
//       <p className="text-sm font-normal text-text-main">{message}</p>
//     </div>
//   );
// };

// export default ContentModal;


import React from "react";

interface ContentModalProps {
  title: string;
  message: string;
}

const ContentModal: React.FC<ContentModalProps> = ({ title, message }) => {
  return (
    <div className="p-2 space-y-4 text-start">
      <h3 className="text-lg font-semibold text-text-main">{title}</h3>
      <p className="text-sm font-normal text-text-main">{message}</p>
    </div>
  );
};

export default ContentModal;
