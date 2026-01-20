import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToOrders } from "../../features/orders/ordersSlice";
import BaseModal from "../BaseModals/BaseModal";

interface ItemSuccessModalProps {
  isOpen: boolean;
  toggle: () => void;
  itemName: string;
  itemPriceFull: number;
  itemPriceHalf: number;
  itemId: string;
  itemImage?: string;
}

const ItemSuccessModal: React.FC<ItemSuccessModalProps> = ({
  isOpen,
  toggle,
  itemName,
  itemPriceFull,
  itemPriceHalf,
  itemId,
  itemImage,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] =
    useState<"full" | "half">("full");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // RESET ON OPEN
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedPortion("full");
    }
  }, [isOpen]);

  const price =
    selectedPortion === "full" ? itemPriceFull : itemPriceHalf;

  const addItem = () => {
    dispatch(
      addToOrders({
        id: itemId,
        name: itemName,
        price,
        quantity,
        portion: selectedPortion,
        image: itemImage,
        description: "",
      })
    );
    toggle();
  };

  return (
  <BaseModal isOpen={isOpen} toggle={toggle} headerText="Add To Cart">
    {/* ITEM CARD */}
    <div className="flex items-center  mb-3 rounded-lg bg-gray-50 dark:bg-gray-700">
   <img
  src={itemImage || "/images/default-food.jpg"}
  alt={itemName}
  className="object-cover mr-3 rounded-lg  h-20 w-20"
/>

      <div>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {itemName}
        </p>
        <p className="text-sm font-medium text-red-500">
          ₹{selectedPortion === "full" ? itemPriceFull : itemPriceHalf}
        </p>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
          {selectedPortion === "full" ? "Full Portion" : "Half Portion"}
        </p>
      </div>
    </div>

    {/* PORTION SELECTOR */}
<div className="mb-5">
  <p className="mb-3 text-md font-medium text-gray-700 dark:text-gray-300">
    Choose Portion Size:
  </p>

  <div className="flex flex-col gap-3">
    {/* HALF */}
    <label className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="portion"
          checked={selectedPortion === "half"}
          onChange={() => {
            setSelectedPortion("half");
            setQuantity(1);
          }}
          className="w-4 h-4 text-orange-500 form-radio"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Half
        </span>
      </div>

      <span className="text-sm font-semibold text-red-500">
        ₹{itemPriceHalf}
      </span>
    </label>

    {/* FULL */}
    <label className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="portion"
          checked={selectedPortion === "full"}
          onChange={() => {
            setSelectedPortion("full");
            setQuantity(1);
          }}
          className="w-4 h-4 text-orange-500 form-radio"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Full
        </span>
      </div>

      <span className="text-sm font-semibold text-red-500">
        ₹{itemPriceFull}
      </span>
    </label>
  </div>
</div>


{/* QUANTITY */}
<div className="flex items-center justify-between mb-5">
  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Quantity
  </p>

  <div className="flex items-center gap-3">
    <button
      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
      className="flex items-center justify-center w-7 h-7 text-sm font-semibold 
                 text-gray-700 border border-gray-300 rounded-full 
                 dark:border-gray-600 dark:text-gray-200
                 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      –
    </button>

    <span className="min-w-[20px] text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
      {quantity}
    </span>

    <button
      onClick={() => setQuantity((q) => q + 1)}
      className="flex items-center justify-center w-7 h-7 text-sm font-semibold 
                 text-gray-700 border border-gray-300 rounded-full 
                 dark:border-gray-600 dark:text-gray-200
                 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      +
    </button>
  </div>
</div>


    {/* ACTION BUTTONS */}
    <div className="flex flex-row justify-between">
      <button
        onClick={() => {
          addItem();
          navigate("/cart");
        }}
        className="w-40 py-2 text-xs font-medium text-white rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90"
      >
        Add To Cart
      </button>

      <button
        onClick={addItem}
        className="w-40 py-2 text-xs font-medium text-orange-500 transition-colors border border-orange-400 rounded-full hover:bg-orange-50 dark:hover:bg-gray-700"
      >
        Continue Item
      </button>
    </div>
  </BaseModal>
);

};

export default ItemSuccessModal;
