import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Users, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { ProfileSheet } from "@/components/ProfileSheet";
import { SearchDialog } from "@/components/SearchDialog";
import lostFoundIcon from "@/assets/lost-found-icon.jpg";
import eventsIcon from "@/assets/events-icon.jpg";
import feedbackIcon from "@/assets/feedback-icon.jpg";
import clubsIcon from "@/assets/clubs-icon.jpg";

const Dashboard = () => {
  const modules = [
    {
      title: "Lost & Found",
      description: "Report or search for lost items",
      icon: Package,
      link: "/lost-found",
      gradient: "gradient-card",
      image: lostFoundIcon
    },
    {
      title: "Events",
      description: "Discover upcoming campus events",
      icon: Calendar,
      link: "/events",
      gradient: "gradient-accent",
      image: eventsIcon
    },
    {
      title: "Feedback",
      description: "Share your thoughts and suggestions",
      icon: MessageSquare,
      link: "/feedback",
      gradient: "gradient-success",
      image: feedbackIcon
    },
    {
      title: "Clubs",
      description: "Explore student organizations",
      icon: Users,
      link: "/clubs",
      gradient: "gradient-creative",
      image: clubsIcon
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-mesh">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Smart Campus
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <SearchDialog />
                <NotificationsDropdown />
                <ProfileSheet />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground text-lg">
            Here's what's happening on campus today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Active Events", value: "12", color: "secondary" },
            { label: "Lost Items", value: "8", color: "primary" },
            { label: "Active Clubs", value: "24", color: "creative" },
            { label: "New Feedback", value: "15", color: "success" }
          ].map((stat, idx) => (
            <Card key={idx} className="hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-3">
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Module Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {modules.map((module, idx) => (
            <Link key={idx} to={module.link}>
              <Card 
                className="group relative overflow-hidden hover:shadow-glow transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full"
              >
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-cover bg-center"
                  style={{ backgroundImage: `url(${module.image})` }}
                />
                
                <div className={`absolute inset-0 bg-${module.gradient} opacity-0 group-hover:opacity-20 transition-opacity`} />
                
                <CardHeader className="relative z-10">
                  <div className={`w-12 h-12 rounded-lg bg-${module.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <module.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{module.title}</CardTitle>
                  <CardDescription className="text-base">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                    Open Module
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from across campus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { text: "New event: Tech Talk 2024", time: "2 hours ago", type: "event" },
                  { text: "Lost item reported: Blue Backpack", time: "5 hours ago", type: "lost" },
                  { text: "Feedback submitted for cafeteria", time: "1 day ago", type: "feedback" },
                  { text: "Coding Club meeting scheduled", time: "2 days ago", type: "club" }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full bg-${
                      activity.type === 'event' ? 'secondary' :
                      activity.type === 'lost' ? 'primary' :
                      activity.type === 'feedback' ? 'success' : 'creative'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{activity.text}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
