import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Empty,
  Input,
  InputNumber,
  Space,
  Spin,
  Switch,
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks/useTitle';
import {
  fetchExperienceWeeklyProducts,
  saveExperienceWeeklyProducts,
  type ExperienceWeeklyProductRow,
} from '../../../api/experienceWeeklyAdmin';
import api from '../../../utils/api';

dayjs.extend(isoWeek);

const getPayloadData = (res: any) => res?.data?.data ?? res?.data;

type ProductRow = {
  id: string;
  name: string;
  categoryName: string;
  categorySlug: string;
};

type SelectedConfig = {
  productId: string;
  quantity: number;
  boxUnit: string;
  isOptional: boolean;
};

function mondayString(d: Dayjs): string {
  return d.startOf('isoWeek').format('YYYY-MM-DD');
}

const ExperienceWeekly: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('admin.experienceWeekly'));

  const [week, setWeek] = useState<Dayjs>(() => dayjs().startOf('isoWeek'));
  const [boxInfo, setBoxInfo] = useState<{ id: string; slug: string; name: string } | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [configByProductId, setConfigByProductId] = useState<Record<string, SelectedConfig>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);

  const weekStr = useMemo(() => mondayString(week), [week]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.categorySlug.toLowerCase().includes(q),
    );
  }, [products, search]);

  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get('/categories');
      const cats: { id: string; slug: string; name: string }[] = getPayloadData(res) ?? [];
      const list: ProductRow[] = [];
      const seen = new Set<string>();
      for (const c of cats) {
        try {
          const pr = await api.get(`/categories/${c.slug}/products?page=1&limit=20`);
          const payload = getPayloadData(pr);
          const items = payload?.items ?? [];
          for (const p of items) {
            if (seen.has(p.id)) continue;
            seen.add(p.id);
            list.push({
              id: p.id,
              name: p.name,
              categoryName: c.name,
              categorySlug: c.slug,
            });
          }
        } catch {
          /* skip */
        }
      }
      setProducts(list);
    } catch (e) {
      console.error(e);
      toast.error('Không tải được danh sách sản phẩm');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const loadWeek = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchExperienceWeeklyProducts(weekStr);
      setBoxInfo(data.box);
      const ids = data.items.map((x) => x.productId);
      const nextConfig: Record<string, SelectedConfig> = {};
      data.items.forEach((r) => {
        nextConfig[r.productId] = {
          productId: r.productId,
          quantity: r.quantity,
          boxUnit: r.unit || 'kg',
          isOptional: r.isOptional,
        };
      });
      setSelectedIds(ids);
      setConfigByProductId(nextConfig);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Không tải được cấu hình tuần');
      setSelectedIds([]);
      setConfigByProductId({});
    } finally {
      setLoading(false);
    }
  }, [weekStr]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  const handleSelectionChange = (nextSelected: React.Key[]) => {
    const ids = nextSelected as string[];
    setSelectedIds(ids);
    setConfigByProductId((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        if (!next[id]) {
          next[id] = { productId: id, quantity: 1, boxUnit: 'kg', isOptional: false };
        }
      });
      Object.keys(next).forEach((id) => {
        if (!ids.includes(id)) delete next[id];
      });
      return next;
    });
  };

  const updateConfig = (productId: string, patch: Partial<SelectedConfig>) => {
    setConfigByProductId((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] ?? { productId, quantity: 1, boxUnit: 'kg', isOptional: false }),
        ...patch,
      },
    }));
  };

  const handleSave = async () => {
    if (selectedIds.length > 0) {
      const invalid = selectedIds.find((id) => {
        const cfg = configByProductId[id];
        return !cfg || cfg.quantity <= 0;
      });
      if (invalid) {
        toast.error('Kiểm tra: mỗi sản phẩm được chọn cần số lượng > 0');
        return;
      }
    }
    try {
      setSaving(true);
      await saveExperienceWeeklyProducts({
        weekStartDate: weekStr,
        items: selectedIds.map((id) => ({
          productId: id,
          quantity: configByProductId[id]?.quantity ?? 1,
          boxUnit: configByProductId[id]?.boxUnit ?? 'kg',
          isOptional: configByProductId[id]?.isOptional ?? false,
        })),
      });
      toast.success('Đã lưu cấu hình tuần');
      await loadWeek();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnsType<ProductRow> = [
    {
      title: 'STT',
      width: 48,
      align: 'center',
      render: (_a, _b, i) => i + 1,
    },
    {
      title: 'Sản phẩm',
      render: (_, r) => <span className="font-medium">{r.name}</span>,
    },
    {
      title: 'Danh mục',
      width: 220,
      render: (_, r) => (
        <span>
          {r.categoryName} <span className="text-gray-400">({r.categorySlug})</span>
        </span>
      ),
    },
    {
      title: 'Số lượng',
      width: 120,
      render: (_, r) => (
        <InputNumber
          className="w-full"
          min={0.0001}
          step={0.1}
          disabled={!selectedIds.includes(r.id)}
          value={configByProductId[r.id]?.quantity ?? 1}
          onChange={(v) => updateConfig(r.id, { quantity: typeof v === 'number' ? v : 1 })}
        />
      ),
    },
    {
      title: 'ĐVT (trong gói)',
      width: 120,
      render: (_, r) => (
        <Input
          disabled={!selectedIds.includes(r.id)}
          value={configByProductId[r.id]?.boxUnit ?? 'kg'}
          onChange={(e) => updateConfig(r.id, { boxUnit: e.target.value || 'kg' })}
          placeholder="kg, gr…"
        />
      ),
    },
    {
      title: 'Tuỳ chọn',
      width: 88,
      render: (_, r) => (
        <Switch
          disabled={!selectedIds.includes(r.id)}
          checked={configByProductId[r.id]?.isOptional ?? false}
          onChange={(v) => updateConfig(r.id, { isOptional: v })}
        />
      ),
    },
  ];

  return (
    <Fragment>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-1 text-xl font-bold text-gray-900 lg:text-2xl">
            {t('admin.experienceWeekly')}
          </h1>
          <p className="mb-0 text-sm text-gray-500">
            Chỉ áp cho gói <strong>trải nghiệm</strong> (slug <code className="text-xs">goi-co-ban</code>). Mỗi
            lần lưu sẽ <strong>thay toàn bộ</strong> danh sách rau của tuần đã chọn.
          </p>
        </div>

        <Alert
          type="info"
          showIcon
          className="mb-4"
          message="API"
          description={
            <ul className="mb-0 pl-4 text-sm list-disc">
              <li>
                <strong>GET</strong> <code>/admin/experience-weekly/box-products?weekStartDate=YYYY-MM-DD</code>
              </li>
              <li>
                <strong>PUT</strong> <code>/admin/experience-weekly/box-products</code> — JSON{' '}
                <code>{`{ weekStartDate, items: [{ productId, quantity, boxUnit?, isOptional? }] }`}</code>
              </li>
            </ul>
          }
        />

        <Card className="shadow-sm">
          <Space wrap className="mb-4">
            <span className="text-sm font-medium text-gray-700">Tuần giao (Thứ Hai)</span>
            <DatePicker
              value={week}
              onChange={(d) => d && setWeek(d)}
              format="YYYY-MM-DD"
              allowClear={false}
            />
            <Button icon={<ReloadOutlined />} onClick={() => loadWeek()} loading={loading}>
              Tải lại
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
              Lưu tuần
            </Button>
          </Space>
          <Space wrap className="mb-4">
            <Input
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên rau hoặc category"
              className="min-w-[320px]"
            />
            <Typography.Text type="secondary">
              Đã chọn: <strong>{selectedIds.length}</strong> sản phẩm
            </Typography.Text>
          </Space>

          {boxInfo && (
            <Typography.Paragraph className="text-sm text-gray-600">
              Box: <strong>{boxInfo.name}</strong> — <span className="font-mono text-xs">{boxInfo.id}</span>
            </Typography.Paragraph>
          )}

          <Spin spinning={loading || loadingProducts}>
            {filteredProducts.length === 0 && !loading && !loadingProducts ? (
              <Empty description="Không có sản phẩm phù hợp" />
            ) : (
              <Table
                rowKey="id"
                rowSelection={{
                  selectedRowKeys: selectedIds,
                  onChange: handleSelectionChange,
                }}
                columns={columns}
                dataSource={filteredProducts}
                pagination={{ pageSize: 12, showSizeChanger: false }}
                bordered
                size="small"
              />
            )}
          </Spin>
        </Card>
      </div>
    </Fragment>
  );
};

export default ExperienceWeekly;
