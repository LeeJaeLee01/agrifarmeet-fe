export type TProductCard = {
  img: string;
  name: string;
  unit: string; // Đơn vị tính: cân, gói, ...
  oldPrice?: number; // Giá trước
  price: number; // Giá hiện tại
  discount?: number; // % giảm giá
};
