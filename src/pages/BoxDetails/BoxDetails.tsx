import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Section from '../../components/Section/Section';
import api from '../../utils/api';
import { Spin, Table, Modal, Button } from 'antd';
import { ShareAltOutlined, DownloadOutlined } from '@ant-design/icons';
import { TBox } from '../../types/TBox';
import { TProduct } from '../../types/TProduct';
import { QRCodeCanvas } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';

const BoxDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [box, setBox] = useState<TBox | null>(null);
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentUrl = window.location.href;

  useEffect(() => {
    const fetchBox = async () => {
      try {
        setLoading(true);
        const res = await api.get<TBox>(`/boxes/${id}`);
        setBox(res.data);
      } catch (err) {
        console.error('Error fetching box:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBox();
  }, [id]);

  // Hàm lưu modal thành ảnh
  const handleSaveImage = async () => {
    if (modalRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(modalRef.current);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${box?.name || 'box'}.png`;
        link.click();
      } catch (err) {
        console.error('Lỗi khi lưu ảnh:', err);
      }
    }
  };

  return (
    <Section>
      <div className="container mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : box ? (
          <>
            {/* Thông tin box */}
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl text-text1">{box.name}</h1>
              <Button type="primary" icon={<ShareAltOutlined />} onClick={() => setOpen(true)}>
                Chia sẻ
              </Button>
            </div>

            <div className="flex flex-col items-center w-full gap-10 pb-10 mb-10 lg:flex-row">
              <div className="flex w-40 lg:block lg:w-60">
                <img src={box.image} alt={box.name} className="object-cover w-full rounded-xl" />
              </div>
              <div className="flex flex-col w-full gap-5 lg:w-1/2">
                <p className="text-base text-text2">{box.description}</p>
                <p className="text-sm text-gray-500">
                  Tổng khối lượng: {Number(box.totalWeight)} g
                </p>
                <p className="text-lg font-semibold text-green-600">
                  Giá: {Number(box.price).toLocaleString('vi-VN')} ₫
                </p>
                {box.isTrial && (
                  <span className="px-3 py-1 text-sm font-medium text-white bg-orange-500 rounded-lg w-fit">
                    Gói dùng thử
                  </span>
                )}
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <h2 className="mb-5 text-xl font-semibold text-text1">Sản phẩm trong gói</h2>
            <Table<TProduct>
              rowKey="id"
              dataSource={box.products}
              pagination={false}
              columns={[
                {
                  title: 'Hình ảnh',
                  dataIndex: 'image',
                  key: 'image',
                  render: (img: string) => (
                    <img src={img} alt="product" className="object-cover w-16 h-16 rounded-md" />
                  ),
                },
                {
                  title: 'Tên sản phẩm',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Khối lượng',
                  dataIndex: 'weight',
                  key: 'weight',
                  render: (w: string) => `${Number(w)} g`,
                },
              ]}
            />

            {/* Modal share */}
            <Modal
              open={open}
              onCancel={() => setOpen(false)}
              footer={[
                <Button key="save" icon={<DownloadOutlined />} onClick={handleSaveImage}>
                  Lưu ảnh
                </Button>,
              ]}
              centered
            >
              <div
                ref={modalRef}
                className="flex flex-col items-center gap-5 p-5 bg-white rounded-xl"
              >
                <h3 className="text-xl font-semibold">{box.name}</h3>
                <QRCodeCanvas value={currentUrl} size={200} />
              </div>
            </Modal>
          </>
        ) : (
          <p className="text-center text-gray-500">Không tìm thấy box.</p>
        )}
      </div>
    </Section>
  );
};

export default BoxDetails;
