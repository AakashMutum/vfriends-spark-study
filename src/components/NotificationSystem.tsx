import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Star, Flame, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'points' | 'badge' | 'streak';
  title: string;
  message: string;
  icon: string;
  points?: number;
  timestamp: Date;
}

export const NotificationSystem = () => {
  const { state } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!state.currentUser) return;

    // Check for new badges
    const newBadges = state.currentUser.badges.filter(badge => {
      const badgeDate = new Date(badge.unlockedAt);
      const now = new Date();
      const diffInMinutes = (now.getTime() - badgeDate.getTime()) / (1000 * 60);
      return diffInMinutes < 5; // Show notifications for badges earned in last 5 minutes
    });

    newBadges.forEach(badge => {
      const notification: Notification = {
        id: `badge-${badge.id}`,
        type: 'badge',
        title: 'New Badge Unlocked!',
        message: badge.description,
        icon: badge.icon,
        points: badge.pointsReward,
        timestamp: new Date(badge.unlockedAt),
      };

      setNotifications(prev => [...prev, notification]);
      
      // Show toast notification
      toast({
        title: "🎉 New Badge Unlocked!",
        description: `${badge.name} - ${badge.description}`,
        duration: 5000,
      });
    });
  }, [state.currentUser?.badges]);

  useEffect(() => {
    if (!state.currentUser) return;

    // Check for streak updates
    const lastActive = new Date(state.currentUser.lastActiveDate);
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 5 && state.currentUser.streak > 0) {
      const notification: Notification = {
        id: `streak-${Date.now()}`,
        type: 'streak',
        title: 'Streak Updated!',
        message: `Your streak is now ${state.currentUser.streak} days!`,
        icon: '🔥',
        timestamp: now,
      };

      setNotifications(prev => [...prev, notification]);
      
      toast({
        title: "🔥 Streak Updated!",
        description: `Your streak is now ${state.currentUser.streak} days!`,
        duration: 3000,
      });
    }
  }, [state.currentUser?.streak, state.currentUser?.lastActiveDate]);

  // Auto-remove notifications after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => 
        prev.filter(notification => {
          const now = new Date();
          const diffInSeconds = (now.getTime() - notification.timestamp.getTime()) / 1000;
          return diffInSeconds < 10;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          className="w-80 glass-card border-0 shadow-lg animate-in slide-in-from-right-2"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{notification.icon}</div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                
                {notification.points && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-orange" />
                    <span className="text-xs font-medium text-orange">
                      +{notification.points} points
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 