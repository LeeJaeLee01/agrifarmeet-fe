import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Input, 
  DatePicker, 
  Modal, 
  Form, 
  Upload, 
  message,
  Tag,
  Empty,
  Spin,
  Switch,
  Image,
  Checkbox,
  Popconfirm
} from 'antd';
import { 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SaveOutlined,
  PictureOutlined,
  UploadOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/api';
import './WeeklyMenuAdmin.scss';

dayjs.extend(isoWeek);
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function startOfIsoWeekMonday(d: Dayjs): Dayjs {
  return d.startOf('isoWeek');
}

const WeeklyMenuAdmin: React.FC = () => {
  const { t } = useTranslation();
  const [week, setWeek] = useState<Dayjs>(() => startOfIsoWeekMonday(dayjs()));
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editingFood, setEditingFood] = useState<any>(null);
  const [foodsByProduct, setFoodsByProduct] = useState<Record<string, any[]>>({});
  const [loadingFoods, setLoadingFoods] = useState<Record<string, boolean>>({});
  const [fileList, setFileList] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const weekStr = useMemo(() => startOfIsoWeekMonday(week).format('YYYY-MM-DD'), [week]);

  useEffect(() => {
    loadWeeklyProducts();
  }, [weekStr]);

  const loadWeeklyProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/boxes/goi-co-ban/weekly-products?weekStartDate=${weekStr}`);
      const data = res.data?.data ?? res.data;
      setItems(data?.items ?? []);
    } catch (err) {
      console.error('Error fetching weekly products:', err);
      message.error('Không thể tải danh sách sản phẩm tuần');
    } finally {
      setLoading(false);
    }
  };

  const loadFoodsForProduct = async (productId: string) => {
    try {
      setLoadingFoods(prev => ({ ...prev, [productId]: true }));
      const res = await api.get(`/foods/product/${productId}`);
      const data = res.data?.data ?? res.data;
      setFoodsByProduct(prev => ({ ...prev, [productId]: data || [] }));
    } catch (err) {
      console.error(`Error fetching foods for product ${productId}:`, err);
    } finally {
      setLoadingFoods(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleCreateFood = (product: any) => {
    setSelectedProduct(product);
    setEditingFood(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({ isWeek: true });
    setIsModalOpen(true);
  };

  const handleEditFood = (food: any, product: any) => {
    setSelectedProduct(product);
    setEditingFood(food);
    setFileList([]);
    form.setFieldsValue({
      name: food.name,
      description: food.description,
      isWeek: food.isWeek,
      clearImage: false,
    });
    setIsModalOpen(true);
  };

  const handleDeleteFood = async (foodId: string, productId: string) => {
    try {
      await api.delete(`/foods/${foodId}`, { withAuth: true });
      message.success('Đã xóa món ăn');
      loadFoodsForProduct(productId);
    } catch (err) {
      message.error('Xóa thất bại');
    }
  };

  const handleSaveModal = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('isWeek', String(values.isWeek));
      
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      } else if (values.clearImage) {
        formData.append('image', ''); 
      }

      if (editingFood) {
        await api.patch(`/foods/${editingFood.id}`, formData, { withAuth: true });
        message.success('Đã cập nhật món ăn');
      } else {
        formData.append('productId', selectedProduct.id);
        await api.post('/foods', formData, { withAuth: true });
        message.success('Đã thêm món ăn mới');
      }
      
      loadFoodsForProduct(selectedProduct.id);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save failed:', err);
      message.error('Lưu thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const expandedRowRender = (record: any) => {
    const productId = record.product.id;
    const foods = foodsByProduct[productId] || [];
    const isLoading = loadingFoods[productId];

    if (isLoading) return <Spin className="p-4" />;

    const foodColumns = [
      {
        title: 'Ảnh',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 80,
        render: (url: string) => url ? <img src={url} alt="dish" className="w-12 h-10 object-cover rounded border" /> : <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center"><PictureOutlined className="text-gray-400" /></div>
      },
      { title: 'Tên món ăn', dataIndex: 'name', key: 'name', className: 'font-medium' },
      { title: 'Mô tả', dataIndex: 'description', key: 'description' },
      { 
        title: 'Tuần này', 
        dataIndex: 'isWeek', 
        key: 'isWeek', 
        width: 100,
        render: (is: boolean) => is ? <Tag color="green">Có</Tag> : <Tag color="default">Không</Tag>
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 150,
        render: (_: any, food: any) => (
          <Space>
            <Button 
              size="small" 
              icon={<EditOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                handleEditFood(food, record.product);
              }} 
            />
            <Popconfirm
              title="Xóa thực đơn?"
              description="Bạn có chắc chắn muốn xóa thực đơn này không?"
              onConfirm={() => handleDeleteFood(food.id, productId)}
              onCancel={(e) => e?.stopPropagation()}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button 
                size="small" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={(e) => e.stopPropagation()} 
              />
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <div className="food-sub-table" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <Text strong className="text-gray-600">Danh sách thực đơn gợi ý</Text>
          <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={(e) => {
            e.stopPropagation();
            handleCreateFood(record.product);
          }}>
            Thêm món mới
          </Button>
        </div>
        <Table 
          columns={foodColumns} 
          dataSource={foods} 
          pagination={false} 
          rowKey="id" 
          size="small"
          bordered={false}
          locale={{ emptyText: 'Chưa có thực đơn nào cho sản phẩm này' }}
        />
      </div>
    );
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (p: any) => (
        <Space>
          <img 
            src={Array.isArray(p.images) ? p.images[0] : p.images} 
            alt={p.name} 
            className="w-12 h-12 object-cover rounded shadow-sm" 
          />
          <div>
            <Text strong className="text-gray-800">{p.name}</Text>
            <br />
            <Text type="secondary" className="text-xs">{p.category?.name}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Số món ăn',
      key: 'count',
      align: 'center' as const,
      render: (_: any, record: any) => {
        const count = foodsByProduct[record.product.id]?.length || 0;
        return <Tag color={count > 0 ? 'green' : 'orange'}>{count} món</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          ghost 
          icon={<PlusOutlined />} 
          onClick={(e) => {
            e.stopPropagation();
            handleCreateFood(record.product);
          }}
        >
          Thêm thực đơn
        </Button>
      )
    }
  ];

  return (
    <div className="weekly-menu-admin">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="m-0">Quản lý thực đơn tuần</Title>
          <Text type="secondary">Cài đặt các món ăn gợi ý đa dạng cho sản phẩm trong tuần</Text>
        </div>
        <Space>
          <DatePicker 
            value={week} 
            onChange={(d) => d && setWeek(startOfIsoWeekMonday(d))} 
            format="YYYY-MM-DD"
            allowClear={false}
          />
          <Button icon={<ReloadOutlined />} onClick={loadWeeklyProducts}>Làm mới</Button>
        </Space>
      </div>

      <Card className="shadow-sm border-0">
        <Table 
          loading={loading}
          dataSource={items}
          columns={columns}
          rowKey="id"
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
            onExpand: (expanded, record) => {
              if (expanded) loadFoodsForProduct(record.product.id);
            }
          }}
          pagination={false}
          locale={{ emptyText: <Empty description="Tuần này chưa có sản phẩm nào" /> }}
        />
      </Card>

      <Modal
        title={editingFood ? `Chỉnh sửa món ăn: ${editingFood.name}` : `Thêm món ăn cho: ${selectedProduct?.name}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveModal}
        confirmLoading={submitting}
        destroyOnClose
        width={600}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item 
            name="name" 
            label="Tên món ăn" 
            rules={[{ required: true, message: 'Vui lòng nhập tên món ăn' }]}
          >
            <Input placeholder="Ví dụ: Bắp cải xào tỏi" />
          </Form.Item>
          
          <Form.Item label="Ảnh món ăn">
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
              accept="image/*"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh tải lên</Button>
            </Upload>
          </Form.Item>

          {editingFood && (
            <Form.Item name="clearImage" valuePropName="checked">
              <Checkbox>Xóa ảnh hiện tại {editingFood.imageUrl && <Text type="secondary">(Nếu không tải lên ảnh mới)</Text>}</Checkbox>
            </Form.Item>
          )}

          {editingFood?.imageUrl && !fileList.length && (
            <div className="mb-4">
              <Text type="secondary" className="block mb-2">Ảnh hiện tại:</Text>
              <Image src={editingFood.imageUrl} width={120} className="rounded border" />
            </div>
          )}

          <Form.Item 
            name="description" 
            label="Mô tả / Công thức"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Mô tả ngắn gọn về món ăn..." />
          </Form.Item>

          <Form.Item name="isWeek" label="Hiển thị tuần này" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WeeklyMenuAdmin;
