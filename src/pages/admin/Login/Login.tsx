import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { setToken } from '../../../store/slices/authSlice';
import { jwtDecode } from 'jwt-decode';
import api from '../../../utils/api';

type LoginForm = {
  username: string;
  password: string;
};

type JwtPayload = {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
};

const Login: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await api.post('/users/login', {
        username: data.username,
        password: data.password,
      });

      if (res.data?.token) {
        const decoded: JwtPayload = jwtDecode<JwtPayload>(res.data.token);

        if (decoded.role === 'admin') {
          localStorage.setItem('adminToken', res.data.token);
          dispatch(setToken(res.data.token));

          navigate('/admin');
          toast.success('Đăng nhập thành công!');
        } else {
          toast.error('Tài khoản không có quyền admin');
        }
      } else {
        toast.error('Đã có lỗi xảy ra, vui lòng thử lại');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
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
                name="username"
                control={control}
                rules={{
                  required: 'Vui lòng nhập tên đăng nhập',
                }}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập tên đăng nhập" size="large" />
                )}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red">{errors.username.message}</p>
              )}
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
