export const formatMoney = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null) return '0 ₽';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0 ₽';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(num);
};
