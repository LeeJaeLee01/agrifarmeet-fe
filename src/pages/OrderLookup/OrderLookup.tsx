import React, { useState, useCallback } from 'react';
import { Input, Button, Modal, Progress } from 'antd';
import Section from '../../components/Section/Section';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import api from '../../utils/api';
import { useTitle } from '../../hooks/useTitle';
import { formatDate } from '../../utils/helper';
import { toast } from 'react-toastify';
import './OrderLookup.scss';

const DELIVERY_STEPS = ['Đã đặt hàng', 'Đang lấy hàng', 'Đang giao', 'Hoàn thành'];
const DELIVERY_STEP_MAP: Record<string, number> = {
  pending: 0,
  prepared: 0,
  picking_up: 1,
  delivering: 2,
  completed: 3,
};

const OrderLookup: React.FC = () => {
  useTitle('Xem thông tin đơn hàng');

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [deliveryModalItem, setDeliveryModalItem] = useState<any | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<any | null>(null);
  const [loadingDeliveryDetails, setLoadingDeliveryDetails] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = phone.replace(/\D/g, '');
    if (trimmed.length !== 10) {
      toast.error('Vui lòng nhập đúng 10 số điện thoại');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const res = await api.get(`/users/phone/${trimmed}/history`);
      const data = res.data?.data ?? res.data;
      const list = Array.isArray(data) ? data : [];
      setOrders(list);
      if (list.length === 0) {
        toast.info('Không tìm thấy đơn hàng nào với số điện thoại này.');
      }
    } catch (err: any) {
      console.error(err);
      setOrders([]);
      const msg = err?.response?.data?.message ?? err?.message ?? 'Không tra cứu được đơn hàng.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const openDeliveryModal = useCallback(async (item: any) => {
    setDeliveryModalItem(item);
    setDeliveryDetails(null);
    const userBoxId = item?.userBox?.id;
    if (!userBoxId) return;

    setLoadingDeliveryDetails(true);
    try {
      const res = await api.get(`/deliveries/user-box/${userBoxId}/details`);
      const data = res.data?.data ?? res.data;
      setDeliveryDetails(data);
    } catch (err: any) {
      console.error(err);
      toast.error('Không tải được chi tiết giao hàng.');
      setDeliveryDetails(null);
    } finally {
      setLoadingDeliveryDetails(false);
    }
  }, []);

  const closeDeliveryModal = useCallback(() => {
    setDeliveryModalItem(null);
    setDeliveryDetails(null);
  }, []);

  const effectiveDeliveryStatus =
    deliveryDetails?.delivery?.status ?? deliveryModalItem?.delivery?.status ?? null;

  const deliveryStepIndex = effectiveDeliveryStatus != null
    ? (DELIVERY_STEP_MAP[effectiveDeliveryStatus] ?? 0)
    : 0;

  return (
    <>
      <MainHeader sticky />
      <Section spaceBottom>
        <div className="container mx-auto order-lookup-page">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl text-text1">Xem thông tin đơn hàng</h1>
          <p className="mb-8 text-text3">Nhập số điện thoại đã dùng khi đặt hàng để tra cứu.</p>

          <form onSubmit={handleSubmit} className="max-w-md mb-10">
            <label className="block mb-2 text-sm font-medium text-text1">Số điện thoại</label>
            <div className="flex gap-3">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Nhập 10 số điện thoại"
                className="h-12 text-base"
                maxLength={10}
              />
              <Button type="primary" htmlType="submit" loading={loading} className="h-12 px-6 bg-green">
                Tra cứu
              </Button>
            </div>
          </form>

          {searched && (
            <div className="order-lookup-result">
              {orders.length === 0 ? (
                <p className="text-text3">Chưa có đơn hàng nào với số điện thoại này.</p>
              ) : (
                <ul className="order-list">
                  {orders.map((item: any, index: number) => {
                    const userBox = item.userBox ?? {};
                    const box = item.box ?? {};
                    const transactions = item.transactions ?? [];
                    const delivery = item.delivery ?? {};
                    const paymentTx = transactions.find((t: any) => t.type === 'payment') ?? transactions[0];
                    return (
                      <li key={userBox.id ?? box.id ?? index} className="order-card">
                        <div className="order-card-header">
                          <h3 className="order-card-title">{box.name ?? 'Gói hàng'}</h3>
                          {box.price != null && (
                            <span className="order-card-price">{Number(box.price).toLocaleString('vi-VN')} VND</span>
                          )}
                        </div>
                        <div className="order-card-body">
                          <div className="order-card-section">
                            <span className="section-label">Trạng thái gói</span>
                            <span className={`section-value status-badge status-${userBox.status ?? 'pending'}`}>
                              {userBox.status ?? '—'}
                            </span>
                          </div>
                          {paymentTx && (
                            <div className="order-card-section">
                              <span className="section-label">Thanh toán</span>
                              <span className={`section-value status-badge status-${paymentTx.status ?? 'pending'}`}>
                                {paymentTx.status ?? '—'}
                              </span>
                            </div>
                          )}
                          {delivery.status != null && (
                            <div className="order-card-section">
                              <span className="section-label">Giao hàng</span>
                              <span className="section-value">{delivery.status}</span>
                            </div>
                          )}
                          {delivery.scheduledDeliveryDate && (
                            <div className="order-card-section">
                              <span className="section-label">Ngày giao dự kiến</span>
                              <span className="section-value">
                                {formatDate(delivery.scheduledDeliveryDate)}
                              </span>
                            </div>
                          )}
                          {(delivery.status === 'picking_up' || delivery.status === 'delivering') && (
                            <div className="order-card-actions">
                              <Button type="primary" size="small" className="bg-green" onClick={() => openDeliveryModal(item)}>
                                Xem trạng thái giao hàng
                              </Button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </Section>

      <Modal
        title="Trạng thái giao hàng"
        open={!!deliveryModalItem}
        onCancel={closeDeliveryModal}
        footer={null}
        width={560}
        centered
        className="order-lookup-delivery-modal"
      >
        {deliveryModalItem && (
          <div className="delivery-modal-content">
            {loadingDeliveryDetails && (
              <p className="text-text3">Đang tải...</p>
            )}

            {!loadingDeliveryDetails && (
              <>
                <div className={`delivery-progress-wrap step-index-${deliveryStepIndex}`}>
                  <div className="delivery-steps">
                    {DELIVERY_STEPS.map((label, i) => (
                      <div
                        key={label}
                        className={`delivery-step ${i <= deliveryStepIndex ? 'active' : ''} ${i === deliveryStepIndex ? 'current' : ''}`}
                      >
                        <span className="step-dot" />
                        <span className="step-label">{label}</span>
                        {i < DELIVERY_STEPS.length - 1 && <span className="step-line" />}
                      </div>
                    ))}
                  </div>
                  <Progress
                    percent={Math.round(((deliveryStepIndex + 1) / DELIVERY_STEPS.length) * 100)}
                    showInfo={false}
                    strokeColor="#3da35d"
                    className="delivery-progress-bar"
                  />
                </div>

                <div className="delivery-shipper-card">
                  <h4 className="shipper-title">Shipper nhận giao đơn</h4>
                  {deliveryDetails?.delivery?.shipper ? (
                    <div className="shipper-info-list">
                      <p className="shipper-info-row">
                        <span className="shipper-info-label">Tài khoản:</span>
                        <span className="shipper-info-value">
                          {deliveryDetails.delivery.shipper.account ??
                            deliveryDetails.delivery.shipper.username ??
                            deliveryDetails.delivery.shipper.name ??
                            '—'}
                        </span>
                      </p>
                      <p className="shipper-info-row">
                        <span className="shipper-info-label">Số điện thoại:</span>
                        <span className="shipper-info-value">
                          {deliveryDetails.delivery.shipper.phone ?? '—'}
                        </span>
                      </p>
                      <p className="shipper-info-row">
                        <span className="shipper-info-label">Email:</span>
                        <span className="shipper-info-value">
                          {deliveryDetails.delivery.shipper.email ?? '—'}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="shipper-empty">
                        <div className="shipper-empty-icon">🚚</div>
                        <div className="shipper-empty-text">
                          <div className="shipper-empty-title">Chưa có shipper nhận giao</div>
                          <div className="shipper-empty-desc">
                            Đơn hàng của bạn đang được hệ thống phân công shipper. Vui lòng quay lại kiểm tra sau ít phút.
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="delivery-box-products">
                  <h4 className="box-products-title">Rau trong gói</h4>
                  <ul className="box-products-list">
                    {(deliveryDetails?.products ?? []).length === 0 ? (
                      <li className="text-text3">
                        Chưa có danh sách sản phẩm. Gói: {deliveryDetails?.box?.name ?? deliveryModalItem.box?.name ?? '—'}
                      </li>
                    ) : (
                      (deliveryDetails.products ?? []).map((p: any) => (
                        <li key={p.boxProductId ?? p.productId ?? p.id}>
                          <span className="product-name">{p.name ?? p.product?.name ?? 'Sản phẩm'}</span>
                          <span className="product-qty">× {p.quantity ?? 1} {p.unit ?? 'kg'}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      <MainFooter />
    </>
  );
};

export default OrderLookup;
