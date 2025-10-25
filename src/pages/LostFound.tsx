import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Search, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const LostFound = () => {
  const [items, setItems] = useState([
    { id: 1, title: "Blue Backpack", location: "Library", time: "2 hours ago", type: "lost", color: "primary", description: "Blue bag with laptop inside" },
    { id: 2, title: "Silver Water Bottle", location: "Cafeteria", time: "5 hours ago", type: "found", color: "success", description: "Stainless steel bottle" },
    { id: 3, title: "Black Wallet", location: "Main Building", time: "1 day ago", type: "lost", color: "primary", description: "Contains ID cards" },
    { id: 4, title: "Red Umbrella", location: "Sports Complex", time: "2 days ago", type: "found", color: "success", description: "Red umbrella with wooden handle" }
  ]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // report form state
  const [report, setReport] = useState({ title: "", location: "", description: "", type: "lost" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now();
    const time = "just now";
    const color = report.type === "lost" ? "primary" : "success";
    setItems((s) => [{ id, title: report.title, location: report.location, time, type: report.type, color, description: report.description }, ...s]);
    setReport({ title: "", location: "", description: "", type: "lost" });
    toast.success("Item reported successfully!");
  };

  const openDetails = (item: any) => setSelectedItem(item);
  const closeDetails = () => setSelectedItem(null);

  const markResolved = (id: number) => {
    setItems((s) => s.filter((it) => it.id !== id));
    setSelectedItem(null);
    toast.success("Marked as resolved");
  };

  const claimItem = (id: number) => {
    setItems((s) => s.filter((it) => it.id !== id));
    setSelectedItem(null);
    toast.success("Claim submitted — please check your email for next steps");
  };

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
            <h1 className="text-2xl font-bold">Lost & Found</h1>
          </div>
          
          <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-card hover:shadow-glow transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Report Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Lost or Found Item</DialogTitle>
                  <DialogDescription>Help reunite items with their owners</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-title">Item Name</Label>
                    <Input id="item-title" placeholder="e.g., Blue Backpack" required value={report.title} onChange={(e) => setReport({ ...report, title: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Where was it lost/found?" required value={report.location} onChange={(e) => setReport({ ...report, location: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Add any identifying details..." rows={3} value={report.description} onChange={(e) => setReport({ ...report, description: e.target.value })} />
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" className="flex-1 bg-gradient-card" onClick={() => setReport({ ...report, type: 'lost' })}>
                      Report Lost
                    </Button>
                    <Button type="button" className="flex-1 bg-gradient-success" onClick={() => setReport({ ...report, type: 'found' })}>
                      Report Found
                    </Button>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-gradient-card">Submit</Button>
                  </div>
                </form>
              </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search for lost or found items..." 
              className="pl-10 py-6 text-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-glow transition-all">
            <CardHeader>
              <CardDescription>Total Items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{items.length}</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-glow transition-all">
            <CardHeader>
              <CardDescription>Lost Items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {items.filter(i => i.type === 'lost').length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-glow transition-all">
            <CardHeader>
              <CardDescription>Found Items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">
                {items.filter(i => i.type === 'found').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Items List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className={`inline-block px-3 py-1 rounded-full text-sm mb-2 bg-${item.color}/10 text-${item.color}`}>
                  {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{item.time}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 mt-4" onClick={() => openDetails(item)}>
                    View Details
                  </Button>
                  <Button variant="ghost" className="mt-4" onClick={() => { if (item.type === 'found') claimItem(item.id); else toast("Please contact the finder if available"); }}>
                    {item.type === 'found' ? 'Claim' : 'Info'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Details Dialog (controlled) */}
        <Dialog open={!!selectedItem} onOpenChange={(open) => { if (!open) closeDetails(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedItem?.title}</DialogTitle>
              <DialogDescription>{selectedItem?.type === 'lost' ? 'Lost Item' : 'Found Item'}</DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-3 mt-2">
                <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> {selectedItem.location}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /> {selectedItem.time}</div>
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => markResolved(selectedItem.id)} className="bg-secondary">Mark Resolved</Button>
                  {selectedItem.type === 'found' && <Button onClick={() => claimItem(selectedItem.id)} className="bg-primary">Claim</Button>}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default LostFound;
