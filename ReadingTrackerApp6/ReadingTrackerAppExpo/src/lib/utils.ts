// 숫자 3자리 콤마
export const formatNumber = (num: number) => num.toLocaleString();
// k단위 포맷
export const formatK = (num: number) => {
  if (num >= 1000) return `${Math.floor(num / 1000).toLocaleString()}k`;
  return num.toLocaleString();
};
// 날짜 YYYY-MM-DD
export const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}; 