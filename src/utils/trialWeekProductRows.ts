import type { TBoxProductRow } from '../types/TBox';

/**
 * Chọn sản phẩm theo tuần giao (weekStartDate): tuần chứa hôm nay,
 * nếu không có thì tuần giao sớm nhất phía sau, cuối cùng là tuần mới nhất trong dữ liệu.
 */
export function pickTrialWeekProductRows(rows: TBoxProductRow[]): TBoxProductRow[] {
  if (!rows.length) return [];

  const byWeek = new Map<string, TBoxProductRow[]>();
  for (const row of rows) {
    const key = row.weekStartDate;
    if (!key) continue;
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key)!.push(row);
  }

  const sortedWeeks = Array.from(byWeek.keys()).sort();
  if (!sortedWeeks.length) return rows;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const w of sortedWeeks) {
    const start = new Date(w);
    if (Number.isNaN(start.getTime())) continue;
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    if (today >= start && today < end) {
      return byWeek.get(w)!;
    }
  }

  for (const w of sortedWeeks) {
    const start = new Date(w);
    if (Number.isNaN(start.getTime())) continue;
    start.setHours(0, 0, 0, 0);
    if (today < start) {
      return byWeek.get(w)!;
    }
  }

  const last = sortedWeeks[sortedWeeks.length - 1];
  return byWeek.get(last)!;
}
