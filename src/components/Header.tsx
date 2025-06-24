import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Auth from "./Auth";
import UserProfile from "./UserProfile";
import { auth } from "@/lib/supabase";

interface HeaderProps {
  onLogin?: () => void;
  onSignup?: () => void;
  showAuth?: boolean;
  user?: any;
  onAuthSuccess?: (user: any) => void;
  forceShowAuth?: boolean;
}

const Header = ({ 
  onLogin, 
  onSignup, 
  showAuth = true, 
  user,
  onAuthSuccess,
  forceShowAuth = false
}: HeaderProps) => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (user: any) => {
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
    setShowAuthModal(false);
    // Navigate to onboarding after successful auth
    navigate("/onboarding", { replace: true });
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
    // Navigate back to home if auth modal is closed
    if (window.location.pathname === "/auth") {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Project Name */}
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/")}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MediCare</h1>
                <p className="text-xs text-muted-foreground -mt-1">Companion</p>
              </div>
            </div>

            {/* Right side - Authentication Buttons or User Profile */}
            {showAuth && (
              <div className="flex items-center gap-3">
                {user ? (
                  <UserProfile user={user} />
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleLogin}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={handleSignup}
                      className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal - Show when forced or when modal is opened */}
      {(showAuthModal || forceShowAuth) && (
        <Auth
          onClose={handleCloseAuth}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

export default Header; 