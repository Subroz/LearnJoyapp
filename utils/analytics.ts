import { storageService, MathScore, LearningProgress } from './storage';

// Analytics Service for tracking user progress and stats
export const analyticsService = {
  // Calculate overall progress
  async getOverallProgress(): Promise<{
    totalLettersLearned: number;
    mathProblemsCompleted: number;
    storiesCreated: number;
    accuracy: number;
  }> {
    const learningProgress = await storageService.getLearningProgress();
    const mathScores = await storageService.getMathScores();
    const stories = await storageService.getFavoriteStories();

    const totalLettersLearned = learningProgress.filter(p => p.completed).length;
    const mathProblemsCompleted = mathScores.reduce((sum, s) => sum + s.totalProblems, 0);
    const storiesCreated = stories.length;

    // Calculate overall accuracy from math scores
    let totalCorrect = 0;
    let totalAttempts = 0;

    mathScores.forEach(score => {
      totalCorrect += score.score;
      totalAttempts += score.totalProblems;
    });

    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    return {
      totalLettersLearned,
      mathProblemsCompleted,
      storiesCreated,
      accuracy: Math.round(accuracy),
    };
  },

  // Get stats for a specific time period
  async getRecentActivity(days: number = 7): Promise<{
    recentMathScores: MathScore[];
    recentLetters: LearningProgress[];
    dailyActivity: { [date: string]: number };
  }> {
    const mathScores = await storageService.getMathScores();
    const learningProgress = await storageService.getLearningProgress();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentMathScores = mathScores.filter(
      score => new Date(score.timestamp) >= cutoffDate
    );

    const recentLetters = learningProgress.filter(
      progress => new Date(progress.timestamp) >= cutoffDate
    );

    // Calculate daily activity
    const dailyActivity: { [date: string]: number } = {};

    [...recentMathScores, ...recentLetters].forEach(item => {
      const date = new Date(item.timestamp).toDateString();
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });

    return {
      recentMathScores,
      recentLetters,
      dailyActivity,
    };
  },

  // Get achievements/milestones
  async getAchievements(): Promise<{
    badges: string[];
    nextMilestone: string;
  }> {
    const progress = await this.getOverallProgress();
    const badges: string[] = [];

    // Letter learning achievements
    if (progress.totalLettersLearned >= 10) badges.push('📚 Letter Explorer');
    if (progress.totalLettersLearned >= 26) badges.push('🎓 Alphabet Master');

    // Math achievements
    if (progress.mathProblemsCompleted >= 10) badges.push('🧮 Math Beginner');
    if (progress.mathProblemsCompleted >= 50) badges.push('🔢 Math Pro');
    if (progress.mathProblemsCompleted >= 100) badges.push('🏆 Math Champion');

    // Accuracy achievements
    if (progress.accuracy >= 80) badges.push('🎯 Sharp Shooter');
    if (progress.accuracy >= 95) badges.push('⭐ Perfectionist');

    // Story achievements
    if (progress.storiesCreated >= 5) badges.push('📖 Storyteller');
    if (progress.storiesCreated >= 20) badges.push('✍️ Author');

    // Determine next milestone
    let nextMilestone = 'Keep learning!';
    if (progress.totalLettersLearned < 10) {
      nextMilestone = `Learn ${10 - progress.totalLettersLearned} more letters to become a Letter Explorer!`;
    } else if (progress.mathProblemsCompleted < 10) {
      nextMilestone = `Solve ${10 - progress.mathProblemsCompleted} more problems to become a Math Beginner!`;
    } else if (progress.storiesCreated < 5) {
      nextMilestone = `Create ${5 - progress.storiesCreated} more stories to become a Storyteller!`;
    }

    return {
      badges,
      nextMilestone,
    };
  },

  // Track session time (to be called on app open/close)
  async logSession(durationMinutes: number): Promise<void> {
    // This could be expanded to track session data
    console.log(`Session logged: ${durationMinutes} minutes`);
  },

  // Get learning streak (consecutive days of activity)
  async getLearningStreak(): Promise<number> {
    const activity = await this.getRecentActivity(30);
    const dates = Object.keys(activity.dailyActivity).sort();
    
    if (dates.length === 0) return 0;

    let streak = 1;
    const today = new Date().toDateString();

    // Check if activity exists today or yesterday
    if (dates[dates.length - 1] !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (dates[dates.length - 1] !== yesterday.toDateString()) {
        return 0; // Streak broken
      }
    }

    // Count consecutive days backwards
    for (let i = dates.length - 2; i >= 0; i--) {
      const current = new Date(dates[i + 1]);
      const previous = new Date(dates[i]);
      const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },
};

export default analyticsService;

