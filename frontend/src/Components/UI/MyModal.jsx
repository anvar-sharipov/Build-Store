import React, { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const MyModal = ({
  onClose,
  children,
  loading,
  isActiveSmallModal = false,
  fullWidth = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading && !isActiveSmallModal) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, loading, isActiveSmallModal]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading && !isActiveSmallModal) {
            onClose();
          }
        }}
      >
        <motion.div
          className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
      ${
        fullWidth
          ? "w-full max-w-[98vw]"
          : "w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]"
      } 
      max-h-[90vh] min-h-[60vh] relative 
      border border-gray-200/20 dark:border-gray-700/30 backdrop-blur-xl`}
          // className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/25 dark:shadow-black/50 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[90vh] min-h-[60vh] overflow-hidden relative border border-gray-200/20 dark:border-gray-700/30 backdrop-blur-xl"
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.4,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Градиентная полоска сверху */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

          {/* Кнопка закрытия */}
          <button
            onClick={() => {
              if (!loading) onClose();
            }}
            disabled={loading}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200 backdrop-blur-sm group disabled:opacity-50 disabled:cursor-not-allowed z-10"
            aria-label="Close modal"
          >
            <IoCloseSharp className="text-xl group-hover:rotate-90 transition-transform duration-200" />
            <span className="absolute -bottom-8 right-0 text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded whitespace-nowrap">
              ESC
            </span>
          </button>

          {/* Контент с кастомным скроллом */}
          <div className="p-6 sm:p-8 md:p-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/60 dark:scrollbar-thumb-gray-600/60 scrollbar-track-transparent hover:scrollbar-thumb-gray-400/80 dark:hover:scrollbar-thumb-gray-500/80">
            {children ? (
              children
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-4">
                    Красивое модальное окно
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center max-w-2xl mx-auto">
                  Здесь можно размещать любой контент с красивыми стилями,
                  анимациями и современным дизайном.
                </p>
              </div>
            )}
          </div>

          {/* Лоадер если loading */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Загрузка...
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MyModal;
