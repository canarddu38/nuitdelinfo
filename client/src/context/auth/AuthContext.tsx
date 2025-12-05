import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "../../utils";

interface User {
  token: string;

}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("sended");
        const res = await fetch(`/api/me`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);


  const login = async (username: string, password: string) => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        

        if (res.ok) {
          return (true);
      } 
    } catch (err) {
        console.log("Utilisateur non connecté", err);
      }
    return false;
  };


  const register = async (username: string, password: string) => {
      try {
        const res = await fetch(`/api/register`, {
          method: "POST",
          credentials: "include",
            headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({username: username, password: password})
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.token) {
             setCookie("token", data.token);
             setUser({ token: data.token });
          }
          return (true);
        } else {
          return (false);
        }
    } catch (err) {
        console.log("Utilisateur non connecté", err);
      }
    return false;
  };

  const logout = async () => {
    try {
      // appelle le backend pour invalider la session / cookie httpOnly
      await fetch(`/api/logout`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({token: user?.token}),
        headers: {
            "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.warn("Erreur logout backend", err);
    } finally {
      deleteCookie("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}