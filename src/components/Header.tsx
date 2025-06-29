import { useEffect, useState, memo } from 'react';
import { useAppNavigation } from '../hooks/use-navigate';
import { LogOut, Users, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { checkSession, logout, onAuthStateChange } from '../lib/supabaseService';

interface HeaderProps {
    userType?: 'patient' | 'caretaker';
    switchUserType?: () => void;
    isOnboarded?: boolean;
}

const Header = ({ userType, switchUserType, isOnboarded }: HeaderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { goToLogin } = useAppNavigation();

    useEffect(() => {
        const init = async () => {
            try {
                const session = await checkSession();
                setIsLoggedIn(!!session);
            } catch {
                setIsLoggedIn(false);
            }
        };

        init();

        const subscription = onAuthStateChange((session) => {
            setIsLoggedIn(!!session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false);
            goToLogin();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-border/20 p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">MediCare Companion</h1>
                        <p className="text-sm text-muted-foreground">
                            {userType === "patient" ? "Patient View" : "Caretaker View"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-6">
                    {isOnboarded && switchUserType && (
                        <Button
                            variant="outline"
                            onClick={switchUserType}
                            aria-label="Switch User Type"
                            className="flex items-center gap-2 hover:bg-accent transition-colors"
                        >
                            {userType === "patient" ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            Switch to {userType === "patient" ? "Caretaker" : "Patient"}
                        </Button>
                    )}
                    {isLoggedIn && (
                        <Button
                            onClick={handleLogout}
                            title="Logout"
                            aria-label="Logout"
                            variant="outline"
                            className="text-gray-600"
                        >
                            <LogOut className="w-6 h-6" />
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default memo(Header);
