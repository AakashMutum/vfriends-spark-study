import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import heroIsland from "@/assets/hero-island.png";
import { ChevronDown, Users, BookOpen, Zap } from "lucide-react";

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-6 h-6 bg-mint rounded-full float opacity-60"></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-violet rounded-full float-delayed opacity-60"></div>
        <div className="absolute bottom-40 left-20 w-8 h-8 bg-orange rounded-full float opacity-40"></div>
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-coral rounded-full float-delayed opacity-50"></div>
        <div className="absolute bottom-60 right-1/4 w-5 h-5 bg-primary-glow rounded-full float opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className={`space-y-8 transition-all duration-slow ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Got a <span className="bg-gradient-primary bg-clip-text text-transparent">doubt?</span>
                <br />
                Or want to <span className="bg-gradient-coral bg-clip-text text-transparent">help</span> someone out?
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Join thousands of students in our peer-to-peer learning community. 
                Solve doubts, earn rewards, and build your knowledge together.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="glow" 
                size="xl"
                className="group"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { role: 'asker' } }));
                }}
              >
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Join as Asker
              </Button>
              
              <Button 
                variant="coral" 
                size="xl"
                className="group"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { role: 'solver' } }));
                }}
              >
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Join as Solver
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral">100K+</div>
                <div className="text-sm text-muted-foreground">Doubts Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-mint">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`relative transition-all duration-slow delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              <img 
                src={heroIsland} 
                alt="Students collaborating on floating study island" 
                className="w-full h-auto rounded-xl shadow-lg float"
              />
              
              {/* Floating UI elements */}
              <div className="absolute -top-6 -right-6 glass-card p-4 rounded-lg float-delayed">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange" />
                  <span className="font-semibold">+5 Points!</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-card p-3 rounded-lg float">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-mint rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">3 helpers online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};