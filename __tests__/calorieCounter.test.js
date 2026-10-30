import { calculateTotalCalories, getCalorieInfo, getDailyCalorieGoal, getCalorieProgress, formatCalories, getMacroBreakdown } from '../utils/calorieCounter';

describe('Calorie Counter - Oh-Delivery Feature 18', () => {
  test('calculateTotalCalories calculates', () => {
    const items = [{ calories: 300, quantity: 2 }, { calories: 200, quantity: 1 }];
    expect(calculateTotalCalories(items)).toBe(800);
  });

  test('calculateTotalCalories handles empty', () => {
    expect(calculateTotalCalories(null)).toBe(0);
    expect(calculateTotalCalories([])).toBe(0);
  });

  test('getCalorieInfo returns info', () => {
    const info = getCalorieInfo({ calories: 300, protein: 20, carbs: 40, fat: 10 });
    expect(info.calories).toBe(300);
    expect(info.protein).toBe(20);
  });

  test('getCalorieInfo handles null', () => {
    expect(getCalorieInfo(null)).toBeNull();
  });

  test('getDailyCalorieGoal returns goal', () => {
    expect(getDailyCalorieGoal('male', 'moderate')).toBe(2500);
    expect(getDailyCalorieGoal('female', 'moderate')).toBe(2000);
  });

  test('getCalorieProgress calculates', () => {
    expect(getCalorieProgress(1250, 2500)).toBe(50);
  });

  test('formatCalories formats', () => {
    expect(formatCalories(500)).toBe('500 kcal');
  });

  test('getMacroBreakdown calculates', () => {
    const items = [{ protein: 20, carbs: 40, fat: 10, quantity: 1 }];
    const macros = getMacroBreakdown(items);
    expect(macros.protein).toBe(20);
    expect(macros.carbs).toBe(40);
  });
});