import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import clsx from "clsx";
import Icon from "../ui/Icon";

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

interface SearchContentProps {
  initialSearch: string; 
  onSelectCountry: (country: Country) => void;
  onClose: () => void;
}

// Dummy countries data
const countries: Country[] = [
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
];

const SearchContent: React.FC<SearchContentProps> = ({
  initialSearch,
  onSelectCountry,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState(""); // Filtering ke liye
  const [inputValue, setInputValue] = useState(initialSearch || ""); // Input me show
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLDivElement | null>(null); // Selected item ke liye scroll

  // Modal open → focus input, reset searchTerm, show selected
 useEffect(() => {
  if (selectedRef.current) {
    // instant scroll, user ko visible nahi hoga
    selectedRef.current.scrollIntoView({ behavior: "auto", block: "center" });
  }
}, [inputValue]); // ya initialSearch


  // Filtering only if user types
  const filteredContent = searchTerm
    ? countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : countries;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setInputValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="relative p-4 border-b border-border-primary">
        <FiSearch className="absolute -translate-y-1/2 text-text-subtle left-7 top-1/2" />
        <input
          ref={inputRef}
          type="text"
          className="w-full px-3 py-3.5 pl-10 text-sm border rounded-lg bg-surface-body text-text-main placeholder-text-subtle border-border-input focus:border-[var(--color-border-input-focus)] focus:ring-primary outline-none"
          placeholder="Search a country..."
          value={inputValue}
          onChange={handleInputChange}
        />
        {inputValue && (
          <button
            data-no-ripple
            onClick={handleClearSearch}
            className="absolute -translate-y-1/2 right-7 top-1/2 p-1.5 rounded-full text-text-subtle hover:bg-surface-hover hover:text-text-main transition-colors"
          >
            <Icon name="x" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Country List */}
      <div className="overflow-y-auto max-h-96 divide-border-primary custom-scrollbar">
        {filteredContent.map((item) => (
          <div
            key={item.code}
            ref={item.name === initialSearch ? selectedRef : null} // selected item scroll
            onClick={() => {
              onSelectCountry(item);
              onClose();
            }}
            className={clsx(
              "flex items-center p-2.5 transition-colors duration-150 cursor-pointer",
              item.name === initialSearch
                ? "bg-surface-active hover:bg-primary-light/40" // Highlight selected
                : "hover:bg-surface-hover"
            )}
          >
            <span className="mr-3 text-xl">{item.flag}</span>
            <div className="flex-1 text-sm font-medium text-text-main">{item.name}</div>
            <div className="text-sm font-semibold text-text-main">{item.dialCode}</div>
          </div>
        ))}
        {filteredContent.length === 0 && (
          <div className="p-4 text-center text-text-subtle">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchContent;
