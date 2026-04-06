import api from '../utils/api';

const getData = <T>(res: { data?: { data?: T } & T }): T =>
  (res?.data as { data?: T })?.data ?? (res?.data as T);

export type ExperienceWeeklyPublicProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  weight: number | null;
  unit: string | null;
  images: string[] | null;
  category: { id: string; name: string; slug: string } | null;
};

export type ExperienceWeeklyPublicItem = {
  id: string;
  productId: string;
  quantity: number;
  unit: string;
  isOptional: boolean;
  weekStartDate: string;
  product: ExperienceWeeklyPublicProduct;
};

export type ExperienceWeeklyPublicResponse = {
  box: { id: string; slug: string; name: string };
  weekStartDate: string;
  items: ExperienceWeeklyPublicItem[];
};

/**
 * GET `/boxes/goi-trai-nghiem/weekly-products` — rau tuần cho gói trải nghiệm (public).
 * `weekStartDate` tùy chọn (YYYY-MM-DD, Thứ Hai).
 */
export async function fetchExperienceWeeklyPublic(weekStartDate?: string): Promise<ExperienceWeeklyPublicResponse> {
  const res = await api.get<ExperienceWeeklyPublicResponse>('/boxes/goi-trai-nghiem/weekly-products', {
    params: weekStartDate ? { weekStartDate } : {},
  });
  return getData(res);
}
