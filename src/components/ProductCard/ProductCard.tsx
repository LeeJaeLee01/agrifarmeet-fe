import React from 'react';
import { TProduct } from '../../types/TProduct';
import { Link } from 'react-router-dom';
import { formatWeight } from '../../utils/helper';
import './ProductCard.scss';

const ProductCard: React.FC<TProduct> = (props) => {
  const { id, name, image, images, weight } = props;

  // Determine display image
  let displayImage = image;
  if (!displayImage && images) {
    if (Array.isArray(images)) {
      if (images.length > 0) displayImage = images[0];
    } else {
      try {
        const parsedImages = JSON.parse(images);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          displayImage = parsedImages[0];
        }
      } catch (e) {
        console.error("Error parsing product images:", e);
      }
    }
  }
  // Fallback
  if (!displayImage) {
    displayImage = 'https://via.placeholder.com/300';
  }

  return (
    <div className="relative flex flex-col h-full pb-4 transition bg-white rounded-lg cursor-pointer group card">
      <Link to={`/product/${id}`} className="flex-1">
        <div className="relative">
          <img src={displayImage} alt={name} className="object-cover w-full h-40 rounded-lg" />
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
