import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Star, Gift, Zap, Trophy, Target } from "lucide-react";

const rewards = [
  {
    level: 1,
    title: "Helper Rookie",
    description: "Solve your first doubt",
    requirement: "1 doubt solved",
    points: 10,
    badge: "🥉",
    color: "text-orange"
  },
  {
    level: 2,
    title: "Knowledge Sharer",
    description: "Keep the streak going",
    requirement: "5 day streak",
    points: 50,
    badge: "🔥",
    color: "text-coral"
  },
  {
    level: 3,
    title: "Study Mentor",
    description: "Become a trusted helper",
    requirement: "25 doubts solved",
    points: 150,
    badge: "⭐",
    color: "text-primary"
  },
  {
    level: 4,
    title: "Academic Hero",
    description: "Master problem solver",
    requirement: "15 day streak",
    points: 300,
    badge: "🏆",
    color: "text-mint"
  }
];

const streakMilestones = [
  { days: 1, reward: "10 points", icon: Flame },
  { days: 3, reward: "Rookie badge", icon: Star },
  { days: 7, reward: "50 bonus points", icon: Gift },
  { days: 15, reward: "Hero badge", icon: Trophy },
  { days: 30, reward: "Legend status", icon: Target }
];

export const StreakRewardsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStreak] = useState(8);
  const [nextMilestone] = useState(15);
  const streakProgress = (currentStreak / nextMilestone) * 100;

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

    const section = document.getElementById('streak-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="streak-section" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-coral bg-clip-text text-transparent">Streaks</span> & 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Rewards</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build consistent learning habits and unlock amazing rewards along the way
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Streak Progress */}
          <div className={`space-y-8 transition-all duration-slow ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="glass-card p-8 rounded-xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Your Current Streak</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Flame className="w-8 h-8 text-orange" />
                  <span className="text-4xl font-bold text-orange">{currentStreak}</span>
                  <span className="text-xl text-muted-foreground">days</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress to next reward</span>
                  <span className="font-semibold">{currentStreak}/{nextMilestone} days</span>
                </div>
                <Progress value={streakProgress} className="h-3" />
                <p className="text-sm text-muted-foreground text-center">
                  {nextMilestone - currentStreak} more days to unlock Hero Badge! 🏆
                </p>
              </div>
            </div>

            {/* Streak Milestones */}
            <div className="glass-card p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-6 text-center">Streak Milestones</h4>
              <div className="space-y-4">
                {streakMilestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  const isCompleted = currentStreak >= milestone.days;
                  const isCurrent = currentStreak < milestone.days && (index === 0 || currentStreak >= streakMilestones[index - 1].days);
                  
                  return (
                    <div 
                      key={milestone.days}
                      className={`
                        flex items-center gap-4 p-4 rounded-lg transition-all duration-normal
                        ${isCompleted 
                          ? 'bg-mint/10 border border-mint/20' 
                          : isCurrent 
                            ? 'bg-primary/10 border border-primary/20 ring-2 ring-primary/30' 
                            : 'bg-background/50 border border-border/50'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${isCompleted 
                          ? 'bg-mint text-white' 
                          : isCurrent 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{milestone.days} days</span>
                          {isCompleted && <Badge variant="secondary" className="text-xs">Unlocked</Badge>}
                          {isCurrent && <Badge className="text-xs bg-primary">Current Goal</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{milestone.reward}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rewards System */}
          <div className={`space-y-6 transition-all duration-slow delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <h3 className="text-2xl font-bold text-center mb-8">Achievement Badges</h3>
            
            {rewards.map((reward, index) => (
              <div 
                key={reward.level}
                className={`
                  glass-card p-6 rounded-xl group cursor-pointer
                  transition-all duration-normal hover:scale-105 hover:shadow-glow
                  ${index === 1 ? 'ring-2 ring-primary/30' : ''}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{reward.badge}</div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {reward.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      {reward.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">
                        {reward.requirement}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-orange" />
                        <span className="font-semibold">{reward.points} pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-sm font-medium ${reward.color}`}>
                      Level {reward.level}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Points info */}
            <div className="glass-card p-6 rounded-xl text-center">
              <h4 className="font-bold mb-2">How Points Work</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Solve a doubt: <span className="text-primary font-semibold">+10 points</span></p>
                <p>• Daily streak: <span className="text-orange font-semibold">+5 points</span></p>
                <p>• Get helpful rating: <span className="text-mint font-semibold">+3 points</span></p>
                <p>• Weekly bonus: <span className="text-coral font-semibold">+50 points</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};