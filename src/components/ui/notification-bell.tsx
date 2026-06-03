"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/app/admin/actions";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data || []);
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up a simple polling interval to check for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = async (notif: any) => {
    if (!notif.is_read) {
      await markNotificationAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    }
    setIsOpen(false);
    if (notif.project_id) {
      router.push(`/admin/projects/${notif.project_id}`);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger 
        render={
          <button className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md">
            <Bell className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full transform translate-x-1/4 -translate-y-1/4 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        }
      />
      
      <SheetContent className="w-full sm:max-w-md bg-zinc-950/95 backdrop-blur-2xl border-white/10 p-0 overflow-hidden flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-serif text-white">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs text-cyan-400 hover:text-cyan-300 h-8">
                <Check className="w-4 h-4 mr-1" /> Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                  notif.is_read 
                    ? 'bg-white/5 border-transparent hover:bg-white/10' 
                    : 'bg-cyan-950/30 border-cyan-500/30 hover:bg-cyan-900/40'
                }`}
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.is_read ? 'bg-transparent' : 'bg-cyan-400'}`} />
                <div>
                  <p className={`text-sm ${notif.is_read ? 'text-zinc-300' : 'text-white font-medium'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
