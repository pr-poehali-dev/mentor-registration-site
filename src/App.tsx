import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthPage from "./components/AuthPage";
import MainLayout from "./components/MainLayout";
import { storage, User } from "./utils/storage";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      storage.setUserOnline(currentUser.id, true);
      setUser(currentUser);
    }

    return () => {
      if (user) {
        storage.setUserOnline(user.id, false);
      }
    };
  }, []);

  const handleLogin = (userData: { phone: string; fullName: string; position: string; isAdmin: boolean; email?: string; office?: string }) => {
    let loggedUser: User | undefined;
    
    if (userData.phone === 'admin' && userData.isAdmin) {
      loggedUser = {
        id: 'admin',
        phone: 'admin',
        fullName: 'Администратор',
        position: 'Администратор',
        email: 'admin@company.ru',
        office: 'Главный офис',
        isAdmin: true,
        isOnline: true,
        avatarUrl: null,
        lastSeen: new Date().toISOString(),
      };
    } else {
      loggedUser = storage.getUserByPhone(userData.phone);
      
      if (!loggedUser) {
        loggedUser = storage.addUser({
          phone: userData.phone,
          fullName: userData.fullName,
          position: userData.position,
          email: userData.email || `${userData.fullName.toLowerCase().replace(/\s+/g, '.')}@company.ru`,
          office: userData.office || 'Москва, Центр',
          isAdmin: userData.isAdmin,
        });
      } else {
        storage.setUserOnline(loggedUser.id, true);
      }
    }
    
    storage.setCurrentUser(loggedUser);
    setUser(loggedUser);
  };

  const handleLogout = () => {
    if (user) {
      storage.setUserOnline(user.id, false);
      storage.setCurrentUser(null);
    }
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!user ? (
          <AuthPage onLogin={handleLogin} />
        ) : (
          <MainLayout user={user} onLogout={handleLogout} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;