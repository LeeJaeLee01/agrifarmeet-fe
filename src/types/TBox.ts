import { TProduct } from './TProduct';

export type TBox = {
  id: string;
  name: string;
  description: string;
  status: string;
  price: string;
  image?: string;
  totalWeight: string;
  products: TProduct[];
  expiredAt: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
