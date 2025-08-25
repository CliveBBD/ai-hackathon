import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Bell, Check, Calendar, Star, BookOpen, Briefcase, CheckCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import apiService from "../../services/api";
import { useToast } from "../../hooks/use-toast";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNotifications(user!._id);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_status': return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'interview_scheduled': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'skill_coaching': return <BookOpen className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const diffInHours = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
          <Card 
            key={notification._id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              !notification.read ? 'bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => !notification.read && markAsRead(notification._id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(notification.created_at)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {notification.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}