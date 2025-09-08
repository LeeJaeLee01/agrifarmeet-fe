import React, { useEffect, useState } from 'react';
import api, { BASE_URL } from '../../utils/api';
import { message } from 'antd';
import Section from '../../components/Section/Section';

type TCategory = {
  id: string;
  name: string;
  image: string;
};

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<TCategory[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get(`${BASE_URL}:3030/categories`);

      setCategories(response.data);
      console.log(response.data);
    } catch (error) {
      message.error('Không thể tải giỏ hàng');
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Section secondary>
      <div className="container mx-auto">
        <div className="flex items-center justify-between w-full mb-8 text-text1 title">
          <h2 className="m-0 text-xl">Danh mục sản phẩm</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((item) => (
            <div key={item.id} className="">
              <img
                src={item.image}
                alt={item.name}
                className="block object-cover w-20 h-20 mb-4 rounded-lg"
              />
              <h3 className="mb-2 text-lg font-normal text-text1">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default CategorySection;
