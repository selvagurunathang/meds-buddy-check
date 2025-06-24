import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  LogOut, 
  Settings, 
  Activity,
  ChevronDown,
  Circle
} from "lucide-react";
import { auth } from "@/lib/supabase";

interface UserProfileProps {
  user: any;
}

const UserProfile = ({ user }: UserProfileProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await auth.signOut();
      localStorage.removeItem("userType");
      window.location.href = "/";
    } catch (error) {
      alert("Logout failed. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    // TODO: Navigate to profile page when implemented
    console.log("Profile clicked");
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    // TODO: Navigate to settings page when implemented
    console.log("Settings clicked");
    setIsOpen(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = (email: string) => {
    if (!email) return "U";
    const parts = email.split("@")[0];
    return parts.charAt(0).toUpperCase();
  };

  // Get username from email
  const getUsername = (email: string) => {
    if (!email) return "User";
    return email.split("@")[0];
  };

  return (
    <div ref={dropdownRef} className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-accent"
            aria-label="User menu"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar_url} alt={getUsername(user?.email)} />
              <AvatarFallback>{getUserInitials(user?.email)}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline font-medium text-sm">{getUsername(user?.email)}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2">
          <DropdownMenuLabel className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span>{user?.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleProfileClick}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent"
          >
            <Activity className="w-4 h-4 text-gray-600" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleSettingsClick}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent"
          >
            <Settings className="w-4 h-4 text-gray-600" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onMouseDown={handleLogout}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-red-50 text-red-600 hover:text-red-700"
            disabled={loggingOut}
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile; 