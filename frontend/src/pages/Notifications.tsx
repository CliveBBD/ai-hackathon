import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft, Bell, Check, Calendar, Star, BookOpen, Briefcase, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import apiService from "../services/api";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

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
      case 'application_status':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'interview_scheduled':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'skill_coaching':
        return <BookOpen className="w-5 h-5 text-purple-500" />;
      case 'new_match':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'project_update':
        return <Bell className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
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

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead(user!._id);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Loading notifications...</h3>
              </CardContent>
            </Card>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">
                  We'll notify you when there are updates on your applications and profile.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification._id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'hover:bg-muted/30'
                }`}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm leading-tight mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3">
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                            <Badge variant={
                              notification.type === 'interview_scheduled' ? 'default' :
                              notification.type === 'application_status' ? 'secondary' :
                              notification.type === 'skill_coaching' ? 'outline' :
                              'outline'
                            } className="text-xs">
                              {notification.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                          {notification.read && (
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="text-center pt-6">
            <p className="text-sm text-muted-foreground">
              Showing {notifications.length} notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
}