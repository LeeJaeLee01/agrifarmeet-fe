import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Input, Button, Select } from 'antd';
import './SignUp.scss';
import { NavLink } from 'react-router-dom';
import { TSignUp } from '../../types/TUser';
import { useTitle } from '../../hooks/useTitle';

const { Option } = Select;

const SignUpPage: React.FC = () => {
  useTitle('Đăng ký');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TSignUp>();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);

  // Lấy danh sách tỉnh
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  // Lấy danh sách huyện khi chọn tỉnh
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

  // Lấy danh sách xã khi chọn huyện
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards || []));
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const onSubmit: SubmitHandler<TSignUp> = (data) => {
    // Tạo chuỗi địa chỉ đầy đủ
    const fullAddress = [data.addressDetail, data.ward, data.district, data.province]
      .filter(Boolean)
      .join(', ');

    const finalData = {
      ...data,
      address: fullAddress,
      addressDetail: undefined, // override lại address
      province: undefined,
      district: undefined,
      ward: undefined,
    };

    console.log('Form Data:', finalData);
  };

  return (
    <div className="relative flex items-center justify-end w-full sign-up">
      <div className="absolute inset-0 -z-10 background">
        <img
          src="https://foodtank.com/wp-content/uploads/2021/03/tim-mossholder-xDwEa2kaeJA-unsplash.jpg"
          alt="background"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex items-center justify-center w-full h-full px-5 lg:justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[500px] bg-white rounded-lg px-12 py-10 m-5"
        >
          <h1 className="mb-3 text-xl font-semibold text-center">Đăng ký</h1>

          {/* Email */}
          <div className="mb-4">
            <label className="inline-block mb-1 text-sm font-medium">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Vui lòng nhập email',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email không hợp lệ',
                },
              }}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập email" className="h-[52px]" />
              )}
            />
            {errors.email && <p className="text-xs text-red">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="inline-block mb-1 text-sm font-medium">Mật khẩu</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Vui lòng nhập mật khẩu',
                minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
              }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Nhập mật khẩu" className="h-[52px]" />
              )}
            />
            {errors.password && <p className="text-xs text-red">{errors.password.message}</p>}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="inline-block mb-1 text-sm font-medium">Số điện thoại</label>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Vui lòng nhập số điện thoại',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Số điện thoại phải gồm 10 chữ số',
                },
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

                    // reset
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

                    // reset
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
                    const wardObj = wards.find((w) => w.name === val);
                    field.onChange(wardObj?.name || null);
                  }}
                  placeholder="Chọn xã/phường"
                  className="w-full h-[52px]"
                  disabled={!wards.length}
                >
                  {wards.map((w) => (
                    <Option key={w.code} value={w.name}>
                      {w.name}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.ward && <p className="text-xs text-red">{errors.ward.message}</p>}
          </div>

          {/* Address detail */}
          <div className="mb-4">
            <label className="inline-block mb-1 text-sm font-medium">Địa chỉ chi tiết</label>
            <Controller
              name="addressDetail"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Số nhà, đường, thôn..." className="h-[52px]" />
              )}
            />
            {errors.addressDetail && (
              <p className="text-xs text-red">{errors.addressDetail.message}</p>
            )}
          </div>

          <Button type="primary" htmlType="submit" block className="bg-green h-[52px]">
            Đăng ký
          </Button>

          <div className="mt-4 text-sm text-center">
            <span>Đã có tài khoản? </span>
            <NavLink to="/login" className="text-green hover:underline">
              Đăng nhập ngay
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
