import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Flame, 
  Star, 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp, 
  BookOpen, 
  HelpCircle,
  LogOut,
  Settings,
  Award
} from "lucide-react";
import { calculateExperienceToNextLevel } from "@/lib/userState";

export const UserDashboard = () => {
  const { state, logout, updateDailyStreak } = useUser();
  const [showBadges, setShowBadges] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (state.currentUser) {
      updateDailyStreak();
    }
  }, [state.currentUser]);

  if (!state.currentUser) {
    return null;
  }

  const user = state.currentUser;
  const experienceToNext = calculateExperienceToNextLevel(user.experience);
  const levelProgress = ((user.experience % 100) / 100) * 100;

  const stats = [
    {
      label: "Total Points",
      value: user.points,
      icon: Zap,
      color: "text-orange",
      bgColor: "bg-orange/10",
    },
    {
      label: "Current Streak",
      value: user.streak,
      icon: Flame,
      color: "text-coral",
      bgColor: "bg-coral/10",
    },
    {
      label: "Level",
      value: user.level,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: user.type === 'solver' ? "Doubts Solved" : "Doubts Asked",
      value: user.type === 'solver' ? user.totalDoubtsSolved : user.totalDoubtsAsked,
      icon: user.type === 'solver' ? BookOpen : HelpCircle,
      color: "text-mint",
      bgColor: "bg-mint/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-primary/20">
              <AvatarFallback className="text-xl font-bold bg-gradient-primary text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant={user.type === 'solver' ? 'default' : 'secondary'}>
                  {user.type === 'solver' ? 'Doubt Solver' : 'Doubt Asker'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Level {user.level}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="glass-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Level Progress */}
          <Card className="glass-card border-0 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Level {user.level}</span>
                <span className="text-sm text-muted-foreground">Level {user.level + 1}</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {user.experience % 100} / 100 XP
                </span>
                <span className="text-primary font-medium">
                  {experienceToNext} XP to next level
                </span>
              </div>
              
              {/* Recent Activity */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  {user.badges.slice(-3).map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
                      <span className="text-lg">{badge.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        +{badge.pointsReward}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-coral" />
                Badges ({user.badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.badges.slice(0, showBadges ? undefined : 5).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                    <span className="text-2xl">{badge.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{badge.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{badge.description}</p>
                    </div>
                  </div>
                ))}
                
                {user.badges.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBadges(!showBadges)}
                    className="w-full"
                  >
                    {showBadges ? 'Show Less' : `Show ${user.badges.length - 5} More`}
                  </Button>
                )}
                
                {user.badges.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No badges yet</p>
                    <p className="text-xs">Start solving doubts to earn badges!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="glow" className="h-16">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Ask a Doubt
                </Button>
                <Button variant="coral" className="h-16">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Solve Doubts
                </Button>
                <Button variant="outline" className="h-16">
                  <Target className="w-5 h-5 mr-2" />
                  View Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 