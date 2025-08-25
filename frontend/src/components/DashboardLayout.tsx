import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../hooks/useAuth";
import apiService from "../services/api";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Plus,
  BookOpen,
  Star,
  Brain
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'recruiter' | 'applicant';
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function DashboardLayout({ children, userRole, activeView, onViewChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const data = await apiService.getUnreadNotificationCount(user!._id);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const recruiterNavItems = [
    { icon: LayoutDashboard, label: "Overview", view: "overview" },
    { icon: Briefcase, label: "Projects", view: "projects" },
    { icon: Users, label: "Candidates", view: "candidates" },
    { icon: BarChart3, label: "Analytics", view: "analytics" },
    { icon: Plus, label: "Create Job", view: "create-project" },
    { icon: Bell, label: "Notifications", view: "notifications" },
    { icon: Settings, label: "Profile", view: "recruiter-profile" },
  ];

  const applicantNavItems = [
    { icon: LayoutDashboard, label: "Overview", view: "overview" },
    { icon: Briefcase, label: "Applications", view: "applications" },
    { icon: Star, label: "Job Matches", view: "recommendations" },
    { icon: User, label: "Skills", view: "skills" },
    { icon: BookOpen, label: "Coaching", view: "coaching" },
    { icon: Bell, label: "Notifications", view: "notifications" },
    { icon: Settings, label: "Profile", view: "applicant-profile" },
  ];

  const navItems = userRole === 'recruiter' ? recruiterNavItems : applicantNavItems;

  const isActive = (view: string) => activeView === view;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-800 to-slate-900 backdrop-blur-sm shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">AfroServe</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden text-slate-400 hover:bg-slate-700/50" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.view}
                variant="ghost"
                className={`w-full justify-start text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 ${isActive(item.view) ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:from-blue-500 hover:to-indigo-500' : ''
                  }`}
                onClick={() => {
                  onViewChange(item.view);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-3 border-t border-slate-700/50">
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-all duration-200" onClick={() => navigate('/')}>
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden mr-2 text-slate-700 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {userRole === 'recruiter' ? 'Recruiter Dashboard' : 'My Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-slate-100" onClick={() => onViewChange('notifications')}>
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 px-1 min-w-[1.25rem] h-5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>

            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}