export type TSwiperList = {
  children: React.ReactNode;
  slidesPerViewConfig?: Record<number, { slidesPerView: number }>;
  spaceBetween?: number;
  className?: string;
  loop?: boolean;
};
