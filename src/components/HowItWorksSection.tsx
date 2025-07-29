import { useState, useEffect, useRef } from "react";
import { MessageCircle, Users, Trophy, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Choose Your Role",
    description: "Join as someone who needs help with doubts, or as a solver ready to help others learn.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    delay: "delay-100"
  },
  {
    icon: Users,
    title: "Connect & Collaborate",
    description: "Get matched with the right people. Ask questions or browse doubts you can solve.",
    color: "text-coral",
    bgColor: "bg-coral/10",
    delay: "delay-200"
  },
  {
    icon: Trophy,
    title: "Solve & Get Rewarded",
    description: "Help others learn and earn points, build streaks, and climb the leaderboard together.",
    color: "text-mint",
    bgColor: "bg-mint/10",
    delay: "delay-300"
  }
];

export const HowItWorksSection = () => {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animation with staggered delays
            setTimeout(() => setVisibleSteps(prev => [true, prev[1], prev[2]]), 100);
            setTimeout(() => setVisibleSteps(prev => [prev[0], true, prev[2]]), 300);
            setTimeout(() => setVisibleSteps(prev => [prev[0], prev[1], true]), 500);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How <span className="bg-gradient-primary bg-clip-text text-transparent">Vfriends</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your learning experience and help others grow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isVisible = visibleSteps[index];
            
            return (
              <div key={index} className="relative">
                <div 
                  className={`
                    glass-card p-8 rounded-xl text-center group cursor-pointer
                    transition-all duration-slow transform
                    ${isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-95'
                    }
                    hover:scale-105 hover:shadow-glow
                  `}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-normal`}>
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2">
                    <ArrowRight className={`w-6 h-6 text-muted-foreground transition-all duration-slow ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="glass-card p-6 rounded-xl inline-block">
            <p className="text-lg font-medium mb-2">Ready to get started?</p>
            <p className="text-muted-foreground">Join thousands of students already learning together</p>
          </div>
        </div>
      </div>
    </section>
  );
};