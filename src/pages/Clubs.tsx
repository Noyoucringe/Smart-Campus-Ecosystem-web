import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { fetchClubs, createClub, joinClub, leaveClub } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Clubs = () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClub, setNewClub] = useState({ name: '', description: '', category: '', color: 'primary', nextMeeting: '' });

  useEffect(() => {
    setLoading(true);
    fetchClubs().then((data) => {
      setClubs(data);
    }).catch((err) => {
      console.error('Failed to load clubs', err);
      toast.error('Failed to load clubs');
    }).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createClub(newClub);
      setClubs((s) => [created, ...s]);
      toast.success('Club created');
      setNewClub({ name: '', description: '', category: '', color: 'primary', nextMeeting: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to create club');
    }
  };

  const { user } = useAuth();

  const handleJoin = async (clubId: any) => {
    try {
      const res = await joinClub(clubId);
      // update local list
      const updated = res.club || res;
      setClubs((prev) => prev.map((c) => (String(c.id || c._id) === String(updated.id || updated._id) ? updated : c)));
      toast.success('Joined club');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to join');
    }
  };
  
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const toggleMembership = async (clubId: any, isMember: boolean) => {
    const key = String(clubId);
    setLoadingMap((s) => ({ ...s, [key]: true }));
    try {
      const res = isMember ? await leaveClub(clubId) : await joinClub(clubId);
      const updated = res.club || res;
      setClubs((prev) => prev.map((c) => (String(c.id || c._id) === String(updated.id || updated._id) ? updated : c)));
      toast.success(isMember ? 'Left club' : 'Joined club');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || (isMember ? 'Failed to leave' : 'Failed to join'));
    } finally {
      setLoadingMap((s) => ({ ...s, [key]: false }));
    }
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
            <h1 className="text-2xl font-bold">Student Clubs</h1>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-creative hover:shadow-glow transition-all">Create Club</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Club</DialogTitle>
                <DialogDescription>Create a new student club</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={newClub.name} onChange={(e) => setNewClub({ ...newClub, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={newClub.category} onChange={(e) => setNewClub({ ...newClub, category: e.target.value })} />
                </div>
                <div>
                  <Label>Next Meeting</Label>
                  <Input value={newClub.nextMeeting} onChange={(e) => setNewClub({ ...newClub, nextMeeting: e.target.value })} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={newClub.description} onChange={(e) => setNewClub({ ...newClub, description: e.target.value })} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="submit" className="bg-gradient-creative">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-creative text-creative-foreground overflow-hidden relative">
          <div className="absolute right-0 bottom-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8" />
              <CardTitle className="text-3xl">Join a Community</CardTitle>
            </div>
            <CardDescription className="text-creative-foreground/90 text-lg">
              Discover clubs that match your interests and make lasting connections
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold mb-1">{clubs.length}</p>
                <p className="text-creative-foreground/80">Active Clubs</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-1">
                  {clubs.reduce((sum, club) => sum + (club.membersCount ?? (club.members ? club.members.length : 0)), 0)}
                </p>
                <p className="text-creative-foreground/80">Total Members</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-1">15+</p>
                <p className="text-creative-foreground/80">Events/Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["All", "Technology", "Arts", "Social", "Sports"].map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className={category === "All" ? "bg-gradient-card" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Clubs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const currentUserId = user?._id || user?.id || user?.sub || user?.googleId || (user && user.email);
            const members = club.members ?? [];
            const isMember = !!(members && currentUserId && members.map(String).includes(String(currentUserId)));
            return (
            <Card 
              key={club.id || club._id}
              className="hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`bg-${club.color}/10 text-${club.color} hover:bg-${club.color}/20`}>
                    {club.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{club.membersCount ?? (club.members ? club.members.length : 0)}</span>
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {club.name}
                </CardTitle>
                <CardDescription>{club.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Next meeting: {club.nextMeeting}</span>
                </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 group-hover:bg-primary/10">Learn More</Button>
                    <Button
                      className={`flex-1 bg-gradient-${club.color}`}
                      onClick={() => toggleMembership(club.id || club._id, isMember)}
                      disabled={isMember && loadingMap[String(club.id || club._id)] === false ? false : !!loadingMap[String(club.id || club._id)]}
                    >
                      {loadingMap[String(club.id || club._id)] ? (isMember ? 'Leaving...' : 'Joining...') : (isMember ? 'Joined' : 'Join Club')}
                    </Button>
                  </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Achievement Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-secondary" />
              <CardTitle>Club Achievements</CardTitle>
            </div>
            <CardDescription>Recent accomplishments from our clubs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { club: "Coding Club", achievement: "Won Inter-University Hackathon" },
                { club: "Photography Club", achievement: "Featured in National Exhibition" },
                { club: "Robotics Club", achievement: "1st Place in Regional Competition" }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <div>
                    <p className="font-medium">{item.club}</p>
                    <p className="text-sm text-muted-foreground">{item.achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Clubs;
