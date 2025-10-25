import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { fetchEvents, createEvent, registerEvent } from '@/services/api';

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tech Talk 2024",
      date: "March 25, 2024",
      time: "2:00 PM",
      location: "Auditorium A",
      attendees: 150,
      category: "Technology",
      color: "primary"
    },
    {
      id: 2,
      title: "Cultural Fest",
      date: "March 28, 2024",
      time: "10:00 AM",
      location: "Main Ground",
      attendees: 500,
      category: "Cultural",
      color: "creative"
    },
    {
      id: 3,
      title: "Sports Day",
      date: "March 30, 2024",
      time: "8:00 AM",
      location: "Sports Complex",
      attendees: 300,
      category: "Sports",
      color: "success"
    },
    {
      id: 4,
      title: "Career Fair",
      date: "April 2, 2024",
      time: "9:00 AM",
      location: "Convention Center",
      attendees: 200,
      category: "Career",
      color: "secondary"
    }
  ]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // create event form state
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", location: "", attendees: "0", category: "Technology", color: "primary", description: "" });

  const resetNewEvent = () => setNewEvent({ title: "", date: "", time: "", location: "", attendees: "0", category: "Technology", color: "primary", description: "" });

  useEffect(() => {
    fetchEvents().then(setEvents).catch(err => console.error(err));
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const created = await createEvent(newEvent);
    setEvents((s) => [created, ...s]);
    toast.success("Event created");
    resetNewEvent();
  };

  const openDetails = (evt: any) => {
    setSelectedEvent(evt);
  };

  const closeDetails = () => setSelectedEvent(null);

  const registerForEvent = async (evtId: number) => {
    try {
      const updated = await registerEvent(evtId);
      // updated may have _id or id depending on backend; normalize by matching both
      setEvents((prev) => prev.map((ev) => {
  const evId = ev.id || (ev as any)._id;
        const updatedId = (updated.id || updated._id);
        if (String(evId) === String(updatedId)) return { ...ev, attendees: updated.attendees };
        return ev;
      }));
      toast.success("Registered for the event");
    } catch (err) {
      // optimistic update fallback
      setEvents((prev) => prev.map((ev) => ev.id === evtId ? { ...ev, attendees: (ev.attendees || 0) + 1 } : ev));
      toast.success("Registered (offline)");
    }
  };

  const categories = useMemo(() => ["All", "Technology", "Cultural", "Sports", "Career"], []);

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
            <h1 className="text-2xl font-bold">Campus Events</h1>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent hover:shadow-glow-accent transition-all">
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
                <DialogDescription>Add a new campus event</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Date</Label>
                    <Input value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="submit" className="bg-gradient-card">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Featured Event */}
        <Card className="mb-8 bg-gradient-hero text-primary-foreground overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <CardHeader className="relative z-10">
            <Badge className="w-fit bg-secondary mb-2">Featured Event</Badge>
            <CardTitle className="text-3xl">Tech Talk 2024</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join us for an inspiring session with industry leaders
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>March 25, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>2:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Auditorium A</span>
              </div>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90">
              Register Now
            </Button>
          </CardContent>
        </Card>

        {/* Event Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["All", "Technology", "Cultural", "Sports", "Career"].map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className={category === "All" ? "bg-gradient-card" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card 
              key={event.id}
              className="hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardHeader>
                <div className={`inline-block px-3 py-1 rounded-full text-sm mb-2 bg-${event.color}/10 text-${event.color}`}>
                  {event.category}
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} attending</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 mt-4 group-hover:bg-primary/10" onClick={() => openDetails(event)}>
                    View Details
                  </Button>
                  <Button variant="ghost" className="mt-4" onClick={() => registerForEvent(event.id)}>Register</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Details Dialog (controlled) */}
        <Dialog open={!!selectedEvent} onOpenChange={(open) => { if (!open) closeDetails(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription>{selectedEvent?.description}</DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> {selectedEvent.date}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /> {selectedEvent.time}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> {selectedEvent.location}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /> {selectedEvent.attendees} attending</div>
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => { registerForEvent(selectedEvent.id); }} className="bg-secondary">Register</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Events;

