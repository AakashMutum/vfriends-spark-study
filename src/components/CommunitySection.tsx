import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Heart, MessageCircle } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Wilson",
    avatar: "SW",
    subject: "Mathematics",
    rating: 5,
    text: "Vfriends helped me understand calculus concepts I was struggling with for weeks. The community is so supportive!",
    helpful: 23,
    verified: true
  },
  {
    name: "Marcus Chen",
    avatar: "MC",
    subject: "Physics",
    rating: 5,
    text: "I love helping other students here. Explaining concepts actually helps me learn better too. Win-win!",
    helpful: 31,
    verified: true
  },
  {
    name: "Aisha Patel",
    avatar: "AP",
    subject: "Chemistry",
    rating: 5,
    text: "The streak system keeps me motivated to help others daily. I've learned so much while teaching!",
    helpful: 18,
    verified: true
  },
  {
    name: "Jake Thompson",
    avatar: "JT",
    subject: "Biology",
    rating: 4,
    text: "Quick responses and detailed explanations. This platform has been a lifesaver during exam prep.",
    helpful: 26,
    verified: true
  }
];

const communityStats = [
  { label: "Active Students", value: "50,000+", icon: "👥" },
  { label: "Doubts Solved Daily", value: "2,500+", icon: "🎯" },
  { label: "Success Rate", value: "95%", icon: "⭐" },
  { label: "Avg Response Time", value: "< 10 min", icon: "⚡" }
];

export const CommunitySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('community-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="community-section" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Join Our <span className="bg-gradient-primary bg-clip-text text-transparent">Community</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thousands of students are already learning, growing, and helping each other succeed
          </p>
        </div>

        {/* Community Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-slow ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {communityStats.map((stat, index) => (
            <div 
              key={stat.label}
              className="glass-card p-6 rounded-xl text-center group hover:scale-105 transition-all duration-normal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Featured Testimonial */}
          <div className={`transition-all duration-slow ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="glass-card p-8 rounded-xl relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                      {testimonials[currentTestimonial].avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{testimonials[currentTestimonial].name}</h4>
                      {testimonials[currentTestimonial].verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonials[currentTestimonial].rating ? 'text-orange fill-current' : 'text-muted-foreground'}`} 
                    />
                  ))}
                </div>
              </div>

              <blockquote className="text-lg leading-relaxed mb-6">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 text-coral" />
                  <span>{testimonials[currentTestimonial].helpful} found this helpful</span>
                </div>
                
                <div className="flex gap-1">
                  {testimonials.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-normal ${
                        index === currentTestimonial ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* More Testimonials Grid */}
          <div className={`space-y-4 transition-all duration-slow delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {testimonials.filter((_, index) => index !== currentTestimonial).slice(0, 3).map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="glass-card p-4 rounded-lg hover:scale-105 transition-all duration-normal cursor-pointer"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-bold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{testimonial.name}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-orange fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{testimonial.subject}</p>
                    <p className="text-sm leading-relaxed">{testimonial.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 rounded-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Join the Community?</h3>
            <p className="text-muted-foreground mb-6">
              Start your learning journey today. Whether you need help or want to help others, 
              there's a place for you in our community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="glow" size="lg" className="group">
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Learning
              </Button>
              <Button variant="glass" size="lg" className="group">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Become a Helper
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Join 50,000+ students already in our community
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};