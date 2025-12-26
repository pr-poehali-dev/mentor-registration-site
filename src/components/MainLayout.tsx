import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import AdminPanel from './AdminPanel';

interface User {
  phone: string;
  fullName: string;
  position: string;
  isAdmin: boolean;
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

interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  time: string;
  isOwn: boolean;
}

interface Group {
  id: number;
  name: string;
  members: number;
  unread: number;
}

const mockNotifications: Notification[] = [
  { id: 1, title: 'Новый участник команды', message: 'Анна Смирнова присоединилась к проекту', time: '5 мин назад', type: 'success', isRead: false },
  { id: 2, title: 'Обновление задачи', message: 'Задача "Анализ данных" перешла в статус "В работе"', time: '1 час назад', type: 'info', isRead: false },
  { id: 3, title: 'Напоминание', message: 'Запланирована встреча команды на 15:00', time: '2 часа назад', type: 'warning', isRead: true },
];

const mockMessages: ChatMessage[] = [
  { id: 1, sender: 'Анна Смирнова', message: 'Привет! Как дела с проектом?', time: '10:30', isOwn: false },
  { id: 2, sender: 'Вы', message: 'Все отлично, задачи выполняются по плану', time: '10:32', isOwn: true },
  { id: 3, sender: 'Дмитрий Козлов', message: 'Нужна помощь с дизайном', time: '11:15', isOwn: false },
];

const mockGroups: Group[] = [
  { id: 1, name: 'Команда разработки', members: 12, unread: 3 },
  { id: 2, name: 'Наставники', members: 5, unread: 0 },
  { id: 3, name: 'Общий чат отдела', members: 25, unread: 7 },
];

export default function MainLayout({ user, onLogout }: MainLayoutProps) {
  const [activeSection, setActiveSection] = useState<'home' | 'profile' | 'admin'>('home');
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'admin':
        return <AdminPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex">
      <aside className="w-20 bg-card border-r flex flex-col items-center py-6 gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
          <Icon name="Sparkles" size={24} className="text-white" />
        </div>

        <Separator />

        <div className="flex flex-col gap-2 flex-1">
          <Button
            variant={activeSection === 'home' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl"
            onClick={() => setActiveSection('home')}
            title="Главная"
          >
            <Icon name="Home" size={20} />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl relative" title="Уведомления">
                <Icon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-96">
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl" title="Чат">
                <Icon name="MessageCircle" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-96">
              <SheetHeader>
                <SheetTitle>Чат</SheetTitle>
                <SheetDescription>Личные сообщения</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 rounded-lg ${
                        msg.isOwn 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                          : 'bg-muted'
                      }`}>
                        {!msg.isOwn && (
                          <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.isOwn ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl" title="Группы">
                <Icon name="Users" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-96">
              <SheetHeader>
                <SheetTitle>Группы</SheetTitle>
                <SheetDescription>Рабочие группы и чаты</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-3">
                {mockGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all border-2 border-transparent hover:border-primary/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Icon name="Users" size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{group.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {group.members} участников
                        </p>
                      </div>
                      {group.unread > 0 && (
                        <Badge className="bg-accent">
                          {group.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant={activeSection === 'profile' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl"
            onClick={() => setActiveSection('profile')}
            title="Профиль"
          >
            <Icon name="User" size={20} />
          </Button>
        </div>

        <Separator />

        {user.isAdmin && (
          <Button
            variant={activeSection === 'admin' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl"
            onClick={() => setActiveSection('admin')}
            title="Админ-панель"
          >
            <Icon name="Shield" size={20} />
          </Button>
        )}

        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl" onClick={onLogout} title="Выход">
          <Icon name="LogOut" size={20} />
        </Button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-card border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarFallback className="font-bold bg-gradient-to-br from-primary to-secondary text-white text-sm">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.position}</p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
