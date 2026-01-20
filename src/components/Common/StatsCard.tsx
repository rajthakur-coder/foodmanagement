import React from "react";
import { motion } from "framer-motion";
import Icon from "../../components/ui/Icon";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: string; // 👈 pass only icon name
  iconColor?: string; // Tailwind color class
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  iconName,
  iconColor = "text-indigo-600",
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="flex items-center gap-4 p-5 transition-all shadow-md cursor-pointer rounded-2xl hover:shadow-lg bg-surface-card"
    >
      {/* Icon Circle */}
      <div className="flex items-center justify-center w-12 h-12 text-xl rounded-full shadow-sm bg-indigo-50">
        <Icon name={iconName} size={24} className={`${iconColor}`} />
      </div>

      {/* Text Section */}
      <div className="flex flex-col">
        <p className="text-sm font-semibold tracking-wide uppercase text-text-main">
          {title}
        </p>
        <h2 className="text-2xl font-bold text-text-main">{value}</h2>
      </div>
    </motion.div>
  );
};

export default StatsCard;