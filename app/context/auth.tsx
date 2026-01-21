"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useLayoutEffect,
} from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import Image from "next/image";

//types
interface User {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  status: string;
  userType: "Client" | "Employee";
  role: "Admin" | "Moderator" | "Viewer";
  employeeId: string;
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  loading: boolean;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const defaultState: AuthState = {
  user: null,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(defaultState);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { token } = parseCookies();
        if (!token) return;

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/me`,
        );

        setAuth({
          token,
          user: data.user,
        });
      } catch {
        destroyCookie(null, "token");
        setAuth(defaultState);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  //fetch user
  useEffect(() => {
    if (!auth.token || auth.user) return;

    const fetchMe = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/me`,
        );

        setAuth((prev) => ({
          ...prev,
          user: data.user,
        }));
      } catch {
        destroyCookie(null, "token");
        setAuth(defaultState);
        router.replace("/login");
      }
    };

    fetchMe();
  }, [auth.token, auth.user, router]);

  // refresh auth
  const refreshAuth = async () => {
    try {
      const { token } = parseCookies();
      if (!token) return;

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/auth/me`,
      );

      setAuth({
        token,
        user: data.user,
      });
    } catch (err) {
      console.error("Refresh auth failed:", err);
    }
  };

  // sync token to cookie
  useEffect(() => {
    if (!auth.token) return;

    setCookie(null, "token", auth.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }, [auth.token]);

  useLayoutEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      const { token } = parseCookies();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return () => axios.interceptors.request.eject(reqInterceptor);
  }, []);

  useLayoutEffect(() => {
    const resInterceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          destroyCookie(null, "token");
          setAuth(defaultState);
          router.replace("/login");
        }
        return Promise.reject(err);
      },
    );

    return () => axios.interceptors.response.eject(resInterceptor);
  }, [router]);

  // logout
  const logout = () => {
    destroyCookie(null, "token", { path: "/" });
    setAuth(defaultState);
  };

  //loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Image
          src="/logoDark.png"
          alt="Aesthetic Pixel Studio LLC"
          width={150}
          height={150}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, loading, logout, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
