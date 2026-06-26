import { useState } from 'react';
import { Search, Bell, User, Moon, Sun, LogOut, CheckCircle, AlertCircle, Info, MessageSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Header() {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: 'New Persona Created', message: 'Dr. Sarah Johnson was created successfully', time: '2 min ago', read: false },
    { id: 2, type: 'info', title: 'AI Suggestion Ready', message: 'You have 3 new AI suggestions to review', time: '15 min ago', read: false },
    { id: 3, type: 'alert', title: 'Channel Connected', message: 'Gmail channel connected successfully', time: '1 hour ago', read: true },
    { id: 4, type: 'success', title: 'Message Received', message: 'New message from Dr. Smith', time: '2 hours ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <header className="fixed top-0 left-[280px] right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 z-40 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages, personas, channels..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 dark:text-slate-200 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`flex items-start gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-indigo-500/5 border-l-2 border-indigo-400' : ''
                      }`}
                    >
                      <div className="mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-white/10">
                <button className="w-full py-2 text-xs text-gray-400 hover:text-white transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-500" />
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-red-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {user?.full_name || 'Demo User'}
            </p>
            <p className="text-xs text-gray-400">{user?.email || 'demo@uniinbox.ai'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
