import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Table,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Select,
  InputNumber,
  Switch,
  DatePicker,
  Radio,
  Upload,
  Image,
  Typography,
  Card,
  Alert,
  Divider,
  Empty,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ReloadOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';
import { TCategory } from '../../../types/TCategory';

dayjs.extend(isoWeek);

interface BoxItem {
  id: string;
  name: string;
  slug: string;
}

interface ProductInRow {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  images?: string[] | null;
  unit?: string | null;
  category?: { id: string; name: string } | null;
}

export interface BoxProductRow {
  id: string;
  boxId: string;
  productId: string;
  quantity: number;
  unit: string;
  isOptional: boolean;
  weekStartDate: string;
  product: ProductInRow;
}

const getPayloadData = (res: any) => res?.data?.data ?? res?.data;

const BoxVegetables: React.FC = () => {
  useTitle('Cập nhật sản phẩm trong gói — Admin');

  const [boxes, setBoxes] = useState<BoxItem[]>([]);
  const [boxId, setBoxId] = useState<string | undefined>();
  const [rows, setRows] = useState<BoxProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [productOptions, setProductOptions] = useState<{ value: string; label: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editing, setEditing] = useState<BoxProductRow | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const mode = Form.useWatch('createMode', form);

  const selectedBox = boxes.find((b) => b.id === boxId);

  const fetchBoxes = useCallback(async () => {
    try {
      const res = await api.get('/boxes');
      const list = getPayloadData(res);
      const arr = Array.isArray(list) ? list : [];
      setBoxes(arr.map((b: any) => ({ id: b.id, name: b.name, slug: b.slug })));
      setBoxId((prev) => prev ?? arr[0]?.id);
    } catch (e) {
      console.error(e);
      toast.error('Không tải được danh sách gói');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(getPayloadData(res) ?? []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadProductOptions = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      const cats: { slug: string; name: string }[] = getPayloadData(res) ?? [];
      const opts: { value: string; label: string }[] = [];
      const seen = new Set<string>();
      for (const c of cats) {
        try {
          const pr = await api.get(`/categories/${c.slug}/products?page=1&limit=20`);
          const payload = getPayloadData(pr);
          const items = payload?.items ?? [];
          for (const p of items) {
            if (seen.has(p.id)) continue;
            seen.add(p.id);
            opts.push({ value: p.id, label: `${p.name} — ${c.name}` });
          }
        } catch {
          /* skip */
        }
      }
      setProductOptions(opts);
    } catch (e) {
      console.error(e);
      toast.error('Không tải được danh sách sản phẩm');
    }
  }, []);

  const fetchBoxProducts = useCallback(async (bid: string | undefined) => {
    if (!bid) {
      setRows([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/admin/boxes/${bid}/box-products`, { withAuth: true });
      const list = getPayloadData(res);
      setRows(Array.isArray(list) ? list : []);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Không tải được rau trong gói');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoxes();
    fetchCategories();
  }, [fetchBoxes, fetchCategories]);

  useEffect(() => {
    if (boxId) fetchBoxProducts(boxId);
  }, [boxId, fetchBoxProducts]);

  const openCreate = () => {
    setIsEdit(false);
    setEditing(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({
      createMode: 'new',
      quantity: 1,
      boxUnit: 'kg',
      isOptional: false,
      weekStartDate: dayjs().startOf('isoWeek'),
    });
    loadProductOptions();
    setOpen(true);
  };

  const openEdit = (record: BoxProductRow) => {
    setIsEdit(true);
    setEditing(record);
    setFileList([]);
    form.setFieldsValue({
      name: record.product?.name,
      slug: record.product?.slug,
      categoryId: record.product?.category?.id,
      description: record.product?.description ?? '',
      quantity: record.quantity,
      boxUnit: record.unit,
      isOptional: record.isOptional,
      weekStartDate: record.weekStartDate ? dayjs(record.weekStartDate) : dayjs().startOf('isoWeek'),
    });
    setOpen(true);
  };

  const buildFormData = (values: any, files: File[], isUpdate: boolean) => {
    const fd = new FormData();
    if (!isUpdate) {
      if (values.createMode === 'existing' && values.productId) {
        fd.append('productId', values.productId);
      } else {
        fd.append('name', values.name);
        if (values.slug) fd.append('slug', values.slug);
        fd.append('categoryId', values.categoryId);
        if (values.description != null) fd.append('description', String(values.description));
        if (values.weight != null) fd.append('weight', String(values.weight));
        if (values.unit) fd.append('unit', values.unit);
      }
      fd.append('quantity', String(values.quantity));
      fd.append('boxUnit', values.boxUnit || 'kg');
      fd.append('isOptional', values.isOptional ? 'true' : 'false');
      fd.append('weekStartDate', values.weekStartDate.format('YYYY-MM-DD'));
    } else {
      if (values.name != null && values.name !== '') fd.append('name', values.name);
      if (values.slug != null && values.slug !== '') fd.append('slug', values.slug);
      if (values.categoryId) fd.append('categoryId', values.categoryId);
      if (values.description !== undefined) fd.append('description', values.description ?? '');
      if (values.weight != null) fd.append('weight', String(values.weight));
      if (values.unit !== undefined) fd.append('unit', values.unit ?? '');
      if (values.quantity != null) fd.append('quantity', String(values.quantity));
      if (values.boxUnit) fd.append('boxUnit', values.boxUnit);
      if (values.isOptional !== undefined) fd.append('isOptional', values.isOptional ? 'true' : 'false');
      if (values.weekStartDate) fd.append('weekStartDate', values.weekStartDate.format('YYYY-MM-DD'));
    }
    files.forEach((f) => fd.append('files', f));
    return fd;
  };

  const handleSubmit = async () => {
    if (!boxId) return;
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const files = fileList.map((f) => f.originFileObj).filter(Boolean) as File[];

      if (!isEdit) {
        const fd = buildFormData(values, files, false);
        await api.post(`/admin/boxes/${boxId}/box-products`, fd, { withAuth: true });
        toast.success('Đã thêm rau vào gói');
      } else if (editing) {
        const fd = buildFormData(values, files, true);
        const qs = files.length > 0 ? '?mode=replace' : '';
        await api.patch(`/admin/boxes/${boxId}/box-products/${editing.id}${qs}`, fd, {
          withAuth: true,
        });
        toast.success('Đã cập nhật sản phẩm trong gói');
      }
      setOpen(false);
      setFileList([]);
      fetchBoxProducts(boxId);
    } catch (e: any) {
      console.error(e);
      if (e?.errorFields) return;
      toast.error(e?.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: BoxProductRow) => {
    if (!boxId) return;
    try {
      await api.delete(`/admin/boxes/${boxId}/box-products/${record.id}`, { withAuth: true });
      toast.success('Đã xóa');
      fetchBoxProducts(boxId);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const thumb = (p: ProductInRow) => {
    const im = p?.images;
    if (Array.isArray(im) && im[0]) return im[0];
    return undefined;
  };

  const columns: ColumnsType<BoxProductRow> = [
    {
      title: 'STT',
      width: 56,
      align: 'center',
      render: (_a, _b, i) => i + 1,
    },
    {
      title: 'Sản phẩm',
      render: (_, r) => (
        <div>
          <div className="font-medium">{r.product?.name ?? '—'}</div>
          <Typography.Text type="secondary" className="text-xs">
            {r.product?.category?.name ?? '—'}
          </Typography.Text>
          <div className="mt-0.5 font-mono text-[11px] text-gray-400">SP: {r.productId?.slice(0, 8)}…</div>
        </div>
      ),
    },
    {
      title: 'Ảnh',
      width: 80,
      render: (_, r) => {
        const u = thumb(r.product);
        return u ? (
          <Image src={u} width={52} height={52} className="object-cover rounded border border-gray-100" />
        ) : (
          '—'
        );
      },
    },
    {
      title: 'SL / ĐVT (trong gói)',
      width: 140,
      render: (_, r) => `${r.quantity} ${r.unit}`,
    },
    {
      title: 'Tuần giao',
      width: 120,
      render: (_, r) => formatDate(r.weekStartDate),
    },
    {
      title: 'Tuỳ chọn',
      width: 88,
      render: (_, r) => (r.isOptional ? 'Có' : 'Không'),
    },
    {
      title: 'Thao tác',
      width: 128,
      fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button type="primary" ghost size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa dòng này khỏi gói?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(r)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-1 text-xl font-bold text-gray-900 lg:text-2xl">Cập nhật sản phẩm trong gói</h1>
          <p className="mb-0 text-sm text-gray-500">
            Chọn gói → xem danh sách rau theo <strong>box_products</strong>. Sửa để gọi{' '}
            <code className="rounded bg-gray-100 px-1 text-xs">PATCH /admin/boxes/&#123;boxId&#125;/box-products/&#123;id&#125;</code>
            .
          </p>
        </div>

        <Alert
          type="info"
          showIcon
          className="mb-6"
          message="API đã ghép sẵn"
          description={
            <ul className="mb-0 pl-4 text-sm list-disc">
              <li>
                <strong>GET</strong> <code>/admin/boxes/:boxId/box-products</code> — danh sách
              </li>
              <li>
                <strong>PATCH</strong> — cập nhật thông tin sản phẩm + số lượng trong gói; upload ảnh mới sẽ{' '}
                <strong>thay ảnh</strong> (mode replace).
              </li>
              <li>
                <strong>POST</strong> thêm dòng, <strong>DELETE</strong> xóa liên kết khỏi gói.
              </li>
            </ul>
          }
        />

        <Card className="shadow-sm">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Gói hàng</span>
              <Select
                className="min-w-[260px]"
                value={boxId}
                placeholder="Chọn gói"
                options={boxes.map((b) => ({ value: b.id, label: `${b.name} (${b.slug})` }))}
                onChange={(v) => setBoxId(v)}
                showSearch
                optionFilterProp="label"
              />
              <Button icon={<ReloadOutlined />} onClick={() => boxId && fetchBoxProducts(boxId)} disabled={!boxId}>
                Làm mới
              </Button>
            </div>
            <Button type="primary" icon={<PlusOutlined />} disabled={!boxId} onClick={openCreate} size="large">
              Thêm sản phẩm vào gói
            </Button>
          </div>

          {selectedBox && (
            <p className="mb-4 text-sm text-gray-600">
              Đang chỉnh: <strong>{selectedBox.name}</strong>
            </p>
          )}

          <Spin spinning={loading}>
            {!boxId ? (
              <Empty description="Không có gói nào" />
            ) : rows.length === 0 && !loading ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có sản phẩm nào trong gói này" />
            ) : (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={rows}
                bordered
                pagination={false}
                scroll={{ x: 960 }}
              />
            )}
          </Spin>
        </Card>
      </div>

      <Modal
        title={
          isEdit ? (
            <span>Cập nhật sản phẩm trong gói</span>
          ) : (
            <span>Thêm sản phẩm vào gói</span>
          )
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setFileList([]);
        }}
        onOk={handleSubmit}
        okText={isEdit ? 'Lưu cập nhật' : 'Thêm'}
        okButtonProps={{ loading: submitting }}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-2">
          {!isEdit && (
            <Form.Item label="Cách thêm" name="createMode" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="new">Tạo sản phẩm mới + gắn vào gói</Radio>
                <Radio value="existing">Gắn sản phẩm có sẵn trong hệ thống</Radio>
              </Radio.Group>
            </Form.Item>
          )}

          {!isEdit && mode === 'existing' && (
            <Form.Item
              name="productId"
              label="Sản phẩm"
              rules={[{ required: true, message: 'Chọn sản phẩm' }]}
            >
              <Select
                showSearch
                placeholder="Chọn sản phẩm"
                options={productOptions}
                optionFilterProp="label"
              />
            </Form.Item>
          )}

          {!isEdit && mode === 'new' && (
            <>
              <Divider orientation="left" plain>
                Sản phẩm mới
              </Divider>
              <Form.Item name="name" label="Tên rau / SP" rules={[{ required: true }]}>
                <Input placeholder="Ví dụ: Cà chua bi" />
              </Form.Item>
              <Form.Item name="slug" label="Slug (tuỳ chọn)">
                <Input placeholder="Để trống sẽ tự sinh" />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true, message: 'Chọn danh mục' }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                />
              </Form.Item>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item name="weight" label="Khối lượng (SP)">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
              <Form.Item name="unit" label="Đơn vị (SP)">
                <Input placeholder="kg" />
              </Form.Item>
            </>
          )}

          {isEdit && (
            <>
              <Divider orientation="left" plain>
                Thông tin sản phẩm
              </Divider>
              <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Nhập tên' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="slug" label="Slug">
                <Input />
              </Form.Item>
              <Form.Item name="categoryId" label="Danh mục">
                <Select allowClear options={categories.map((c) => ({ value: c.id, label: c.name }))} />
              </Form.Item>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="weight" label="Khối lượng (SP)">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
              <Form.Item name="unit" label="Đơn vị (SP)">
                <Input />
              </Form.Item>
            </>
          )}

          <Divider orientation="left" plain>
            Trong gói (box_products)
          </Divider>
          <Form.Item
            name="quantity"
            label="Số lượng trong gói"
            rules={[{ required: true, message: 'Nhập số lượng' }]}
          >
            <InputNumber className="w-full" min={0} step={0.1} />
          </Form.Item>
          <Form.Item name="boxUnit" label="Đơn vị trong gói" rules={[{ required: true }]}>
            <Input placeholder="kg" />
          </Form.Item>
          <Form.Item name="isOptional" label="Có thể thay / tuỳ chọn" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="weekStartDate"
            label="Ngày bắt đầu tuần giao"
            rules={[{ required: true, message: 'Chọn tuần' }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <Divider orientation="left" plain>
            Ảnh sản phẩm
          </Divider>
          {isEdit && (
            <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded px-3 py-2">
              Khi chọn ảnh mới, hệ thống <strong>thay toàn bộ ảnh</strong> của sản phẩm (chỉ nên chọn{' '}
              <strong>một ảnh</strong> đại diện).
            </p>
          )}
          <Form.Item label={isEdit ? 'Ảnh mới (tuỳ chọn, tối đa 1)' : 'Ảnh (có thể nhiều file)'}>
            <Upload
              multiple={!isEdit}
              maxCount={isEdit ? 1 : undefined}
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
              listType="picture-card"
            >
              {(isEdit ? fileList.length < 1 : true) && (
                <div>
                  <UploadOutlined />
                  <div className="mt-1 text-xs">Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          {!isEdit && (
            <p className="text-xs text-gray-500">
              <InboxOutlined /> Thêm mới: có thể nhiều ảnh. Gắn SP có sẵn: ảnh upload sẽ nối thêm vào sản phẩm.
            </p>
          )}
        </Form>
      </Modal>
    </Fragment>
  );
};

export default BoxVegetables;
