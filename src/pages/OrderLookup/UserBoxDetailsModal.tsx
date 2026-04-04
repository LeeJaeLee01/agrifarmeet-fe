import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { formatVND } from '../../utils/helper';

interface UserBoxDetailsModalProps {
  open: boolean;
  userBoxId: string | null;
  onClose: () => void;
}

const UserBoxDetailsModal: React.FC<UserBoxDetailsModalProps> = ({ open, userBoxId, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (open && userBoxId) {
      fetchUserBoxDetails();
    } else {
      setData(null);
    }
  }, [open, userBoxId]);

  const fetchUserBoxDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/boxes/user-box/${userBoxId}`);
      const payload = res.data?.data ?? res.data;
      setData(payload);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (images: any) => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch {
        return images;
      }
    }
    return 'https://via.placeholder.com/80';
  };

  return (
    <Modal
      title={t('orderLookup.viewVegetables') || 'Chi tiết rau trong gói'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      {loading ? (
        <p className="text-sm text-text3 my-4">{t('orderLookup.loading') || 'Đang tải...'}</p>
      ) : data ? (
        <div className="max-h-[70vh] overflow-y-auto pr-2 mt-4 space-y-6">
          {/* box_details */}
          {data.box_details && data.box_details.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-text1 mb-3">
                {t('orderLookup.vegetablesInBox') || 'Các loại rau trong gói'}
              </h3>
              <div className="space-y-4">
                {data.box_details.map((detail: any, idx: number) => (
                  <div key={idx} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-green-700 text-sm mb-2">{detail.category?.name}</p>
                    <div className="space-y-2">
                      {detail.products?.map((prod: any, pIdx: number) => (
                        <div key={pIdx} className="flex gap-3 items-center">
                          <img
                            src={getProductImage(prod.images)}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-md flex-shrink-0 border"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text1 line-clamp-1">{prod.name}</p>
                            <p className="text-xs text-text3 mt-0.5">
                              {prod.weight && prod.unit ? `${prod.weight}${prod.unit}` : ''}
                            </p>
                          </div>
                          <div className="text-sm font-medium">
                            x{prod.quantity || 1} {prod.boxUnit || ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* user_add_ons */}
          {data.user_add_ons && data.user_add_ons.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-text1 mb-3">
                {t('orderLookup.userAddOns') || 'Các sản phẩm mua thêm'}
              </h3>
              <div className="space-y-2">
                {data.user_add_ons.map((addon: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <img
                      src={getProductImage(addon.images)}
                      alt={addon.name}
                      className="w-12 h-12 object-cover rounded-md flex-shrink-0 border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text1 line-clamp-1">{addon.name}</p>
                      <p className="text-xs text-green-600 mt-0.5 font-medium">
                        {formatVND(addon.priceSnapshot || addon.price || 0)}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      x{addon.quantity || 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!data.box_details?.length && !data.user_add_ons?.length) && (
            <p className="text-sm text-text3 text-center my-8">
              {t('orderLookup.noProducts') || 'Chưa có sản phẩm nào trong gói này.'}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-text3 text-center my-8">
          {t('orderLookup.noData') || 'Không thể tải dữ liệu.'}
        </p>
      )}
    </Modal>
  );
};

export default UserBoxDetailsModal;
