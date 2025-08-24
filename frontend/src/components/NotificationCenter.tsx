import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Bell, Check, X, Calendar, Star, BookOpen, Briefcase } from "lucide-react";
import apiService from "../services/api";
import { useToast } from "../hooks/use-toast";

interface Notification {
  _id: string;
  type: 'application_status' | 'interview_scheduled' | 'skill_coaching' | 'new_match' | 'project_update';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

interface NotificationCenterProps {
  userId: string;
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const data = await apiService.getNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await apiService.getUnreadNotificationCount(userId);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead(userId);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_status':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4 text-green-500" />;
      case 'skill_coaching':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'new_match':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'project_update':
        return <Bell className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 px-1 min-w-[1.25rem] h-5">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Notifications</DialogTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification._id} 
                  className={`cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => !notification.read && markAsRead(notification._id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm leading-tight">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}