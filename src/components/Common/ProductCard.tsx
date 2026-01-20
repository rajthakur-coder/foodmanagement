// import React from "react";

// interface ProductCardProps {
//   title: string;
//   description: string;
//   price?: number;
//   image?: string;
//   buttonText?: string;
//   onClick?: () => void;
//   showPriceTag?: boolean;
// }

// const ProductCard: React.FC<ProductCardProps> = ({
//   title,
//   description,
//   price,
//   image,
//   buttonText = "Explore",
//   onClick,
//   showPriceTag = true,
// }) => {
//   return (
//     <div
//       className="relative transition-all duration-300 shadow-md bg-surface-card card group rounded-xl hover:shadow-lg"
//       data-label={showPriceTag && price ? `₹ ${price}` : ""}
//     >
//       <div className="card__container">
      

//         {/* Title */}
//         <h2 className="mb-2 text-xl font-bold text-text-main card__header">
//           {title}
//         </h2>

//         {/* Description */}
//         <p className="mb-4 text-sm leading-relaxed text-gray-600 card__body">
//           {description}
//         </p>

//         {/* Button */}
//         <button
//           onClick={onClick}
//           className="w-1/2 border border-blue-600 text-blue-600 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"
//         >
//           {buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;











import React from "react";

interface ProductCardProps {
  title: string;
  description: string;
  price?: number;
  image?: string;
  buttonText?: string;
  onClick?: () => void;
  showPriceTag?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  price,
  image,
  buttonText = "Explore",
  onClick,
  showPriceTag = true,
}) => {
  return (
    <div
      className="
        relative text-[#434343] bg-surface-card rounded-[1rem]
        shadow-[4px_4px_15px_rgba(0,0,0,0.15)]
        transition-all duration-300 
        hover:-translate-y-1
        group

        /* Ribbon before */
        before:absolute before:top-[30px] before:right-[-10px]
        before:content-[''] before:bg-[#283593]
        before:w-[28px] before:h-[28px]
        before:rotate-45 before:z-0

        /* Ribbon text */
        after:absolute after:top-[11px] after:right-[-17px]
        after:px-[0.5rem] after:py-[0.4rem]
        after:w-[7rem]
        after:bg-[#3949ab] after:text-white
        after:text-[0.85rem] after:text-center
        after:shadow-[4px_4px_15px_rgba(26,35,126,0.2)]
        after:z-10
        after:content-[attr(data-label)]
      "
      data-label={showPriceTag && price ? `₹ ${price}` : ""}
    >
      <div className="p-7 w-full h-full rounded-[1rem] bg-surface-card relative">

        {/* Title */}
        <h2
          className="
            mb-3 text-xl font-bold text-text-main
            lg:max-[1024px]:m-[15px]
            max-[320px]:m-[10px]
          "
        >
          {title}
        </h2>

        {/* Description */}
        <p
          className="
            mb-4 text-[0.95rem] leading-relaxed text-text-main
            lg:max-[1024px]:m-[15px]
            max-[320px]:m-[10px]
          "
        >
          {description}
        </p>

        {/* Button */}
        <button
          onClick={onClick}
          className="
            w-1/2 border border-blue-600 text-blue-600 
            py-1.5 rounded-lg
            hover:bg-surface-hover hover:text-blue-700
            transition
          "
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;
