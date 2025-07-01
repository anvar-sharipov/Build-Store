import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// My jsx
import { ROUTES } from "../../routes";
// icons
import myAxios from "../axios";
import LargeScreenLinks from "./LargeScreenLinks";
import MobileScreenLinks from "./MobileScreenLinks";
import HeaderAvatarModal from "./modals/HeaderAvatarModal";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);

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
            Authorization: `Bearer ${access}`,
          },
        });
        setUser(res.data);
        console.log('user', user); 
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
      } else if (event.key === "F5") {
        event.preventDefault();
        navigate(ROUTES.AGENTS);
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
    <header className="bg-gray-800 text-gray-800 dark:text-white  dark:border-gray-700 px-4 sm:px-6 lg:px-20 py-3 print:hidden z-50 ">
      {/* header links for large screens */}
      <LargeScreenLinks
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        ROUTES={ROUTES}
        t={t}
        logout={logout}
        setDarkMode={setDarkMode}
        darkMode={darkMode}
        i18n={i18n}
        user={user}
        setShowAvatarModal={setShowAvatarModal}
      />

      {/* header links for mobile screens */}
      <MobileScreenLinks
        isMenuOpen={isMenuOpen}
        ROUTES={ROUTES}
        setIsMenuOpen={setIsMenuOpen}
        t={t}
        logout={logout}
        i18n={i18n}
        setDarkMode={setDarkMode}
        darkMode={darkMode}
        user={user}
        setShowAvatarModal={setShowAvatarModal}
      />

      {/* show avatar modal */}
      <HeaderAvatarModal
        showAvatarModal={showAvatarModal}
        setShowAvatarModal={setShowAvatarModal}
        user={user}
      />
    </header>
  );
};

export default Header;
