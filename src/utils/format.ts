export const formatPrice = (price: number): string => {
  return `₹${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatPricePerDay = (price: number): string => {
  return `₹${price}/day`;
};