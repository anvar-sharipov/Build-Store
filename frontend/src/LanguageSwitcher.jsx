import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GrLanguage } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import MyButton from "./Components/UI/MyButton";

const LanguageSwitcher = ({ i18n }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const languages = [
    { code: "ru", label: "RU" },
    { code: "tk", label: "TM" },
  ];

  const toggleOpen = () => setOpen(!open);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <MyButton variant="green" onClick={toggleOpen}>
        <div className="flex items-center gap-1">
          <GrLanguage size={20} />
          <span className="font-semibold select-none">{t("language")}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            ▼
          </motion.span>
        </div>
      </MyButton>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 border border-gray-300 rounded-md shadow-lg z-50 bg-white dark:bg-gray-700"
          >
            {languages.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
