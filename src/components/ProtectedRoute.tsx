import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { checkSession, onAuthStateChange } from "../lib/supabaseService";

const ProtectedRoute = () => {
  
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await checkSession();
      setSession(currentSession);
      setLoading(false);
    };
    fetchSession();

    const subscription = onAuthStateChange((newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return session ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
