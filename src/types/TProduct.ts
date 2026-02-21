export type TProduct = {
  id: string;
  name: string;
  slug: string;
  image?: string; // Optional for compatibility
  images: string | string[]; // JSON string or array of images
  description: string;
  weight: number;
  categoryId: string;
  status: string;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
};
