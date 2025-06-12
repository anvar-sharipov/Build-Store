// context/AuthContext.js
import { createContext, useEffect, useState } from "react";
import myAxios from "./Components/axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authGroup, setAuthGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    myAxios
      .get("userinfo/")
      .then((res) => {
        setAuthUser(res.data.authUser);
        setAuthGroup(res.data.authGroup);
        // console.log("resss", res.data.authUser);
        // console.log("resss", res.data.authGroup);
        
        // console.log("authUserg", authUser);
        // console.log("authGroupg", authGroup);
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  useEffect(() => {
  console.log("authUser обновлён:", authUser);
  console.log("authGroup обновлён:", authGroup);
}, [authUser, authGroup]);

  return (
    <AuthContext.Provider value={{ authUser, authGroup }}>
      {children}
    </AuthContext.Provider>
  );
};
