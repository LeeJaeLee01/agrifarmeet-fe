import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Input, Button } from 'antd';

type LoginForm = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    console.log('Form data:', data);
    // TODO: call API login admin tại đây
  };

  return (
    <main>
      <div className="grid w-full min-h-screen admin-login lg:grid-cols-2">
        {/* Cột trái */}
        <div className="relative w-full h-full bg-[#1677ff]">
          <div className="absolute text-lg font-semibold text-white -translate-x-1/2 -translate-y-1/2 lg:text-2xl top-1/2 left-1/2">
            Welcome back admin
          </div>
        </div>

        {/* Cột phải */}
        <div className="flex flex-col w-full p-5 mx-auto my-5 lg:justify-center">
          <h1 className="text-4xl font-bold text-text1">Đăng nhập</h1>
          <p className="mb-8 text-sm text-text2">Sử dụng tài khoản có quyền admin để đăng nhập</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium">Tên đăng nhập</label>
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
                render={({ field }) => <Input {...field} placeholder="Nhập email" size="large" />}
              />
              {errors.email && <p className="mt-1 text-xs text-red">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-sm font-medium">Mật khẩu</label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Vui lòng nhập mật khẩu' }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Nhập mật khẩu" size="large" />
                )}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              className="w-full"
            >
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
