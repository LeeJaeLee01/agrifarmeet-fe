import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Input, Button, Select } from 'antd';
import Section from '../../components/Section/Section';
import axios from 'axios';
import './Purchase.scss';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

type PurchaseForm = {
  boxId: string;
  fullname: string;
  email: string;
  phone: string;
  province: string | null;
  district: string | null;
  ward: string | null;
  addressDetail: string;
  timeActive: string;
  timeEnd: string;
};

const { Option } = Select;

const PurchasePage: React.FC = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PurchaseForm>();

  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [boxInfo, setBoxInfo] = useState<any>(null);

  const boxId = useSelector((state: RootState) => state.box.selectedBoxId);
  const navigate = useNavigate();

  // 🔹 Nếu không có boxId → quay về trang chủ
  useEffect(() => {
    if (!boxId) {
      toast.error('Bạn chưa chọn gói nào!');
      navigate('/');
      return;
    }
  }, [boxId, navigate]);

  // 🔹 Lấy thông tin box từ API
  useEffect(() => {
    if (!boxId) return;
    const fetchBox = async () => {
      try {
        const res = await axios.get(`http://localhost:3030/boxes/${boxId}`);
        setBoxInfo(res.data);
        // Set boxId vào form luôn
        setValue('boxId', boxId);
      } catch (err) {
        console.error(err);
        toast.error('Không tải được thông tin gói hàng');
      }
    };
    fetchBox();
  }, [boxId, setValue]);

  // 🔹 Lấy danh sách tỉnh
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  // 🔹 Lấy huyện theo tỉnh
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts || []));
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  // 🔹 Lấy xã theo huyện
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards || []));
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const onSubmit: SubmitHandler<PurchaseForm> = async (data) => {
    if (!boxInfo) return;

    const fullAddress = [data.addressDetail, data.ward, data.district, data.province]
      .filter(Boolean)
      .join(', ');

    const payload = {
      boxId: boxInfo.id,
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      address: fullAddress,
      timeActive: new Date().toISOString(),
      timeEnd: new Date(Date.now() + 10 * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      setLoading(true);
      await axios.post('http://localhost:3030/boxes/purchase', payload);
      toast.success('Đặt hàng thành công!');
      reset();
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi đặt hàng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <div className="container mx-auto">
        <h1 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">Đặt hàng</h1>
        <div className="flex flex-col justify-between w-full gap-10 pb-10 mb-10 lg:flex-row item-center">
          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full lg:w-2/3 xl:w-3/4"
            id="purchase-form"
          >
            <h2 className="mb-5 text-lg font-medium lg:text-xl text-text1">Thông tin người nhận</h2>
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium">Họ và tên</label>
              <Controller
                name="fullname"
                control={control}
                rules={{ required: 'Vui lòng nhập họ tên' }}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập họ và tên" className="h-[52px]" />
                )}
              />
              {errors.fullname && <p className="text-xs text-red">{errors.fullname.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium">Email</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Vui lòng nhập email',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' },
                }}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập email" className="h-[52px]" />
                )}
              />
              {errors.email && <p className="text-xs text-red">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium">Số điện thoại</label>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Vui lòng nhập số điện thoại',
                  maxLength: { value: 10, message: 'Số điện thoại tối đa 10 chữ số' },
                  pattern: { value: /^[0-9]{10}$/, message: 'Số điện thoại phải gồm 10 chữ số' },
                }}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập số điện thoại" className="h-[52px]" />
                )}
              />
              {errors.phone && <p className="text-xs text-red">{errors.phone.message}</p>}
            </div>

            {/* Province */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium">Tỉnh/Thành phố</label>
              <Controller
                name="province"
                control={control}
                rules={{ required: 'Chọn tỉnh/thành phố' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || undefined}
                    onChange={(val) => {
                      const provinceObj = provinces.find((p) => p.code === val);
                      setSelectedProvince(provinceObj);
                      field.onChange(provinceObj?.name || null);

                      setValue('district', null);
                      setValue('ward', null);
                      setDistricts([]);
                      setWards([]);
                    }}
                    placeholder="Chọn tỉnh"
                    className="w-full h-[52px]"
                  >
                    {provinces.map((p) => (
                      <Option key={p.code} value={p.code}>
                        {p.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.province && <p className="text-xs text-red">{errors.province.message}</p>}
            </div>

            {/* District */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium">Quận/Huyện</label>
              <Controller
                name="district"
                control={control}
                rules={{ required: 'Chọn quận/huyện' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || undefined}
                    onChange={(val) => {
                      const districtObj = districts.find((d) => d.code === val);
                      setSelectedDistrict(districtObj);
                      field.onChange(districtObj?.name || null);

                      setValue('ward', null);
                    }}
                    placeholder="Chọn quận/huyện"
                    className="w-full h-[52px]"
                    disabled={!districts.length}
                  >
                    {districts.map((d) => (
                      <Option key={d.code} value={d.code}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.district && <p className="text-xs text-red">{errors.district.message}</p>}
            </div>

            {/* Ward */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium">Xã/Phường</label>
              <Controller
                name="ward"
                control={control}
                rules={{ required: 'Chọn xã/phường' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || undefined}
                    onChange={(val) => {
                      const wardObj = wards.find((w) => w.code === val);
                      field.onChange(wardObj?.name || null);
                    }}
                    placeholder="Chọn xã/phường"
                    className="w-full h-[52px]"
                    disabled={!wards.length}
                  >
                    {wards.map((w) => (
                      <Option key={w.code} value={w.code}>
                        {w.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.ward && <p className="text-xs text-red">{errors.ward.message}</p>}
            </div>

            {/* Address detail */}
            <div className="mb-6">
              <label className="inline-block mb-1 text-sm font-medium">Địa chỉ chi tiết</label>
              <Controller
                name="addressDetail"
                control={control}
                rules={{ required: 'Vui lòng nhập địa chỉ chi tiết' }}
                render={({ field }) => (
                  <Input {...field} placeholder="Số nhà, đường, thôn..." className="h-[52px]" />
                )}
              />
              {errors.addressDetail && (
                <p className="text-xs text-red">{errors.addressDetail.message}</p>
              )}
            </div>
          </form>

          {/* ORDER SUMMARY */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <h2 className="mb-5 text-lg font-semibold lg:text-xl text-text1">Thông tin đơn hàng</h2>

            {boxInfo ? (
              <>
                <div className="flex w-full gap-5 pb-5 mb-5 border-b border-border">
                  <img
                    src={boxInfo.image || 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png'}
                    alt=""
                    className="block object-cover rounded-lg w-28 h-28"
                  />
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium lg:mb-2 lg:text-lg text-text1">
                      {boxInfo.name}
                    </p>
                    <p className="mb-1 text-xs lg:mb-2 lg:text-sm text-text2">
                      {boxInfo.description}
                    </p>
                    <p className="text-xs lg:text-sm text-text3">
                      Khối lượng: <span>{boxInfo.totalWeight}g</span>
                    </p>
                  </div>
                </div>

                <h3 className="mb-5 text-sm lg:text-base">Các sản phẩm có trong gói hàng</h3>
                {boxInfo.products?.map((p: any) => (
                  <div className="flex gap-5 mb-5" key={p.id}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="block object-cover w-20 h-20 rounded-lg"
                    />
                    <div>
                      <p className="mb-1 text-sm lg:mb-2 text-text2">{p.name}</p>
                      <p className="text-xs text-text3">
                        Khối lượng tịnh: <span>{p.weight}g</span>
                      </p>
                    </div>
                  </div>
                ))}

                <div>
                  <p className="text-lg text-end">
                    Tổng số tiền: <span>{Number(boxInfo.price).toLocaleString()}đ</span>
                  </p>
                  <div className="flex justify-end w-full">
                    <Button
                      type="primary"
                      block
                      className="bg-green h-[52px]"
                      loading={loading}
                      onClick={() => handleSubmit(onSubmit)()}
                    >
                      Xác nhận đặt hàng
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p>Đang tải thông tin gói hàng...</p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default PurchasePage;
