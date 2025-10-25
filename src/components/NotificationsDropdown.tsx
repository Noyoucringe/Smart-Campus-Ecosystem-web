import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Calendar, Package, MessageSquare, Users, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "event" | "lost" | "feedback" | "club";
  read: boolean;
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Event",
      message: "Tech Talk 2024 starts in 2 hours",
      time: "Just now",
      type: "event",
      read: false,
    },
    {
      id: 2,
      title: "Lost Item Found",
      message: "Your blue backpack has been found!",
      time: "5 min ago",
      type: "lost",
      read: false,
    },
    {
      id: 3,
      title: "Feedback Response",
      message: "Admin responded to your cafeteria feedback",
      time: "1 hour ago",
      type: "feedback",
      read: false,
    },
    {
      id: 4,
      title: "Club Meeting",
      message: "Coding Club meeting tomorrow at 4 PM",
      time: "2 hours ago",
      type: "club",
      read: true,
    },
  ]);

  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        setPermissionGranted(permission === "granted");
        if (permission === "granted") {
          toast.success("Notifications enabled!");
        }
      });
    } else if (Notification.permission === "granted") {
      setPermissionGranted(true);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="w-4 h-4 text-secondary" />;
      case "lost":
        return <Package className="w-4 h-4 text-primary" />;
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-success" />;
      case "club":
        return <Users className="w-4 h-4 text-creative" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const sendTestNotification = () => {
    if (!permissionGranted) {
      toast.error("Please enable notifications first");
      return;
    }

    new Notification("Smart Campus", {
      body: "This is a test notification from your campus app!",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    });

    toast.success("Test notification sent!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <div className="p-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={sendTestNotification}
          >
            Send Test Notification
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
