import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { LeaderboardSection } from "@/components/LeaderboardSection";
import { StreakRewardsSection } from "@/components/StreakRewardsSection";
import { CommunitySection } from "@/components/CommunitySection";
import { MobileActionBar } from "@/components/MobileActionBar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <LeaderboardSection />
      <StreakRewardsSection />
      <CommunitySection />
      <MobileActionBar />
    </div>
  );
};

export default Index;
