import { useState, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { setupAutoLogout } from "../utility/authWatcher";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export function AuthProvider({ children, navigate }) {
  const [user, setUser] = useState(null);
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser && storedUser !== "undefined") {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setUser(JSON.parse(storedUser));
          logoutTimerRef.current = setupAutoLogout(token, handleTokenExpire);
        } else {
          handleTokenExpire();
        }
      } catch (err) {
        console.error("Token decode failed", err);
        handleTokenExpire();
      }
    }
  }, []);

  const handleTokenExpire = () => {
    toast.info("Session expired. You have been logged out.");
    logout();
    if (navigate) navigate("/login");
  };

  const login = (userData) => {
    if (!userData) return;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    const token = localStorage.getItem("access_token");
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (token) {
      logoutTimerRef.current = setupAutoLogout(token, handleTokenExpire);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
