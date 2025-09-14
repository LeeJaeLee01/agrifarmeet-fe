import React from 'react';
import { TProduct } from '../../types/TProduct';
import { Link } from 'react-router-dom';
import { formatWeight } from '../../utils/helper';
import './ProductCard.scss';

const ProductCard: React.FC<TProduct> = ({ id, name, image, weight }) => {
  return (
    <div className="relative flex flex-col h-full pb-4 transition bg-white rounded-lg cursor-pointer group card">
      <Link to={`/product/${id}`} className="flex-1">
        <div className="relative">
          <img src={image} alt={name} className="object-cover w-full h-40 rounded-lg" />
        </div>

        <div className="flex-1 px-3 mt-4">
          <h3 className="h-10 mb-2 text-sm font-medium text-text1 line-clamp-2">{name}</h3>
          <p className="mb-3 text-xs text-text3">Khối lượng tịnh: {formatWeight(weight)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
