import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Award, TrendingUp } from "lucide-react";

const topSolvers = [
  {
    name: "Alex Chen",
    points: 2450,
    streak: 12,
    solved: 145,
    subject: "Mathematics",
    avatar: "AC",
    rank: 1,
    trend: "+25"
  },
  {
    name: "Priya Sharma",
    points: 2380,
    streak: 8,
    solved: 132,
    subject: "Physics",
    avatar: "PS",
    rank: 2,
    trend: "+18"
  },
  {
    name: "Sam Johnson",
    points: 2290,
    streak: 15,
    solved: 128,
    subject: "Chemistry",
    avatar: "SJ",
    rank: 3,
    trend: "+12"
  },
  {
    name: "Maya Patel",
    points: 2150,
    streak: 6,
    solved: 118,
    subject: "Biology",
    avatar: "MP",
    rank: 4,
    trend: "+8"
  },
  {
    name: "David Kim",
    points: 2050,
    streak: 9,
    solved: 115,
    subject: "Computer Science",
    avatar: "DK",
    rank: 5,
    trend: "+15"
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-orange" />;
    case 2:
      return <Medal className="w-5 h-5 text-muted-foreground" />;
    case 3:
      return <Award className="w-5 h-5 text-orange/70" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  }
};

export const LeaderboardSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topSolvers.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

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

    const section = document.getElementById('leaderboard-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="leaderboard-section" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-coral bg-clip-text text-transparent">Live</span> Leaderboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See who's making the biggest impact in our learning community
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Top 3 Spotlight */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {topSolvers.slice(0, 3).map((solver, index) => (
              <div 
                key={solver.name}
                className={`
                  glass-card p-6 rounded-xl text-center group cursor-pointer
                  transition-all duration-slow transform
                  ${isVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                  }
                  hover:scale-105 hover:shadow-glow
                  ${solver.rank === 1 ? 'ring-2 ring-orange/30' : ''}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative mb-4">
                  <Avatar className="w-16 h-16 mx-auto border-2 border-primary/20">
                    <AvatarFallback className="text-lg font-bold bg-gradient-primary text-primary-foreground">
                      {solver.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2">
                    {getRankIcon(solver.rank)}
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2">{solver.name}</h3>
                <Badge variant="secondary" className="mb-3">
                  {solver.subject}
                </Badge>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points:</span>
                    <span className="font-bold text-primary">{solver.points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Streak:</span>
                    <span className="font-bold text-orange">{solver.streak} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Solved:</span>
                    <span className="font-bold text-mint">{solver.solved}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-mint" />
                  <span className="text-mint font-medium">{solver.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Remaining positions */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-6 text-center">Top Performers</h3>
            <div className="space-y-4">
              {topSolvers.slice(3).map((solver, index) => (
                <div 
                  key={solver.name}
                  className={`
                    flex items-center justify-between p-4 rounded-lg bg-background/50 
                    transition-all duration-normal hover:bg-hover group cursor-pointer
                    ${isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-8'
                    }
                  `}
                  style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(solver.rank)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="text-sm font-bold bg-gradient-primary text-primary-foreground">
                        {solver.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{solver.name}</div>
                      <div className="text-sm text-muted-foreground">{solver.subject}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-primary">{solver.points}</div>
                      <div className="text-muted-foreground">points</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-orange">{solver.streak}</div>
                      <div className="text-muted-foreground">streak</div>
                    </div>
                    <div className="flex items-center gap-1 text-mint">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">{solver.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live updates indicator */}
          <div className="text-center mt-6">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-mint rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Updated live</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};