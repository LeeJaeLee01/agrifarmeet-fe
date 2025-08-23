import React from 'react';
import { formatVND } from '../../utils/helper';
import { TProductCard } from '../../types/TProductCard';
import { toast } from 'react-toastify';

const ProductCard: React.FC<TProductCard> = ({ img, name, unit, oldPrice, price, discount }) => {
  return (
    <div className="relative flex flex-col h-full pb-4 transition bg-white border rounded-lg cursor-pointer group">
      <div className="relative">
        <img src={img} alt={name} className="object-cover w-full h-40 rounded-lg" />
        {discount && (
          <span className="absolute px-2 py-1 text-xs font-bold bg-red-500 rounded-lg top-1 right-1 text-red bg-rose-200">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex-1 px-3 mt-4">
        <h3 className="h-10 mb-2 text-sm font-medium text-text1 line-clamp-2">{name}</h3>
        <p className="mb-3 text-xs text-text3">Đơn vị tính: {unit}</p>

        <div className="flex items-center gap-2">
          {oldPrice && (
            <span className="text-sm line-through text-text4">{formatVND(oldPrice)}</span>
          )}
          <span className="text-base font-semibold text-green">{formatVND(price)}</span>
        </div>
      </div>
      <div className="px-3">
        <button
          onClick={() => toast.success('Thành công!')}
          className="w-full px-2 py-2 mt-3 text-sm font-normal transition bg-green-500 border rounded-lg text-purple border-purple group-hover:bg-purple group-hover:text-white"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
