import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { LeaderboardSection } from "@/components/LeaderboardSection";
import { StreakRewardsSection } from "@/components/StreakRewardsSection";
import { CommunitySection } from "@/components/CommunitySection";
import { MobileActionBar } from "@/components/MobileActionBar";
import { UserDashboard } from "@/components/UserDashboard";
import { DoubtInteraction } from "@/components/DoubtInteraction";
import { LoginModal } from "@/components/LoginModal";
import { NotificationSystem } from "@/components/NotificationSystem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Target, 
  BookOpen, 
  HelpCircle, 
  Trophy,
  User,
  LogIn
} from "lucide-react";

const Index = () => {
  const { state } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [preselectedRole, setPreselectedRole] = useState<'asker' | 'solver' | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("home");

  // Listen for login modal events from hero section
  useEffect(() => {
    const handleOpenLoginModal = (e: any) => {
      if (e.detail && (e.detail.role === 'asker' || e.detail.role === 'solver')) {
        setPreselectedRole(e.detail.role);
      }
      setShowLoginModal(true);
    };
    window.addEventListener('openLoginModal', handleOpenLoginModal);
    return () => window.removeEventListener('openLoginModal', handleOpenLoginModal);
  }, []);

  // If user is not logged in, show the landing page with login option
  if (!state.currentUser) {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <LeaderboardSection />
      <StreakRewardsSection />
      <CommunitySection />
      <MobileActionBar />
        
        {/* Login Modal */}
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => { setShowLoginModal(false); setPreselectedRole(undefined); }}
          preselectedRole={preselectedRole}
        />
        
        {/* Floating Login Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={() => setShowLoginModal(true)}
            size="lg"
            className="rounded-full shadow-lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  // If user is logged in, show the main app interface
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                vFriends
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Welcome back, {state.currentUser.name}!
                </span>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-orange font-medium">
                    {state.currentUser.points} pts
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="doubts" className="flex items-center gap-2">
              {state.currentUser.type === 'solver' ? (
                <>
                  <BookOpen className="w-4 h-4" />
                  Solve
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4" />
                  Ask
                </>
              )}
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <UserDashboard />
          </TabsContent>

          <TabsContent value="doubts" className="space-y-6">
            <DoubtInteraction />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <LeaderboardSection />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <StreakRewardsSection />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunitySection />
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Action Bar */}
      <MobileActionBar />
      
      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
};

export default Index;
