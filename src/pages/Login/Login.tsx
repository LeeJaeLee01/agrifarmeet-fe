import React from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Input, Button } from 'antd';
import './Login.scss';
import { NavLink } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    console.log('Login Data:', data);
  };

  return (
    <div className="relative flex items-center justify-end w-full login">
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
          className="w-full max-w-[500px] bg-white rounded-lg px-12 py-10"
        >
          <h1 className="mb-3 text-xl font-semibold text-center">Đăng nhập</h1>

          {/* Email */}
          <div className="mb-4">
            <label className="inline-block mb-1 text-sm font-medium text-text2">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Vui lòng nhập email' }}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập email" className="h-[52px]" />
              )}
            />
            {errors.email && <p className="mt-1 text-xs text-red">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="inline-block mb-1 text-sm font-medium text-text2">Mật khẩu</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Vui lòng nhập mật khẩu',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu tối thiểu 6 ký tự',
                },
              }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Nhập mật khẩu" className="h-[52px]" />
              )}
            />
            {errors.password && <p className="mt-1 text-xs text-red">{errors.password.message}</p>}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-green h-[52px] text-base font-semibold"
          >
            Đăng nhập
          </Button>

          <div className="mt-4 text-sm text-center">
            <span>Chưa có tài khoản? </span>
            <NavLink to="/sign-up" className="text-green hover:underline">
              Đăng ký ngay
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
