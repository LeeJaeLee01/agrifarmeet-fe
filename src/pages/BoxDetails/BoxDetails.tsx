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
import { formatVND, getFirstCooperativeImageUrl } from '../../utils/helper';

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
              <div className="flex items-start justify-between -mt-4 lg:mt-0">
                <h1 className="section-title">{box.name}</h1>
                <div className="flex items-center gap-2">
                  {/* Mobile: chỉ icon, đặt bên phải tên box */}
                  <Button
                    type="default"
                    icon={<ShareAltOutlined />}
                    onClick={() => setOpen(true)}
                    className="sm:hidden"
                  />
                  {/* Desktop: nút có text Share */}
                  <Button
                    type="primary"
                    icon={<ShareAltOutlined />}
                    onClick={() => setOpen(true)}
                    className="hidden sm:inline-flex"
                  >
                    {t('common.share')}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center w-full gap-10 pb-10 mb-10 lg:flex-row lg:items-stretch">
                <div className="w-full lg:w-60">
                  {/* Placeholder for Box Image based on product image or default */}
                  <img
                    src={box.images?.[0] || 'https://api.nongthonviet.com.vn/media/6075f867068bb739ff944505_images1469385_1.jpg'}
                    alt={box.name}
                    className="object-cover w-full h-auto max-h-80 rounded-xl"
                  />
                </div>
                <div className="flex flex-col w-full gap-5 lg:w-1/2">
                  <p className="text-base text-text2">{box.description}</p>
                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold text-green-600">
                        {t('common.price')}: {formatVND(box.price)}
                      </p>
                    </div>
                    {/* isTrial removed */}
                    <Link to={`/purchase/${box.slug}`} className="sm:ml-4">
                      <Button
                        type="primary"
                        size="large"
                        className="w-full sm:w-auto bg-green2 hover:bg-green-700"
                        style={{ backgroundColor: '#3da35d' }}
                      >
                        {t('common.buyNow')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <h2 className="mb-5 text-xl font-semibold text-text1">
                {t('common.productsInPackage')}
              </h2>
              <div className="w-full overflow-x-auto">
                <Table<TBoxProduct>
                  rowKey="id"
                  dataSource={box.boxProducts || []}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
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
                      title: t('common.productName'),
                      dataIndex: ['product', 'name'],
                      key: 'name',
                    },
                    {
                      title: t('common.weight'),
                      dataIndex: ['product', 'weight'],
                      key: 'weight',
                      render: (w: number, record: TBoxProduct) => `${w} ${record.unit}`,
                    },
                    {
                      title: t('common.total'),
                      key: 'total',
                      align: 'right',
                      render: (_, record) => `${record.quantity} ${record.unit}`,
                    },

                  ]}
                />
              </div>

              {/* Modal share */}
              <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={[
                  <Button key="save" icon={<DownloadOutlined />} onClick={handleSaveImage}>
                    {t('common.saveImage')}
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
                width="100%"
                style={{ maxWidth: 800 }}
                title={t('boxDetails.productDetailTitle')}
                centered
              >
                {selectedProduct && (
                  <div
                    className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto no-scrollbar"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <img
                        src={
                          Array.isArray(selectedProduct.product.images) &&
                          selectedProduct.product.images.length > 0
                            ? selectedProduct.product.images[0]
                            : 'https://via.placeholder.com/150'
                        }
                        alt={selectedProduct.product.name}
                        className="object-cover w-full h-auto rounded-lg sm:w-40 sm:h-40"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">{selectedProduct.product.name}</h3>
                        <p className="mt-1 text-gray-500">{selectedProduct.product.description}</p>
                        <p className="mt-2 font-semibold text-green-600">
                          {t('common.weight')}: {selectedProduct.product.weight} {selectedProduct.unit}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3 text-lg font-semibold">
                        {t('components.product_item.cooperative')}
                      </h4>
                      {loadingCooperatives[selectedProduct.id] ? (
                        <div className="flex justify-center py-4">
                          <Spin />
                        </div>
                      ) : (
                        <div className="w-full overflow-x-auto">
                          <Table<TProductCooperative>
                            rowKey={(item) => `${item.cooperativeId}-${item.productId}`}
                            dataSource={cooperativesData[selectedProduct.id] || []}
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                            columns={[
                              {
                                title: t('common.image'),
                                dataIndex: ['cooperative', 'images'],
                                key: 'cooperativeImage',
                                render: (images: string | string[] | null | undefined) => {
                                  const src = getFirstCooperativeImageUrl(images, 'https://via.placeholder.com/80');
                                  return (
                                    <img
                                      src={src}
                                      alt="cooperative"
                                      className="object-cover w-20 h-20 rounded-md"
                                    />
                                  );
                                },
                              },
                              {
                                title: t('boxDetails.cooperativeName'),
                                dataIndex: ['cooperative', 'name'],
                                key: 'cooperativeName',
                              },
                              {
                                title: t('common.address'),
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
                                title: t('boxDetails.supplyCapacity'),
                                dataIndex: 'supplyCapacity',
                                key: 'supplyCapacity',
                                render: (val, item) => `${val} ${item.unit}`,
                              },
                              {
                                title: t('boxDetails.status'),
                                dataIndex: 'isAvailable',
                                key: 'isAvailable',
                                render: (avail) => (
                                  <span
                                    className={avail ? 'text-green-600' : 'text-red-600'}
                                  >
                                    {avail ? t('boxDetails.available') : t('boxDetails.unavailable')}
                                  </span>
                                ),
                              },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Modal>
            </>
          ) : (
            <p className="text-center text-gray-500">{t('common.boxNotFound')}</p>
          )}
        </div>
      </Section>
      <MainFooter />
    </Fragment>
  );
};

export default BoxDetails;
