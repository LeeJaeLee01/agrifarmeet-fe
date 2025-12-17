import React, { Fragment, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Input, Button } from 'antd';
import './SignUp.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import { TSignUp } from '../../types/TUser';
import { useTitle } from '../../hooks/useTitle';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { useTranslation } from 'react-i18next';

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('common.signup'));

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TSignUp>();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const password = watch('password');

  const onSubmit: SubmitHandler<TSignUp> = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/users', {
        username: data.username,
        password: data.password,
      });

      if (response.status === 201) {
        toast.success(t('common.signupSuccess'));
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || t('common.signupFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <MainHeader sticky />
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
            className="w-full max-w-[500px] bg-white rounded-lg px-12 py-10 m-5 shadow-md"
          >
            <h1 className="mb-3 text-xl font-semibold text-center">{t('common.signup')}</h1>

            {/* Username */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium">{t('common.account')}</label>
              <Controller
                name="username"
                control={control}
                rules={{
                  required: t('common.accountRequired'),
                }}
                render={({ field }) => (
                  <Input {...field} placeholder={t('common.enterAccount')} className="h-[52px]" />
                )}
              />
              {errors.username && <p className="text-xs text-red">{errors.username.message}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium">{t('login.password')}</label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: t('login.passwordRequired'),
                  minLength: { value: 8, message: t('common.passwordMinLength8') },
                }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder={t('login.enterPassword')} className="h-[52px]" />
                )}
              />
              {errors.password && <p className="text-xs text-red">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="inline-block mb-1 text-sm font-medium">{t('common.confirmPassword')}</label>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: t('common.confirmPasswordRequired'),
                  validate: (value) => value === password || t('common.passwordMismatch'),
                }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder={t('common.enterConfirmPassword')} className="h-[52px]" />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-green h-[52px]"
              loading={loading}
              disabled={loading}
            >
              {t('common.signup')}
            </Button>

            <div className="mt-4 text-sm text-center">
              <span>{t('common.hasAccount')} </span>
              <NavLink to="/login" className="text-green hover:underline">
                {t('common.loginNow')}
              </NavLink>
            </div>
          </form>
        </div>
      </div>
      <MainFooter />
    </Fragment>
  );
};

export default SignUpPage;
