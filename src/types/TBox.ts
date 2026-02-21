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
  boxProducts: TBoxProduct[];
};
