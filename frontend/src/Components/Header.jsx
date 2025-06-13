import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
// My jsx
import LanguageSwitcher from "../LanguageSwitcher";
import { ROUTES } from "../routes";
import MyButton from "./UI/MyButton";
// icons
import { GrLanguage } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoLogInOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { LiaRegistered } from "react-icons/lia";
import myAxios from "./axios";
import axios from "axios";
import { div } from "framer-motion/client";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Загружаем данные пользователя по токену при монтировании
 useEffect(() => {
  const fetchUser = async () => {
    try {
      const access = localStorage.getItem("access");
      const res = await myAxios.get("user/", {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      setUser(res.data);
    } catch (error) {
      console.error("Ошибка загрузки пользователя", error);
    }
  };

  fetchUser();
}, []);

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
        navigate(ROUTES.MAIN);
      } else if (event.key === "F2") {
        event.preventDefault();
        navigate(ROUTES.HARYTLAR);
      } else if (event.key === "F3") {
        event.preventDefault();
        navigate(ROUTES.EMPLOYEERS);
      } else if (event.key === "F4") {
        event.preventDefault();
        navigate(ROUTES.PARTNERS);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location = ROUTES.MAIN;
  };

  return (
    <header className="bg-gray-800 text-gray-800 dark:text-white  dark:border-gray-700 px-4 sm:px-6 lg:px-20 py-3 print:hidden">
      <nav className="flex items-center justify-between">
        {/* Logo */}

        <h1 className="text-xl font-bold text-center text-indigo-400">
          POLISEM
        </h1>

        {/* Burger button */}
        <div className="lg:hidden text-gray-300">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <IoClose size={28} /> : <GiHamburgerMenu size={28} />}
          </button>
        </div>

        {/* Menu (desktop) */}
        <div className="hidden lg:flex gap-6 items-center">
          <Link
            to={ROUTES.REGISTER}
            className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
          >
            <LiaRegistered />
            {t("register")}
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
          >
            <IoLogInOutline />
            {t("login")}
          </Link>
          <div
            onClick={logout}
            className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center cursor-pointer"
          >
            <TbLogout2 />
            {t("logout")}
          </div>
          <LanguageSwitcher i18n={i18n} />
          <div
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center cursor-pointer"
          >
            {darkMode
              ? `🌙 ${t("theme")}: ${t("dark")}`
              : `☀️ ${t("theme")}: ${t("light")}`}
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <img
                src={user.photo}
                alt="user"
                className="w-8 h-8 rounded-full object-cover border border-gray-400"
              />
              <span className="text-gray-400">{user.username}</span>
            </div>
          )}
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
            className="lg:hidden flex justify-between items-start gap-2 mt-3"
          >
            <div className="flex flex-col gap-2">
              <Link
              to={ROUTES.MAIN}
              className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("main")}
            </Link>
            <Link
              to={ROUTES.HARYTLAR}
              className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("towary")}
            </Link>
            <Link
              to={ROUTES.EMPLOYEERS}
              className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("employeers")}
            </Link>
            <Link
              to={ROUTES.PARTNERS}
              className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("partners")}
            </Link>
            </div>

            <div className="flex flex-col gap-2">
              <Link
              to={ROUTES.REGISTER}
              className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <LiaRegistered />
              {t("register")}
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <IoLogInOutline />
              {t("login")}
            </Link>
            <div
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
            >
              <TbLogout2 />
              {t("logout")}
            </div>

            <LanguageSwitcher
              i18n={i18n}
              classList="bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600"
            />

            <div
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              className="hover:underline text-blue-500 hover:text-blue-700 flex gap-1 items-center"
            >
              {darkMode
                ? `🌙 ${t("theme")}: ${t("dark")}`
                : `☀️ ${t("theme")}: ${t("light")}`}
            </div>

            {user && (
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={user.photo}
                  alt="user"
                  className="w-8 h-8 rounded-full object-cover border border-gray-400"
                />
                <span className="text-gray-400">{user.username}</span>
              </div>
            )}
            </div>
            
            
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
