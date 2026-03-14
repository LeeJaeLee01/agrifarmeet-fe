export function formatVND(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '';
  return n.toLocaleString('vi-VN') + ' VND';
}

export function formatWeight(weight: string | number, unit: string = 'g'): string {
  const num = Number(weight);

  if (isNaN(num)) return '0';

  if (unit === 'kg') {
    const kgValue = num / 1000;
    // Nếu là số nguyên thì bỏ phần thập phân
    return Number.isInteger(kgValue) ? `${kgValue} kg` : `${kgValue.toFixed(2)} kg`;
  }

  // Mặc định dùng unit truyền vào
  return Number.isInteger(num) ? `${num} ${unit}` : `${num} ${unit}`;
}

export const formatDate = (dateString: string) => {
  // 2025-08-23T01:36:27.354Z -> "23/08/2025 08:36:27"
  if (!dateString) return '';
  const d = new Date(dateString);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

/** Sinh mã giao dịch dạng txn_461770666 (prefix txn_ + số) */
export const generateRandomString = (length: number = 13): string => {
  const prefix = 'txn_';
  const digits = '0123456789';
  let result = prefix;
  const numLength = length - prefix.length;
  for (let i = 0; i < numLength; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return result;
};
