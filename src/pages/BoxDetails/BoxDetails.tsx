import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import Section from '../../components/Section/Section';
import api from '../../utils/api';
import { Spin, Table, Modal, Button } from 'antd';
import { ShareAltOutlined, DownloadOutlined, RightOutlined, DownOutlined } from '@ant-design/icons';
import { TBox, TBoxProduct } from '../../types/TBox';
import { TProduct } from '../../types/TProduct';
import { TProductCooperative } from '../../types/TCooperative';
import { QRCodeCanvas } from 'qrcode.react';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { useTitle } from '../../hooks/useTitle';
import { formatVND } from '../../utils/helper';

const BoxDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [box, setBox] = useState<TBox | null>(null);
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  // State cho việc hiển thị modal chi tiết sản phẩm
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TBoxProduct | null>(null);
  const [cooperativesData, setCooperativesData] = useState<Record<string, TProductCooperative[]>>({});
  const [loadingCooperatives, setLoadingCooperatives] = useState<Record<string, boolean>>({});

  const currentUrl = window.location.href;

  useEffect(() => {
    const fetchBox = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ status: number; data: TBox }>(`/boxes/${id}`);
        if (res.data && res.data.data) {
          setBox(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching box:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBox();
  }, [id]);

  const handleShowProductDetail = async (record: TBoxProduct) => {
    setSelectedProduct(record);
    setProductModalOpen(true);

    if (!cooperativesData[record.id]) {
      try {
        setLoadingCooperatives((prev) => ({ ...prev, [record.id]: true }));
        // API call to get product details including cooperatives
        const res = await api.get<{ status: number; data: TProduct & { productCooperatives: TProductCooperative[] } }>(
          `/products/${record.product.slug}`
        );

        if (res.data && res.data.data && res.data.data.productCooperatives) {
          setCooperativesData((prev) => ({
            ...prev,
            [record.id]: res.data.data.productCooperatives,
          }));
        }
      } catch (err) {
        console.error('Error fetching cooperatives:', err);
      } finally {
        setLoadingCooperatives((prev) => ({ ...prev, [record.id]: false }));
      }
    }
  };

  // Hàm lưu modal thành ảnh
  const handleSaveImage = async () => {
    if (!modalRef.current || !box) return;

    try {
      // Tìm canvas QR code
      const qrCanvas = modalRef.current.querySelector('canvas') as HTMLCanvasElement;

      if (!qrCanvas) {
        console.error('Không tìm thấy QR code canvas');
        return;
      }

      // Đợi canvas render xong (đặc biệt quan trọng trên mobile)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Tạo canvas mới để combine text và QR code
      const outputCanvas = document.createElement('canvas');
      const ctx = outputCanvas.getContext('2d');

      if (!ctx) {
        console.error('Không thể tạo canvas context');
        return;
      }

      // Kích thước canvas output
      const padding = 40;
      const qrSize = qrCanvas.width;
      const textHeight = 60;
      const canvasWidth = qrSize + padding * 2;
      const canvasHeight = qrSize + textHeight + padding * 3;

      outputCanvas.width = canvasWidth;
      outputCanvas.height = canvasHeight;

      // Vẽ nền trắng
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Vẽ text (tên box)
      ctx.fillStyle = '#171725';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Wrap text nếu quá dài
      const maxWidth = canvasWidth - padding * 2;
      const words = box.name.split(' ');
      let line = '';
      let y = padding;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, canvasWidth / 2, y);
          line = words[i] + ' ';
          y += 30;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvasWidth / 2, y);

      // Vẽ QR code vào giữa canvas
      const qrX = padding;
      const qrY = textHeight + padding * 2;
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // Convert canvas thành blob và download
      outputCanvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Không thể tạo blob từ canvas');
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${box.name || 'box'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Cleanup
          setTimeout(() => URL.revokeObjectURL(url), 100);
        },
        'image/png',
        1.0
      );
    } catch (err) {
      console.error('Lỗi khi lưu ảnh:', err);
    }
  };

  return (
    <Fragment>
      <MainHeader sticky />
      <Section spaceBottom>
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : box ? (
            <>
              {/* Thông tin box */}
              <div className="flex items-start justify-between">
                <h1 className="section-title">{box.name}</h1>
                <Button type="primary" icon={<ShareAltOutlined />} onClick={() => setOpen(true)}>
                  {t('common.share')}
                </Button>
              </div>

              <div className="flex flex-col items-center w-full gap-10 pb-10 mb-10 lg:flex-row lg:items-stretch">
                <div className="flex w-40 lg:w-60">
                  {/* Placeholder for Box Image based on product image or default */}
                  <img
                    src={box.images?.[0] || 'https://api.nongthonviet.com.vn/media/6075f867068bb739ff944505_images1469385_1.jpg'}
                    alt={box.name}
                    className="object-cover w-full h-full rounded-xl"
                  />
                </div>
                <div className="flex flex-col w-full gap-5 lg:w-1/2">
                  <p className="text-base text-text2">{box.description}</p>
                  <p className="text-lg font-semibold text-green-600">
                    Giá: {formatVND(box.price)}
                  </p>
                  {/* isTrial removed */}
                  <Link to={`/purchase/${box.slug}`}>
                    <Button
                      type="primary"
                      size="large"
                      className="w-full mt-4 bg-green2 hover:bg-green-700"
                      style={{ backgroundColor: '#3da35d' }}
                    >
                      Mua ngay
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <h2 className="mb-5 text-xl font-semibold text-text1">Sản phẩm trong gói</h2>
              <Table<TBoxProduct>
                rowKey="id"
                dataSource={box.boxProducts || []}
                pagination={false}
                columns={[
                  {
                    // title: 'Hình ảnh',
                    dataIndex: ['product', 'images'],
                    width: 120,
                    key: 'images',
                    render: (images: string[]) => {
                      const src = Array.isArray(images) && images.length > 0 ? images[0] : 'https://via.placeholder.com/64';
                      return <img src={src} alt="product" className="object-cover w-24 h-20 rounded-md" />;
                    },
                  },
                  {
                    title: '',
                    width: 120,
                    key: 'action',
                    align: 'center',
                    render: (_, record) => (
                      <span
                        className="text-green-600 cursor-pointer hover:underline"
                        onClick={() => handleShowProductDetail(record)}
                      >
                        {t('components.product_item.detail')}
                      </span>
                    ),
                  },
                  {
                    title: 'Tên sản phẩm',
                    dataIndex: ['product', 'name'],
                    key: 'name',
                  },
                  {
                    title: 'Khối lượng',
                    dataIndex: ['product', 'weight'],
                    key: 'weight',
                    render: (w: number, record: TBoxProduct) => `${w} ${record.unit}`,
                  },
                  {
                    title: 'Tổng',
                    key: 'total',
                    align: 'right',
                    render: (_, record) => `${record.quantity} ${record.unit}`,
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
              {/* Modal Product Detail */}
              <Modal
                open={productModalOpen}
                onCancel={() => setProductModalOpen(false)}
                footer={null}
                width={800}
                title="Thông tin chi tiết sản phẩm"
                centered
              >
                {selectedProduct && (
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                      <img
                        src={Array.isArray(selectedProduct.product.images) && selectedProduct.product.images.length > 0 ? selectedProduct.product.images[0] : 'https://via.placeholder.com/150'}
                        alt={selectedProduct.product.name}
                        className="object-cover w-32 h-32 rounded-lg"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">{selectedProduct.product.name}</h3>
                        <p className="text-gray-500">{selectedProduct.product.description}</p>
                        <p className="mt-2 font-semibold text-green-600">
                          Khối lượng: {selectedProduct.product.weight} {selectedProduct.unit}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3 text-lg font-semibold">{t('components.product_item.cooperative')}</h4>
                      {loadingCooperatives[selectedProduct.id] ? (
                        <div className="flex justify-center py-4"><Spin /></div>
                      ) : (
                        <Table<TProductCooperative>
                          rowKey={(item) => `${item.cooperativeId}-${item.productId}`}
                          dataSource={cooperativesData[selectedProduct.id] || []}
                          pagination={false}
                          columns={[
                            {
                              title: t('common.image'),
                              dataIndex: ['cooperative', 'images'],
                              key: 'cooperativeImage',
                              render: (images: string) => {
                                try {
                                  const parsedImages = JSON.parse(images);
                                  const src = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : 'https://via.placeholder.com/80';
                                  return <img src={src} alt="cooperative" className="object-cover w-20 h-20 rounded-md" />;
                                } catch (e) {
                                  return <img src="https://via.placeholder.com/80" alt="cooperative" className="object-cover w-20 h-20 rounded-md" />;
                                }
                              },
                            },
                            {
                              title: 'Tên Hợp tác xã',
                              dataIndex: ['cooperative', 'name'],
                              key: 'cooperativeName',
                            },
                            {
                              title: 'Địa chỉ',
                              dataIndex: ['cooperative', 'address'],
                              key: 'cooperativeAddress',
                            },
                            {
                              title: t('common.website'),
                              dataIndex: ['cooperative', 'website'],
                              key: 'cooperativeWebsite',
                              render: (website: string | null) => {
                                if (!website) return null;
                                return (
                                  <a href={website} target="_blank" rel="noopener noreferrer">
                                    <QRCodeCanvas value={website} size={80} />
                                  </a>
                                );
                              },
                            },
                            {
                              title: 'Khả năng cung ứng',
                              dataIndex: 'supplyCapacity',
                              key: 'supplyCapacity',
                              render: (val, item) => `${val} ${item.unit}`,
                            },
                            {
                              title: 'Trạng thái',
                              dataIndex: 'isAvailable',
                              key: 'isAvailable',
                              render: (avail) => (
                                <span className={avail ? 'text-green-600' : 'text-red-600'}>
                                  {avail ? 'Sẵn sàng' : 'Không sẵn sàng'}
                                </span>
                              ),
                            },
                          ]}
                        />
                      )}
                    </div>
                  </div>
                )}
              </Modal>
            </>
          ) : (
            <p className="text-center text-gray-500">Không tìm thấy box.</p>
          )}
        </div>
      </Section>
      <MainFooter />
    </Fragment>
  );
};

export default BoxDetails;
