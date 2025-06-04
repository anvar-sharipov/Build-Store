import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "./UI/MyButton";
import { IoLogInOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { LiaRegistered } from "react-icons/lia";
import {ROUTES} from "../routes"

const Header = () => {
  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location = ROUTES.FAKTURA;
  }

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F1") {
        event.preventDefault();
        navigate(ROUTES.FAKTURA);
      } else if (event.key === "F2") {
        event.preventDefault();
        navigate(ROUTES.HARYTLAR);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <header className="bg-gray-100 text-gray-800 border-b border-gray-300 px-3 py-2">
      <nav className="flex flex-wrap items-center justify-between">
        <div className="flex gap-2 items-center">
          <h1 className="text-xl font-bold text-blue-700">POLISEM</h1>
          <img src="public/POLISEM.png" alt="" width={100} />
          <Link to={ROUTES.FAKTURA}>
            <MyButton variant="Purple">Faktura (F1)</MyButton>
          </Link>
          <Link to={ROUTES.HARYTLAR}>
            <MyButton variant="Blue">Harytlar (F2)</MyButton>
          </Link>
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 mt-2 sm:mt-0 gap-2">
          <Link to={ROUTES.REGISTER}>
            <MyButton className="flex items-center gap-1">
              <LiaRegistered />
              Registrasiya
            </MyButton>
          </Link>

          <Link to={ROUTES.LOGIN}>
            <MyButton className="flex items-center gap-1">
              <IoLogInOutline /> Girmek
            </MyButton>
          </Link>

          <Link to={ROUTES.LOGIN}>
            <MyButton onClick={logout} className="flex items-center gap-1">
              <TbLogout2 />
              Chykmak
            </MyButton>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
