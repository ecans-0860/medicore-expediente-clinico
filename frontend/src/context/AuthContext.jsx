import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuario")) || null
  );

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (usuarioData, tokenData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));

    setUsuario(usuarioData);
    setToken(tokenData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setUsuario(null);
    setToken(null);
  };

  const estaAutenticado = !!token && !!usuario;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        estaAutenticado,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);