export const BOX_SLUG_EXPERIENCE = 'goi-co-ban';
export const BOX_SLUG_STANDARD = 'goi-tieu-chuan';
export const BOX_SLUG_FLEXIBLE = 'goi-linh-hoat';
export const BOX_SLUG_STANDARD_LEGACY = 'goi-co-ban';

type BoxLike = {
  slug?: string | null;
};

export function normalizeBoxSlug(slug: string | null | undefined): string {
  return String(slug || '').trim().toLowerCase();
}

export function isExperienceBoxBySlug(slug: string | null | undefined): boolean {
  return normalizeBoxSlug(slug) === BOX_SLUG_EXPERIENCE;
}

export function isStandardBoxBySlug(slug: string | null | undefined): boolean {
  const s = normalizeBoxSlug(slug);
  return s === BOX_SLUG_STANDARD || s === BOX_SLUG_STANDARD_LEGACY;
}

export function isFlexibleBoxBySlug(slug: string | null | undefined): boolean {
  return normalizeBoxSlug(slug) === BOX_SLUG_FLEXIBLE;
}

export function isSubscriptionComboBoxBySlug(slug: string | null | undefined): boolean {
  return isStandardBoxBySlug(slug) || isFlexibleBoxBySlug(slug);
}

export function isExperienceBox(box: BoxLike | null | undefined): boolean {
  return isExperienceBoxBySlug(box?.slug);
}

export function isSubscriptionComboBox(box: BoxLike | null | undefined): boolean {
  return isSubscriptionComboBoxBySlug(box?.slug);
}
