/**
 * Sleep & Recovery AI Engine
 * 
 * This engine uses behavioral inputs, timing, and subjective feedback
 * to heuristically calculate a recovery score, sleep efficiency, and 
 * generate contextual insights without needing an external API.
 */

// Weights for the Recovery Algorithm
const WEIGHTS = {
  DURATION: 0.35,      // 35% based on total sleep duration
  EFFICIENCY: 0.25,    // 25% based on sleep efficiency (time asleep / time in bed)
  INTERRUPTIONS: 0.15, // 15% penalty for awakenings
  BEHAVIORS: 0.15,     // 15% penalty for late caffeine, screens, stress
  SUBJECTIVE: 0.10     // 10% bonus/penalty based on morning questionnaire
};

export const calculateSleepRecovery = (sleepLog) => {
  const {
    bedtime,
    wake_time,
    sleep_onset_time,
    awakenings_count = 0,
    awake_duration_minutes = 0,
    used_screens_late = false,
    consumed_caffeine_late = false,
    felt_stressed_anxious = false,
    took_naps = false,
    energy_upon_waking = 5,
    mental_clarity = 5,
    mood = 5,
    muscle_soreness = 5,
    motivation_to_train = 5
  } = sleepLog;

  const bTime = new Date(bedtime);
  const wTime = new Date(wake_time);
  const oTime = sleep_onset_time ? new Date(sleep_onset_time) : bTime;

  // 1. Duration & Efficiency
  const timeInBedMs = wTime - bTime;
  const timeInBedHrs = timeInBedMs / (1000 * 60 * 60);
  
  const onsetDelayMs = Math.max(0, oTime - bTime);
  const onsetDelayMins = onsetDelayMs / (1000 * 60);

  const totalSleepMs = timeInBedMs - onsetDelayMs - (awake_duration_minutes * 60 * 1000);
  const totalSleepHrs = Math.max(0, totalSleepMs / (1000 * 60 * 60));

  const sleep_efficiency = timeInBedHrs > 0 ? (totalSleepHrs / timeInBedHrs) * 100 : 0;

  // 2. Base Scores
  let durationScore = Math.min(100, (totalSleepHrs / 8) * 100); 
  if (totalSleepHrs > 9) durationScore -= (totalSleepHrs - 9) * 10; // Penalty for oversleeping > 9h

  let efficiencyScore = sleep_efficiency;
  
  // 3. Interruptions Penalty
  let interruptionScore = 100 - (awakenings_count * 10) - (awake_duration_minutes * 0.5);
  interruptionScore = Math.max(0, interruptionScore);

  // 4. Behavioral Score
  let behaviorScore = 100;
  if (used_screens_late) behaviorScore -= 15;
  if (consumed_caffeine_late) behaviorScore -= 20;
  if (felt_stressed_anxious) behaviorScore -= 25;
  behaviorScore = Math.max(0, behaviorScore);

  // 5. Subjective Score (average of 1-10 mapped to 0-100)
  // Higher muscle soreness (10) means worse recovery, so invert it
  const invertedSoreness = 11 - muscle_soreness; 
  const subjectiveAvg = (energy_upon_waking + mental_clarity + mood + invertedSoreness + motivation_to_train) / 5;
  const subjectiveScore = (subjectiveAvg / 10) * 100;

  // Final Recovery Calculation
  let recovery_score = (
    (durationScore * WEIGHTS.DURATION) +
    (efficiencyScore * WEIGHTS.EFFICIENCY) +
    (interruptionScore * WEIGHTS.INTERRUPTIONS) +
    (behaviorScore * WEIGHTS.BEHAVIORS) +
    (subjectiveScore * WEIGHTS.SUBJECTIVE)
  );
  
  // Slight bonus for taking a nap if they had low sleep
  if (took_naps && totalSleepHrs < 7) {
    recovery_score = Math.min(100, recovery_score + 5);
  }

  recovery_score = Math.max(0, Math.min(100, Math.round(recovery_score)));

  // Generate Insights
  const insights = [];

  if (totalSleepHrs < 6) {
    insights.push("You may be carrying sleep debt from inadequate sleep duration.");
  }
  if (sleep_efficiency < 80) {
    insights.push("Your sleep efficiency appears lower than usual. Try optimizing your sleep environment.");
  }
  if (onsetDelayMins > 45) {
    insights.push("Late sleep onset may be affecting recovery quality. A wind-down routine might help.");
  }
  if (behaviorScore < 70) {
    insights.push("Late-night stimulation (screens/caffeine/stress) likely fragmented your rest.");
  }
  if (recovery_score < 50) {
    insights.push("Recovery appears compromised; consider lowering workout intensity today.");
  } else if (recovery_score >= 85) {
    insights.push("Excellent recovery readiness! Prime condition for high-intensity training.");
  } else {
    insights.push("Recovery readiness is moderate. Listen to your body during workouts today.");
  }
  if (invertedSoreness <= 3 && totalSleepHrs < 7) {
    insights.push("High muscle soreness paired with low sleep slows down physical repair.");
  }

  return {
    recovery_score,
    sleep_efficiency: Math.round(sleep_efficiency),
    total_sleep_hours: Number(totalSleepHrs.toFixed(2)),
    insights_json: insights
  };
};
