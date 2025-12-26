import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface User {
  phone: string;
  fullName: string;
  position: string;
}

interface MainLayoutProps {
  user: User;
  onLogout: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  { id: 1, title: 'Новый участник команды', message: 'Анна Смирнова присоединилась к проекту', time: '5 мин назад', type: 'success', isRead: false },
  { id: 2, title: 'Обновление задачи', message: 'Задача "Анализ данных" перешла в статус "В работе"', time: '1 час назад', type: 'info', isRead: false },
  { id: 3, title: 'Напоминание', message: 'Запланирована встреча команды на 15:00', time: '2 часа назад', type: 'warning', isRead: true },
];

const teamMembers = [
  { id: 1, name: 'Анна Смирнова', role: 'Разработчик', status: 'online', tasks: 12 },
  { id: 2, name: 'Дмитрий Козлов', role: 'Дизайнер', status: 'online', tasks: 8 },
  { id: 3, name: 'Елена Волкова', role: 'Аналитик', status: 'offline', tasks: 15 },
  { id: 4, name: 'Михаил Соколов', role: 'Тестировщик', status: 'online', tasks: 10 },
];

export default function MainLayout({ user, onLogout }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'team'>('home');
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Добро пожаловать, {user.fullName.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground mt-2">Управляйте командой и отслеживайте прогресс</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Активных задач</CardTitle>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="CheckCircle" className="text-primary" size={20} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">24</div>
                  <p className="text-sm text-muted-foreground mt-1">+3 за неделю</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Участников</CardTitle>
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Icon name="Users" className="text-secondary" size={20} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">{teamMembers.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">3 онлайн</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Завершено</CardTitle>
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon name="TrendingUp" className="text-accent" size={20} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">142</div>
                  <p className="text-sm text-muted-foreground mt-1">+12 за неделю</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Последняя активность</CardTitle>
                <CardDescription>События и обновления по проектам</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notif.type === 'success' ? 'bg-green-100' : 
                      notif.type === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <Icon 
                        name={notif.type === 'success' ? 'CheckCircle' : notif.type === 'warning' ? 'AlertCircle' : 'Info'} 
                        className={notif.type === 'success' ? 'text-green-600' : notif.type === 'warning' ? 'text-orange-600' : 'text-blue-600'}
                        size={20}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{notif.title}</h4>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                      <span className="text-xs text-muted-foreground mt-1 inline-block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Профиль
            </h1>
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                    <CardDescription className="text-base mt-1">{user.position}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Icon name="Phone" size={16} />
                      Телефон
                    </Label>
                    <div className="text-lg font-medium">{user.phone}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Icon name="Briefcase" size={16} />
                      Должность
                    </Label>
                    <div className="text-lg font-medium">{user.position}</div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Статистика</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-primary">45</div>
                      <div className="text-sm text-muted-foreground">Задач выполнено</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-secondary">12</div>
                      <div className="text-sm text-muted-foreground">В работе</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-accent">98%</div>
                      <div className="text-sm text-muted-foreground">Эффективность</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Команда
              </h1>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Icon name="UserPlus" size={18} className="mr-2" />
                Добавить участника
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="border-2 hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 border-2 border-primary/20">
                        <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary to-secondary text-white">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{member.name}</h3>
                          {member.status === 'online' && (
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{member.role}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="secondary" className="gap-1">
                            <Icon name="ListTodo" size={12} />
                            {member.tasks} задач
                          </Badge>
                          <Badge variant={member.status === 'online' ? 'default' : 'outline'}>
                            {member.status === 'online' ? 'Онлайн' : 'Оффлайн'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Sparkles" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Корпоративная платформа
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="Bell" size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    Уведомления
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        Прочитать все
                      </Button>
                    )}
                  </SheetTitle>
                  <SheetDescription>
                    У вас {unreadCount} непрочитанных уведомлений
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 rounded-lg border-2 transition-all ${
                        notif.isRead ? 'bg-background' : 'bg-muted/50 border-primary/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notif.type === 'success' ? 'bg-green-100' : 
                          notif.type === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                          <Icon 
                            name={notif.type === 'success' ? 'CheckCircle' : notif.type === 'warning' ? 'AlertCircle' : 'Info'} 
                            className={notif.type === 'success' ? 'text-green-600' : notif.type === 'warning' ? 'text-orange-600' : 'text-blue-600'}
                            size={16}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">{notif.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                          <span className="text-xs text-muted-foreground mt-2 inline-block">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" onClick={onLogout}>
              <Icon name="LogOut" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container px-4">
          <div className="flex gap-1">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              className={`rounded-none border-b-2 ${
                activeTab === 'home' ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('home')}
            >
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              className={`rounded-none border-b-2 ${
                activeTab === 'profile' ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </Button>
            <Button
              variant={activeTab === 'team' ? 'default' : 'ghost'}
              className={`rounded-none border-b-2 ${
                activeTab === 'team' ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('team')}
            >
              <Icon name="Users" size={18} className="mr-2" />
              Команда
            </Button>
          </div>
        </div>
      </nav>

      <main className="container px-4 py-8 animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-medium text-muted-foreground ${className || ''}`}>{children}</div>;
}
