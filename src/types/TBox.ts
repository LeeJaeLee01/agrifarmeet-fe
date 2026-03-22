import { TProduct } from './TProduct';

export type TBoxProduct = {
  id: string;
  boxId: string;
  productId: string;
  quantity: number;
  unit: string;
  isOptional: boolean;
  weekStartDate: string;
  product: TProduct;
  createdAt: string;
  updatedAt: string;
};

/** Danh mục trong response GET /boxes/:slug (box_details) */
export type TBoxDetailCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

/** Sản phẩm trong box_details (dạng phẳng từ API) */
export type TBoxDetailProductItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  weight: number;
  unit: string;
  images: string[];
  status: string;
  quantity: number;
  boxUnit: string;
  isOptional: boolean;
  weekStartDate: string;
  boxProductId: string;
};

export type TBoxDetailGroup = {
  category: TBoxDetailCategory;
  products: TBoxDetailProductItem[];
};

export type TBox = {
  id: string;
  name: string;
  slug: string;
  shortTitle: string;
  description: string;
  images: string[];
  includes: {
    serving_size: string;
    duration_text: string;
    product_count: number;
  };
  price: string;
  duration: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  /** Legacy: danh sách phẳng */
  boxProducts?: TBoxProduct[];
  /** Mới: nhóm theo danh mục */
  box_details?: TBoxDetailGroup[];
};

/** Hàng bảng: TBoxProduct + optional category (khi dữ liệu từ box_details) */
export type TBoxProductRow = TBoxProduct & {
  category?: TBoxDetailCategory;
};
