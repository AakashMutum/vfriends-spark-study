export interface User {
  id: string;
  name: string;
  type: 'asker' | 'solver';
  points: number;
  streak: number;
  lastActiveDate: string;
  totalDoubtsSolved: number;
  totalDoubtsAsked: number;
  badges: Badge[];
  level: number;
  experience: number;
  lastStreakUpdate?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  pointsReward: number;
}

export interface Doubt {
  id: string;
  title: string;
  description: string;
  subject: string;
  askerId: string;
  solverId?: string;
  status: 'open' | 'solved' | 'closed';
  createdAt: string;
  solvedAt?: string;
  points: number;
  rating?: number;
}

// Point calculation constants
export const POINT_VALUES = {
  SOLVE_DOUBT: 10,
  DAILY_STREAK: 5,
  HELPFUL_RATING: 3,
  WEEKLY_BONUS: 50,
  FIRST_DOUBT: 25,
  STREAK_MILESTONE: 100,
  PERFECT_RATING: 5,
} as const;

// Streak milestones
export const STREAK_MILESTONES = [
  { days: 1, reward: 10, badge: 'Rookie Helper' },
  { days: 3, reward: 25, badge: 'Consistent Helper' },
  { days: 7, reward: 50, badge: 'Weekly Warrior' },
  { days: 15, reward: 100, badge: 'Hero Helper' },
  { days: 30, reward: 200, badge: 'Legend' },
  { days: 60, reward: 500, badge: 'Master' },
  { days: 100, reward: 1000, badge: 'Grandmaster' },
] as const;

// Level calculation
export const calculateLevel = (experience: number): number => {
  return Math.floor(experience / 100) + 1;
};

export const calculateExperienceToNextLevel = (experience: number): number => {
  const currentLevel = calculateLevel(experience);
  const nextLevelExperience = currentLevel * 100;
  return nextLevelExperience - experience;
};

// Point calculation functions
export const calculatePointsForDoubtSolved = (
  basePoints: number = POINT_VALUES.SOLVE_DOUBT,
  rating?: number,
  isFirstDoubt: boolean = false
): number => {
  let points = basePoints;
  
  if (isFirstDoubt) {
    points += POINT_VALUES.FIRST_DOUBT;
  }
  
  if (rating && rating >= 4) {
    points += POINT_VALUES.HELPFUL_RATING;
  }
  
  if (rating === 5) {
    points += POINT_VALUES.PERFECT_RATING;
  }
  
  return points;
};

export const calculateStreakBonus = (streak: number): number => {
  const milestone = STREAK_MILESTONES.find(m => m.days === streak);
  return milestone ? milestone.reward : 0;
};

// Streak calculation
export const updateStreak = (lastActiveDate: string): { newStreak: number; streakBonus: number } => {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = new Date(lastActiveDate);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  let newStreak = 0;
  let streakBonus = 0;
  
  if (lastActive.toDateString() === yesterday.toDateString() || lastActive.toDateString() === new Date().toDateString()) {
    // Continue streak
    newStreak = 1; // This will be incremented by the current streak
    streakBonus = POINT_VALUES.DAILY_STREAK;
  } else if (lastActive.toDateString() === new Date().toDateString()) {
    // Already active today
    newStreak = 0;
    streakBonus = 0;
  } else {
    // Streak broken
    newStreak = 1;
    streakBonus = POINT_VALUES.DAILY_STREAK;
  }
  
  return { newStreak, streakBonus };
};

// Badge system
export const checkForNewBadges = (user: User): Badge[] => {
  const newBadges: Badge[] = [];
  const now = new Date().toISOString();
  
  // Check for streak milestones
  const streakMilestone = STREAK_MILESTONES.find(m => m.days === user.streak);
  if (streakMilestone && !user.badges.find(b => b.name === streakMilestone.badge)) {
    newBadges.push({
      id: `streak-${streakMilestone.days}`,
      name: streakMilestone.badge,
      description: `${streakMilestone.days} day streak achieved!`,
      icon: '🔥',
      unlockedAt: now,
      pointsReward: streakMilestone.reward,
    });
  }
  
  // Check for doubt solving milestones
  const doubtMilestones = [
    { count: 1, name: 'First Helper', description: 'Solved your first doubt!' },
    { count: 10, name: 'Helper Rookie', description: 'Solved 10 doubts' },
    { count: 25, name: 'Study Mentor', description: 'Solved 25 doubts' },
    { count: 50, name: 'Knowledge Sharer', description: 'Solved 50 doubts' },
    { count: 100, name: 'Academic Hero', description: 'Solved 100 doubts' },
  ];
  
  doubtMilestones.forEach(milestone => {
    if (user.totalDoubtsSolved >= milestone.count && 
        !user.badges.find(b => b.name === milestone.name)) {
      newBadges.push({
        id: `doubt-${milestone.count}`,
        name: milestone.name,
        description: milestone.description,
        icon: '⭐',
        unlockedAt: now,
        pointsReward: milestone.count * 5,
      });
    }
  });
  
  return newBadges;
}; 