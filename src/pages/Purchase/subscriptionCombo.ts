/** Combo 6/8 tuần — đồng bộ `agrifarmeet-be/src/boxes/subscription-combo.constants.ts` */
export const SUBSCRIPTION_COMBO_SLUGS = ['goi-co-ban', 'goi-linh-hoat'] as const;

export type SubscriptionComboSlug = (typeof SUBSCRIPTION_COMBO_SLUGS)[number];

export function isSubscriptionComboSlug(slug: string | undefined): slug is SubscriptionComboSlug {
  return slug === 'goi-co-ban' || slug === 'goi-linh-hoat';
}

export function getSubscriptionComboAmount(
  slug: SubscriptionComboSlug,
  weeks: 6 | 8
): number {
  if (slug === 'goi-co-ban') {
    return weeks === 6 ? 1_554_000 : 1_970_000;
  }
  return weeks === 6 ? 1_854_000 : 2_350_000;
}
