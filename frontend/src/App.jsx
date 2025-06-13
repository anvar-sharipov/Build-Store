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

function SidebarLeft() {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <nav className="hidden lg:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-52 flex-col p-4 bg-gray-900 overflow-y-auto z-20 mt-20">
      <ul>
        {[
          { to: ROUTES.MAIN, label: t("main"), key: "F1" },
          { to: ROUTES.HARYTLAR, label: t("towary"), key: "F2" },
          { to: ROUTES.EMPLOYEERS, label: t("employeers"), key: "F3" },
          { to: ROUTES.PARTNERS, label: t("partners"), key: "F4" },
        ].map(({ to, label, key }) => (
          <li key={to} className="flex justify-between items-center">
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

function SidebarRight() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  // Показывать сайдбар только на странице /partners
  if (location.pathname !== ROUTES.PARTNERS) return null;

  const typeFilter = searchParams.get("type") || "all";

  const setFilter = (value) => {
    if (value === "all") {
      searchParams.delete("type");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ type: value });
    }
  };

  const filterOptions = [
    { key: "klient", label: t("klient") },
    { key: "supplier", label: t("supplier") },
    { key: "both", label: t("both") },
    { key: "all", label: t("all") },
  ];

  return (
    <aside className="hidden lg:flex fixed top-16 right-0 h-[calc(100vh-4rem)] w-48 flex-col p-4 bg-gray-00 overflow-y-auto z-20 mt-20">
      <h2 className="font-semibold mb-4 text-gray-300">
        {t("filter")}
      </h2>
      {filterOptions.map((option) => (
        <label
          key={option.key}
          className="flex items-center mb-3 cursor-pointer select-none hover:text-blue-800 text-blue-600 hover:underline"
        >
          <input
            type="radio"
            name="partnerType"
            checked={typeFilter === option.key}
            onChange={() => setFilter(option.key)}
            className="mr-3 accent-blue-600 cursor-pointer"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </aside>
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
            <section className="flex-grow overflow-auto max-h-[calc(100vh-4rem)] flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <Routes>
                <Route path={ROUTES.MAIN} element={<ProductList />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.HARYTLAR} element={<Harytlar />} />
                <Route path={ROUTES.EMPLOYEERS} element={<Employee />} />
                <Route path={ROUTES.PARTNERS} element={<Partner />} />
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
