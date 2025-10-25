import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Feedback = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your feedback!");
  };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Feedback & Suggestions</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Introduction */}
        <Card className="mb-8 bg-gradient-success text-success-foreground">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-8 h-8" />
              <CardTitle className="text-2xl">Your Voice Matters</CardTitle>
            </div>
            <CardDescription className="text-success-foreground/90 text-lg">
              Help us improve your campus experience by sharing your thoughts and suggestions
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Feedback Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              All feedback is anonymous and will be reviewed by the administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academics">Academics</SelectItem>
                    <SelectItem value="facilities">Facilities</SelectItem>
                    <SelectItem value="cafeteria">Cafeteria</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="clubs">Clubs</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts, suggestions, or concerns..."
                  rows={6}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-success hover:shadow-glow transition-all"
              >
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>See what others are saying</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  category: "Cafeteria",
                  text: "The food quality has improved significantly!",
                  likes: 45,
                  time: "2 days ago"
                },
                {
                  category: "Facilities",
                  text: "Need more study spaces in the library",
                  likes: 32,
                  time: "3 days ago"
                },
                {
                  category: "Events",
                  text: "More cultural events would be great",
                  likes: 28,
                  time: "5 days ago"
                }
              ].map((feedback, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-lg border hover:shadow-glow transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-success/10 text-success">
                      {feedback.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{feedback.time}</span>
                  </div>
                  <p className="mb-3">{feedback.text}</p>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    {feedback.likes}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Feedback;
