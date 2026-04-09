/** Combo theo gói:
 * - Cơ bản (slug: goi-co-ban): 1/4 tuần
 * - Tiêu chuẩn (slug: goi-tieu-chuan): 6/8 tuần
 * - Linh hoạt: 6/8 tuần
 */
export const SUBSCRIPTION_COMBO_SLUGS = ['goi-co-ban', 'goi-tieu-chuan', 'goi-linh-hoat'] as const;

export type SubscriptionComboSlug = (typeof SUBSCRIPTION_COMBO_SLUGS)[number];
export type SubscriptionWeeks = 1 | 4 | 6 | 8;

export function isSubscriptionComboSlug(slug: string | undefined): slug is SubscriptionComboSlug {
  return slug === 'goi-co-ban' || slug === 'goi-tieu-chuan' || slug === 'goi-linh-hoat';
}

export function getSubscriptionComboAmount(
  slug: SubscriptionComboSlug,
  weeks: SubscriptionWeeks,
  baseWeeklyPrice = 0
): number {
  if (slug === 'goi-co-ban') {
    return weeks === 4 ? baseWeeklyPrice * 4 : baseWeeklyPrice;
  }
  if (slug === 'goi-tieu-chuan') {
    return weeks === 6 ? 1_554_000 : 1_970_000;
  }
  return weeks === 6 ? 1_854_000 : 2_350_000;
}
