// Utility functions for deposit calculations
export const calculateDeposit = (pricePerDay: number, duration: number): number => {
  // Base deposit is 7 days worth of rental
  const baseDeposit = pricePerDay * 7;
  
  // For longer rentals, increase deposit proportionally
  if (duration > 7) {
    // Additional deposit for each week beyond first week
    const additionalWeeks = Math.ceil((duration - 7) / 7);
    return baseDeposit + (baseDeposit * 0.2 * additionalWeeks);
  }
  
  return baseDeposit;
};

export const getDepositTerms = (duration: number): string => {
  const baseTerms = 'Deposit will be refunded within 7 days after the toy is returned in good condition.';
  const damageClause = 'Deductions may apply for damages or missing parts.';
  
  if (duration > 14) {
    return `${baseTerms} Additional deposit required for extended rental period. ${damageClause}`;
  }
  
  return `${baseTerms} ${damageClause}`;
};