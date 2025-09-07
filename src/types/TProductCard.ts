export type TProductCard = {
  id: string;
  image: string;
  name: string;
  unit: string; // Đơn vị tính: cân, gói, ...
  oldPrice?: number | string; // Giá trước
  price?: number | string; // Giá hiện tại
  discount?: number | string; // % giảm giá
  weight?: number; // khối lượng (g)
};
