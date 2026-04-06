import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input, Button, Modal, Progress } from 'antd';
import Section from '../../components/Section/Section';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import api from '../../utils/api';
import { useTitle } from '../../hooks/useTitle';
import { formatDate } from '../../utils/helper';
import { toast } from 'react-toastify';
import './OrderLookup.scss';
import OrderLookupAddOnModal, { type OrderLookupAddOnBox } from './OrderLookupAddOnModal';
import OrderLookupSubscriptionVegModal from './OrderLookupSubscriptionVegModal';
import UserBoxDetailsModal from './UserBoxDetailsModal';

const ORDER_LOOKUP_PHONE_KEY = 'farme_order_lookup_phone';

function isTrialBoxFromBox(box: { slug?: string; name?: string }): boolean {
  const slugValue = String(box?.slug || '').toLowerCase();
  const nameValue = String(box?.name || '').toLowerCase();
  return (
    slugValue.includes('trai-nghiem') ||
    nameValue.includes('trải nghiệm') ||
    nameValue.includes('trai nghiem') ||
    nameValue.includes('thử nghiệm') ||
    nameValue.includes('thu nghiem')
  );
}

/** Gói cơ bản / linh hoạt (đăng ký), không tính gói trải nghiệm */
function isBasicFlexibleBoxFromBox(box: { slug?: string; name?: string }): boolean {
  if (isTrialBoxFromBox(box)) return false;
  const slug = String(box?.slug || '').toLowerCase();
  const name = String(box?.name || '').toLowerCase();
  const hasBasic =
    slug.includes('co-ban') ||
    slug.includes('co_ban') ||
    slug.includes('coban') ||
    name.includes('cơ bản') ||
    name.includes('co ban');
  const hasFlexible =
    slug.includes('linh-hoat') ||
    slug.includes('linh_hoat') ||
    slug.includes('linhhoat') ||
    name.includes('linh hoạt') ||
    name.includes('linh hoat');
  return hasBasic || hasFlexible;
}

function readStoredPhone(): string {
  try {
    const raw = localStorage.getItem(ORDER_LOOKUP_PHONE_KEY);
    if (raw && /^\d{10}$/.test(raw.replace(/\D/g, ''))) {
      return raw.replace(/\D/g, '').slice(0, 10);
    }
  } catch {
    /* ignore */
  }
  return '';
}

const DELIVERY_STEP_MAP: Record<string, number> = {
  pending: 0,
  prepared: 0,
  picking_up: 1,
  delivering: 2,
  completed: 3,
};

const OrderLookup: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('orderLookup.pageTitle'));
  const navigate = useNavigate();

  const deliveryStepLabels = useMemo(
    () => [
      t('orderLookup.deliveryStepOrdered'),
      t('orderLookup.deliveryStepPicking'),
      t('orderLookup.deliveryStepShipping'),
      t('orderLookup.deliveryStepDone'),
    ],
    [t]
  );

  const [phone, setPhone] = useState(readStoredPhone);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [deliveryModalItem, setDeliveryModalItem] = useState<any | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<any | null>(null);
  const [loadingDeliveryDetails, setLoadingDeliveryDetails] = useState(false);
  const [addOnBox, setAddOnBox] = useState<OrderLookupAddOnBox | null>(null);
  const [vegBox, setVegBox] = useState<OrderLookupAddOnBox | null>(null);
  const [viewVegUserBoxId, setViewVegUserBoxId] = useState<string | null>(null);


  const fetchOrdersByPhone = useCallback(
    async (trimmed: string) => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await api.get(`/users/phone/${trimmed}/history`);
        const data = res.data?.data ?? res.data;
        const list = Array.isArray(data) ? data : [];
        setOrders(list);
        try {
          localStorage.setItem(ORDER_LOOKUP_PHONE_KEY, trimmed);
        } catch {
          /* ignore quota / private mode */
        }
        if (list.length === 0) {
          toast.info(t('orderLookup.toastNoOrders'));
        }
      } catch (err: any) {
        console.error(err);
        setOrders([]);
        const msg = err?.response?.data?.message ?? err?.message ?? t('orderLookup.toastLookupFailed');
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = phone.replace(/\D/g, '');
    if (trimmed.length !== 10) {
      toast.error(t('orderLookup.toastPhoneInvalid'));
      return;
    }

    await fetchOrdersByPhone(trimmed);
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
      toast.error(t('orderLookup.toastDeliveryLoadFailed'));
      setDeliveryDetails(null);
    } finally {
      setLoadingDeliveryDetails(false);
    }
  }, [t]);

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
          <h1 className="mb-2 text-2xl font-bold md:text-3xl text-text1">{t('orderLookup.heading')}</h1>
          <p className="mb-8 text-text3">{t('orderLookup.description')}</p>

          <form onSubmit={handleSubmit} className="max-w-md mb-10">
            <label className="block mb-2 text-sm font-medium text-text1">{t('orderLookup.phoneLabel')}</label>
            <div className="flex gap-3">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder={t('orderLookup.phonePlaceholder')}
                className="h-12 text-base"
                maxLength={10}
              />
              <Button type="primary" htmlType="submit" loading={loading} className="h-12 px-6 bg-green">
                {t('orderLookup.submit')}
              </Button>
            </div>
          </form>

          {searched && (
            <div className="order-lookup-result">
              {orders.length === 0 ? (
                <p className="text-text3">{t('orderLookup.emptyResult')}</p>
              ) : (
                <ul className="order-list">
                  {orders.map((item: any, index: number) => {
                    const userBox = item.userBox ?? {};
                    const box = item.box ?? {};
                    const transactions = item.transactions ?? [];
                    const delivery = item.delivery ?? {};
                    const paymentTx = transactions.find((t: any) => t.type === 'payment') ?? transactions[0];
                    const boxPathId = box.slug || box.id;
                    const showBasicFlexibleAddOn =
                      Boolean(boxPathId) &&
                      isBasicFlexibleBoxFromBox(box) &&
                      box.id &&
                      userBox.id;
                    return (
                      <li key={userBox.id ?? box.id ?? index} className="order-card">
                        <div className="order-card-header">
                          <h3 className="order-card-title">{box.name ?? t('orderLookup.boxFallbackName')}</h3>
                          {box.price != null && (
                            <span className="order-card-price">{Number(box.price).toLocaleString('vi-VN')} VND</span>
                          )}
                        </div>
                        <div className="order-card-body">
                          <div className="order-card-section">
                            <span className="section-label">{t('orderLookup.statusPackage')}</span>
                            <span className={`section-value status-badge status-${userBox.status ?? 'pending'}`}>
                              {userBox.status ?? '—'}
                            </span>
                          </div>
                          {paymentTx && (
                            <div className="order-card-section">
                              <span className="section-label">{t('orderLookup.payment')}</span>
                              <span className={`section-value status-badge status-${paymentTx.status ?? 'pending'}`}>
                                {paymentTx.status ?? '—'}
                              </span>
                            </div>
                          )}
                          {delivery.status != null && (
                            <div className="order-card-section">
                              <span className="section-label">{t('orderLookup.delivery')}</span>
                              <span className="section-value">{delivery.status}</span>
                            </div>
                          )}
                          {delivery.scheduledDeliveryDate && (
                            <div className="order-card-section">
                              <span className="section-label">{t('orderLookup.scheduledDate')}</span>
                              <span className="section-value">
                                {formatDate(delivery.scheduledDeliveryDate)}
                              </span>
                            </div>
                          )}
                          {(boxPathId ||
                            showBasicFlexibleAddOn ||
                            delivery.status === 'picking_up' ||
                            delivery.status === 'delivering') && (
                            <div className="order-card-actions order-card-actions--row">
                              {showBasicFlexibleAddOn ? (
                                <>
                                  <Button
                                    type="default"
                                    size="small"
                                    className="order-lookup-addon-btn"
                                    onClick={() =>
                                      setAddOnBox({
                                        id: String(box.id),
                                        slug: String(boxPathId),
                                        name: String(box.name ?? ''),
                                        price: box.price != null ? Number(box.price) : null,
                                        userBoxId: String(userBox.id),
                                      })
                                    }
                                  >
                                    {t('orderLookup.addOn')}
                                  </Button>
                                  <Button
                                    type="default"
                                    size="small"
                                    className="order-lookup-veg-btn"
                                    onClick={() =>
                                      setVegBox({
                                        id: String(box.id),
                                        slug: String(boxPathId),
                                        name: String(box.name ?? ''),
                                        price: box.price != null ? Number(box.price) : null,
                                        userBoxId: String(userBox.id),
                                      })
                                    }
                                  >
                                    {t('orderLookup.addVegButton')}
                                  </Button>
                                </>
                              ) : null}
                              {boxPathId ? (
                                <Button
                                  type="default"
                                  size="small"
                                  onClick={() => setViewVegUserBoxId(String(userBox.id))}
                                >
                                  {t('orderLookup.viewVegetables')}
                                </Button>
                              ) : null}
                              {(delivery.status === 'picking_up' || delivery.status === 'delivering') && (
                                <Button
                                  type="primary"
                                  size="small"
                                  className="bg-green"
                                  onClick={() => openDeliveryModal(item)}
                                >
                                  {t('orderLookup.viewDeliveryStatus')}
                                </Button>
                              )}
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

      <OrderLookupAddOnModal
        open={!!addOnBox}
        onClose={() => setAddOnBox(null)}
        box={addOnBox}
        defaultPhone={phone}
      />

      <OrderLookupSubscriptionVegModal
        open={!!vegBox}
        onClose={() => setVegBox(null)}
        box={vegBox}
      />

      <Modal
        title={t('orderLookup.modalDeliveryTitle')}
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
              <p className="text-text3">{t('orderLookup.loading')}</p>
            )}

            {!loadingDeliveryDetails && (
              <>
                <div className={`delivery-progress-wrap step-index-${deliveryStepIndex}`}>
                  <div className="delivery-steps">
                    {deliveryStepLabels.map((label, i) => (
                      <div
                        key={i}
                        className={`delivery-step ${i <= deliveryStepIndex ? 'active' : ''} ${i === deliveryStepIndex ? 'current' : ''}`}
                      >
                        <span className="step-dot" />
                        <span className="step-label">{label}</span>
                        {i < deliveryStepLabels.length - 1 && <span className="step-line" />}
                      </div>
                    ))}
                  </div>
                  <Progress
                    percent={Math.round(((deliveryStepIndex + 1) / deliveryStepLabels.length) * 100)}
                    showInfo={false}
                    strokeColor="#3da35d"
                    className="delivery-progress-bar"
                  />
                </div>

                <div className="delivery-shipper-card">
                  <h4 className="shipper-title">{t('orderLookup.shipperTitle')}</h4>
                  {deliveryDetails?.delivery?.shipper ? (
                    <div className="shipper-info-list">
                      <p className="shipper-info-row">
                        <span className="shipper-info-label">{t('orderLookup.shipperAccount')}</span>
                        <span className="shipper-info-value">
                          {deliveryDetails.delivery.shipper.account ??
                            deliveryDetails.delivery.shipper.username ??
                            deliveryDetails.delivery.shipper.name ??
                            '—'}
                        </span>
                      </p>
                      <p className="shipper-info-row">
                        <span className="shipper-info-label">{t('orderLookup.shipperPhone')}</span>
                        <span className="shipper-info-value">
                          {deliveryDetails.delivery.shipper.phone ?? '—'}
                        </span>
                      </p>
                      <p className="shipper-info-row">
                        <span className="shipper-info-label">{t('orderLookup.shipperEmail')}</span>
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
                          <div className="shipper-empty-title">{t('orderLookup.shipperEmptyTitle')}</div>
                          <div className="shipper-empty-desc">{t('orderLookup.shipperEmptyDesc')}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="delivery-box-products">
                  <h4 className="box-products-title">{t('orderLookup.boxProductsTitle')}</h4>
                  <ul className="box-products-list">
                    {(deliveryDetails?.products ?? []).length === 0 ? (
                      <li className="text-text3">
                        {t('orderLookup.noProductList', {
                          boxName: deliveryDetails?.box?.name ?? deliveryModalItem.box?.name ?? '—',
                        })}
                      </li>
                    ) : (
                      (deliveryDetails.products ?? []).map((p: any) => (
                        <li key={p.boxProductId ?? p.productId ?? p.id}>
                          <span className="product-name">{p.name ?? p.product?.name ?? t('orderLookup.productFallback')}</span>
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

      <UserBoxDetailsModal
        open={!!viewVegUserBoxId}
        userBoxId={viewVegUserBoxId}
        onClose={() => setViewVegUserBoxId(null)}
      />

      <MainFooter />
    </>
  );
};

export default OrderLookup;
