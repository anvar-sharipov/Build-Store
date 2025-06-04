import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyButton from "./UI/MyButton";
import { IoLogInOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { LiaRegistered } from "react-icons/lia";
import { ROUTES } from "../routes";
import { useTranslation } from "react-i18next";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { GrLanguage } from "react-icons/gr";
import LanguageSwitcher from "../LanguageSwitcher";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Добавляем состояние для темы
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // Синхронизируем класс и localStorage при изменении темы
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const langs = [
    { code: "ru", flag: "🇷🇺" },
    { code: "tk", flag: "🇹🇲" },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F1") {
        event.preventDefault();
        navigate(ROUTES.FAKTURA);
      } else if (event.key === "F2") {
        event.preventDefault();
        navigate(ROUTES.HARYTLAR);
      } else if (event.key === "F3") {
        event.preventDefault();
        navigate(ROUTES.SUPPLIERS);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location = ROUTES.FAKTURA;
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-700 px-4 sm:px-6 lg:px-20 py-3">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="public/POLISEM.png" alt="logo" className="w-20 h-auto" />
          <h1 className="text-2xl font-bold">POLISEM</h1>

          <div className="hidden md:flex gap-4 items-center">
            <Link to={ROUTES.FAKTURA}>
              <MyButton variant="green">{t("faktura")} (F1)</MyButton>
            </Link>
            <Link to={ROUTES.HARYTLAR}>
              <MyButton variant="green">{t("towary")} (F2)</MyButton>
            </Link>
            <Link to={ROUTES.SUPPLIERS}>
              <MyButton variant="green">{t("suppliers")} (F3)</MyButton>
            </Link>
          </div>
        </div>

        {/* Burger button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <IoClose size={28} /> : <GiHamburgerMenu size={28} />}
          </button>
        </div>

        {/* Menu (desktop) */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to={ROUTES.REGISTER}>
            <MyButton className="flex items-center" variant="blue">
              <LiaRegistered />
              {t("register")}
            </MyButton>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <MyButton className="flex items-center" variant="green">
              <IoLogInOutline />
              {t("login")}
            </MyButton>
          </Link>
          <MyButton
            onClick={logout}
            className="flex items-center"
            variant="red"
          >
            <TbLogout2 />
            {t("logout")}
          </MyButton>
          <LanguageSwitcher
            i18n={i18n}
            classList="bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600"
          />
          <MyButton
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            variant="blue"
          >
            {darkMode ? "🌙 Тема: Ночь" : "☀️ Тема: День"}
          </MyButton>
        </div>
      </nav>

      {/* AnimatePresence + motion.div for mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden flex flex-col items-start gap-2 mt-3"
          >
            <Link to={ROUTES.FAKTURA}>
              <MyButton
                className="flex items-center"
                variant="green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("faktura")} (F1)
              </MyButton>
            </Link>
            <Link to={ROUTES.HARYTLAR}>
              <MyButton
                className="flex items-center"
                variant="green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("towary")} (F2)
              </MyButton>
            </Link>
            <Link to={ROUTES.SUPPLIERS}>
              <MyButton
                className="flex items-center"
                variant="green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("suppliers")} (F3)
              </MyButton>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <MyButton
                className="flex items-center"
                variant="blue"
                onClick={() => setIsMenuOpen(false)}
              >
                <LiaRegistered />
                {t("register")}
              </MyButton>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <MyButton
                className="flex items-center"
                variant="green"
                onClick={() => setIsMenuOpen(false)}
              >
                <IoLogInOutline />
                {t("login")}
              </MyButton>
            </Link>
            <MyButton
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="flex items-center"
              variant="red"
            >
              <TbLogout2 />
              {t("logout")}
            </MyButton>
            <LanguageSwitcher
              i18n={i18n}
              classList="bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600"
            />

            <MyButton
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              variant="blue"
            >
              {darkMode ? "🌙 Тема: Ночь" : "☀️ Тема: День"}
            </MyButton>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
