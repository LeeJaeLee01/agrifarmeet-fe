import React, { Fragment, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Input, Button, message } from 'antd';
import './Login.scss';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { useDispatch } from 'react-redux';
import { setToken, setUsername } from '../../store/slices/authSlice'; // đường dẫn slice bạn đã tạo
import { AppDispatch } from '../../store';
import { useTitle } from '../../hooks/useTitle';
import { TLogin } from '../../types/TUser';
import { toast } from 'react-toastify';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('login.title'));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const onSubmit: SubmitHandler<TLogin> = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/users/login', {
        username: data.username,
        password: data.password,
      });

      if (response.status === 200) {
        toast.success(t('messages.loginSuccess'));

        if (response.data.token) {
          // ✅ lưu vào Redux
          dispatch(setToken(response.data.token));
          dispatch(setUsername(response.data.user.username));

          // ✅ vẫn lưu localStorage (cho refresh)
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', response.data.user.username);
        }

        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(t('messages.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <MainHeader sticky />
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
            className="w-full max-w-[500px] bg-white rounded-lg px-12 py-10 shadow-md"
          >
            <h1 className="mb-3 text-xl font-semibold text-center">{t('login.title')}</h1>

            {/* Account */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium text-text2">{t('login.account')}</label>
              <Controller
                name="username"
                control={control}
                rules={{ required: t('login.accountRequired') }}
                render={({ field }) => (
                  <Input {...field} placeholder={t('login.enterAccount')} className="h-[52px]" />
                )}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium text-text2">{t('login.password')}</label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: t('login.passwordRequired'),
                  minLength: {
                    value: 6,
                    message: t('login.passwordMinLength'),
                  },
                }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder={t('login.enterPassword')} className="h-[52px]" />
                )}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-green h-[52px] text-base font-semibold"
              loading={loading}
              disabled={loading}
            >
              {t('common.login')}
            </Button>

            <div className="mt-4 text-sm text-center">
              <span>{t('login.noAccount')} </span>
              <NavLink to="/sign-up" className="text-green hover:underline">
                {t('login.signupNow')}
              </NavLink>
            </div>
          </form>
        </div>
      </div>
      <MainFooter />
    </Fragment>
  );
};

export default LoginPage;
