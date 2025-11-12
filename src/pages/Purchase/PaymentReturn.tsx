import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleReturn = async () => {
      try {
        // gọi BE để verify chữ ký
        const res = await api.get(`/payment/return?${searchParams.toString()}`);

        if (res.data.success) {
          // ✅ Thanh toán thành công → gọi tiếp /boxes/purchase
          const boxId = localStorage.getItem('lastBoxId');
          if (boxId) {
            const payload = {
              boxId,
              // timeActive: new Date().toISOString(),
              // timeEnd: new Date(Date.now() + 10 * 7 * 24 * 60 * 60 * 1000).toISOString(),
            };
            await api.post('/boxes/purchase', payload, { withAuth: true });
          }

          toast.success('Thanh toán thành công 🎉');
          navigate('/farm-stand');
        } else {
          toast.error('Thanh toán thất bại ❌');
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        toast.error('Có lỗi khi xác thực thanh toán');
        navigate('/');
      }
    };

    handleReturn();
  }, [searchParams, navigate]);

  return <p>Đang xác thực thanh toán...</p>;
};

export default PaymentReturn;
