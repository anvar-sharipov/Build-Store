import React, { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const MyModal = ({ onClose, children, loading, isActiveSmallModal = false }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading && !isActiveSmallModal) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[95%] sm:w-[90%] md:w-[80%] lg:w-[80%] xl:w-[80%] max-h-[90vh] min-h-[60vh] overflow-auto relative p-4 sm:p-6 md:p-8"
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Кнопка закрытия */}
          <button
            onClick={() => {
              if (!loading) onClose()
            }}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none flex items-center gap-1"
            aria-label="Close modal"
          >
            <IoCloseSharp className="text-red-500 hover:text-red-700 text-lg" />
            <span className="text-sm text-red-500 hover:text-red-700">ESC</span>
          </button>

          {/* Контент */}
          {children ? (
            children
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Большое модальное окно</h2>
              <p>Здесь можно размещать любой контент, например формы, таблицы, текст и т.д.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MyModal;
