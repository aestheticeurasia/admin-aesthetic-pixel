'use client';
import { useAuth } from "./context/auth";
import AppDashboard from "./dashboard/page";
import Login from "./login/page";

export default function Home() {
  const {auth, setAuth} = useAuth();
  return (
    <div className="w-full overflow-x-hidden">
     {
      auth?.user?<AppDashboard />:<Login />
     }
    </div>
  );
}
