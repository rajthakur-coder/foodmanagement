// import React from "react";
// import CenteredSearchModal from "../BaseModals/DropdowmBaseModal";
// import SearchContent from "../ContentModal/SearchContentModal";
// import type { Country } from "../ContentModal/SearchContentModal";

// interface SearchModalWrapperProps {
//     initialSearch?: string;
//     title?: string;
//     maxWidth?: string;
//     isOpen: boolean;
//     onClose: () => void;
//     onSelect: (country: Country) => void;
// }

// const SearchModalWrapper: React.FC<SearchModalWrapperProps> = ({
//     initialSearch = "",
//     title = "Search/Select Country",
//     maxWidth = "max-w-sm",
//       isOpen,
//     onClose,
//     onSelect
// }) => {


//     const handleSelect = (country: Country) => {
//         onSelect(country);
//         onClose();
//     };

//     return (
//         <>
//        <CenteredSearchModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title={title}
//             maxWidth={maxWidth}
//         >
//             <SearchContent
//                 initialSearch={initialSearch}
//                 onSelectCountry={handleSelect}
//                 onClose={onClose}
//             />
//         </CenteredSearchModal>
//         </>
//     );
// };

// export default SearchModalWrapper;






import React from "react";
import CenteredSearchModal from "../BaseModals/DropdowmBaseModal";
import SearchContent from "../ContentModal/SearchContentModal";
import type { Country } from "../ContentModal/SearchContentModal";

interface SearchModalWrapperProps {
  initialSearch?: string;
  title?: string;
  maxWidth?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
}

const SearchModalWrapper: React.FC<SearchModalWrapperProps> = ({
  initialSearch = "",
  title = "Search/Select Country",
  maxWidth = "max-w-sm",
  isOpen,
  onClose,
  onSelect,
}) => {
  const handleSelect = (country: Country) => {
    onSelect(country);
    onClose();
  };

  return (
    <CenteredSearchModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
    >
      <SearchContent
        initialSearch={initialSearch}
        onSelectCountry={handleSelect}
        onClose={onClose}
      />
    </CenteredSearchModal>
  );
};

export default SearchModalWrapper;
