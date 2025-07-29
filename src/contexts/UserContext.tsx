import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Doubt, updateStreak, checkForNewBadges, calculatePointsForDoubtSolved, calculateLevel } from '@/lib/userState';
import { generateDemoDoubts } from '@/lib/demoData';

interface UserState {
  currentUser: User | null;
  doubts: Doubt[];
  isLoading: boolean;
  error: string | null;
}

type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_POINTS'; payload: number }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'ADD_DOUBT'; payload: Doubt }
  | { type: 'SET_DOUBTS'; payload: Doubt[] }
  | { type: 'SOLVE_DOUBT'; payload: { doubtId: string; solverId: string; rating?: number } }
  | { type: 'ADD_BADGE'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_USER' };

const initialState: UserState = {
  currentUser: null,
  doubts: generateDemoDoubts(), // Initialize with demo doubts
  isLoading: false,
  error: null,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload, error: null };
    
    case 'UPDATE_POINTS':
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          points: state.currentUser.points + action.payload,
          experience: state.currentUser.experience + action.payload,
          level: calculateLevel(state.currentUser.experience + action.payload),
        },
      };
    
    case 'UPDATE_STREAK':
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          streak: action.payload,
          lastActiveDate: new Date().toISOString(),
        },
      };
    
    case 'ADD_DOUBT':
      return {
        ...state,
        doubts: [...state.doubts, action.payload],
      };
    
    case 'SET_DOUBTS':
      return { ...state, doubts: action.payload };
    
    case 'SOLVE_DOUBT':
      const updatedDoubts = state.doubts.map(doubt =>
        doubt.id === action.payload.doubtId
          ? {
              ...doubt,
              status: 'solved' as const,
              solverId: action.payload.solverId,
              solvedAt: new Date().toISOString(),
              rating: action.payload.rating,
            }
          : doubt
      );
      
      if (!state.currentUser) return { ...state, doubts: updatedDoubts };
      
      const isFirstDoubt = state.currentUser.totalDoubtsSolved === 0;
      const pointsEarned = calculatePointsForDoubtSolved(
        10,
        action.payload.rating,
        isFirstDoubt
      );
      
      const newTotalSolved = state.currentUser.totalDoubtsSolved + 1;
      const newBadges = checkForNewBadges({
        ...state.currentUser,
        totalDoubtsSolved: newTotalSolved,
      });
      
      return {
        ...state,
        doubts: updatedDoubts,
        currentUser: {
          ...state.currentUser,
          points: state.currentUser.points + pointsEarned,
          experience: state.currentUser.experience + pointsEarned,
          level: calculateLevel(state.currentUser.experience + pointsEarned),
          totalDoubtsSolved: newTotalSolved,
          badges: [...state.currentUser.badges, ...newBadges],
        },
      };
    
    case 'ADD_BADGE':
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          badges: [...state.currentUser.badges, action.payload],
          points: state.currentUser.points + action.payload.pointsReward,
          experience: state.currentUser.experience + action.payload.pointsReward,
          level: calculateLevel(state.currentUser.experience + action.payload.pointsReward),
        },
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET_USER':
      return { ...initialState };
    
    default:
      return state;
  }
};

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  login: (userType: 'asker' | 'solver', name: string) => void;
  logout: () => void;
  solveDoubt: (doubtId: string, rating?: number) => void;
  askDoubt: (title: string, description: string, subject: string) => void;
  updateDailyStreak: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vfriends-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('vfriends-user', JSON.stringify(state.currentUser));
    }
  }, [state.currentUser]);

  const login = (userType: 'asker' | 'solver', name: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      type: userType,
      points: 0,
      streak: 0,
      lastActiveDate: new Date().toISOString(),
      totalDoubtsSolved: 0,
      totalDoubtsAsked: 0,
      badges: [],
      level: 1,
      experience: 0,
    };
    
    dispatch({ type: 'SET_USER', payload: newUser });
  };

  const logout = () => {
    localStorage.removeItem('vfriends-user');
    dispatch({ type: 'RESET_USER' });
  };

  const solveDoubt = (doubtId: string, rating?: number) => {
    if (!state.currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const lastStreakUpdate = state.currentUser.lastStreakUpdate || '';
    let streak = state.currentUser.streak;
    let lastActiveDate = state.currentUser.lastActiveDate;
    let streakUpdated = false;

    // Only update streak if not already updated today
    if (lastStreakUpdate !== today) {
      // If last active was yesterday or earlier, increment streak, else reset to 1
      const lastActive = new Date(state.currentUser.lastActiveDate).toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActive === yesterday.toDateString()) {
        streak = state.currentUser.streak + 1;
      } else {
        streak = 1;
      }
      lastActiveDate = new Date().toISOString();
      streakUpdated = true;
    }

    // Update points/XP for solver only
    const isFirstDoubt = state.currentUser.totalDoubtsSolved === 0;
    const pointsEarned = calculatePointsForDoubtSolved(10, rating, isFirstDoubt);
    const newTotalSolved = state.currentUser.totalDoubtsSolved + 1;
    const newBadges = checkForNewBadges({
      ...state.currentUser,
      totalDoubtsSolved: newTotalSolved,
      streak,
    });

    // Update the doubt as solved
    const updatedDoubts = state.doubts.map(doubt =>
      doubt.id === doubtId
        ? {
            ...doubt,
            status: 'solved' as const,
            solverId: state.currentUser!.id,
            solvedAt: new Date().toISOString(),
            rating,
          }
        : doubt
    );

    dispatch({
      type: 'SET_USER',
      payload: {
        ...state.currentUser,
        points: state.currentUser.points + pointsEarned,
        experience: state.currentUser.experience + pointsEarned,
        level: calculateLevel(state.currentUser.experience + pointsEarned),
        totalDoubtsSolved: newTotalSolved,
        streak,
        lastActiveDate,
        lastStreakUpdate: streakUpdated ? today : lastStreakUpdate,
        badges: [...state.currentUser.badges, ...newBadges],
      },
    });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: false });
    dispatch({ type: 'SET_DOUBTS', payload: updatedDoubts });
  };

  const askDoubt = (title: string, description: string, subject: string) => {
    if (!state.currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const lastStreakUpdate = state.currentUser.lastStreakUpdate || '';
    let streak = state.currentUser.streak;
    let lastActiveDate = state.currentUser.lastActiveDate;
    let streakUpdated = false;
    let totalDoubtsAsked = state.currentUser.totalDoubtsAsked + 1;

    // Only update streak if not already updated today
    if (lastStreakUpdate !== today) {
      const lastActive = new Date(state.currentUser.lastActiveDate).toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActive === yesterday.toDateString()) {
        streak = state.currentUser.streak + 1;
      } else {
        streak = 1;
      }
      lastActiveDate = new Date().toISOString();
      streakUpdated = true;
    }

    const newBadges = checkForNewBadges({
      ...state.currentUser,
      totalDoubtsAsked,
      streak,
    });

    const newDoubt: Doubt = {
      id: `doubt-${Date.now()}`,
      title,
      description,
      subject,
      askerId: state.currentUser.id,
      status: 'open',
      createdAt: new Date().toISOString(),
      points: 10,
    };

    dispatch({
      type: 'SET_USER',
      payload: {
        ...state.currentUser,
        totalDoubtsAsked,
        streak,
        lastActiveDate,
        lastStreakUpdate: streakUpdated ? today : lastStreakUpdate,
        badges: [...state.currentUser.badges, ...newBadges],
      },
    });
    dispatch({ type: 'ADD_DOUBT', payload: newDoubt });
  };

  const updateDailyStreak = () => {
    if (!state.currentUser) return;
    
    const { newStreak, streakBonus } = updateStreak(state.currentUser.lastActiveDate);
    const updatedStreak = state.currentUser.streak + newStreak;
    
    dispatch({ type: 'UPDATE_STREAK', payload: updatedStreak });
    
    if (streakBonus > 0) {
      dispatch({ type: 'UPDATE_POINTS', payload: streakBonus });
    }
    
    // Check for new badges
    const newBadges = checkForNewBadges({
      ...state.currentUser,
      streak: updatedStreak,
    });
    
    newBadges.forEach(badge => {
      dispatch({ type: 'ADD_BADGE', payload: badge });
    });
  };

  const value: UserContextType = {
    state,
    dispatch,
    login,
    logout,
    solveDoubt,
    askDoubt,
    updateDailyStreak,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 