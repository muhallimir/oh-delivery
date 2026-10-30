// Oh-Delivery Feature 18: Calorie Counter utilities

export function calculateTotalCalories(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item.calories || 0) * (item.quantity || 1), 0);
}

export function getCalorieInfo(item) {
  if (!item) return null;
  return {
    calories: item.calories || 0,
    protein: item.protein || 0,
    carbs: item.carbs || 0,
    fat: item.fat || 0,
    fiber: item.fiber || 0,
  };
}

export function getDailyCalorieGoal(gender = 'male', activityLevel = 'moderate') {
  const base = gender === 'female' ? 2000 : 2500;
  const multipliers = { sedentary: 0.8, moderate: 1.0, active: 1.2 };
  return Math.round(base * (multipliers[activityLevel] || 1.0));
}

export function getCalorieProgress(current, goal) {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

export function formatCalories(calories) {
  return `${calories} kcal`;
}

export function getMacroBreakdown(items) {
  if (!Array.isArray(items)) return { protein: 0, carbs: 0, fat: 0 };
  return items.reduce((acc, item) => ({
    protein: acc.protein + (item.protein || 0) * (item.quantity || 1),
    carbs: acc.carbs + (item.carbs || 0) * (item.quantity || 1),
    fat: acc.fat + (item.fat || 0) * (item.quantity || 1),
  }), { protein: 0, carbs: 0, fat: 0 });
}