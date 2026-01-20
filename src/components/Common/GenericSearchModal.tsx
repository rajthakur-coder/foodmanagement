


// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useCallback,
//   useLayoutEffect,
// } from "react";
// import { createPortal } from "react-dom";
// import clsx from "clsx";
// import Icon from "../ui/Icon";

// import type {
//   TypedUseQueryHookResult,
//   QueryDefinition,
//   BaseQueryFn,
//   FetchArgs,
// } from "@reduxjs/toolkit/query/react";

// // 📦 Types
// interface PaginatedResponse<T> {
//   success: boolean;
//   data: T[];
//   recordsTotal: number;
// }

// export interface SearchItem {
//   id: string | number;
//   name: string;
//   [key: string]: any;
// }

// type ListQueryParams = {
//   page?: number;
//   limit?: number;
//   searchValue?: string;
//   status?: "Active" | "Inactive";
//   [key: string]: any;
// };

// type FetchDataHook<T extends SearchItem> = (
//   params: ListQueryParams,
//   options?: { skip?: boolean }
// ) => TypedUseQueryHookResult<
//   PaginatedResponse<T>,
//   QueryDefinition<
//     ListQueryParams,
//     BaseQueryFn<string | FetchArgs, unknown, unknown>,
//     string,
//     PaginatedResponse<T>
//   >
// >;

// interface GenericSearchModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSelect: (item: SearchItem) => void;

//   fetchDataHook?: FetchDataHook<SearchItem>;
//   fetchByIdHook?: (
//     id: number | string,
//     options?: { skip?: boolean }
//   ) => TypedUseQueryHookResult<
//     QueryDefinition<any, BaseQueryFn, any, { data: SearchItem }>
//   >;

//   data?: SearchItem[];
//   initialSelectedId?: string | number | null;
//   initialSelectedName?: string | null;
//   title?: string;
//   maxWidth?: string;
//   searchPlaceholder?: string;
//   labelKey?: string;
//   queryParams?: Record<string, any>;
//   showEmail?: boolean; 
// }

// const ITEM_LIMIT = 10;

// const GenericSearchModal: React.FC<GenericSearchModalProps> = ({
//   isOpen,
//   onClose,
//   onSelect,
//   fetchDataHook,
//   fetchByIdHook,
//   data,
//   initialSelectedId,
//   initialSelectedName = "",
//   title = "Search / Select",
//   maxWidth = "max-w-sm",
//   searchPlaceholder = "Search...",
//   labelKey = "name",
//   queryParams = {},
//     showEmail = false, 
// }) => {
//   const isHookBased = !!fetchDataHook;
//   const [page, setPage] = useState(0);
//   const [allData, setAllData] = useState<SearchItem[]>([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [inputValue, setInputValue] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedId, setSelectedId] = useState<string | number | null>(
//     initialSelectedId || null
//   );

//   const listContainerRef = useRef<HTMLDivElement>(null);
//   const selectedRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const debounceRef = useRef<NodeJS.Timeout | null>(null);

//   // 🔹 Fetch list data
//   const {
//     data: apiResponse,
//     isFetching: isHookFetching,
//     isSuccess,
//     isError,
//   } = fetchDataHook
//     ? fetchDataHook(
//         { page, limit: ITEM_LIMIT, searchValue: searchTerm, ...queryParams },
//         { skip: !isOpen || !isHookBased }
//       )
//     : ({} as any);

//   // 🔹 Fetch selected item by ID
//   const {
//     data: selectedItemResponse,
//     isSuccess: isSelectedItemFetched,
//   } = fetchByIdHook
//     ? fetchByIdHook(initialSelectedId!, {
//         skip: !isOpen || !initialSelectedId,
//       })
//     : { data: null, isSuccess: false };

//   // 🔹 Add selected item if not already in list
//   useEffect(() => {
//     if (
//       isOpen &&
//       isSelectedItemFetched &&
//       selectedItemResponse?.data &&
//       !allData.some((d) => d.id === selectedItemResponse.data.id)
//     ) {
//       setAllData((prev) => [selectedItemResponse.data, ...prev]);
//     }
//   }, [isOpen, isSelectedItemFetched, selectedItemResponse]);

//   // 🔹 Handle list data update
//   useEffect(() => {
//     if (!isHookBased) return;
//     if (isSuccess && apiResponse) {
//       const newItems = apiResponse.data || [];
//       const isNewSearch = page === 0;

//       setAllData((prev) => {
//         const uniqueItems = newItems.filter(
//           (n) => !prev.some((e) => e.id === n.id)
//         );
//         return isNewSearch ? newItems : [...prev, ...uniqueItems];
//       });

//       const totalPages = Math.ceil(apiResponse.recordsTotal / ITEM_LIMIT);
//       setHasMore(page < totalPages - 1);
//     }
//     if (isError) setHasMore(false);
//   }, [isSuccess, apiResponse, page, searchTerm, isError, isHookBased]);

//   // 🔹 Local data filter (non-hook mode)
//   useEffect(() => {
//     if (!isOpen || isHookBased) return;
//     const filtered =
//       data?.filter((item) =>
//         item[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase())
//       ) || [];
//     setAllData(filtered);
//     setHasMore(false);
//   }, [isOpen, isHookBased, data, searchTerm, labelKey]);

//   const isFetching = isHookBased ? isHookFetching : false;

//   // 🔹 Set input when opened
//   useEffect(() => {
//     if (isOpen) {
//       setSelectedId(initialSelectedId || null);
//       setInputValue(initialSelectedName || "");
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   }, [isOpen, initialSelectedId, initialSelectedName]);

//   // 🔹 Scroll selected into view
//   useLayoutEffect(() => {
//     if (!isOpen || !allData.length || !selectedId) return;
//     const container = listContainerRef.current;
//     const selected = selectedRef.current;
//     if (container && selected) {
//       selected.scrollIntoView({ block: "center", behavior: "auto" });
//     }
//   }, [isOpen, allData, selectedId]);

//   // 🔹 Infinite scroll
//   const handleScroll = useCallback(() => {
//     if (!isHookBased) return;
//     const el = listContainerRef.current;
//     if (el && hasMore && !isFetching) {
//       if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50) {
//         setPage((prev) => prev + 1);
//       }
//     }
//   }, [hasMore, isFetching, isHookBased]);

//   useEffect(() => {
//     const el = listContainerRef.current;
//     if (isOpen && el) {
//       el.addEventListener("scroll", handleScroll);
//       return () => el.removeEventListener("scroll", handleScroll);
//     }
//   }, [isOpen, handleScroll]);

//   // 🔹 Debounced search
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newTerm = e.target.value;
//     setInputValue(newTerm);
//     setSelectedId(null);
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       if (newTerm !== searchTerm) {
//         if (isHookBased) {
//           setPage(0);
//           setAllData([]);
//           setHasMore(true);
//         }
//         setSearchTerm(newTerm);
//       }
//     }, 300);
//   };

//   useEffect(() => {
//     return () => {
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//     };
//   }, []);

//   const handleClearSearch = useCallback(() => {
//     setInputValue("");
//     setSearchTerm("");
//     setSelectedId(null);
//     setHasMore(isHookBased);
//     requestAnimationFrame(() => inputRef.current?.focus());
//   }, [isHookBased]);

// const handleSelect = (item: SearchItem) => {
//   setSelectedId(item.id);

//   // 👇 Custom display for user-type data
//   const formattedName =
//     item.company_name || item.mobile
//       ? `${item.name || "N/A"} - ${item.company_name || "N/A"} - ${
//           item.mobile || "N/A"
//         }`
//       : item.name || item[labelKey] || item.name || "";

//   setInputValue(formattedName);
//   onSelect({ ...item, name: formattedName });
//   onClose();
// };

// // 🔹 Auto-format user data (if applicable)
// useEffect(() => {
//     if (!isHookBased || !apiResponse?.data) return;

//     // 1. हर आइटम को फॉर्मेट करें
//     const formatted = apiResponse.data.map((user: any) => {
//         // 'mobile_no' या 'mobile' में से जो भी मौजूद हो, उसका उपयोग करें
//         const mobileValue = user.mobile_no || user.mobile || "N/A";
        
//         return {
//             ...user,
       
//         };
//     });

//     // 2. setAllData लॉजिक
//     setAllData((prev) => {
//         const isNewSearch = page === 0;
        
//         if (isNewSearch) {
//             // ✅ Fix: नया सर्च है, इसलिए सिर्फ़ फ़ॉर्मेटेड डेटा रिटर्न करें 
//             // ताकि पिछले अनफ़ॉर्मेटेड आइटम्स साफ़ हो जाएं।
//             return formatted; 
//         }

//         // इनफिनिट स्क्रॉलिंग (page > 0) के लिए: डुप्लीकेट हटाएँ और जोड़ें
//         const ids = new Set(prev.map((p) => p.id));
//         const unique = formatted.filter((u) => !ids.has(u.id));
//         return [...prev, ...unique];
//     });
    
//     // (बाकी isSuccess, recordsTotal, hasMore लॉजिक...)
//     if (isSuccess && apiResponse) {
//         const totalPages = Math.ceil(apiResponse.recordsTotal / ITEM_LIMIT);
//         setHasMore(page < totalPages - 1);
//     }
    
// }, [apiResponse, isHookBased, page, isSuccess]);

//   // 🔹 Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!isOpen) return;
//       if (e.key === "Escape") onClose();
//       if (e.key === "Enter" && allData.length && selectedId) {
//         const selectedItem = allData.find((d) => d.id === selectedId);
//         if (selectedItem) handleSelect(selectedItem);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isOpen, selectedId, allData]);

//   if (!isOpen) return null;

//   const modalContent = (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         className={clsx(
//           "bg-white rounded-xl shadow-2xl w-full transform transition-transform duration-300",
//           maxWidth
//         )}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="text-lg font-semibold">{title}</h3>
//           <button onClick={onClose} className="p-1 text-gray-500 hover:text-black">
//             <Icon name="x" className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="relative p-4 border-b">
//           <Icon
//             name="ri-search-line"
//             className="absolute text-gray-400 -translate-y-1/2 left-7 top-1/2"
//           />
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder={searchPlaceholder}
//             value={inputValue}
//             onChange={handleInputChange}
//             className="w-full py-3 pl-10 pr-8 border rounded-lg focus:outline-none"
//           />
//           {inputValue && (
//             <button
//               data-no-ripple
//               onClick={handleClearSearch}
//               className="absolute text-gray-400 -translate-y-1/2 right-7 top-1/2 hover:text-black"
//             >
//               <Icon name="x" className="w-4 h-4" />
//             </button>
//           )}
//         </div>

//         <div ref={listContainerRef} className="overflow-y-auto max-h-96 custom-scrollbar">
//           {isError && (
//             <div className="p-4 text-center text-red-500">
//               Failed to load data. Please try again.
//             </div>
//           )}

//           {isFetching && allData.length === 0 && (
//             <div className="flex items-center justify-center p-6 text-gray-500">
//               <Icon name="ri-loader-4-line" className="w-5 h-5 mr-2 animate-spin" />
//               <span>Loading...</span>
//             </div>
//           )}

//           {!isFetching && allData.length === 0 && !isError && (
//             <div className="p-4 text-center text-gray-400">No results found.</div>
//           )}
// {/* {allData.map((item) => {
//   // 👇 Detect if it's a "user"-type object
//   const isUserItem =
//     item.company_name || (item.mobile_no || item.mobile);

//   // 👇 Build display text conditionally
//   const displayText = isUserItem
//     ? `${item.name || "N/A"} - ${item.company_name || "N/A"} - ${
//         item.mobile_no || item.mobile || "N/A"
//       }`
//     : item.name || item[labelKey] || "";

//   return (
//     <div
//       key={item.id}
//       ref={item.id === selectedId ? selectedRef : null}
//       onClick={() => handleSelect(item)}
//       className={clsx(
//         "p-3 pl-6 cursor-pointer flex items-center justify-between transition-all",
//         item.id === selectedId
//           ? "bg-blue-100 text-blue-700 font-semibold"
//           : "hover:bg-gray-100"
//       )}
//     >
//       <span>{displayText}</span>
//     </div>
//   );
// })} */}


// {allData.map((item) => {
//   const isUserItem =
//     item.company_name || item.mobile_no || item.mobile || item.email;

//   let displayText = "";

//   if (isUserItem) {
//     displayText = `${item.name || "N/A"} - ${item.company_name || "N/A"} - ${
//       item.mobile_no || item.mobile || "N/A"
//     }`;

//     // 👇 If showEmail prop is true, append email
//     if (showEmail && item.email) {
//       displayText += ` - ${item.email}`;
//     }
//   } else {
//     displayText = item.name || item[labelKey] || "";
//   }

//   return (
//     <div
//       key={item.id}
//       ref={item.id === selectedId ? selectedRef : null}
//       onClick={() => handleSelect(item)}
//       className={clsx(
//         "p-3 pl-6 cursor-pointer flex items-center justify-between transition-all",
//         item.id === selectedId
//           ? "bg-blue-100 text-blue-700 font-semibold"
//           : "hover:bg-gray-100"
//       )}
//     >
//       <span>{displayText}</span>
//     </div>
//   );
// })}



//           {isHookBased && isFetching && allData.length > 0 && hasMore && (
//             <div className="p-4 text-center text-gray-500">
//               <Icon name="ri-loader-4-line" className="inline w-4 h-4 mr-1 animate-spin" />
//               Loading more...
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   return createPortal(modalContent, document.body);
// };

// export default GenericSearchModal;














import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import Icon from "../ui/Icon";
// 💡 useTheme हुक को इम्पोर्ट करें
import { useTheme } from "../context/ThemeContext"; 

import type {
  TypedUseQueryHookResult,
  QueryDefinition,
  BaseQueryFn,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";

// 📦 Types
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  recordsTotal: number;
}

export interface SearchItem {
  id: string | number;
  name: string;
  [key: string]: any;
}

type ListQueryParams = {
  page?: number;
  limit?: number;
  searchValue?: string;
  status?: "Active" | "Inactive";
  [key: string]: any;
};

type FetchDataHook<T extends SearchItem> = (
  params: ListQueryParams,
  options?: { skip?: boolean }
) => TypedUseQueryHookResult<
  PaginatedResponse<T>,
  QueryDefinition<
    ListQueryParams,
    BaseQueryFn<string | FetchArgs, unknown, unknown>,
    string,
    PaginatedResponse<T>
  >
>;

interface GenericSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SearchItem) => void;

  fetchDataHook?: FetchDataHook<SearchItem>;
  fetchByIdHook?: (
    id: number | string,
    options?: { skip?: boolean }
  ) => TypedUseQueryHookResult<
    QueryDefinition<any, BaseQueryFn, any, { data: SearchItem }>
  >;

  data?: SearchItem[];
  initialSelectedId?: string | number | null;
  initialSelectedName?: string | null;
  title?: string;
  maxWidth?: string;
  searchPlaceholder?: string;
  labelKey?: string;
  queryParams?: Record<string, any>;
  showEmail?: boolean; 
}

const ITEM_LIMIT = 10;

const GenericSearchModal: React.FC<GenericSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  fetchDataHook,
  fetchByIdHook,
  data,
  initialSelectedId,
  initialSelectedName = "",
  title = "Search / Select",
  maxWidth = "max-w-sm",
  searchPlaceholder = "Search...",
  labelKey = "name",
  queryParams = {},
    showEmail = false, 
}) => {
  // 💡 useTheme हुक का उपयोग करें
  const { theme } = useTheme();

  const isHookBased = !!fetchDataHook;
  const [page, setPage] = useState(0);
  const [allData, setAllData] = useState<SearchItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | null>(
    initialSelectedId || null
  );

  const listContainerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 🔹 Fetch list data
  const {
    data: apiResponse,
    isFetching: isHookFetching,
    isSuccess,
    isError,
  } = fetchDataHook
    ? fetchDataHook(
        { page, limit: ITEM_LIMIT, searchValue: searchTerm, ...queryParams },
        { skip: !isOpen || !isHookBased }
      )
    : ({} as any);

  // 🔹 Fetch selected item by ID
  const {
    data: selectedItemResponse,
    isSuccess: isSelectedItemFetched,
  } = fetchByIdHook
    ? fetchByIdHook(initialSelectedId!, {
        skip: !isOpen || !initialSelectedId,
      })
    : { data: null, isSuccess: false };

  // 🔹 Add selected item if not already in list
  useEffect(() => {
    if (
      isOpen &&
      isSelectedItemFetched &&
      selectedItemResponse?.data &&
      !allData.some((d) => d.id === selectedItemResponse.data.id)
    ) {
      setAllData((prev) => [selectedItemResponse.data, ...prev]);
    }
  }, [isOpen, isSelectedItemFetched, selectedItemResponse]);

  // 🔹 Handle list data update
  useEffect(() => {
    if (!isHookBased) return;
    if (isSuccess && apiResponse) {
      const newItems = apiResponse.data || [];
      const isNewSearch = page === 0;

      setAllData((prev) => {
        const uniqueItems = newItems.filter(
          (n) => !prev.some((e) => e.id === n.id)
        );
        return isNewSearch ? newItems : [...prev, ...uniqueItems];
      });

      const totalPages = Math.ceil(apiResponse.recordsTotal / ITEM_LIMIT);
      setHasMore(page < totalPages - 1);
    }
    if (isError) setHasMore(false);
  }, [isSuccess, apiResponse, page, searchTerm, isError, isHookBased]);

  // 🔹 Local data filter (non-hook mode)
  useEffect(() => {
    if (!isOpen || isHookBased) return;
    const filtered =
      data?.filter((item) =>
        item[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
    setAllData(filtered);
    setHasMore(false);
  }, [isOpen, isHookBased, data, searchTerm, labelKey]);

  const isFetching = isHookBased ? isHookFetching : false;

  // 🔹 Set input when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedId(initialSelectedId || null);
      setInputValue(initialSelectedName || "");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialSelectedId, initialSelectedName]);

  // 🔹 Scroll selected into view
  useLayoutEffect(() => {
    if (!isOpen || !allData.length || !selectedId) return;
    const container = listContainerRef.current;
    const selected = selectedRef.current;
    if (container && selected) {
      selected.scrollIntoView({ block: "center", behavior: "auto" });
    }
  }, [isOpen, allData, selectedId]);

  // 🔹 Infinite scroll
  const handleScroll = useCallback(() => {
    if (!isHookBased) return;
    const el = listContainerRef.current;
    if (el && hasMore && !isFetching) {
      if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50) {
        setPage((prev) => prev + 1);
      }
    }
  }, [hasMore, isFetching, isHookBased]);

  useEffect(() => {
    const el = listContainerRef.current;
    if (isOpen && el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [isOpen, handleScroll]);

  // 🔹 Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setInputValue(newTerm);
    setSelectedId(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (newTerm !== searchTerm) {
        if (isHookBased) {
          setPage(0);
          setAllData([]);
          setHasMore(true);
        }
        setSearchTerm(newTerm);
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleClearSearch = useCallback(() => {
    setInputValue("");
    setSearchTerm("");
    setSelectedId(null);
    setHasMore(isHookBased);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isHookBased]);

const handleSelect = (item: SearchItem) => {
  setSelectedId(item.id);

  // 👇 Custom display for user-type data
  const formattedName =
    item.company_name || item.mobile
      ? `${item.name || "N/A"} - ${item.company_name || "N/A"} - ${
          item.mobile || "N/A"
        }`
      : item.name || item[labelKey] || item.name || "";

  setInputValue(formattedName);
  onSelect({ ...item, name: formattedName });
  onClose();
};

// 🔹 Auto-format user data (if applicable)
useEffect(() => {
    if (!isHookBased || !apiResponse?.data) return;

    // 1. हर आइटम को फॉर्मेट करें
    const formatted = apiResponse.data.map((user: any) => {
        // 'mobile_no' या 'mobile' में से जो भी मौजूद हो, उसका उपयोग करें
        const mobileValue = user.mobile_no || user.mobile || "N/A";
        
        return {
            ...user,
       
        };
    });

    // 2. setAllData लॉजिक
    setAllData((prev) => {
        const isNewSearch = page === 0;
        
        if (isNewSearch) {
            return formatted; 
        }

        // इनफिनिट स्क्रॉलिंग (page > 0) के लिए: डुप्लीकेट हटाएँ और जोड़ें
        const ids = new Set(prev.map((p) => p.id));
        const unique = formatted.filter((u) => !ids.has(u.id));
        return [...prev, ...unique];
    });
    
    // (बाकी isSuccess, recordsTotal, hasMore लॉजिक...)
    if (isSuccess && apiResponse) {
        const totalPages = Math.ceil(apiResponse.recordsTotal / ITEM_LIMIT);
        setHasMore(page < totalPages - 1);
    }
    
}, [apiResponse, isHookBased, page, isSuccess]);

  // 🔹 Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && allData.length && selectedId) {
        const selectedItem = allData.find((d) => d.id === selectedId);
        if (selectedItem) handleSelect(selectedItem);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedId, allData]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      // 💡 डार्क थीम में बैकग्राउंड को गहरा करें
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={clsx(
          // 💡 डार्क थीम के लिए बैकग्राउंड, बॉर्डर और टेक्स्ट कलर
          "bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow-2xl w-full transform transition-transform duration-300",
          maxWidth
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
            // 💡 डार्क थीम के लिए बॉर्डर कलर
            className="flex items-center justify-between p-4 border-b dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={onClose} 
            // 💡 डार्क थीम में क्लोज बटन का कलर
            className="p-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div 
            // 💡 डार्क थीम के लिए बॉर्डर कलर
            className="relative p-4 border-b dark:border-gray-700"
        >
          <Icon
            name="ri-search-line"
            // 💡 डार्क थीम में आइकन का कलर
            className="absolute -translate-y-1/2 text-text-main left-7 top-1/2 "
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={handleInputChange}
            className={clsx(
              "w-full py-3 pl-10 pr-8 border rounded-lg focus:outline-none",
              // 💡 डार्क थीम में इनपुट फील्ड का स्टाइल
              "border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-text-main dark:placeholder-gray-400",
              "focus:border-gray-500 dark:focus:border-gray-400"
            )}
          />
          {inputValue && (
            <button
              data-no-ripple
              onClick={handleClearSearch}
              // 💡 डार्क थीम में क्लियर बटन का कलर
              className="absolute -translate-y-1/2 text-text-main right-7 top-1/2 hover:text-black dark:hover:text-white"
            >
              <Icon name="x" className="w-4 h-4" />
            </button>
          )}
        </div>

        <div ref={listContainerRef} className="overflow-y-auto max-h-96 custom-scrollbar">
          {isError && (
            <div className="p-4 text-center text-red-500">
              Failed to load data. Please try again.
            </div>
          )}

          {isFetching && allData.length === 0 && (
            <div 
                // 💡 डार्क थीम में टेक्स्ट कलर
                className="flex items-center justify-center p-6 text-text-main"
            >
              <Icon name="ri-loader-4-line" className="w-5 h-5 mr-2 animate-spin" />
              <span>Loading...</span>
            </div>
          )}

          {!isFetching && allData.length === 0 && !isError && (
            <div className="p-4 text-center text-text-main">No results found.</div>
          )}

          {allData.map((item) => {
            const isUserItem =
              item.company_name || item.mobile_no || item.mobile || item.email;

            let displayText = "";

            if (isUserItem) {
              displayText = `${item.name || "N/A"} - ${item.company_name || "N/A"} - ${
                item.mobile_no || item.mobile || "N/A"
              }`;

              // 👇 If showEmail prop is true, append email
              if (showEmail && item.email) {
                displayText += ` - ${item.email}`;
              }
            } else {
              displayText = item.name || item[labelKey] || "";
            }

            return (
              <div
                key={item.id}
                ref={item.id === selectedId ? selectedRef : null}
                onClick={() => handleSelect(item)}
                className={clsx(
                  "p-3 mt-1 pl-6 cursor-pointer flex items-center justify-between transition-all",
                  item.id === selectedId
                    ? // 💡 Selected item styles (थीम-अज्ञेय रखें या डार्क वेरिएंट जोड़ें)
                      "bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900 dark:text-blue-200 rounded-lg"
                    : // 💡 Hover state (डार्क वेरिएंट जोड़ें)
                      "hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:rounded-lg"
                )}
              >
                <span>{displayText}</span>
              </div>
            );
          })}

          {isHookBased && isFetching && allData.length > 0 && hasMore && (
            <div 
                // 💡 डार्क थीम में टेक्स्ट कलर
                className="p-4 text-center text-text-main"
            >
              <Icon name="ri-loader-4-line" className="inline w-4 h-4 mr-1 animate-spin" />
              Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default GenericSearchModal;
