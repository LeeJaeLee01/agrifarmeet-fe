import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Input, Button, Select, Modal } from 'antd';
import Section from '../../components/Section/Section';
import './Purchase.scss';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { useTitle } from '../../hooks/useTitle';
import { formatWeight, generateRandomString, formatVND } from '../../utils/helper';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { QRCodeCanvas } from 'qrcode.react';

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
  const { t } = useTranslation();
  useTitle(t('purchase.title'));

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
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrExpireTime, setQrExpireTime] = useState<number>(0); // Thời gian còn lại (giây)
  const [currentBoxId, setCurrentBoxId] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null); // orderId để polling GET /boxes/payment/status/:orderId
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successPayDate, setSuccessPayDate] = useState<string | null>(null);

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // 🔹 Lấy thông tin box từ API
  useEffect(() => {
    if (!slug) return;
    const fetchBox = async () => {
      try {
        const res = await api.get<{ data: any }>(`/boxes/${slug}`);
        setBoxInfo(res.data.data);
        // Set boxId vào form luôn
        setValue('boxId', res.data.data.id);
      } catch (err) {
        console.error(err);
        toast.error(t('purchase.cannotLoadBox'));
      }
    };
    fetchBox();
  }, [slug, setValue]);

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

  // 🔹 Đếm ngược thời gian QR code (3 phút = 180 giây)
  useEffect(() => {
    if (!showQrModal || !qrCodeData) {
      setQrExpireTime(0);
      return;
    }

    // Bắt đầu đếm ngược từ 180 giây (3 phút)
    setQrExpireTime(180);

    const interval = setInterval(() => {
      setQrExpireTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Hết hạn: đóng modal và hiển thị thông báo
          setShowQrModal(false);
          setQrCodeData(null);
          toast.error(t('purchase.qrExpired'));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showQrModal, qrCodeData]);

  // 🔹 Polling GET /boxes/payment/status/:orderId mỗi 5 giây; nếu status === 'completed' thì đóng QR và hiện modal thành công
  useEffect(() => {
    if (!showQrModal || !currentOrderId) {
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const res = await api.get(`/boxes/payment/status/${currentOrderId}`, {
          withAuth: true,
        });
        // Backend có thể trả { data: { status, payDate, ... } } hoặc { status, payDate, ... }
        const payload = res.data?.data ?? res.data;
        if (payload && String(payload.status).toLowerCase() === 'completed') {
          setShowQrModal(false);
          setQrCodeData(null);
          setQrExpireTime(0);
          setCurrentBoxId(null);
          setCurrentOrderId(null);
          setSuccessPayDate(payload.payDate ?? null);
          setShowSuccessModal(true);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    };

    checkPaymentStatus();
    const pollInterval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(pollInterval);
  }, [showQrModal, currentOrderId, navigate, t]);

  // 🔹 Format thời gian đếm ngược thành MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 🔹 Đóng modal QR và reset state
  const handleCloseQrModal = () => {
    setShowQrModal(false);
    setQrCodeData(null);
    setQrExpireTime(0);
    setCurrentBoxId(null);
    setCurrentOrderId(null);
  };

  const onSubmit: SubmitHandler<PurchaseForm> = async (data) => {
    if (!boxInfo) return;

    // Tạo orderId ngẫu nhiên
    const orderId = generateRandomString(13);
    const amount = Number(boxInfo.price);

    try {
      setLoading(true);

      // Tạo body request cho API /payment/create
      const requestBody = {
        orderId,
        amount,
        orderInfo: `Thanh toán ${boxInfo.name}`,
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        address: `${data.province}, ${data.district}, ${data.ward}`,
        address_detail: data.addressDetail,
        box_id: boxInfo.id,
      };

      // Gọi API /boxes/payment/qr để tạo QR code
      const res = await api.post('/boxes/payment/qr', requestBody);

      if (res.data && res.data.data && res.data.data.data) {
        setQrCodeData(res.data.data.data);
        setCurrentBoxId(boxInfo.id);
        setCurrentOrderId(orderId); // Lưu orderId để polling GET /boxes/payment/status/:orderId
        setShowQrModal(true);
        toast.success(t('purchase.createQrSuccess'));
      } else {
        toast.error(t('purchase.createQrFailed'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('purchase.orderError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <MainHeader sticky />

      {/* Modal thành công thanh toán (icon V xanh + hiệu ứng) */}
      <Modal
        title={null}
        open={showSuccessModal}
        onOk={() => {
          setShowSuccessModal(false);
          setSuccessPayDate(null);
          navigate('/');
        }}
        footer={
          <Button type="primary" onClick={() => {
            setShowSuccessModal(false);
            setSuccessPayDate(null);
            navigate('/');
          }}>
            OK
          </Button>
        }
        closable={false}
        centered
        width={400}
      >
        <div className="payment-success-modal">
          <div className="payment-success-icon-wrap">
            <span className="payment-success-v">V</span>
          </div>
          <p className="payment-success-title">{t('purchase.paymentSuccess')}</p>
          {successPayDate && <p className="payment-success-date">{successPayDate}</p>}
        </div>
      </Modal>

      <Section spaceBottom>
        <div className="container mx-auto">
          <h1 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">{t('purchase.title')}</h1>
          <div className="flex flex-col justify-between w-full gap-10 lg:flex-row item-center">
            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full lg:w-2/3 xl:w-3/4"
              id="purchase-form"
            >
              <h2 className="mb-5 text-lg font-medium lg:text-xl text-text1">
                {t('purchase.receiverInfo')}
              </h2>
              <div className="mb-4">
                <label className="inline-block mb-1 text-sm font-medium">{t('purchase.fullname')}</label>
                <Controller
                  name="fullname"
                  control={control}
                  rules={{ required: 'purchase.fullnameRequired' }}
                  render={({ field }) => (
                    <Input {...field} placeholder={t('purchase.enterFullname')} className="h-[52px]" />
                  )}
                />
                {errors.fullname && <p className="text-xs text-red">{t(errors.fullname.message || '')}</p>}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="inline-block mb-1 text-sm font-medium">{t('purchase.email')}</label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'purchase.emailRequired',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'purchase.emailInvalid' },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder={t('purchase.enterEmail')} className="h-[52px]" />
                  )}
                />
                {errors.email && <p className="text-xs text-red">{t(errors.email.message || '')}</p>}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="inline-block mb-1 text-sm font-medium">{t('purchase.phone')}</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: 'purchase.phoneRequired',
                    maxLength: { value: 10, message: 'purchase.phoneMaxLength' },
                    pattern: { value: /^[0-9]{10}$/, message: 'purchase.phonePattern' },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder={t('purchase.enterPhone')} className="h-[52px]" />
                  )}
                />
                {errors.phone && <p className="text-xs text-red">{t(errors.phone.message || '')}</p>}
              </div>

              {/* Province */}
              <div className="mb-4">
                <label className="inline-block mb-1 text-sm font-medium">{t('purchase.province')}</label>
                <Controller
                  name="province"
                  control={control}
                  rules={{ required: 'purchase.provinceRequired' }}
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
                      placeholder={t('purchase.selectProvince')}
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
                {errors.province && <p className="text-xs text-red">{t(errors.province.message || '')}</p>}
              </div>

              {/* District */}
              <div className="mb-4">
                <label className="inline-block mb-1 text-sm font-medium">{t('purchase.district')}</label>
                <Controller
                  name="district"
                  control={control}
                  rules={{ required: 'purchase.districtRequired' }}
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
                      placeholder={t('purchase.selectDistrict')}
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
                {errors.district && <p className="text-xs text-red">{t(errors.district.message || '')}</p>}
              </div>

              {/* Ward */}
              <div className="mb-4">
                <label className="inline-block mb-1 text-sm font-medium">{t('purchase.ward')}</label>
                <Controller
                  name="ward"
                  control={control}
                  rules={{ required: 'purchase.wardRequired' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || undefined}
                      onChange={(val) => {
                        const wardObj = wards.find((w) => w.code === val);
                        field.onChange(wardObj?.name || null);
                      }}
                      placeholder={t('purchase.selectWard')}
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
                {errors.ward && <p className="text-xs text-red">{t(errors.ward.message || '')}</p>}
              </div>

              {/* Address detail */}
              <div className="mb-6">
                <label className="inline-block mb-1 text-sm font-medium">{t('purchase.addressDetail')}</label>
                <Controller
                  name="addressDetail"
                  control={control}
                  rules={{ required: 'purchase.addressDetailRequired' }}
                  render={({ field }) => (
                    <Input {...field} placeholder={t('purchase.enterAddressDetail')} className="h-[52px]" />
                  )}
                />
                {errors.addressDetail && (
                  <p className="text-xs text-red">{t(errors.addressDetail.message || '')}</p>
                )}
              </div>

              {/* Total & Button */}
              {boxInfo && (
                <div className="mt-8">
                  <p className="text-lg text-left mb-8 font-semibold">
                    {t('purchase.totalAmount')}: <span className="text-green-600 text-xl">{formatVND(boxInfo.price)}</span>
                  </p>
                  <div className="flex justify-center w-full">
                    <Button
                      type="primary"
                      className="bg-green h-[52px] text-lg font-semibold"
                      loading={loading}
                      htmlType="submit"
                    >
                      {t('purchase.confirmOrder')}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            {/* ORDER SUMMARY */}
            <div className="w-full lg:w-1/3 xl:w-1/4">
              <h2 className="mb-5 text-lg font-semibold lg:text-xl text-text1">
                {t('purchase.orderInfo')}
              </h2>

              {boxInfo ? (
                <>
                  <div className="flex w-full gap-5 pb-5 mb-5 border-b border-border">
                    <img
                      src={
                        boxInfo.images?.[0] || 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png'
                      }
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
                        {t('purchase.weight')}: <span>{boxInfo.includes?.serving_size}</span>
                      </p>
                    </div>
                  </div>

                  <h3 className="mb-5 text-sm lg:text-base">{t('purchase.productsInBox')}</h3>
                  {boxInfo.boxProducts?.map((bp: any) => (
                    <div className="flex gap-5 mb-5" key={bp.id}>
                      <img
                        src={bp.product.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={bp.product.name}
                        className="block object-cover w-20 h-20 rounded-lg"
                      />
                      <div>
                        <p className="mb-1 text-sm lg:mb-2 text-text2">{bp.product.name}</p>
                        <p className="text-xs text-text3">
                          {t('purchase.netWeight')}: <span>{formatWeight(bp.product.weight, bp.product.unit)}</span>
                        </p>
                        <p className="text-xs text-text3">
                          {t('purchase.quantity')}: <span>{bp.quantity} {bp.unit}</span>
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Total and Button moved to form */}
                </>
              ) : (
                <p>{t('purchase.loadingBoxInfo')}</p>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* QR Code Modal Custom Design */}
      <Modal
        title={null}
        footer={null}
        open={showQrModal}
        onCancel={handleCloseQrModal}
        centered
        width={400}
        className="qr-modal-custom"
        styles={{
          content: {
            borderRadius: '20px',
            padding: '0',
            overflow: 'hidden',
          }
        }}
        closeIcon={null}
      >
        <div className="relative flex flex-col items-center justify-center p-8 bg-white">
          <button
            onClick={handleCloseQrModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-2xl font-bold text-center text-text1 mb-2">{t('purchase.qrTitle')}</h3>
          <p className="text-sm text-center text-text3 mb-6">{t('purchase.scanQr')}</p>

          <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
            {qrCodeData ? (
              <QRCodeCanvas value={qrCodeData} size={200} level="H" />
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center text-gray-400">
                Waiting...
              </div>
            )}
          </div>

          <div className="w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm text-text3">{t('purchase.timeLeft')}:</span>
              <span className={`text-xl font-bold font-mono ${qrExpireTime <= 30 ? 'text-red-500' : 'text-green-600'
                }`}>
                {formatTime(qrExpireTime)}
              </span>
            </div>
            {qrExpireTime <= 30 && (
              <p className="text-xs text-red-500 font-medium animate-pulse">
                {t('purchase.qrExpiring')}
              </p>
            )}
          </div>

          <p className="mt-6 text-xs text-center text-gray-400">
            Vui lòng không tắt trình duyệt khi đang thanh toán
          </p>
        </div>
      </Modal>

      <MainFooter />
    </Fragment>
  );
};

export default PurchasePage;
