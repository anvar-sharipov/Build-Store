import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { LiaRegistered } from "react-icons/lia";
import { Link } from "react-router-dom";
import { IoLogInOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import LanguageSwitcher from "../../LanguageSwitcher";

const LargeScreenLinks = ({
  setIsMenuOpen,
  isMenuOpen,
  ROUTES,
  t,
  logout,
  setDarkMode,
  darkMode,
  i18n,
  user,
  setShowAvatarModal,
}) => {
  return (
    <nav className="flex items-center justify-between">
      {/* Logo */}
    
        <img src="public/polisem.png" alt="polisem-icon" width={200} />
    

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
              className="w-8 h-8 rounded-full object-cover border border-gray-400 cursor-pointer"
              onClick={() => setShowAvatarModal(true)}
            />
            <span className="text-gray-400">{user.username}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LargeScreenLinks;
