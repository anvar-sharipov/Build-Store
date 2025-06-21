import { FaTruck, FaUser, FaExchangeAlt } from "react-icons/fa";

const TypeBadge = ({ type, text, typeText }) => {
  const styles = {
    supplier:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    klient: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    both: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  const icons = {
    supplier: <FaTruck className="inline mr-1" />,
    klient: <FaUser className="inline mr-1" />,
    both: <FaExchangeAlt className="inline mr-1" />,
  };

  

  return (
    <span
      className={`inline-flex items-center px-1 rounded-full text-xs font-semibold ${styles[type]}`}
    >
      <div className="flex gap-2 items-center">
        <span className="hidden lg:block">{typeText}</span>
        <span>{icons[type]}</span>
      </div>
    </span>
  );
};

export default TypeBadge;