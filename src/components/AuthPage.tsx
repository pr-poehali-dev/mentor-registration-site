import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onLogin: (userData: { phone: string; fullName: string; position: string; isAdmin: boolean }) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isAdmin = phone === 'admin' && password === 'admin';
    
    if (isLogin) {
      onLogin({ 
        phone, 
        fullName: isAdmin ? 'Администратор' : 'Иван Петров', 
        position: isAdmin ? 'Администратор' : 'Наставник', 
        isAdmin 
      });
    } else {
      onLogin({ 
        phone, 
        fullName: fullName || 'Новый сотрудник', 
        position: 'Наставник', 
        isAdmin: false 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(217,70,239,0.1)_0%,transparent_50%)]" />
      
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-card/95 shadow-2xl border-2 animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Icon name="Users" size={32} className="text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isLogin ? 'Вход в систему' : 'Регистрация'}
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin 
              ? 'Введите данные для входа в корпоративную платформу' 
              : 'Создайте аккаунт наставника'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Icon name="Phone" size={16} />
                Номер телефона
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-11 border-2 focus:border-primary transition-colors"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <Icon name="User" size={16} />
                  ФИО
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Иванов Иван Иванович"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-11 border-2 focus:border-primary transition-colors"
                />
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="position" className="flex items-center gap-2">
                  <Icon name="Briefcase" size={16} />
                  Должность
                </Label>
                <Input
                  id="position"
                  type="text"
                  value="Наставник"
                  disabled
                  className="h-11 bg-muted/50 cursor-not-allowed"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Icon name="Lock" size={16} />
                Пароль
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-2 focus:border-primary transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin 
                  ? 'Нет аккаунта? Зарегистрируйтесь' 
                  : 'Уже есть аккаунт? Войдите'}
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">или</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setPhone('admin');
                setPassword('admin');
              }}
            >
              <Icon name="Shield" size={16} className="mr-2" />
              Вход в админ-панель
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}