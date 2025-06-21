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
import { ROUTES } from "./routes";
import Harytlar from "./Components/Page/Harytlar";
// import ThemeToggle from "./Components/ThemeToggle";
import { useTranslation } from "react-i18next";
import Employee from "./Components/Page/Employee/Employee";
import Partner from "./Components/Page/Partner/Partner";
import { AuthProvider } from "./AuthContext";
import { useState, useEffect } from "react";
import Agent from "./Components/Page/Agent/Agent";
import SidebarRight from "./Components/Sidebar/SideRight";

function SidebarLeft() {
  const location = useLocation();
  const { t } = useTranslation();

  const [sidebarPosition, setSidebarPosition] = useState(0);

  // Функция для отслеживания прокрутки
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop <= 160) {
        setSidebarPosition(scrollTop);  // Двигаем сайдбар вверх
      } else {
        setSidebarPosition(160);  // Сайдбар остаётся на 200px
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Очистка события при размонтировании компонента
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
    className="hidden lg:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-52 flex-col p-4 bg-gray-900 overflow-y-auto z-20 mt-20"
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
          <li key={to} className="flex justify-between items-center border-b border-gray-600">
            <Link
              to={to}
              className={` ${to === location.pathname ? "text-gray-200 font-bold" : "text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"} `}
            >
              {label}
            </Link>
            <span className="text-xs text-gray-500 select-none">{key}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}



function App() {
  return (
    <div className="flex flex-col  text-gray-800 bg-gray-900 dark:text-gray-100 min-h-screen p-4 text-xs sm:text-sm md:text-base">
      {/* <ThemeToggle /> */}
      <Router>
        <Header />
        <AuthProvider>
          <main className="flex flex-grow gap-4 mt-4 lg:ml-52 lg:mr-48">
            <SidebarLeft />
            <section className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <Routes>
                <Route path={ROUTES.MAIN} element={<ProductList />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.HARYTLAR} element={<Harytlar />} />
                <Route path={ROUTES.EMPLOYEERS} element={<Employee />} />
                <Route path={ROUTES.PARTNERS} element={<Partner />} />
                <Route path={ROUTES.AGENTS} element={ <Agent /> } />
              </Routes>
            </section>
            <SidebarRight />
          </main>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
