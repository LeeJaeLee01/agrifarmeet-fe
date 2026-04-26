import React, { useEffect } from 'react';
import { Row, Col, Card, Typography, Space } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, FacebookOutlined, SendOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './Contact.scss';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';

const { Title, Paragraph, Text } = Typography;

const Contact: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-page">
      <MainHeader sticky />
      
      <section className="contact-hero">
        <div className="hero-content">
          <Title level={1} className="hero-title">{t('common.contact')}</Title>
          <Paragraph className="hero-subtitle">
            {t('contact.heroSubtitle')}
          </Paragraph>
        </div>
      </section>

      <section className="contact-container">
        <Row gutter={[40, 40]}>
          <Col xs={24} lg={10}>
            <div className="contact-info">
              <Title level={2} className="info-title">{t('contact.titleInfo')}</Title>
              <Paragraph className="info-desc">
                {t('contact.infoDesc')}
              </Paragraph>

              <Space direction="vertical" size="large" className="info-list">
                <div className="info-item">
                  <div className="info-icon">
                    <EnvironmentOutlined />
                  </div>
                  <div className="info-text">
                    <Text strong className="block">{t('common.address')}</Text>
                    <Text>20 Võ Chí Công, phường Tây Hồ, Hà Nội</Text>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <PhoneOutlined />
                  </div>
                  <div className="info-text">
                    <Text strong className="block">{t('common.phone')}</Text>
                    <a href="tel:0981817189">0981817189</a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <MailOutlined />
                  </div>
                  <div className="info-text">
                    <Text strong className="block">{t('common.email')}</Text>
                    <a href="mailto:contact@agrifarmeet.vn">contact@agrifarmeet.vn</a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FacebookOutlined />
                  </div>
                  <div className="info-text">
                    <Text strong className="block">Facebook</Text>
                    <a href="https://www.facebook.com/profile.php?id=61582201066240" target="_blank" rel="noreferrer">
                      Farme - Nông sản sạch
                    </a>
                  </div>
                </div>
              </Space>
            </div>
          </Col>

          <Col xs={24} lg={14}>
            <Card className="contact-card shadow-premium border-none">
              <div className="social-connect-section">
                <div className="connect-group mb-10">
                  <Title level={4} className="connect-title">Kết nối với chúng tôi</Title>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <a href="https://zalo.me/2768914139305378370" target="_blank" rel="noreferrer" className="social-btn zalo-btn">
                      <SendOutlined className="mr-2" />
                      Nhắn tin qua Zalo
                    </a>
                    <a href="https://m.me/1023499277515849" target="_blank" rel="noreferrer" className="social-btn messenger-btn">
                      <MailOutlined className="mr-2" />
                      Nhắn tin qua Messenger
                    </a>
                  </div>
                </div>

                <div className="connect-group mb-12">
                  <Title level={4} className="connect-title">Theo dõi chúng tôi</Title>
                  <div className="mt-4">
                    <a href="https://www.facebook.com/profile.php?id=61582201066240" target="_blank" rel="noreferrer" className="social-btn facebook-btn">
                      <FacebookOutlined className="mr-2" />
                      Fanpage Facebook
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-map">
                <div className="map-address py-4 px-5 bg-gray-50 border-b border-gray-100">
                  <EnvironmentOutlined className="mr-2 text-green2" />
                  <span className="font-medium text-gray-700">20 Võ Chí Công, phường Tây Hồ, Hà Nội</span>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.633800683416!2d105.8041443!3d21.0473335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab196749893d%3A0xe54e608053a8174e!2zMjAgVsO1IENow60gQ8O0bmcsIFh1w6JuIExhLCBUw6J5IEjhu5ksIEjDoCBO4buZaSwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1714120000000!5m2!1sen!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Farme Map"
                ></iframe>
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      <MainFooter />
    </div>
  );
};

export default Contact;
