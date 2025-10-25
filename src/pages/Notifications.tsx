import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Package, MessageSquare, Users, Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "event" | "lost" | "feedback" | "club";
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Event",
      message: "Tech Talk 2024 starts in 2 hours at Auditorium A",
      time: "Just now",
      type: "event",
      read: false,
    },
    {
      id: 2,
      title: "Lost Item Found",
      message: "Your blue backpack has been found at the library!",
      time: "5 min ago",
      type: "lost",
      read: false,
    },
    {
      id: 3,
      title: "Feedback Response",
      message: "Admin responded to your cafeteria feedback. Check it out!",
      time: "1 hour ago",
      type: "feedback",
      read: false,
    },
    {
      id: 4,
      title: "Club Meeting",
      message: "Coding Club meeting tomorrow at 4 PM in Lab 301",
      time: "2 hours ago",
      type: "club",
      read: true,
    },
    {
      id: 5,
      title: "Event Reminder",
      message: "Cultural Fest registration closes in 3 days",
      time: "1 day ago",
      type: "event",
      read: true,
    },
    {
      id: 6,
      title: "New Club Activity",
      message: "Photography Club is organizing a campus photo walk this weekend",
      time: "2 days ago",
      type: "club",
      read: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="w-5 h-5 text-secondary" />;
      case "lost":
        return <Package className="w-5 h-5 text-primary" />;
      case "feedback":
        return <MessageSquare className="w-5 h-5 text-success" />;
      case "club":
        return <Users className="w-5 h-5 text-creative" />;
      default:
        return null;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    toast.success("Notification deleted");
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          
          {unreadNotifications.length > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No notifications yet
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`hover:shadow-glow transition-all ${
                      !notification.read ? "border-primary/50 bg-muted/30" : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getIcon(notification.type)}
                          <div>
                            <CardTitle className="text-lg">
                              {notification.title}
                            </CardTitle>
                            {!notification.read && (
                              <Badge variant="secondary" className="mt-1">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-2">
                        {notification.message}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="unread">
            <div className="space-y-4">
              {unreadNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No unread notifications
                  </CardContent>
                </Card>
              ) : (
                unreadNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="hover:shadow-glow transition-all border-primary/50 bg-muted/30"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getIcon(notification.type)}
                          <div>
                            <CardTitle className="text-lg">
                              {notification.title}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              New
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-2">
                        {notification.message}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="read">
            <div className="space-y-4">
              {readNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No read notifications
                  </CardContent>
                </Card>
              ) : (
                readNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="hover:shadow-glow transition-all"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getIcon(notification.type)}
                          <CardTitle className="text-lg">
                            {notification.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-2">
                        {notification.message}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Notifications;
