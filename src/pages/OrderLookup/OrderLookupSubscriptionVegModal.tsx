import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import type { TProduct } from '../../types/TProduct';
import type { OrderLookupAddOnBox } from './OrderLookupAddOnModal';

type VegGroupKey = 'soft' | 'hardy' | 'root';

type SubscriptionVegCatalogPayload = {
  boxSlug: string;
  limits: Record<VegGroupKey, { maxTypes: number; weightHint: string }>;
  groups: Record<VegGroupKey, TProduct[]>;
};

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

type Props = {
  open: boolean;
  onClose: () => void;
  box: OrderLookupAddOnBox | null;
};

const OrderLookupSubscriptionVegModal: React.FC<Props> = ({ open, onClose, box }) => {
  const { t } = useTranslation();
  const [subCatalog, setSubCatalog] = useState<SubscriptionVegCatalogPayload | null>(null);
  const [loadingSubCatalog, setLoadingSubCatalog] = useState(false);
  const [loadingSubUserBox, setLoadingSubUserBox] = useState(false);
  const [savingSubVeg, setSavingSubVeg] = useState(false);
  const [subSelection, setSubSelection] = useState<Record<VegGroupKey, string[]>>({
    soft: [],
    hardy: [],
    root: [],
  });

  useEffect(() => {
    if (!open) return;
    setSubCatalog(null);
    setSubSelection({ soft: [], hardy: [], root: [] });
  }, [open, box?.userBoxId]);

  useEffect(() => {
    if (!open || !box?.slug) return;
    let cancelled = false;
    setLoadingSubCatalog(true);
    api
      .get('/products/subscription-veggie-catalog', { params: { boxSlug: box.slug } })
      .then((res) => {
        const payload = res.data?.data ?? res.data;
        if (!cancelled && payload?.groups && payload?.limits) {
          setSubCatalog(payload as SubscriptionVegCatalogPayload);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setSubCatalog(null);
          toast.error(t('orderLookup.subscriptionVegCatalogFailed'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSubCatalog(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, box?.slug, t]);

  useEffect(() => {
    if (!open || !box?.userBoxId) return;
    let cancelled = false;
    setLoadingSubUserBox(true);
    api
      .get(`/boxes/user-box/${encodeURIComponent(box.userBoxId)}`)
      .then((res) => {
        const payload = res.data?.data ?? res.data;
        const sel = payload?.subscriptionVegSelection;
        if (cancelled) return;
        if (!sel) {
          setSubSelection({ soft: [], hardy: [], root: [] });
          return;
        }
        setSubSelection({
          soft: Array.isArray(sel.soft) ? sel.soft.map(String) : [],
          hardy: Array.isArray(sel.hardy) ? sel.hardy.map(String) : [],
          root: Array.isArray(sel.root) ? sel.root.map(String) : [],
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoadingSubUserBox(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, box?.userBoxId]);

  const subGroupLabel = useCallback(
    (g: VegGroupKey) =>
      ({
        soft: t('orderLookup.subscriptionVegGroupSoft'),
        hardy: t('orderLookup.subscriptionVegGroupHardy'),
        root: t('orderLookup.subscriptionVegGroupRoot'),
      })[g],
    [t],
  );

  const toggleSubVeg = (group: VegGroupKey, productId: string) => {
    if (!subCatalog) return;
    const max = subCatalog.limits[group].maxTypes;
    setSubSelection((prev) => {
      const cur = [...prev[group]];
      const i = cur.indexOf(productId);
      if (i >= 0) {
        cur.splice(i, 1);
        return { ...prev, [group]: cur };
      }
      if (cur.length >= max) {
        toast.info(
          t('orderLookup.subscriptionVegMax', { max, group: subGroupLabel(group) }),
        );
        return prev;
      }
      return { ...prev, [group]: [...cur, productId] };
    });
  };

  const handleSaveSubscriptionVeg = async () => {
    if (!box?.userBoxId) return;
    try {
      setSavingSubVeg(true);
      await api.patch(`/boxes/user-box/${encodeURIComponent(box.userBoxId)}/subscription-veggie`, {
        soft: subSelection.soft,
        hardy: subSelection.hardy,
        root: subSelection.root,
      });
      toast.success(t('orderLookup.subscriptionVegSaved'));
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(t('orderLookup.subscriptionVegSaveFailed'));
    } finally {
      setSavingSubVeg(false);
    }
  };

  if (!box) return null;

  return (
    <Modal
      title={t('orderLookup.subscriptionVegModalTitle')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      centered
      destroyOnClose
      className="order-lookup-subscription-veg-modal"
    >
      <p className="mb-4 text-sm text-text3">{t('orderLookup.subscriptionVegModalHint')}</p>

      {loadingSubCatalog || loadingSubUserBox ? (
        <p className="text-sm text-text3">{t('orderLookup.loading')}</p>
      ) : !subCatalog ? (
        <p className="text-sm text-text3">{t('orderLookup.subscriptionVegCatalogEmpty')}</p>
      ) : (
        <>
          {(['soft', 'hardy', 'root'] as const).map((gk) => {
            const lim = subCatalog.limits[gk];
            const products = subCatalog.groups[gk] ?? [];
            return (
              <div key={gk} className="mb-4 last:mb-0">
                <p className="mb-1 text-xs font-medium text-text1">
                  {subGroupLabel(gk)} —{' '}
                  {t('orderLookup.subscriptionVegGroupLine', { max: lim.maxTypes, hint: lim.weightHint })}
                </p>
                {products.length === 0 ? (
                  <p className="text-xs text-text3">{t('orderLookup.subscriptionVegNoProducts')}</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {products.map((p) => {
                      const pid = String(p.id);
                      const checked = subSelection[gk].includes(pid);
                      const atMax = subSelection[gk].length >= lim.maxTypes;
                      const disablePick = !checked && atMax;
                      const imgSrc = productImageSrc(p.images);
                      return (
                        <label
                          key={pid}
                          className={`flex items-center gap-3 p-2 border rounded-lg transition-colors ${
                            disablePick ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          } ${checked ? 'border-green-600 bg-green-50' : 'border-[#e9ecef] bg-white'}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disablePick}
                            onChange={() => toggleSubVeg(gk, pid)}
                            className="w-4 h-4 accent-green-600"
                          />
                          <img
                            src={imgSrc || 'https://via.placeholder.com/80'}
                            alt=""
                            className="object-cover w-11 h-11 rounded-md shrink-0"
                          />
                          <span className="flex-1 min-w-0 text-sm font-medium text-text1 line-clamp-2">
                            {p.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={onClose}>{t('purchase.close')}</Button>
            <Button type="primary" className="bg-green" loading={savingSubVeg} onClick={handleSaveSubscriptionVeg}>
              {t('orderLookup.subscriptionVegSave')}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default OrderLookupSubscriptionVegModal;
