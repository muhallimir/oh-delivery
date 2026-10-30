import { generateReferralCode, validateReferralCode, calculateReferralReward, getReferralStats, formatReferralMessage } from '../utils/referralProgram';

describe('Referral Program - Oh-Delivery Feature 24', () => {
  test('generateReferralCode generates code', () => {
    const code = generateReferralCode('user123');
    expect(code).toContain('REF-');
  });

  test('validateReferralCode validates', () => {
    expect(validateReferralCode('REF-ABC123-XY').valid).toBe(true);
    expect(validateReferralCode('invalid').valid).toBe(false);
    expect(validateReferralCode('').valid).toBe(false);
  });

  test('calculateReferralReward calculates', () => {
    expect(calculateReferralReward(0)).toBe(5);
    expect(calculateReferralReward(5)).toBe(7);
  });

  test('getReferralStats returns stats', () => {
    const referrals = [{ status: 'completed' }, { status: 'pending' }];
    const stats = getReferralStats(referrals);
    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.totalRewards).toBe(5);
  });

  test('formatReferralMessage formats', () => {
    const msg = formatReferralMessage('REF-ABC');
    expect(msg).toContain('REF-ABC');
    expect(msg).toContain('$5');
  });
});