import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const QREntry = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const restaurantId = params.get("restaurant_id");
    const tableId = params.get("table_id");

    if (!restaurantId || !tableId) {
      navigate("/error/404", { replace: true });
      return;
    }

    // ✅ SESSION STORE
    sessionStorage.setItem("restaurant_id", restaurantId);
    sessionStorage.setItem("table_id", tableId);
    sessionStorage.setItem("user_type", "Guest");

    // ✅ MENU PAGE
requestAnimationFrame(() => {
  navigate("/menu", { replace: true });
});
  }, [params, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Preparing menu...</p>
    </div>
  );
};

export default QREntry;
