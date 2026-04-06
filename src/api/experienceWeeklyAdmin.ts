import api from '../utils/api';

const getData = <T>(res: { data?: { data?: T } & T }): T =>
  (res?.data as { data?: T })?.data ?? (res?.data as T);

/** Phản hồi GET/PUT `/admin/experience-weekly/box-products` (sau interceptor `data.data`). */
export interface ExperienceWeeklyBoxMeta {
  id: string;
  slug: string;
  name: string;
}

export interface ExperienceWeeklyProductRow {
  id: string;
  boxId: string;
  productId: string;
  quantity: number;
  unit: string;
  isOptional: boolean;
  weekStartDate: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images?: string[] | null;
    category?: { id: string; name: string; slug?: string } | null;
  };
}

export interface ExperienceWeeklyListResponse {
  box: ExperienceWeeklyBoxMeta;
  weekStartDate: string;
  items: ExperienceWeeklyProductRow[];
}

/** Danh sách rau trong tuần cho gói trải nghiệm (`goi-trai-nghiem`). `weekStartDate`: YYYY-MM-DD (Thứ Hai). */
export async function fetchExperienceWeeklyProducts(weekStartDate: string): Promise<ExperienceWeeklyListResponse> {
  const res = await api.get<ExperienceWeeklyListResponse>('/admin/experience-weekly/box-products', {
    params: { weekStartDate },
    withAuth: true,
  });
  return getData(res);
}

export interface ExperienceWeeklyItemInput {
  productId: string;
  quantity: number;
  boxUnit?: string;
  isOptional?: boolean;
}

/**
 * Thay toàn bộ cấu hình tuần (PUT). `items` rỗng = xóa hết rau tuần đó.
 * Không dùng multipart — chỉ JSON.
 */
export async function saveExperienceWeeklyProducts(payload: {
  weekStartDate: string;
  items: ExperienceWeeklyItemInput[];
}): Promise<ExperienceWeeklyListResponse> {
  const res = await api.put<ExperienceWeeklyListResponse>('/admin/experience-weekly/box-products', payload, {
    withAuth: true,
  });
  return getData(res);
}
