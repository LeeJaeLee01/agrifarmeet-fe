import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../../../utils/api';
import './WeeklyMenuAdmin.scss';

const { Title, Text } = Typography;
const { TextArea } = Input;

type MenuFood = {
  id: string;
  menuName: string;
  productId: string;
  name: string;
  description?: string;
  preparedProducts?: string[];
  isWeek?: boolean;
  imageUrl?: string;
  product?: { id: string; name: string; slug?: string };
};

type MenuGroup = {
  menuName: string;
  foods: MenuFood[];
  ingredients: string[];
};

type FoodDraft = {
  productId: string;
  name: string;
  description?: string;
  preparedProductsText?: string;
  isWeek: boolean;
  imageFiles?: UploadFile[];
};

type ProductOption = {
  value: string;
  label: string;
};

function toPreparedProducts(text?: string): string[] {
  if (!text) return [];
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeMenuList(payload: unknown): MenuGroup[] {
  if (!Array.isArray(payload)) return [];
  return payload.map((m: any) => ({
    menuName: String(m?.menuName ?? ''),
    foods: Array.isArray(m?.foods) ? m.foods : [],
    ingredients: Array.isArray(m?.ingredients) ? m.ingredients : [],
  }));
}

function normFile(e: any): UploadFile[] {
  if (Array.isArray(e)) return e;
  return e?.fileList ?? [];
}

const WeeklyMenuAdmin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menus, setMenus] = useState<MenuGroup[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [addFoodsOpen, setAddFoodsOpen] = useState(false);
  const [editFoodOpen, setEditFoodOpen] = useState(false);
  const [targetMenu, setTargetMenu] = useState<MenuGroup | null>(null);
  const [editingFood, setEditingFood] = useState<MenuFood | null>(null);
  const [createForm] = Form.useForm();
  const [addFoodsForm] = Form.useForm();
  const [editFoodForm] = Form.useForm();

  const uploadOneFoodImage = async (file: File): Promise<string | undefined> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/uploads?folder=foods', fd, { withAuth: true });
    const payload = res.data?.data ?? res.data;
    if (typeof payload?.path === 'string' && payload.path) return payload.path;
    if (typeof payload?.url === 'string' && payload.url) return payload.url;
    return undefined;
  };

  const buildFoodsPayload = (foodsDraft: FoodDraft[]) => {
    return foodsDraft.map((f) => ({
      productId: String(f.productId || '').trim(),
      name: f.name?.trim(),
      description: f.description?.trim() || undefined,
      preparedProducts: toPreparedProducts(f.preparedProductsText),
      isWeek: Boolean(f.isWeek),
    }));
  };

  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get('/admin/products', { withAuth: true });
      const payload = res.data?.data ?? res.data;
      const items = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
      const opts: ProductOption[] = items
        .map((p: any) => ({
          value: String(p?.id ?? ''),
          label: `${String(p?.name ?? '')} (${String(p?.id ?? '')})`,
        }))
        .filter((x: ProductOption) => x.value && x.label);
      setProductOptions(opts);
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Không tải được danh sách sản phẩm');
      setProductOptions([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const loadMenus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/foods/menus', { withAuth: true });
      const payload = res.data?.data ?? res.data;
      setMenus(normalizeMenuList(payload));
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Không tải được danh sách thực đơn');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const closeCreateModal = () => {
    setCreateOpen(false);
    createForm.resetFields();
  };

  const closeAddFoodsModal = () => {
    setAddFoodsOpen(false);
    setTargetMenu(null);
    addFoodsForm.resetFields();
  };

  const closeEditFoodModal = () => {
    setEditFoodOpen(false);
    setEditingFood(null);
    editFoodForm.resetFields();
  };

  const openCreateModal = () => {
    createForm.setFieldsValue({
      menuName: '',
      foods: [{ isWeek: true }],
    });
    setCreateOpen(true);
  };

  const openAddFoodsModal = (menu: MenuGroup) => {
    setTargetMenu(menu);
    addFoodsForm.setFieldsValue({
      foods: [{ isWeek: true }],
    });
    setAddFoodsOpen(true);
  };

  const submitCreateMenu = async () => {
    try {
      const values = await createForm.validateFields();
      const foodsDraft = (values.foods ?? []) as FoodDraft[];
      const foods = buildFoodsPayload(foodsDraft);
      const fd = new FormData();
      fd.append('menuName', values.menuName?.trim());
      fd.append('foods', JSON.stringify(foods));
      foodsDraft.forEach((f) => {
        const file = f.imageFiles?.[0]?.originFileObj as File | undefined;
        if (file) fd.append('files', file);
      });
      setSubmitting(true);
      await api.post('/admin/foods/menus', fd, { withAuth: true });
      message.success('Đã tạo thực đơn');
      closeCreateModal();
      await loadMenus();
    } catch (error: any) {
      if (error?.errorFields) return;
      console.error(error);
      message.error(error?.response?.data?.message || 'Tạo thực đơn thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const submitAddFoods = async () => {
    if (!targetMenu) return;
    try {
      const values = await addFoodsForm.validateFields();
      const foodsDraft = (values.foods ?? []) as FoodDraft[];
      const foods = buildFoodsPayload(foodsDraft);
      const fd = new FormData();
      fd.append('foods', JSON.stringify(foods));
      foodsDraft.forEach((f) => {
        const file = f.imageFiles?.[0]?.originFileObj as File | undefined;
        if (file) fd.append('files', file);
      });
      setSubmitting(true);
      await api.post(`/admin/foods/menus/${encodeURIComponent(targetMenu.menuName)}/foods`, fd, {
        withAuth: true,
      });
      message.success(`Đã thêm món vào thực đơn "${targetMenu.menuName}"`);
      closeAddFoodsModal();
      await loadMenus();
    } catch (error: any) {
      if (error?.errorFields) return;
      console.error(error);
      message.error(error?.response?.data?.message || 'Thêm món thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMenu = async (menuName: string) => {
    try {
      await api.delete(`/admin/foods/menus/${encodeURIComponent(menuName)}`, { withAuth: true });
      message.success(`Đã xóa thực đơn "${menuName}"`);
      await loadMenus();
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Xóa thực đơn thất bại');
    }
  };



  const openEditFoodModal = (food: MenuFood) => {
    setEditingFood(food);
    editFoodForm.setFieldsValue({
      productId: food.productId,
      name: food.name,
      description: food.description || '',
      preparedProductsText: (food.preparedProducts || []).join(', '),
      isWeek: Boolean(food.isWeek),
      imageFiles: [],
    });
    setEditFoodOpen(true);
  };

  const submitEditFood = async () => {
    if (!editingFood) return;
    try {
      const values = await editFoodForm.validateFields();
      const file = (values.imageFiles?.[0]?.originFileObj as File | undefined) ?? undefined;
      const uploadedPath = file ? await uploadOneFoodImage(file) : undefined;
      setSubmitting(true);
      await api.patch(
        `/foods/${editingFood.id}`,
        {
          productId: String(values.productId || '').trim(),
          name: values.name?.trim(),
          description: values.description?.trim() || undefined,
          preparedProducts: toPreparedProducts(values.preparedProductsText),
          isWeek: Boolean(values.isWeek),
          ...(uploadedPath ? { imageUrl: uploadedPath } : {}),
        },
        { withAuth: true },
      );
      message.success(`Đã cập nhật món "${values.name}"`);
      closeEditFoodModal();
      await loadMenus();
    } catch (error: any) {
      if (error?.errorFields) return;
      console.error(error);
      message.error(error?.response?.data?.message || 'Sửa món thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteFood = async (food: MenuFood) => {
    try {
      await api.delete(`/foods/${food.id}`, { withAuth: true });
      message.success(`Đã xóa món "${food.name}"`);
      await loadMenus();
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Xóa món thất bại');
    }
  };

  const menuColumns: ColumnsType<MenuGroup> = useMemo(
    () => [
      {
        title: 'Thực đơn',
        dataIndex: 'menuName',
        key: 'menuName',
        render: (name: string) => <Text strong>{name}</Text>,
      },
      {
        title: 'Món ăn',
        key: 'foodsCount',
        width: 110,
        align: 'center',
        render: (_, m) => <Tag color={m.foods.length > 0 ? 'green' : 'default'}>{m.foods.length}</Tag>,
      },
      {
        title: 'Nguyên liệu tổng hợp',
        key: 'ingredients',
        render: (_, m) =>
          m.ingredients.length > 0 ? (
            <Space wrap size={[6, 6]}>
              {m.ingredients.map((ing) => (
                <Tag key={ing}>{ing}</Tag>
              ))}
            </Space>
          ) : (
            <Text type="secondary">—</Text>
          ),
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 220,
        render: (_, m) => (
          <Space>
            <Button size="small" icon={<PlusOutlined />} onClick={() => openAddFoodsModal(m)}>
              Thêm món
            </Button>
            <Popconfirm
              title="Xóa thực đơn?"
              description={`Thực đơn "${m.menuName}" sẽ bị xóa cùng tất cả món bên trong.`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => deleteMenu(m.menuName)}
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  const foodColumns: ColumnsType<MenuFood> = [
    {
      title: 'Món ăn',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Nguyên liệu chính',
      key: 'mainIngredient',
      width: 240,
      render: (_, food) =>
        food.product?.name ? (
          <div>
            <Text>{food.product.name}</Text>
            {food.product?.slug ? (
              <div>
                <Text type="secondary" className="text-xs">
                  {food.product.slug}
                </Text>
              </div>
            ) : null}
          </div>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Chuẩn bị kèm',
      key: 'prepared',
      render: (_, food) =>
        Array.isArray(food.preparedProducts) && food.preparedProducts.length > 0 ? (
          <Space wrap size={[6, 6]}>
            {food.preparedProducts.map((pp) => (
              <Tag key={pp}>{pp}</Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Tuần',
      dataIndex: 'isWeek',
      key: 'isWeek',
      width: 90,
      align: 'center',
      render: (v?: boolean) => (v ? <Tag color="green">Bật</Tag> : <Tag>Off</Tag>),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 140,
      render: (_, food) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditFoodModal(food)} />
          <Popconfirm
            title="Xóa món ăn?"
            description={`Bạn có chắc muốn xóa món "${food.name}" khỏi thực đơn?`}
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => deleteFood(food)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderFoodEditor = (form: any) => (
    <Form form={form} layout="vertical" initialValues={{ foods: [{ isWeek: true }] }}>
      <Form.Item
        name="menuName"
        label="Tên thực đơn"
        rules={[{ required: true, message: 'Vui lòng nhập tên thực đơn' }]}
        hidden={form === addFoodsForm}
      >
        <Input placeholder="Ví dụ: Thực đơn tuần 1" />
      </Form.Item>

      <Form.List
        name="foods"
        rules={[
          {
            validator: async (_, foods) => {
              if (!foods || foods.length < 1) {
                throw new Error('Cần ít nhất 1 món ăn');
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, idx) => (
              <Card key={field.key} size="small" className="menu-food-card" title={`Món #${idx + 1}`}>
                <Form.Item
                  {...field}
                  name={[field.name, 'productId']}
                  label="Product ID"
                  rules={[{ required: true, message: 'Nhập productId' }]}
                >
                  <Select
                    showSearch
                    loading={loadingProducts}
                    options={productOptions}
                    placeholder="Chọn sản phẩm"
                    optionFilterProp="label"
                  />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'name']}
                  label="Tên món"
                  rules={[{ required: true, message: 'Nhập tên món' }]}
                >
                  <Input placeholder="Ví dụ: Salad cải kale" />
                </Form.Item>
                <Form.Item {...field} name={[field.name, 'description']} label="Mô tả">
                  <TextArea rows={2} placeholder="Mô tả ngắn món ăn" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'preparedProductsText']}
                  label="Nguyên liệu chuẩn bị kèm"
                  extra="Nhập dạng: Thịt bò, Nấm, Tôm..."
                >
                  <Input placeholder="Thịt bò, Nấm đùi gà" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'imageFiles']}
                  label="Upload ảnh món ăn"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </Form.Item>
                <Form.Item {...field} name={[field.name, 'isWeek']} valuePropName="checked" label="Hiển thị tuần">
                  <Switch />
                </Form.Item>
                <div className="menu-food-card__actions">
                  <Button danger onClick={() => remove(field.name)}>
                    Xóa món này
                  </Button>
                </div>
              </Card>
            ))}
            <Form.ErrorList errors={errors} />
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ isWeek: true })} block>
              Thêm món
            </Button>
          </>
        )}
      </Form.List>
    </Form>
  );

  return (
    <div className="weekly-menu-admin">
      <div className="weekly-menu-admin__header">
        <div>
          <Title level={2} className="weekly-menu-admin__title">
            Quản lý thực đơn
          </Title>
          <Text type="secondary">
            Cấu trúc mới: Thực đơn {'->'} bên trong chứa danh sách món ăn.
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadMenus}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Tạo thực đơn
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          rowKey="menuName"
          loading={loading}
          dataSource={menus}
          columns={menuColumns}
          pagination={false}
          expandable={{
            expandedRowRender: (menu) => (
              <Table
                rowKey="id"
                className="weekly-menu-admin__foods-table"
                dataSource={menu.foods}
                columns={foodColumns}
                pagination={false}
                size="small"
                locale={{ emptyText: 'Thực đơn này chưa có món ăn' }}
              />
            ),
          }}
          locale={{
            emptyText: loading ? <Spin /> : <Empty description="Chưa có thực đơn nào" />,
          }}
        />
      </Card>

      <Modal
        title="Tạo thực đơn mới"
        open={createOpen}
        onCancel={closeCreateModal}
        onOk={submitCreateMenu}
        okText="Tạo thực đơn"
        cancelText="Hủy"
        confirmLoading={submitting}
        width={840}
        destroyOnClose
      >
        {renderFoodEditor(createForm)}
      </Modal>

      <Modal
        title={targetMenu ? `Thêm món vào "${targetMenu.menuName}"` : 'Thêm món'}
        open={addFoodsOpen}
        onCancel={closeAddFoodsModal}
        onOk={submitAddFoods}
        okText="Thêm món"
        cancelText="Hủy"
        confirmLoading={submitting}
        width={840}
        destroyOnClose
      >
        {renderFoodEditor(addFoodsForm)}
      </Modal>

      <Modal
        title={editingFood ? `Sửa món "${editingFood.name}"` : 'Sửa món'}
        open={editFoodOpen}
        onCancel={closeEditFoodModal}
        onOk={submitEditFood}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={submitting}
        width={720}
        destroyOnClose
      >
        <Form form={editFoodForm} layout="vertical">
          <Form.Item name="productId" label="Product ID" rules={[{ required: true, message: 'Nhập productId' }]}>
            <Select
              showSearch
              loading={loadingProducts}
              options={productOptions}
              placeholder="Chọn sản phẩm"
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item name="name" label="Tên món" rules={[{ required: true, message: 'Nhập tên món' }]}>
            <Input placeholder="Tên món ăn" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả ngắn" />
          </Form.Item>
          <Form.Item name="preparedProductsText" label="Nguyên liệu chuẩn bị kèm" extra="Nhập dạng: Thịt bò, Nấm, Tôm...">
            <Input placeholder="Thịt bò, Nấm đùi gà" />
          </Form.Item>
          <Form.Item
            name="imageFiles"
            label="Upload ảnh món ăn"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="isWeek" label="Hiển thị tuần" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WeeklyMenuAdmin;
