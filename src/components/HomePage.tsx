import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface Employee {
  id: number;
  fullName: string;
  position: string;
  status: 'online' | 'offline';
}

interface Task {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const employees: Employee[] = [
  { id: 1, fullName: 'Иван Петров', position: 'Наставник', status: 'online' },
  { id: 2, fullName: 'Анна Смирнова', position: 'Разработчик', status: 'online' },
  { id: 3, fullName: 'Дмитрий Козлов', position: 'Дизайнер', status: 'offline' },
  { id: 4, fullName: 'Елена Волкова', position: 'Аналитик', status: 'online' },
  { id: 5, fullName: 'Михаил Соколов', position: 'Тестировщик', status: 'online' },
  { id: 6, fullName: 'Ольга Новикова', position: 'Менеджер', status: 'offline' },
  { id: 7, fullName: 'Сергей Морозов', position: 'Разработчик', status: 'online' },
  { id: 8, fullName: 'Татьяна Павлова', position: 'Дизайнер', status: 'online' },
];

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const currentDayIndex = new Date().getDay() - 1;

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Провести утреннюю планерку с командой', priority: 'high', completed: false },
    { id: 2, title: 'Проверить выполнение задач за вчера', priority: 'high', completed: false },
    { id: 3, title: 'Обновить график смен на следующую неделю', priority: 'medium', completed: false },
    { id: 4, title: 'Провести обучение новых сотрудников', priority: 'medium', completed: false },
    { id: 5, title: 'Подготовить отчет для руководства', priority: 'high', completed: false },
    { id: 6, title: 'Согласовать отпуска на следующий месяц', priority: 'low', completed: false },
  ]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Главная страница
        </h1>
        <p className="text-muted-foreground mt-2">Обзор отдела, график смен и задачи на смену</p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Users" size={24} className="text-primary" />
            Сотрудники отдела
          </CardTitle>
          <CardDescription>Полный список всех сотрудников вашего отдела</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all border-2 border-transparent hover:border-primary/20"
              >
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarFallback className="font-bold bg-gradient-to-br from-primary to-secondary text-white">
                    {getInitials(employee.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{employee.fullName}</h4>
                    {employee.status === 'online' && (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                </div>
                <Badge variant={employee.status === 'online' ? 'default' : 'outline'}>
                  {employee.status === 'online' ? 'Онлайн' : 'Оффлайн'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Calendar" size={24} className="text-secondary" />
            График смен
          </CardTitle>
          <CardDescription>Расписание работы сотрудников на неделю</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-2">
              <div className="text-sm font-semibold text-muted-foreground"></div>
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={`text-center text-sm font-semibold py-2 rounded-lg ${
                    index === currentDayIndex 
                      ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                      : 'bg-muted/30 text-muted-foreground'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {employees.map((employee) => (
              <div key={employee.id} className="grid grid-cols-8 gap-2 items-center">
                <div className="text-sm font-medium truncate pr-2">{employee.fullName}</div>
                {weekDays.map((_, dayIndex) => {
                  const isWorking = (employee.id + dayIndex) % 2 === 0;
                  const isToday = dayIndex === currentDayIndex;
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        isToday 
                          ? isWorking 
                            ? 'bg-primary/20 border-2 border-primary text-primary ring-2 ring-primary/30' 
                            : 'bg-muted border-2 border-primary/50'
                          : isWorking
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-muted/30 text-muted-foreground border border-border'
                      }`}
                    >
                      {isWorking ? (
                        <Icon name="Check" size={18} />
                      ) : (
                        <Icon name="Minus" size={18} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="ListTodo" size={24} className="text-accent" />
              Активные задачи ({activeTasks.length})
            </CardTitle>
            <CardDescription>Задачи на текущую смену</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Все задачи выполнены!</p>
                </div>
              ) : (
                activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all border-2 border-transparent hover:border-primary/20"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1 h-5 w-5"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <div className="mt-2">
                        <Badge 
                          variant={
                            task.priority === 'high' ? 'destructive' : 
                            task.priority === 'medium' ? 'default' : 
                            'secondary'
                          }
                        >
                          {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
              Завершенные задачи ({completedTasks.length})
            </CardTitle>
            <CardDescription>Выполненные задачи за смену</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="ListTodo" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Пока нет завершенных задач</p>
                </div>
              ) : (
                completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border-2 border-green-200"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1 h-5 w-5"
                    />
                    <div className="flex-1">
                      <p className="font-medium line-through text-muted-foreground">{task.title}</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          <Icon name="Check" size={12} className="mr-1" />
                          Завершено
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
