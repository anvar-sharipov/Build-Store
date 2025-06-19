import { useEffect } from "react";

const MySmallModal = ({ onClose, children, loading }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === "Escape" && !loading) {
            onClose();
          }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }, [onClose]);
  return (
    <>
      {/* Затемнённый фон */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={onClose} // закрытие по клику на фон
      />
      {/* Само модальное окно */}
      <div
        className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                   bg-white dark:bg-gray-800 rounded-lg shadow-lg
                   w-80 max-w-full p-6"
      >
        {children ? children : <p className="text-center text-gray-700 dark:text-gray-300">My Small Modal</p>}
      </div>
    </>
  );
};

export default MySmallModal;
