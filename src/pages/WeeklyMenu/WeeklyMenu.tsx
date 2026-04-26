import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tag, Skeleton, Empty, Button } from 'antd';
import { ArrowLeftOutlined, FireOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import './WeeklyMenu.scss';

const { Title, Paragraph, Text } = Typography;

// Fake dishes mapped to common vegetable types or just random
const FAKE_DISHES: any = {
  'Leafy': {
    name: 'Nộm rau tươi sốt lạc',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop',
    description: 'Rau tươi xanh kết hợp cùng lạc rang giòn và sốt chua ngọt đậm đà, thanh mát cho ngày hè.'
  },
  'Root': {
    name: 'Canh củ quả hầm xương',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop',
    description: 'Vị ngọt thanh từ củ quả tươi kết hợp cùng xương hầm kỹ, mang lại bát canh bổ dưỡng.'
  },
  'Fruit': {
    name: 'Salad hoa quả nhiệt đới',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2032&auto=format&fit=crop',
    description: 'Tổng hợp các loại quả theo mùa, vị ngọt tự nhiên giúp bổ sung vitamin cho cả gia đình.'
  },
  'Default': {
    name: 'Món ngon mỗi ngày',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    description: 'Công thức nấu ăn đơn giản nhưng tinh tế, giúp giữ trọn vẹn hương vị tự nhiên của nguyên liệu.'
  }
};

const WeeklyMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchWeeklyMenu();
  }, []);

  const fetchWeeklyMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get('/foods/weekly');
      const data = res.data?.data ?? res.data;
      setFoods(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching weekly menu:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weekly-menu-page">
      <MainHeader sticky />
      
      <div className="menu-hero">
        <div className="container">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)} 
            className="back-btn" 
            ghost
          >
            Quay lại
          </Button>
          <div className="hero-text">
            <Title level={1} className="hero-title">{t('landing.weeklyMenuTitle')}</Title>
            <Paragraph className="hero-subtitle">
              Khám phá các món ăn gợi ý từ nông sản tươi ngon tuần này
            </Paragraph>
          </div>
        </div>
      </div>

      <div className="container menu-container">
        {loading ? (
          <Row gutter={[24, 24]}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Col xs={24} sm={12} lg={8} key={i}>
                <Card cover={<Skeleton.Image className="w-full h-48" />} loading />
              </Col>
            ))}
          </Row>
        ) : foods.length > 0 ? (
          <Row gutter={[32, 32]}>
            {foods.map((food: any) => {
              const p = food.product;
              const productImg = p && (Array.isArray(p.images) ? p.images[0] : p.images);
              
              return (
                <Col xs={24} md={12} lg={8} key={food.id}>
                  <Card 
                    className="menu-card" 
                    hoverable
                    cover={
                      <div className="card-media">
                        <img src={food.imageUrl} alt={food.name} className="dish-image" />
                        {p && (
                          <div className="product-badge">
                            <img src={productImg} alt={p.name} className="product-thumb" />
                            <span>{p.name}</span>
                          </div>
                        )}
                      </div>
                    }
                  >
                    <div className="dish-content">
                      <Tag color="green" icon={<FireOutlined />} className="mb-3">Món ngon gợi ý</Tag>
                      <Title level={4} className="dish-name">{food.name}</Title>
                      <Paragraph className="dish-desc" ellipsis={{ rows: 3 }}>
                        {food.description}
                      </Paragraph>
                      {p && (
                        <div className="product-footer">
                          <Text type="secondary">Nguyên liệu chính:</Text>
                          <Text strong className="ml-2 text-green-600">{p.name}</Text>
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div className="py-20 text-center">
            <Empty description="Chưa có thực đơn cho tuần này" />
            <Button type="primary" className="mt-4" onClick={() => navigate('/')}>Trở về trang chủ</Button>
          </div>
        )}
      </div>

      <MainFooter />
    </div>
  );
};

export default WeeklyMenu;
