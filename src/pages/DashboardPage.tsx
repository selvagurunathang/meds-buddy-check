import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientDashboard from "@/components/PatientDashboard";
import CaretakerDashboard from "@/components/CaretakerDashboard";
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";
import { auth } from "@/lib/supabase";

type UserType = "patient" | "caretaker" | null;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user } = await auth.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          // Get user type from localStorage
          const storedUserType = localStorage.getItem("userType") as UserType;
          if (storedUserType) {
            setUserType(storedUserType);
          } else {
            // If no user type stored, redirect to onboarding
            navigate("/onboarding", { replace: true });
          }
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

  const switchUserType = () => {
    const newType = userType === "patient" ? "caretaker" : "patient";
    setUserType(newType);
    localStorage.setItem("userType", newType);
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

  if (!userType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {userType === "patient" ? "Patient Dashboard" : "Caretaker Dashboard"}
          </h2>
          <p className="text-muted-foreground">
            Welcome to your {userType === "patient" ? "patient" : "caretaker"} view
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={switchUserType}
          className="flex items-center gap-2 hover:bg-accent transition-colors"
        >
          {userType === "patient" ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
          Switch to {userType === "patient" ? "Caretaker" : "Patient"}
        </Button>
      </div>

      {userType === "patient" ? <PatientDashboard /> : <CaretakerDashboard />}
    </div>
  );
};

export default DashboardPage; 