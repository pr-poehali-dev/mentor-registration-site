export interface User {
  id: string;
  phone: string;
  fullName: string;
  position: string;
  email: string;
  office: string;
  isAdmin: boolean;
  isOnline: boolean;
  avatarUrl: string | null;
  lastSeen: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
  posts: GroupPost[];
}

export interface GroupPost {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  isRead: boolean;
}

class StorageManager {
  private readonly USERS_KEY = 'corporate_users';
  private readonly MESSAGES_KEY = 'corporate_messages';
  private readonly GROUPS_KEY = 'corporate_groups';
  private readonly NOTIFICATIONS_KEY = 'corporate_notifications';
  private readonly CURRENT_USER_KEY = 'corporate_current_user';

  getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  addUser(user: Omit<User, 'id' | 'isOnline' | 'lastSeen'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      isOnline: true,
      lastSeen: new Date().toISOString(),
      avatarUrl: null,
      email: user.email || `${user.fullName.toLowerCase().replace(/\s+/g, '.')}@company.ru`,
      office: user.office || 'Москва, Центр',
    };
    users.push(newUser);
    this.saveUsers(users);
    
    this.addNotificationForAll(newUser.id, {
      title: 'Новый сотрудник',
      message: `${newUser.fullName} зарегистрировался в системе`,
      type: 'success',
    });
    
    return newUser;
  }

  updateUser(userId: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  }

  getUserByPhone(phone: string): User | undefined {
    return this.getUsers().find(u => u.phone === phone);
  }

  setUserOnline(userId: string, isOnline: boolean): void {
    this.updateUser(userId, { 
      isOnline, 
      lastSeen: new Date().toISOString() 
    });
  }

  getMessages(): ChatMessage[] {
    const data = localStorage.getItem(this.MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveMessages(messages: ChatMessage[]): void {
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  addMessage(senderId: string, receiverId: string, message: string): ChatMessage {
    const messages = this.getMessages();
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    this.saveMessages(messages);
    return newMessage;
  }

  getMessagesBetween(userId1: string, userId2: string): ChatMessage[] {
    return this.getMessages().filter(
      m => (m.senderId === userId1 && m.receiverId === userId2) ||
           (m.senderId === userId2 && m.receiverId === userId1)
    );
  }

  getChatList(userId: string): string[] {
    const messages = this.getMessages();
    const userIds = new Set<string>();
    messages.forEach(m => {
      if (m.senderId === userId) userIds.add(m.receiverId);
      if (m.receiverId === userId) userIds.add(m.senderId);
    });
    return Array.from(userIds);
  }

  getGroups(): Group[] {
    const data = localStorage.getItem(this.GROUPS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveGroups(groups: Group[]): void {
    localStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
  }

  addGroup(name: string, createdBy: string): Group {
    const groups = this.getGroups();
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      createdBy,
      members: [createdBy],
      posts: [],
    };
    groups.push(newGroup);
    this.saveGroups(groups);
    return newGroup;
  }

  deleteGroup(groupId: string): void {
    const groups = this.getGroups().filter(g => g.id !== groupId);
    this.saveGroups(groups);
  }

  addPostToGroup(groupId: string, authorId: string, content: string): void {
    const groups = this.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const post: GroupPost = {
        id: Date.now().toString(),
        authorId,
        content,
        timestamp: new Date().toISOString(),
      };
      group.posts.unshift(post);
      this.saveGroups(groups);
    }
  }

  getNotifications(userId: string): Notification[] {
    const data = localStorage.getItem(this.NOTIFICATIONS_KEY);
    const allNotifications: Notification[] = data ? JSON.parse(data) : [];
    return allNotifications.filter(n => n.userId === userId);
  }

  saveNotifications(notifications: Notification[]): void {
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }

  addNotification(userId: string, notification: Omit<Notification, 'id' | 'userId' | 'time' | 'isRead'>): void {
    const allNotifications = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_KEY) || '[]');
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      userId,
      time: new Date().toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    allNotifications.push(newNotification);
    this.saveNotifications(allNotifications);
  }

  addNotificationForAll(exceptUserId: string, notification: Omit<Notification, 'id' | 'userId' | 'time' | 'isRead'>): void {
    const users = this.getUsers();
    users.forEach(user => {
      if (user.id !== exceptUserId) {
        this.addNotification(user.id, notification);
      }
    });
  }

  markNotificationAsRead(notificationId: string): void {
    const allNotifications = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_KEY) || '[]');
    const notification = allNotifications.find((n: Notification) => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications(allNotifications);
    }
  }

  markAllNotificationsAsRead(userId: string): void {
    const allNotifications = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_KEY) || '[]');
    allNotifications.forEach((n: Notification) => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    this.saveNotifications(allNotifications);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }
}

export const storage = new StorageManager();
