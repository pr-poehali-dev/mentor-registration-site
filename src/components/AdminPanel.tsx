import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Employee {
  id: number;
  fullName: string;
  phone: string;
  position: string;
  isAdmin: boolean;
  isBlocked: boolean;
}

export default function AdminPanel() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, fullName: 'Иван Петров', phone: '+7 (999) 123-45-67', position: 'Наставник', isAdmin: false, isBlocked: false },
    { id: 2, fullName: 'Анна Смирнова', phone: '+7 (999) 234-56-78', position: 'Разработчик', isAdmin: false, isBlocked: false },
    { id: 3, fullName: 'Дмитрий Козлов', phone: '+7 (999) 345-67-89', position: 'Дизайнер', isAdmin: false, isBlocked: false },
    { id: 4, fullName: 'Елена Волкова', phone: '+7 (999) 456-78-90', position: 'Аналитик', isAdmin: false, isBlocked: false },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleAdmin = (id: number) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, isAdmin: !emp.isAdmin } : emp
    ));
  };

  const toggleBlock = (id: number) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, isBlocked: !emp.isBlocked } : emp
    ));
  };

  const changePosition = (id: number, newPosition: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, position: newPosition } : emp
    ));
  };

  const filteredEmployees = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone.includes(searchTerm) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
            <Icon name="Shield" size={36} className="text-primary" />
            Панель администратора
          </h1>
          <p className="text-muted-foreground mt-2">Управление сотрудниками и правами доступа</p>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Поиск сотрудников</CardTitle>
          <CardDescription>Найдите сотрудника по имени, телефону или должности</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Начните вводить имя, телефон или должность..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 border-2"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className={`border-2 transition-all ${employee.isBlocked ? 'opacity-50 border-destructive' : 'hover:shadow-lg'}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary to-secondary text-white">
                    {getInitials(employee.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-semibold">{employee.fullName}</h3>
                      {employee.isAdmin && (
                        <Badge className="bg-gradient-to-r from-primary to-secondary">
                          <Icon name="Shield" size={12} className="mr-1" />
                          Админ
                        </Badge>
                      )}
                      {employee.isBlocked && (
                        <Badge variant="destructive">
                          <Icon name="Ban" size={12} className="mr-1" />
                          Заблокирован
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Phone" size={14} />
                        {employee.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Briefcase" size={14} />
                        {employee.position}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Icon name="Briefcase" size={14} className="mr-2" />
                          Изменить должность
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Изменить должность</DialogTitle>
                          <DialogDescription>
                            Выберите новую должность для {employee.fullName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Должность</Label>
                            <Select 
                              defaultValue={employee.position}
                              onValueChange={(value) => changePosition(employee.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Наставник">Наставник</SelectItem>
                                <SelectItem value="Разработчик">Разработчик</SelectItem>
                                <SelectItem value="Дизайнер">Дизайнер</SelectItem>
                                <SelectItem value="Аналитик">Аналитик</SelectItem>
                                <SelectItem value="Тестировщик">Тестировщик</SelectItem>
                                <SelectItem value="Менеджер">Менеджер</SelectItem>
                                <SelectItem value="Руководитель">Руководитель</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant={employee.isAdmin ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleAdmin(employee.id)}
                    >
                      <Icon name="Shield" size={14} className="mr-2" />
                      {employee.isAdmin ? 'Убрать админа' : 'Выдать админа'}
                    </Button>

                    <Button
                      variant={employee.isBlocked ? "default" : "destructive"}
                      size="sm"
                      onClick={() => toggleBlock(employee.id)}
                    >
                      <Icon name={employee.isBlocked ? "Unlock" : "Ban"} size={14} className="mr-2" />
                      {employee.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Сотрудники не найдены</p>
              <p className="text-sm">Попробуйте изменить условия поиска</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
