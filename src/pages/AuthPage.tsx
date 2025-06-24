import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Auth from "@/components/Auth";
import { Heart } from "lucide-react";
import { auth } from "@/lib/supabase";

const AuthPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user } = await auth.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          // If user is already authenticated, redirect to onboarding
          navigate("/onboarding", { replace: true });
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser(session.user);
        navigate("/onboarding", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    navigate("/onboarding", { replace: true });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">MediCare Companion</h1>
          <p className="text-muted-foreground">Loading your health journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header 
        user={currentUser}
        onAuthSuccess={handleAuthSuccess}
      />
      <div className="flex items-center justify-center min-h-screen p-6">
        <Auth
          onClose={() => navigate("/")}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
};

export default AuthPage; 