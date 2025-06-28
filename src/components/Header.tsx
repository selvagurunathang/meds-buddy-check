import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useAppNavigation } from '../hooks/use-navigate';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";

interface HeaderProps {
    userType?: 'patient' | 'caretaker';
    switchUserType?: () => void;
    isOnboarded?: boolean;
}

export default function Header({ userType, switchUserType, isOnboarded }: HeaderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { goToLogin } = useAppNavigation();

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            setIsLoggedIn(!!data.session);
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setIsLoggedIn(false);
            goToLogin();
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
                    {isOnboarded &&
                        <Button
                            variant="outline"
                            onClick={() => { switchUserType() }}
                            className="flex items-center gap-2 hover:bg-accent transition-colors"
                        >
                            {userType === "patient" ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            Switch to {userType === "patient" ? "Caretaker" : "Patient"}
                        </Button>}
                    {isLoggedIn && (
                        <Button
                            onClick={handleLogout}
                            title="Logout"
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
}
