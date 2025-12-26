import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  phone: string;
  fullName: string;
  position: string;
  isAdmin: boolean;
}

interface ProfilePageProps {
  user: User;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: 'Задач выполнено', value: '145', icon: 'CheckCircle', color: 'text-green-600' },
    { label: 'В работе', value: '8', icon: 'Clock', color: 'text-blue-600' },
    { label: 'Дней в компании', value: '234', icon: 'Calendar', color: 'text-purple-600' },
    { label: 'Эффективность', value: '98%', icon: 'TrendingUp', color: 'text-orange-600' },
  ];

  const achievements = [
    { title: 'Лучший наставник месяца', date: 'Декабрь 2024', icon: 'Award' },
    { title: 'Выполнил 100 задач', date: 'Ноябрь 2024', icon: 'Trophy' },
    { title: 'Отличная посещаемость', date: 'Октябрь 2024', icon: 'Star' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Мой профиль
        </h1>
        <p className="text-muted-foreground mt-2">Ваша личная информация и достижения</p>
      </div>

      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={user.fullName} />
                  ) : (
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg"
                >
                  <Icon name="Camera" size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {user.isAdmin && (
                <Badge className="bg-gradient-to-r from-primary to-secondary">
                  <Icon name="Shield" size={14} className="mr-1" />
                  Администратор
                </Badge>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-lg text-muted-foreground">{user.position}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Phone" size={16} />
                    <span className="font-medium">Телефон</span>
                  </div>
                  <div className="text-base font-medium">{user.phone}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Mail" size={16} />
                    <span className="font-medium">Email</span>
                  </div>
                  <div className="text-base font-medium">
                    {user.fullName.toLowerCase().replace(/\s+/g, '.')}@company.ru
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Briefcase" size={16} />
                    <span className="font-medium">Должность</span>
                  </div>
                  <div className="text-base font-medium">{user.position}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="MapPin" size={16} />
                    <span className="font-medium">Офис</span>
                  </div>
                  <div className="text-base font-medium">Москва, Центр</div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline">
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактировать профиль
                </Button>
                <Button variant="outline">
                  <Icon name="Settings" size={16} className="mr-2" />
                  Настройки
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="BarChart" size={24} className="text-primary" />
            Статистика
          </CardTitle>
          <CardDescription>Ваши показатели эффективности</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-lg bg-muted/30 border-2 border-transparent hover:border-primary/20 transition-all">
                <Icon name={stat.icon as any} size={32} className={`mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Award" size={24} className="text-accent" />
            Достижения
          </CardTitle>
          <CardDescription>Ваши награды и успехи</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/10 hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name={achievement.icon as any} size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" size={24} className="text-secondary" />
            Недавняя активность
          </CardTitle>
          <CardDescription>Последние действия в системе</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Завершил задачу "Провести обучение"', time: '2 часа назад', icon: 'CheckCircle', color: 'text-green-600' },
              { action: 'Обновил график смен', time: '5 часов назад', icon: 'Calendar', color: 'text-blue-600' },
              { action: 'Добавил нового сотрудника', time: 'Вчера', icon: 'UserPlus', color: 'text-purple-600' },
              { action: 'Провел планерку с командой', time: '2 дня назад', icon: 'Users', color: 'text-orange-600' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon name={activity.icon as any} size={16} className={activity.color} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
