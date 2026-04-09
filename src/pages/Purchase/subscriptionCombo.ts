/** Combo theo gói:
 * - Tiêu chuẩn (slug mới: goi-tieu-chuan, tương thích slug cũ: goi-co-ban): 4/6 tuần
 * - Linh hoạt: 6/8 tuần
 */
export const SUBSCRIPTION_COMBO_SLUGS = ['goi-tieu-chuan', 'goi-co-ban', 'goi-linh-hoat'] as const;

export type SubscriptionComboSlug = (typeof SUBSCRIPTION_COMBO_SLUGS)[number];

export function isSubscriptionComboSlug(slug: string | undefined): slug is SubscriptionComboSlug {
  return slug === 'goi-tieu-chuan' || slug === 'goi-co-ban' || slug === 'goi-linh-hoat';
}

export function getSubscriptionComboAmount(
  slug: SubscriptionComboSlug,
  weeks: 4 | 6 | 8
): number {
  if (slug === 'goi-tieu-chuan' || slug === 'goi-co-ban') {
    return weeks === 4 ? 1_036_000 : 1_554_000;
  }
  return weeks === 6 ? 1_854_000 : 2_350_000;
}
