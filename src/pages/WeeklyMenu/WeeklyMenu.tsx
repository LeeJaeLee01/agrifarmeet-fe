import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tag, Skeleton, Empty, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import './WeeklyMenu.scss';

const { Title, Paragraph, Text } = Typography;

type MenuFood = {
  id: string;
  name: string;
  imageUrl?: string;
};

type WeeklyMenuCard = {
  menuName: string;
  foods: MenuFood[];
  ingredients: string[];
};

const WeeklyMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState<WeeklyMenuCard[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchWeeklyMenu();
  }, []);

  const fetchWeeklyMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/foods/menus', { withAuth: true });
      const data = res.data?.data ?? res.data;
      setMenus(Array.isArray(data) ? data : []);
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
              Chọn thực đơn phù hợp, xem danh sách món ăn và đặt rau ngay tại đây
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
        ) : menus.length > 0 ? (
          <Row gutter={[32, 32]}>
            {menus.map((menu) => {
              const coverImage = menu.foods?.find((f) => !!f.imageUrl)?.imageUrl;
              return (
                <Col xs={24} md={12} lg={8} key={menu.menuName}>
                  <Card 
                    className="menu-card" 
                    hoverable
                    cover={
                      <div className="card-media">
                        <img
                          src={coverImage || 'https://via.placeholder.com/800x600?text=Thuc+don'}
                          alt={menu.menuName}
                          className="dish-image"
                        />
                      </div>
                    }
                  >
                    <div className="dish-content">
                      <Title level={4} className="dish-name">{menu.menuName}</Title>

                      <div className="menu-section">
                        <Text strong className="menu-section-title">Món ăn</Text>
                        <div className="menu-tags">
                          {(menu.foods ?? []).length > 0 ? (
                            menu.foods.map((food) => (
                              <Tag key={food.id} className="menu-tag">{food.name}</Tag>
                            ))
                          ) : (
                            <Text type="secondary">Chưa có món ăn</Text>
                          )}
                        </div>
                      </div>

                      <div className="menu-section">
                        <Text strong className="menu-section-title">Nguyên liệu</Text>
                        <div className="menu-tags">
                          {(menu.ingredients ?? []).length > 0 ? (
                            menu.ingredients.map((ing) => (
                              <Tag key={ing} color="green" className="menu-tag">{ing}</Tag>
                            ))
                          ) : (
                            <Text type="secondary">Chưa có nguyên liệu</Text>
                          )}
                        </div>
                      </div>

                      <Button
                        type="primary"
                        className="order-now-btn"
                        onClick={() => navigate('/purchase/goi-co-ban')}
                      >
                        Đặt rau ngay tại đây
                      </Button>
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
