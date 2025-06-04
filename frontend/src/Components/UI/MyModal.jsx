import React from 'react';
import { useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";

const MyModal = ({ onClose, children }) => {

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto p-8 relative">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none flex items-center"
          aria-label="Close modal"
        >
          <IoCloseSharp className='text-red-500 hover:text-red-700' /> <span className='text-red-500 hover:text-red-700'>ESC</span>
        </button>

        {/* Содержимое модалки */}
        {children ? children : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Большое модальное окно</h2>
            <p>Здесь можно размещать любой контент, например формы, таблицы, текст и т.д.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyModal;
