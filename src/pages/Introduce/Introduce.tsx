import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { useTitle } from '../../hooks/useTitle';
import { useTranslation } from 'react-i18next';
import './Introduce.scss';

const Introduce: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('common.introduce'));

  const isVisible = true;

  return (
    <Fragment>
      <MainHeader sticky />

      <div className="introduce-page">
        <section className="user-problem-section">
          <div className="container">
            <h3
              className={`section-label ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              Vấn đề người dùng gặp phải
            </h3>
            <h2
              className={`section-title ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isVisible ? '0.15s' : undefined }}
            >
              Người thành phố đang khó tin vào rau sạch
            </h2>
            <p
              className={`section-description ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isVisible ? '0.3s' : undefined }}
            >
              Ngày này người dùng ngày càng lo lắng về thực phẩm:
            </p>
            <ul
              className={`section-problem-list ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isVisible ? '0.25s' : undefined }}
            >
              <li>👉 Rau không rõ nguồn gốc</li>
              <li>👉 Quá nhiều trung gian</li>
            </ul>
            <p
              className={`section-description section-description-conclusion ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: isVisible ? '0.4s' : undefined }}
            >
              Trong khi đó nhiều nông dân vẫn trồng rau rất cẩn thận nhưng sản phẩm lại không đến được
              trực tiếp người tiêu dùng.
            </p>

            <div className="user-origin-block">
              <h3
                className={`section-label ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isVisible ? '0.5s' : undefined }}
              >
                FARME RA ĐỜI
              </h3>

              <h2
                className={`section-title ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isVisible ? '0.6s' : undefined }}
              >
                Farme Kết Nối Nông Dân Và Gia Đình Thành Phố
              </h2>

              <p
                className={`section-description ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isVisible ? '0.7s' : undefined }}
              >
                Farme xây dựng mô hình giao rau định kỳ từ nông trại để mang rau tươi minh bạch đến bàn
                ăn gia đình.
              </p>

              <p
                className={`section-description section-description-conclusion ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: isVisible ? '0.8s' : undefined }}
              >
                Rau được:
              </p>

              <ul
                className={`section-problem-list ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isVisible ? '0.9s' : undefined }}
              >
                <li>👉 Thu hoạch trực tiếp tại trang trại</li>
                <li>👉 Đóng gói trong ngày</li>
                <li>👉 Giao tận nhà mỗi tuần</li>
                <li>👉 Không qua nhiều trung gian</li>
              </ul>
            </div>

            <div className="user-core-values-block">
              <h3
                className={`section-label ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isVisible ? '1.0s' : undefined }}
              >
                GIÁ TRỊ CỐT LÕI
              </h3>

              <h2
                className={`section-title ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isVisible ? '1.1s' : undefined }}
              >
                Giá Trị Của Farme
              </h2>

              <p
                className={`section-description ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isVisible ? '1.2s' : undefined }}
              >
                3 giá trị cốt lõi Farme mang đến cho khách hàng và nông dân:
              </p>

              <div className="core-values-grid">
                {[
                  {
                    title: 'Minh Bạch',
                    description:
                      'Khách hàng biết rau đến từ trang trại nào và ai là người trồng.',
                  },
                  {
                    title: 'An Toàn',
                    description:
                      'Rau được canh tác theo quy trình kiểm soát tại các hợp tác xã uy tín.',
                  },
                  {
                    title: 'Bền Vững',
                    description:
                      'Farme giúp nông dân bán sản phẩm ổn định và phát triển nông nghiệp bền vững.',
                  },
                ].map((value, index) => (
                  <div
                    key={value.title}
                    className={`core-value-card ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{
                      animationDelay: isVisible ? `${1.3 + index * 0.1}s` : undefined,
                    }}
                  >
                    <h4>{value.title}</h4>
                    <p>{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="user-how-it-works-block">
              <h3
                className={`section-label ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isVisible ? '1.5s' : undefined }}
              >
                FARME HOẠT ĐỘNG THẾ NÀO
              </h3>

              <h2
                className={`section-title ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isVisible ? '1.6s' : undefined }}
              >
                Cách Farme Hoạt Động
              </h2>

              <div className="how-it-works-steps">
                {[
                  {
                    step: 'Bước 1',
                    description: 'Chọn gói rau phù hợp với nhu cầu gia đình.',
                  },
                  {
                    step: 'Bước 2',
                    description: 'Rau được thu hoạch tại trang trại và đóng gói trong ngày.',
                  },
                  {
                    step: 'Bước 3',
                    description: 'Farme giao hộp rau tươi đến tận nhà mỗi tuần.',
                  },
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className={`how-step ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{
                      animationDelay: isVisible ? `${1.7 + index * 0.1}s` : undefined,
                    }}
                  >
                    <p className="how-step-label">{item.step}</p>
                    <p className="how-step-description">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="commitments-section">
          <div className="container">
            <h3 className={`section-label ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              CAM KẾT CỦA FARME
            </h3>
            <h2
              className={`section-title ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isVisible ? '0.15s' : undefined }}
            >
              Farme cam kết:
            </h2>
            <ul
              className={`commitments-list ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isVisible ? '0.25s' : undefined }}
            >
              <li>👉 Minh bạch nguồn gốc</li>
              <li>👉 Rau thu hoạch trong ngày</li>
              <li>👉 Không tồn kho lâu</li>
              <li>👉 Giao hàng nhanh trong ngày</li>
            </ul>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <h3 className={`section-label ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>FAQ</h3>

            <div className="faq-list">
              {[
                {
                  q: 'Rau có phải VietGAP không?',
                  a: 'Rau được trồng tại các hợp tác xã tuân theo quy trình canh tác kiểm soát.',
                },
                {
                  q: 'Có thể tạm dừng giao hàng không?',
                  a: 'Bạn có thể tạm dừng hoặc huỷ gói bất kỳ lúc nào.',
                },
                {
                  q: 'Nếu rau không tươi thì sao?',
                  a: 'Farme luôn sẵn sàng hỗ trợ đổi sản phẩm.',
                },
              ].map((item, index) => (
                <div
                  key={item.q}
                  className={`faq-item ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: isVisible ? `${0.15 + index * 0.1}s` : undefined }}
                >
                  <h4 className="faq-question">{item.q}</h4>
                  <p className="faq-answer">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta-section">
          <div className="container">
            <h2
              className={`section-title ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isVisible ? '0.15s' : undefined }}
            >
              Bắt Đầu Trải Nghiệm Farme Ngay Hôm Nay
            </h2>
            <p
              className={`final-cta-text ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isVisible ? '0.3s' : undefined }}
            >
              Chọn gói rau phù hợp cho gia đình bạn và để Farme chăm sóc bữa ăn xanh mỗi tuần.
            </p>
            <div
              className={`final-cta-actions ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isVisible ? '0.45s' : undefined }}
            >
              <Link to={{ pathname: '/', hash: '#landing-packages' }} className="final-cta-button">
                Chọn Gói Rau Phù Hợp
              </Link>
            </div>
          </div>
        </section>
      </div>

      <MainFooter />
    </Fragment>
  );
};

export default Introduce;
