import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import ProductList from "./Components/Page/Faktura";
import Register from "./Components/Register";
import Login from "./Components/Login";
import "./index.css";
import Header from "./Components/Header/Header";
import { ROUTES, ROUTES_RAPORT } from "./routes";
import Harytlar from "./Components/Page/Product/Product";
// import ThemeToggle from "./Components/ThemeToggle";
import { useTranslation } from "react-i18next";
import Employee from "./Components/Page/Employee/Employee";
import Partner from "./Components/Page/Partner/Partner";
import { AuthProvider } from "./AuthContext";
import { useState, useEffect, useRef } from "react";
import Agent from "./Components/Page/Agent/Agent";
import SidebarRight from "./Components/Sidebar/right/SideRight";
import { SearchProvider } from "./Components/context/SearchContext.jsx";
import PriceChangeReport from "./Components/Page/Reports/PriceChangeReport/PriceChangeReport.jsx";

function SidebarLeft() {
  const location = useLocation();
  const { t } = useTranslation();
  const [isOpen1, setIsOpen1] = useState(false);
  const popupRef = useRef(null);

  const [sidebarPosition, setSidebarPosition] = useState(0);

  // Функция для отслеживания прокрутки
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop <= 160) {
        setSidebarPosition(scrollTop); // Двигаем сайдбар вверх
      } else {
        setSidebarPosition(160); // Сайдбар остаётся на 200px
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Очистка события при размонтировании компонента
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen1(false); // <-- закрываем меню
      }
    }

    if (isOpen1) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen1]);

  return (
    <nav
      className="hidden lg:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-52 flex-col p-4 bg-gray-900 overflow-y-auto z-20 mt-20 print:hidden"
      // className="hidden lg:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-52 flex-col p-4 bg-gray-900 overflow-y-auto z-20 mt-20"
      style={{ top: `${80 - sidebarPosition}px` }} // Двигаем сайдбар в зависимости от прокрутки
    >
      <ul>
        {[
          { to: ROUTES.MAIN, label: t("main"), key: "F1" },
          { to: ROUTES.HARYTLAR, label: t("towary"), key: "F2" },
          { to: ROUTES.EMPLOYEERS, label: t("employeers"), key: "F3" },
          { to: ROUTES.PARTNERS, label: t("partners"), key: "F4" },
          { to: ROUTES.AGENTS, label: t("agents"), key: "F5" },
        ].map(({ to, label, key }) => (
          <li
            key={to}
            className="flex justify-between items-center border-b border-gray-600"
          >
            <Link
              to={to}
              className={` ${
                to === location.pathname
                  ? "text-gray-200 font-bold"
                  : "text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              } `}
            >
              {label}
            </Link>
            <span className="text-xs text-gray-500 select-none">{key}</span>
          </li>
        ))}
      </ul>

      {/* otchety */}
      <div className="relative inline-block text-left" ref={popupRef}>
        {/* Кнопка открытия попапа */}
        <button
          onClick={() => setIsOpen1(!isOpen1)}
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
        >
          {t("reports")}
        </button>

        {/* Само всплывающее окно */}
        {isOpen1 && (
          <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
            <ul>
              {[
                {
                  to: ROUTES_RAPORT.PRICE_CHANGE_REPORT,
                  label: t("PRICE_CHANGE_REPORT"),
                  key: "F6",
                },
              ].map(({ to, label, key }) => (
                <li
                  key={to}
                  className="flex justify-between items-center border-b border-gray-600 px-4 py-2 last:border-b-0"
                >
                  <Link
                    to={to}
                    className={`${
                      to === location.pathname
                        ? "text-gray-200 font-bold"
                        : "text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
                    }`}
                    onClick={() => setIsOpen1(false)} // закрыть меню при клике
                  >
                    {label}
                  </Link>
                  <span className="text-xs text-gray-500 select-none">
                    {key}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="flex flex-col  text-gray-800 bg-gray-900 dark:text-gray-100 min-h-screen p-4 text-xs sm:text-sm md:text-base print:min-h-0">
      {/* <ThemeToggle /> */}
      <Router>
        <Header />
        <AuthProvider>
          <SearchProvider>
            <main className="flex flex-grow gap-4 mt-4 lg:ml-52 lg:mr-72 print:w-full print:block print:mr-4 print:ml-4">
              <SidebarLeft />
              <section className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <Routes>
                  <Route path={ROUTES.MAIN} element={<ProductList />} />
                  <Route path={ROUTES.REGISTER} element={<Register />} />
                  <Route path={ROUTES.LOGIN} element={<Login />} />
                  <Route path={ROUTES.HARYTLAR} element={<Harytlar />} />
                  <Route path={ROUTES.EMPLOYEERS} element={<Employee />} />
                  <Route path={ROUTES.PARTNERS} element={<Partner />} />
                  <Route path={ROUTES.AGENTS} element={<Agent />} />
                  <Route
                    path={ROUTES_RAPORT.PRICE_CHANGE_REPORT}
                    element={<PriceChangeReport />}
                  />
                </Routes>
              </section>
              <SidebarRight />
            </main>
          </SearchProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
