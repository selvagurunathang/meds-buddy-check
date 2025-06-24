import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Onboarding from "@/components/Onboarding";
import { auth } from "@/lib/supabase";

type UserType = "patient" | "caretaker" | null;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user } = await auth.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        } else {
          // If no user, redirect to auth
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Error checking user:", error);
        navigate("/auth", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth", { replace: true });
      } else if (session?.user) {
        setCurrentUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleOnboardingComplete = (userType: UserType) => {
    // Store user type in localStorage or database
    localStorage.setItem("userType", userType);
    // Navigate to dashboard
    navigate("/dashboard", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Onboarding onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default OnboardingPage; 