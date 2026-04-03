import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Select } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../../utils/api';
import { formatVND, generateRandomString } from '../../utils/helper';
import { toast } from 'react-toastify';
import type { TBox, TBoxProductRow } from '../../types/TBox';
import type { TProduct } from '../../types/TProduct';
import { getBoxProductRows } from '../../utils/boxProductRows';

const EXTRA_VEG_WEEKLY_FEE = 25000;

function isBasicBoxSlugName(slug: string, name: string): boolean {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();
  return (
    s.includes('co-ban') ||
    s.includes('co_ban') ||
    s.includes('coban') ||
    n.includes('cơ bản') ||
    n.includes('co ban')
  );
}

function isFlexibleBoxSlugName(slug: string, name: string): boolean {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();
  return (
    s.includes('linh-hoat') ||
    s.includes('linh_hoat') ||
    s.includes('linhhoat') ||
    n.includes('linh hoạt') ||
    n.includes('linh hoat')
  );
}

/** Gói linh hoạt: tối đa 2 loại rau thêm; gói cơ bản: 1 loại */
function maxExtraVegForBox(slug: string, name: string): number {
  if (isFlexibleBoxSlugName(slug, name)) return 2;
  if (isBasicBoxSlugName(slug, name)) return 1;
  return 1;
}

type TAddOnProduct = {
  id: string | number;
  name: string;
  slug?: string;
  /** Một số API trả giá add-on ở đây */
  priceAddOn?: number;
  /** API thường trả `price` cho sản phẩm add-on */
  price?: number | string;
  images?: unknown;
};

/** Giá một dòng add-on: ưu tiên priceAddOn, sau đó price / snake_case; chuỗi "25.000" VND → 25000 */
function addOnLinePrice(item: TAddOnProduct): number {
  const raw =
    item.priceAddOn ??
    item.price ??
    (item as Record<string, unknown>).price_add_on ??
    (item as Record<string, unknown>).addOnPrice;
  if (raw == null || raw === '') return 0;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) return raw;
  const s = String(raw).trim();
  if (/^[\d.,\s]+$/.test(s) && /\d/.test(s)) {
    const digits = s.replace(/\D/g, '');
    if (digits.length > 0) {
      const n = parseInt(digits, 10);
      if (Number.isFinite(n) && n >= 0) return n;
    }
  }
  const n = parseFloat(s.replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function addOnIdKey(id: string | number): string {
  return String(id);
}

export type OrderLookupAddOnBox = {
  id: string;
  slug: string;
  name: string;
  price: number | null | undefined;
  /** user_box đã thanh toán — bắt buộc cho POST /boxes/payment/qr-add-on */
  userBoxId: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  box: OrderLookupAddOnBox | null;
  defaultPhone: string;
};

function addOnImageSrc(images: TAddOnProduct['images']): string {
  if (Array.isArray(images)) return images[0] || '';
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images || '[]');
      return Array.isArray(parsed) && parsed[0] ? parsed[0] : '';
    } catch {
      return images;
    }
  }
  return '';
}

function productImageSrc(images: TProduct['images']): string {
  if (Array.isArray(images)) return images[0] || '';
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images || '[]');
      return Array.isArray(parsed) && parsed[0] ? parsed[0] : '';
    } catch {
      return images;
    }
  }
  return '';
}

function weekRangeLabelFromStart(weekStart: string, lang: string): string {
  const start = new Date(weekStart);
  if (Number.isNaN(start.getTime())) return weekStart;
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const loc = lang?.startsWith('vi') ? 'vi-VN' : 'en-US';
  const fmt = (d: Date) =>
    d.toLocaleDateString(loc, { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

const OrderLookupAddOnModal: React.FC<Props> = ({ open, onClose, box, defaultPhone }) => {
  const { t, i18n } = useTranslation();
  const [addOns, setAddOns] = useState<TAddOnProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingAddOns, setLoadingAddOns] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [boxDetail, setBoxDetail] = useState<TBox | null>(null);
  const [loadingBoxDetail, setLoadingBoxDetail] = useState(false);
  const [selectedWeekStart, setSelectedWeekStart] = useState<string | null>(null);
  const [selectedExtraProductIds, setSelectedExtraProductIds] = useState<string[]>([]);

  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [qrExpireTime, setQrExpireTime] = useState(0);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const visibleAddOns = useMemo(
    () => addOns.filter((item) => item.slug !== 'rau-them-1-loai'),
    [addOns]
  );

  /** Ưu tiên slug chuẩn; fallback theo slug/tên nếu API đổi key */
  const rauThemAddOn = useMemo(() => {
    const bySlug = addOns.find((item) => item.slug === 'rau-them-1-loai');
    if (bySlug) return bySlug;
    const slugLoose = addOns.find((item) => {
      const s = String(item.slug || '').toLowerCase();
      return s.includes('rau-them') || s.includes('rau_them');
    });
    if (slugLoose) return slugLoose;
    return addOns.find((item) => {
      const n = String(item.name || '').toLowerCase();
      return n.includes('rau thêm') || n.includes('rau them');
    });
  }, [addOns]);

  const boxProductRows = useMemo((): TBoxProductRow[] => {
    if (!boxDetail) return [];
    return getBoxProductRows(boxDetail);
  }, [boxDetail]);

  const weekOptions = useMemo(() => {
    const keys = Array.from(
      new Set(boxProductRows.map((r) => r.weekStartDate).filter(Boolean) as string[])
    );
    keys.sort();
    return keys.map((k) => ({
      value: k,
      label: weekRangeLabelFromStart(k, i18n.language),
    }));
  }, [boxProductRows, i18n.language]);

  const weekRows = useMemo(() => {
    if (!selectedWeekStart) return [];
    return boxProductRows.filter((r) => r.weekStartDate === selectedWeekStart);
  }, [boxProductRows, selectedWeekStart]);

  const maxExtraVeg = useMemo(() => {
    const slug = String(boxDetail?.slug ?? box?.slug ?? '');
    const name = String(boxDetail?.name ?? box?.name ?? '');
    return maxExtraVegForBox(slug, name);
  }, [boxDetail?.slug, boxDetail?.name, box?.slug, box?.name]);

  /** Phí rau thêm: 25k × số loại — không phụ thuộc có tìm được product add-on trên API hay không (tránh tổng 0 khi slug lệch) */
  const extraVegLineTotal = useMemo(() => {
    if (!selectedWeekStart || selectedExtraProductIds.length === 0) return 0;
    return selectedExtraProductIds.length * EXTRA_VEG_WEEKLY_FEE;
  }, [selectedWeekStart, selectedExtraProductIds.length]);

  const addOnTotal = useMemo(() => {
    const other = visibleAddOns
      .filter((item) => selectedIds.includes(addOnIdKey(item.id)))
      .reduce((sum, item) => sum + addOnLinePrice(item), 0);
    return other + extraVegLineTotal;
  }, [visibleAddOns, selectedIds, extraVegLineTotal]);

  const payableAmount = useMemo(() => addOnTotal, [addOnTotal]);

  const resetForm = useCallback(() => {
    setSelectedIds([]);
    setSelectedWeekStart(null);
    setSelectedExtraProductIds([]);
  }, []);

  useEffect(() => {
    if (!open) return;
    resetForm();
    setBoxDetail(null);
    setShowQrModal(false);
    setQrCodeData(null);
    setQrImageUrl(null);
    setCurrentOrderId(null);
    setQrExpireTime(0);
  }, [open, defaultPhone, resetForm]);

  useEffect(() => {
    if (!open || !box?.slug) return;
    let cancelled = false;
    setLoadingBoxDetail(true);
    setBoxDetail(null);
    api
      .get<{ data: TBox }>(`/boxes/${encodeURIComponent(box.slug)}`)
      .then((res) => {
        const data = res.data?.data ?? (res.data as unknown as TBox);
        if (!cancelled && data) setBoxDetail(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setBoxDetail(null);
          toast.error(t('orderLookup.addOnBoxLoadFailed'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingBoxDetail(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, box?.slug, t]);

  /** Nếu đổi gói / giới hạn mà đang chọn quá số loại cho phép → cắt bớt */
  useEffect(() => {
    setSelectedExtraProductIds((prev) =>
      prev.length > maxExtraVeg ? prev.slice(0, maxExtraVeg) : prev
    );
  }, [maxExtraVeg]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingAddOns(true);
    api
      .get('/products/add-ons?page=1&limit=20')
      .then((res) => {
        const items = res.data?.data?.items;
        if (!cancelled) setAddOns(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setAddOns([]);
          toast.error(t('orderLookup.addOnLoadFailed'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingAddOns(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, t]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!showQrModal || (!qrCodeData && !qrImageUrl)) {
      setQrExpireTime(0);
      return;
    }
    setQrExpireTime(180);
    const interval = setInterval(() => {
      setQrExpireTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowQrModal(false);
          setQrCodeData(null);
          setQrImageUrl(null);
          toast.error(t('purchase.qrExpired'));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showQrModal, qrCodeData, qrImageUrl, t]);

  useEffect(() => {
    if (!showQrModal || !currentOrderId) return;

    const checkPaymentStatus = async () => {
      try {
        const res = await api.get(`/boxes/payment/status/${currentOrderId}`, {
          withAuth: true,
        });
        const payload = res.data?.data ?? res.data;
        if (payload && String(payload.status).toLowerCase() === 'completed') {
          setShowQrModal(false);
          setQrCodeData(null);
          setQrImageUrl(null);
          setCurrentOrderId(null);
          toast.success(t('purchase.paymentSuccess'));
          onClose();
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    };

    checkPaymentStatus();
    const pollInterval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(pollInterval);
  }, [showQrModal, currentOrderId, onClose, t]);

  const toggleAddOn = (id: string | number) => {
    const key = addOnIdKey(id);
    setSelectedIds((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  };

  const toggleExtraProduct = (productId: string | number) => {
    const key = String(productId);
    setSelectedExtraProductIds((prev) => {
      if (prev.includes(key)) return prev.filter((x) => x !== key);
      if (prev.length >= maxExtraVeg) {
        toast.info(t('orderLookup.addOnMaxVegReached', { max: maxExtraVeg }));
        return prev;
      }
      return [...prev, key];
    });
  };

  const onWeekChange = (value: string | null) => {
    setSelectedWeekStart(value);
    setSelectedExtraProductIds([]);
  };

  const handleCloseQr = () => {
    setShowQrModal(false);
    setQrCodeData(null);
    setQrImageUrl(null);
    setCurrentOrderId(null);
    setQrExpireTime(0);
  };

  const handlePay = async () => {
    if (!box?.id) {
      toast.error(t('orderLookup.addOnMissingBox'));
      return;
    }
    if (!box.userBoxId) {
      toast.error(t('orderLookup.addOnMissingUserBox'));
      return;
    }
    const trimmedPhone = defaultPhone.replace(/\D/g, '').slice(0, 10);
    if (trimmedPhone.length !== 10) {
      toast.error(t('orderLookup.addOnPhoneRequired'));
      return;
    }

    if (selectedWeekStart && selectedExtraProductIds.length === 0) {
      toast.error(t('orderLookup.addOnPickVegRequired'));
      return;
    }
    if (selectedWeekStart && selectedExtraProductIds.length > 0 && !rauThemAddOn) {
      toast.warning(t('orderLookup.addOnRauThemPayWithoutProduct'));
    }

    const orderId = generateRandomString(13);
    const add_on = visibleAddOns
      .filter((item) => selectedIds.includes(addOnIdKey(item.id)))
      .map((item) => ({ product_id: item.id, quantity: 1 }));

    if (rauThemAddOn && selectedWeekStart && selectedExtraProductIds.length > 0) {
      add_on.push({
        product_id: rauThemAddOn.id,
        quantity: selectedExtraProductIds.length,
      });
    }

    if (add_on.length === 0 || payableAmount <= 0) {
      toast.error(t('orderLookup.addOnPaymentEmpty'));
      return;
    }

    const extraNames = weekRows
      .filter((r) => selectedExtraProductIds.includes(String(r.product.id)))
      .map((r) => r.product.name)
      .join(', ');
    const orderInfo =
      extraNames.length > 0
        ? `${t('orderLookup.addOnOrderInfoPrefix')} ${box.name} | ${t('orderLookup.addOnOrderInfoVeg')}: ${extraNames}`
        : `${t('orderLookup.addOnOrderInfoPrefix')} ${box.name}`;

    const requestBody = {
      orderId,
      amount: payableAmount,
      orderInfo,
      phone: trimmedPhone,
      user_box_id: box.userBoxId,
      add_on,
    };

    try {
      setSubmitting(true);
      const res = await api.post('/boxes/payment/qr-add-on', requestBody);

      const top = res.data?.data;
      let qrString: string | null = null;
      let imgUrl: string | null = null;

      if (typeof top === 'string') {
        qrString = top;
      } else if (top && typeof top === 'object' && !Array.isArray(top)) {
        const d = top as { data?: unknown; qrImageUrl?: string };
        if (typeof d.data === 'string') qrString = d.data;
        imgUrl = d.qrImageUrl ?? null;
      }

      if (!qrString && res.data?.data && typeof res.data.data === 'object') {
        const nested = (res.data.data as { data?: unknown }).data;
        if (typeof nested === 'string') qrString = nested;
      }

      const hasQr = Boolean(qrString || imgUrl);
      if (hasQr) {
        setQrCodeData(qrString);
        setQrImageUrl(imgUrl);
        setCurrentOrderId(orderId);
        setShowQrModal(true);
        toast.success(t('purchase.createQrSuccess'));
      } else {
        toast.error(t('purchase.createQrFailed'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('purchase.orderError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!box) return null;

  return (
    <>
      <Modal
        title={t('orderLookup.addOnModalTitle')}
        open={open && !showQrModal}
        onCancel={onClose}
        footer={null}
        width={560}
        centered
        destroyOnClose
        className="order-lookup-addon-modal"
      >
        <p className="mb-4 text-sm text-text3">{t('orderLookup.addOnModalHint')}</p>

        <div className="mb-6 pb-5 border-b border-[#eee]">
          <p className="mb-2 text-sm font-semibold text-text1">{t('orderLookup.addOnExtraVegTitle')}</p>
          <p className="mb-3 text-xs text-text3">{t('orderLookup.addOnExtraVegLimitHint', { max: maxExtraVeg })}</p>
          {loadingBoxDetail ? (
            <p className="text-sm text-text3">{t('orderLookup.loading')}</p>
          ) : weekOptions.length === 0 ? (
            <p className="text-sm text-text3">{t('orderLookup.addOnNoWeeksInBox')}</p>
          ) : (
            <>
              <label className="block mb-1 text-xs font-medium text-text1">
                {t('orderLookup.addOnSelectWeekLabel')}
              </label>
              <Select
                className="w-full mb-3"
                size="large"
                allowClear
                placeholder={t('orderLookup.addOnSelectWeekPlaceholder')}
                options={weekOptions}
                value={selectedWeekStart ?? undefined}
                onChange={(v) => onWeekChange(v ?? null)}
              />
              {selectedWeekStart ? (
                <>
                  <p className="mb-2 text-xs font-medium text-text2">
                    {t('orderLookup.addOnWeekVegListTitle', { max: maxExtraVeg })}
                  </p>
                  {weekRows.length === 0 ? (
                    <p className="text-sm text-text3">{t('orderLookup.addOnNoWeekRows')}</p>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {weekRows.map((row) => {
                        const pid = row.product.id;
                        const checked = selectedExtraProductIds.includes(String(pid));
                        const atMax = selectedExtraProductIds.length >= maxExtraVeg;
                        const disablePick = !checked && atMax;
                        const imgSrc = productImageSrc(row.product.images);
                        return (
                          <label
                            key={`${row.id}-${pid}`}
                            className={`flex items-center gap-3 p-2 border rounded-lg transition-colors ${
                              disablePick ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            } ${
                              checked ? 'border-green-600 bg-green-50' : 'border-[#e9ecef] bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disablePick}
                              onChange={() => toggleExtraProduct(String(pid))}
                              className="w-4 h-4 accent-green-600"
                            />
                            <img
                              src={imgSrc || 'https://via.placeholder.com/80'}
                              alt=""
                              className="object-cover w-11 h-11 rounded-md shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="m-0 text-sm font-medium text-text1 line-clamp-2">
                                {row.product.name}
                              </p>
                              {row.category?.name ? (
                                <p className="m-0 text-[11px] text-green-700">{row.category.name}</p>
                              ) : null}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {selectedWeekStart && selectedExtraProductIds.length > 0 ? (
                    <p className="mt-2 text-xs text-text3">
                      {t('orderLookup.addOnRauThemSubtotal', {
                        count: selectedExtraProductIds.length,
                        total: formatVND(extraVegLineTotal),
                      })}
                    </p>
                  ) : null}
                </>
              ) : null}
            </>
          )}
        </div>

        <p className="mb-2 text-sm font-semibold text-text1">{t('purchase.addOn')}</p>
        {loadingAddOns ? (
          <p className="text-sm text-text3">{t('orderLookup.loading')}</p>
        ) : visibleAddOns.length === 0 ? (
          <p className="mb-4 text-sm text-text3">{t('orderLookup.addOnEmpty')}</p>
        ) : (
          <div className="mb-4 space-y-2 max-h-48 overflow-y-auto pr-1">
            {visibleAddOns.map((item) => {
              const checked = selectedIds.includes(addOnIdKey(item.id));
              const imgSrc = addOnImageSrc(item.images);
              return (
                <label
                  key={addOnIdKey(item.id)}
                  className={`flex items-center gap-3 p-2 border rounded-lg cursor-pointer transition-colors ${
                    checked ? 'border-green-600 bg-green-50' : 'border-[#e9ecef] bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAddOn(item.id)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <img
                    src={imgSrc || 'https://via.placeholder.com/80'}
                    alt=""
                    className="object-cover w-12 h-12 rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-sm font-medium text-text1 line-clamp-2">{item.name}</p>
                    <p className="m-0 text-xs text-text3">{formatVND(addOnLinePrice(item))}</p>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <p className="mb-4 text-sm">
          <span className="text-text3">{t('purchase.totalAmount')}: </span>
          <span className="font-semibold text-green-600">{formatVND(payableAmount)}</span>
        </p>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>{t('purchase.close')}</Button>
          <Button type="primary" className="bg-green" loading={submitting} onClick={handlePay}>
            {t('orderLookup.addOnPay')}
          </Button>
        </div>
      </Modal>

      <Modal
        title={null}
        footer={null}
        open={showQrModal}
        onCancel={handleCloseQr}
        centered
        width={400}
        closable
        className="order-lookup-addon-qr-modal"
      >
        <div className="flex flex-col items-center p-6">
          <h3 className="mb-2 text-xl font-bold text-center text-text1">{t('purchase.qrTitle')}</h3>
          <p className="mb-4 text-sm text-center text-text3">{t('purchase.scanQr')}</p>
          <div className="flex items-center justify-center mb-4">
            {qrCodeData ? (
              <QRCodeCanvas value={qrCodeData} size={220} level="H" />
            ) : qrImageUrl ? (
              <img src={qrImageUrl} alt="payment-qr" className="max-w-[220px]" />
            ) : (
              <div className="text-text3">{t('purchase.waiting')}</div>
            )}
          </div>
          <div className="mb-2 text-center">
            <span className="text-sm text-text3">{t('purchase.timeLeft')}: </span>
            <span
              className={`text-xl font-mono font-bold ${qrExpireTime <= 30 ? 'text-red-500' : 'text-green-600'}`}
            >
              {formatTime(qrExpireTime)}
            </span>
          </div>
          <p className="text-xs text-center text-gray-400">{t('purchase.doNotCloseBrowser')}</p>
        </div>
      </Modal>
    </>
  );
};

export default OrderLookupAddOnModal;
