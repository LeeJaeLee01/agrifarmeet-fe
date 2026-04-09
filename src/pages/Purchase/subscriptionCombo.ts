/** Combo 6/8 tuần — đồng bộ `agrifarmeet-be/src/boxes/subscription-combo.constants.ts` */
export const SUBSCRIPTION_COMBO_SLUGS = ['goi-linh-hoat'] as const;

export type SubscriptionComboSlug = (typeof SUBSCRIPTION_COMBO_SLUGS)[number];

export function isSubscriptionComboSlug(slug: string | undefined): slug is SubscriptionComboSlug {
  return slug === 'goi-linh-hoat';
}

export function getSubscriptionComboAmount(
  slug: SubscriptionComboSlug,
  weeks: 6 | 8
): number {
  // Hiện chỉ còn áp dụng combo cho gói linh hoạt.
  return weeks === 6 ? 1_854_000 : 2_350_000;
}
