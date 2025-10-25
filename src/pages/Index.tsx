import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";
import campusHero from "@/assets/campus-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
        
        {/* Hero Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${campusHero})` }}
        />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-hero rounded-full shadow-glow animate-bounce" style={{ animationDuration: '3s' }}>
              <GraduationCap className="w-16 h-16 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Smart Campus Ecosystem
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-foreground max-w-3xl mx-auto">
            Your unified digital hub for campus life at KLH University. Connect, collaborate, and thrive.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-card hover:shadow-glow transition-all duration-300 group px-8">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-2 border-primary hover:bg-primary/10 px-8">
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need in One Place
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Lost & Found", desc: "Reunite with your belongings", color: "primary" },
              { title: "Events", desc: "Stay updated on campus activities", color: "secondary" },
              { title: "Feedback", desc: "Voice your opinions", color: "success" },
              { title: "Clubs", desc: "Join student organizations", color: "creative" }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group p-6 rounded-xl bg-card border border-border hover:shadow-glow transition-all duration-300 hover:-translate-y-2"
              >
                <h3 className={`text-2xl font-semibold mb-3 text-${feature.color}`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
