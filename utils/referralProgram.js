// Oh-Delivery Feature 24: Referral Program utilities

export function generateReferralCode(userId) {
  if (!userId) return '';
  return `REF-${userId.toString().slice(0, 6).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

export function validateReferralCode(code) {
  if (!code) return { valid: false, error: 'Code required' };
  if (!/^REF-[A-Z0-9]+-[A-Z0-9]+$/.test(code)) return { valid: false, error: 'Invalid code format' };
  return { valid: true };
}

export function calculateReferralReward(referralCount) {
  const baseReward = 5;
  const bonus = Math.floor(referralCount / 5) * 2; // bonus every 5 referrals
  return baseReward + bonus;
}

export function getReferralStats(referrals) {
  if (!Array.isArray(referrals)) return { total: 0, pending: 0, completed: 0, totalRewards: 0 };
  const completed = referrals.filter(r => r.status === 'completed').length;
  return {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    completed,
    totalRewards: completed * 5,
  };
}

export function formatReferralMessage(code) {
  return `Use my referral code ${code} and get $5 off your first order!`;
}