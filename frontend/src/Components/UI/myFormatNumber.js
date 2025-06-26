export function myFormatNumber(num, decimals = 3) {
  const number = Number(num);
  if (isNaN(number)) return ''; // если не число — возвращаем пустую строку или можно вернуть сам input
  const str = number.toFixed(decimals);
  return str.replace(/\.?0+$/, '');
}