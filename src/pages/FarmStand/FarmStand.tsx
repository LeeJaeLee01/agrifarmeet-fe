import React, { useState, useEffect } from 'react';
import Section from '../../components/Section/Section';
import { Button, Progress, Table, message } from 'antd';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CartItem {
  productId: string;
  name: string;
  image?: string;
  productWeight: number; // khối lượng 1 đơn vị sản phẩm (g)
  quantity: number; // số lượng sản phẩm
}

interface BoxData {
  id: string; // box_user_id
  name: string;
  description: string;
  totalWeight: number;
  products: CartItem[];
}

const FarmStand: React.FC = () => {
  const [boxData, setBoxData] = useState<BoxData | null>(null);

  // tính tổng khối lượng hiện tại
  function getUsedWeight(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.quantity * item.productWeight, 0);
  }

  // gọi API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          'http://localhost:3030/boxes/active/user',
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const data = res.data;

        const mappedItems: CartItem[] = data.boxUserProducts.map((item: any) => ({
          productId: item.productId,
          name: item.product?.name || 'Không tên',
          image: item.product?.image,
          productWeight: item.product?.weight ? parseFloat(item.product.weight) : 0,
          quantity: item.quantity ? parseFloat(item.quantity) : 0,
        }));

        setBoxData({
          id: data.id, // box_user_id
          name: data.box?.name || '',
          description: data.box?.description || '',
          totalWeight: data.box?.totalWeight ? parseFloat(data.box.totalWeight) : 0,
          products: mappedItems,
        });
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  // xử lý tăng giảm số lượng
  const updateQuantity = (productId: string, delta: number) => {
    if (!boxData) return;

    const updatedProducts = boxData.products.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );

    setBoxData({ ...boxData, products: updatedProducts });
  };

  const handleUpdateList = async () => {
    if (!boxData) return;

    try {
      const payload = {
        id: boxData.id, // box_user_id
        products: boxData.products.map((p) => ({
          id: p.productId,
          quantity: p.quantity,
        })),
      };

      await axios.put('http://localhost:3030/boxes/user-products/update-list', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Cập nhật gói thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật thất bại, vui lòng thử lại.');
    }
  };

  if (!boxData) {
    return (
      <Section>
        <div className="container mx-auto">Đang tải dữ liệu...</div>
      </Section>
    );
  }

  const usedWeight = getUsedWeight(boxData.products);
  const progress = boxData.totalWeight > 0 ? (usedWeight / boxData.totalWeight) * 100 : 0;

  const columns: ColumnsType<CartItem> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (src, record) =>
        src ? (
          <Link to={`/product/${record.productId}`}>
            <img src={src} alt="product" className="object-cover rounded-lg w-14 h-14" />
          </Link>
        ) : (
          <span>Không có</span>
        ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/product/${record.productId}`}>{text}</Link>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record) => {
        const disablePlus = usedWeight + record.productWeight > boxData.totalWeight;

        return (
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center border rounded-md border-text4">
              <Button
                type="text"
                className="px-3"
                onClick={() => updateQuantity(record.productId, -1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <div className="px-4">{quantity}</div>
              <Button
                type="text"
                className="px-3"
                onClick={() => updateQuantity(record.productId, 1)}
                disabled={disablePlus}
              >
                +
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Khối lượng mỗi sp (g)',
      dataIndex: 'productWeight',
      key: 'productWeight',
      render: (w: number) => <span>{w} g</span>,
    },
    {
      title: 'Tổng khối lượng (g)',
      key: 'totalWeight',
      render: (_, record) => (
        <span>
          {record.quantity && record.productWeight ? record.quantity * record.productWeight : 0} g
        </span>
      ),
    },
  ];

  return (
    <Section>
      <div className="container mx-auto">
        <h2 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">Farm Stand</h2>
        <div className="flex flex-col justify-between w-full gap-5 mb-10 lg:flex-row item-center">
          <div>
            <p className="mb-3 text-lg font-semibold lg:mb-5 lg:text-2xl text-text1">
              {boxData.name}
            </p>
            <span className="text-text2">{boxData.description}</span>
          </div>
          <div className="flex justify-between w-full font-semibold text-right lg:block lg:justify-start">
            <Progress
              percent={Math.round(progress)}
              status="active"
              className="w-full max-w-[150px] lg:mb-5"
              strokeColor={progress < 50 ? '#d60016' : progress < 80 ? '#f4a259' : '#3da35d'}
            />
            <p className="m-0 text-sm text-text2">
              Tổng: {usedWeight}g / {boxData.totalWeight}g
            </p>
          </div>
        </div>
        <Table
          dataSource={boxData.products}
          columns={columns}
          rowKey="productId"
          pagination={false}
          scroll={{ x: 'max-content' }}
          className="mb-10"
        />
        <div className="flex justify-end pb-10">
          <Button
            type="primary"
            className="text-white rounded-lg bg-green"
            onClick={handleUpdateList}
          >
            Điều chỉnh thông tin gói
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default FarmStand;
