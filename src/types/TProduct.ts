import type { TCategory } from './TCategory';

export type TProduct = {
  id: string;
  name: string;
  slug: string;
  image?: string; // Optional for compatibility
  images: string | string[]; // JSON string or array of images
  description: string;
  weight: number;
  /** Đơn vị khối lượng (kg, bó, ...) — có trong API product */
  unit?: string;
  categoryId: string;
  category?: TCategory;
  status: string;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  priceAddOn?: number;
  isAddOn?: boolean;
  /** Đang mở bán (add-on / on-sale catalog); API có thể trả 0/1 */
  isSale?: boolean | number;
};
