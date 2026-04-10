import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Upload,
  Image,
  Checkbox,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';

type NewsRow = {
  id: string;
  name?: string | null;
  images?: string[] | null;
  description?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

const getPayloadData = (res: any) => res?.data?.data ?? res?.data;

const NewsAdmin: React.FC = () => {
  useTitle('Tin tức — Admin');

  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editing, setEditing] = useState<NewsRow | null>(null);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  const fetchList = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const res = await api.get(`/news?page=${page}&limit=${limit}`, { withAuth: true });
      const payload = getPayloadData(res);
      const list: NewsRow[] = payload?.items ?? [];
      const meta = payload?.meta;

      setItems(list);
      setPagination({
        current: meta?.page ?? page,
        pageSize: meta?.limit ?? limit,
        total: meta?.total ?? list.length,
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Không tải được tin tức');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList(1, 20);
  }, [fetchList]);

  const imageThumb = useCallback((row: NewsRow) => {
    const imgs = row.images;
    if (!Array.isArray(imgs) || imgs.length === 0) return '—';
    return (
      <Image.PreviewGroup>
        <Space wrap size="small">
          {imgs.slice(0, 3).map((src, i) => (
            <Image
              key={`${row.id}-img-${i}`}
              src={src}
              width={46}
              height={46}
              className="object-cover rounded"
            />
          ))}
        </Space>
      </Image.PreviewGroup>
    );
  }, []);

  const openCreate = () => {
    setIsEdit(false);
    setEditing(null);
    setExistingImages([]);
    setFileList([]);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (row: NewsRow) => {
    setIsEdit(true);
    setEditing(row);
    setExistingImages(Array.isArray(row.images) ? row.images : []);
    setFileList([]);
    form.setFieldsValue({
      name: row.name ?? '',
      description: row.description ?? '',
      clearImages: false,
    });
    setOpen(true);
  };

  const uploadFilesToNews = useCallback(async (files: File[]) => {
    const paths: string[] = [];
    // Upload lần lượt để dễ kiểm soát lỗi + tránh quá nhiều request song song.
    for (const f of files) {
      const fd = new FormData();
      fd.append('file', f);
      const res = await api.post(`/uploads?folder=news`, fd);
      const payload = getPayloadData(res);
      if (typeof payload?.path === 'string') paths.push(payload.path);
    }
    return paths;
  }, []);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      const selectedFiles = fileList
        .map((f) => f.originFileObj)
        .filter(Boolean) as File[];

      if (!isEdit && selectedFiles.length === 0 && !values.description?.trim()) {
        toast.error('Vui lòng nhập mô tả hoặc chọn ít nhất 1 ảnh');
        return;
      }

      const uploadedPaths = selectedFiles.length
        ? await uploadFilesToNews(selectedFiles)
        : [];

      let imagesToSend: string[] | null = null;

      if (isEdit) {
        const keepOld = uploadedPaths.length === 0 && !values.clearImages;

        if (keepOld) {
          imagesToSend = existingImages.length ? existingImages : null;
        } else if (values.clearImages) {
          // clearImages = true: dùng uploadedPaths (nếu có), còn không thì xóa ảnh (null).
          imagesToSend = uploadedPaths.length ? uploadedPaths : null;
        } else {
          // Upload file mới => thay toàn bộ ảnh bằng uploadedPaths.
          imagesToSend = uploadedPaths.length ? uploadedPaths : null;
        }
      } else {
        imagesToSend = uploadedPaths.length ? uploadedPaths : null;
      }

      const payload: Partial<NewsRow> = {
        name: values.name?.trim() ? values.name.trim() : null,
        description: values.description?.trim() ? values.description : null,
        images: imagesToSend,
      };

      if (isEdit && editing) {
        await api.patch(`/news/${editing.id}`, payload, { withAuth: true });
        toast.success('Đã cập nhật tin tức');
      } else {
        await api.post('/news', payload, { withAuth: true });
        toast.success('Đã tạo tin tức');
      }

      setOpen(false);
      setFileList([]);
      setExistingImages([]);
      setEditing(null);
      setIsEdit(false);
      fetchList(pagination.current, pagination.pageSize);
    } catch (e: any) {
      console.error(e);
      if (e?.errorFields) return;
      toast.error(e?.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (row: NewsRow) => {
    try {
      await api.delete(`/news/${row.id}`, { withAuth: true });
      toast.success('Đã xóa');
      fetchList(pagination.current, pagination.pageSize);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const columns: ColumnsType<NewsRow> = useMemo(
    () => [
      {
        title: 'STT',
        width: 56,
        align: 'center',
        render: (_a, _b, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
      },
      {
        title: 'Ảnh',
        width: 220,
        render: (_: unknown, record: NewsRow) => imageThumb(record),
      },
      {
        title: 'Tên bài viết',
        width: 200,
        dataIndex: 'name',
        ellipsis: true,
        render: (n: string | null | undefined) => n?.trim() || '—',
      },
      {
        title: 'Mô tả',
        width: 300,
        dataIndex: 'description',
        ellipsis: true,
        render: (d: string | null | undefined) => d || '—',
      },
      {
        title: 'Ngày tạo',
        width: 180,
        dataIndex: 'createdAt',
        render: (d: string | Date) => (d ? formatDate(String(d)) : '—'),
      },
      {
        title: 'Hành động',
        width: 120,
        fixed: 'right',
        render: (_: unknown, r: NewsRow) => (
          <Space>
            <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(r)} />
            <Popconfirm title="Xóa tin tức này?" onConfirm={() => handleDelete(r)}>
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [imageThumb, pagination.current, pagination.pageSize],
  );

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý tin tức</h1>
      <div className="flex flex-wrap justify-end gap-3 mb-5">
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm tin tức
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          bordered
          scroll={{ x: 1280 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (page, pageSize) => fetchList(page, pageSize ?? 20),
          }}
        />
      </Spin>

      <Modal
        title={isEdit ? 'Sửa tin tức' : 'Thêm tin tức'}
        open={open}
        onCancel={() => {
          setOpen(false);
          setFileList([]);
        }}
        onOk={handleSubmit}
        okButtonProps={{ loading: submitting }}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {isEdit && (
            <Form.Item name="clearImages" valuePropName="checked">
              <Checkbox>Xóa ảnh hiện có (nếu không chọn ảnh mới)</Checkbox>
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="Tên bài viết"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài viết' }]}
          >
            <Input placeholder="Tiêu đề hiển thị trên trang tin tức" maxLength={200} showCount />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {
                validator: async (_, val) => {
                  // Không bắt buộc description tuyệt đối: backend sẽ check description/images.
                  // Nhưng nếu val rỗng và user cũng không chọn ảnh mới, BE sẽ báo lỗi.
                  return;
                },
              },
            ]}
          >
            <Input.TextArea rows={6} placeholder="Nhập mô tả tin tức (có thể rất dài)" />
          </Form.Item>

          <Form.Item label="Ảnh (tùy chọn)">
            <Upload
              multiple
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          {isEdit && existingImages.length > 0 && (
            <div>
              <div className="mb-2 text-sm font-medium text-text1">Ảnh hiện có</div>
              <div className="flex flex-wrap gap-2">
                {existingImages.slice(0, 8).map((src, i) => (
                  <Image key={`existing-${i}`} src={src} width={72} height={48} className="object-cover" />
                ))}
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </Fragment>
  );
};

export default NewsAdmin;

