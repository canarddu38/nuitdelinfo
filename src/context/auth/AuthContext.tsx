import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "../../utils";

interface User {
  token: string;
  name?: string;
  campus?: string;
  picture?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch(`https://${import.meta.env.VITE_IPBACKEND}:8080/api/me`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          const tokenFromCookie = getCookie("token") || "";
          if (data && typeof data === "object") {
            setUser({
              token: tokenFromCookie,
              name: (data as any).name,
              campus: (data as any).campus,
              picture: (data as any).picture,
              username: (data as any).username,
            });
          } else {
            deleteCookie("token");
            setUser(null);
          }
        } else {
          const tokenFromCookie = getCookie("token");
          if (tokenFromCookie) deleteCookie("token");
          setUser(null);
        }
      } catch (err) {
        console.log("Utilisateur non connecté", err);
        deleteCookie("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async () => {
    window.location.href=import.meta.env.VITE_AUTH42;
    return false;
  };

  const logout = async () => {
    try {
      // appelle le backend pour invalider la session / cookie httpOnly
      await fetch(`https://${import.meta.env.VITE_IPBACKEND}:/api/logout`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({token: user?.token}),
      });
    } catch (err) {
      console.warn("Erreur logout backend", err);
    } finally {
      deleteCookie("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}