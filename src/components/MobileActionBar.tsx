import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Home, Trophy, User } from "lucide-react";
import { useState } from "react";

export const MobileActionBar = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'ask', icon: MessageCircle, label: 'Ask' },
    { id: 'solve', icon: Users, label: 'Solve' },
    { id: 'leaderboard', icon: Trophy, label: 'Board' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Main Action Buttons */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 mb-2">
          <Button 
            variant="glow" 
            className="flex-1 h-12 text-sm font-semibold"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask Doubt
          </Button>
          <Button 
            variant="coral" 
            className="flex-1 h-12 text-sm font-semibold"
          >
            <Users className="w-4 h-4 mr-2" />
            Help Solve
          </Button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="glass-card border-t border-border/20 px-2 py-1">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-normal
                  ${isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-hover'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};