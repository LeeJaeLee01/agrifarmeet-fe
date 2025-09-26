import React, { Fragment, useEffect, useState, useRef } from 'react';
import './Home.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import Section from '../../components/Section/Section';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import WeeklyFarm from '../../modules/Home/WeeklyFarm';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { setSelectedBoxId } from '../../store/slices/boxSlice';
import api from '../../utils/api';
import { useTitle } from '../../hooks/useTitle';
import { formatWeight } from '../../utils/helper';
import { TBox } from '../../types/TBox';

const Home: React.FC = () => {
  useTitle('Trang chủ - Agrifarmeet');

  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  // ref cho section gói phổ biến
  const popularRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get<TBox[]>('/boxes');
        setBoxes(res.data);
      } catch (err) {
        console.error('Error fetching boxes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollToPopular = () => {
    if (popularRef.current) {
      popularRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Fragment>
      {/* Banner */}
      <div className="banner relative w-full h-[350px] md:h-[650px] overflow-hidden">
        <div className="absolute inset-0 background">
          <img
            src="/banner.jpg"
            alt="Banner"
            className="object-cover object-bottom w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative z-10 grid items-center justify-center h-full grid-cols-1 lg:justify-end lg:grid-cols-2">
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-full p-5 text-center rounded-lg md:max-w-md lg:p-10 lg:text-left">
              <h1 className="text-2xl font-bold text-white lg:text-4xl">Tươi ngon từ nông trại</h1>
              <p className="text-sm text-white lg:text-base">
                Chúng tôi giao những nông sản tươi ngon nhất của mùa và các sản phẩm nông trại lành
                mạnh đến tận cửa nhà bạn. Chúng tôi giúp bạn đơn giản hóa việc tận hưởng một cuộc
                sống với thực phẩm tốt.
              </p>
              <Button
                onClick={scrollToPopular}
                type="primary"
                size="large"
                className="text-base font-semibold"
              >
                Xem các gói
              </Button>
            </div>
          </div>
          <div className="hidden lg:block"></div>
        </div>
      </div>
      {/* Gói */}
      <Section secondary>
        <div ref={popularRef} className="container mx-auto">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">
            Gói phổ biến
          </h2>
          <div className="grid grid-cols-1 mb-10 lg:gap-5 lg:mb-10 gap-y-3 lg:gap-y-10 lg:grid-cols-3">
            {boxes.map((box) => (
              <div key={box.id} className="p-4 bg-white rounded-lg shadow-md">
                <Link to={`/boxes/${box.id}`} className="block hover:text-inherit h-fit">
                  <p className="mb-3 text-lg font-semibold text-center lg:mb-5 lg:text-2xl text-text1">
                    {box.name}
                  </p>
                  <p className="h-11 line-clamp-2">{box.description}</p>
                  <ul className="mb-5">
                    <li className="flex gap-2 mb-3">
                      <CheckCircleOutlined className="text-base text-orange" />
                      <span className="truncate">
                        {box.products.map((product) => product.name).join(', ')}
                      </span>
                    </li>
                    <li className="flex gap-2 mb-3">
                      <CheckCircleOutlined className="text-base text-orange" />
                      <span>Khối lượng {formatWeight(box.totalWeight, 'kg')}</span>
                    </li>
                    <li className="flex gap-2 mb-3">
                      <CheckCircleOutlined className="text-base text-orange" />
                      <span>{box.expiredAt} tuần</span>
                    </li>
                  </ul>
                </Link>
                <Link to={`/purchase/${box.id}`}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    className="text-base font-semibold"
                    onClick={() => dispatch(setSelectedBoxId(box.id))}
                  >
                    Mua ngay
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>
      {/* How it work */}
      <Section secondary>
        <div className="container mx-auto">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">
            Hoạt động như thế nào?
          </h2>
          <div className="grid grid-cols-1 mb-10 lg:gap-5 md:grid-cols-2 lg:mb-10 gap-y-5 lg:gap-y-10 lg:grid-cols-4">
            <div className="flex flex-col items-center">
              <img src="/illustration-fc-box.png" alt="" className="w-40 mb-3 text-center" />
              <p className="w-full mb-5 text-2xl font-semibold text-text1">Lựa chọn gói</p>
              <span className="text-sm text-text2">
                Dù bạn là tín đồ trái cây, fan cứng của rau củ hay yêu thích tất cả, bạn đều có thể
                chọn (và thay đổi) kích cỡ hộp nông sản phù hợp với mình.
              </span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/illustration-fc-swap.png" alt="" className="w-40 mb-3 text-center" />
              <p className="w-full mb-5 text-2xl font-semibold text-text1">Tùy chỉnh sản phẩm</p>
              <span className="text-sm text-text2">
                Muốn thay đổi các loại nông sản trong đơn giao của bạn? Không vấn đề gì! Bạn có thể
                dễ dàng thêm hoặc thay thế sản phẩm trong Farm Stand trực tuyến của chúng tôi.
              </span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/illustration-fc-jam-eggs.png" alt="" className="w-40 mb-3 text-center" />
              <p className="w-full mb-5 text-2xl font-semibold text-text1">
                Thêm sản phẩm từ nông trại
              </p>
              <span className="text-sm text-text2">
                Thêm vào đơn giao của bạn những sản phẩm thủ công từ nông trại như mứt đặc biệt làm
                thủ công, trứng gà thả vườn, dầu ô liu, mật ong địa phương, các sản phẩm sữa và
                nhiều hơn nữa...
              </span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/illustration-fc-door.png" alt="" className="w-40 mb-3 text-center" />
              <p className="w-full mb-5 text-2xl font-semibold text-text1">
                Giao hàng và tận hưởng
              </p>
              <span className="text-sm text-text2">
                Khám phá sự tiện lợi và thú vị khi mở cửa đón nhận những hộp nông sản tươi ngon! Bạn
                có thể bỏ qua một lần giao hoặc thay đổi tần suất giao hàng để phù hợp với lịch
                trình hay kỳ nghỉ của mình.
              </span>
            </div>
          </div>
          <div className="w-full text-center">
            <Link
              to="/boxes"
              className="text-base font-semibold lg:text-lg text-orange hover:text-orange2"
            >
              Xem thêm
            </Link>
          </div>
        </div>
      </Section>
      {/* About */}
      <div className="w-full mt-10 lg:mt-24 md:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-[500px] hidden md:block">
            <img src="/about.jpg" alt="" className="object-cover w-full h-full" />
          </div>
          <div className="flex items-center justify-center w-full h-full px-5 py-10 bg-beige lg:p-20">
            <div className="text-center lg:text-left">
              <h2 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-brown">
                Hành trình nông sản sạch
              </h2>
              <p className="max-w-md text-text2">
                Chúng tôi khởi đầu từ niềm đam mê với nông sản sạch và hữu cơ, luôn tận tâm trồng
                trọt và tuyển chọn những thực phẩm tươi ngon, đồng thời thúc đẩy các thực hành nông
                nghiệp bền vững để mang đến giá trị tốt nhất cho cộng đồng.
              </p>
              <Link
                to="/about"
                className="text-base font-semibold lg:text-lg text-orange hover:text-orange2"
              >
                Xem thêm
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Blog */}
      <Section secondary>
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-text1">
              Thông tin mới và Blog
            </h2>
            <Link to="/" className="text-text3 hover:text-orange2">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-1 mb-10 lg:gap-5 md:grid-cols-2 lg:mb-10 gap-y-3 lg:gap-y-10 lg:grid-cols-4">
            <div className="rounded-lg shadow-md">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7K5A41Y2QT8db6KbhiE8xrCzSQCNk_7egIA&s"
                alt=""
                className="object-cover w-full h-40 rounded-lg"
              />
              <div className="p-3">
                <p className="text-sm font-medium lg:text-base line-clamp-2 text-text1">
                  Công thức nấu ăn cà tím ngon nhất
                </p>
                <span className="text-xs text-text2 line-clamp-3">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium similique
                  aut possimus neque nemo nobis accusamus porro dicta dolorum et. Est odit explicabo
                  doloremque quasi sed, nam corrupti delectus. Consequuntur.
                </span>
              </div>
            </div>
            <div className="rounded-lg shadow-md">
              <img
                src="https://cdn.tgdd.vn/Files/2019/11/11/1217643/trung-ga-va-mot-so-mon-an-thuoc-giup-chua-benh-hieu-qua-201911110959178469.jpg"
                alt=""
                className="object-cover w-full h-40 rounded-lg"
              />
              <div className="p-3">
                <p className="text-sm font-medium lg:text-base line-clamp-2 text-text1">
                  Trứng gà rất tốt cho sức khỏe
                </p>
                <span className="text-xs text-text2 line-clamp-3">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium similique
                  aut possimus neque nemo nobis accusamus porro dicta dolorum et. Est odit explicabo
                  doloremque quasi sed, nam corrupti delectus. Consequuntur.
                </span>
              </div>
            </div>
            <div className="rounded-lg shadow-md">
              <img
                src="https://assets.unileversolutions.com/v1/60221576.png"
                alt=""
                className="object-cover w-full h-40 rounded-lg"
              />
              <div className="p-3">
                <p className="text-sm font-medium lg:text-base line-clamp-2 text-text1">
                  Danh sách thực phẩm sắp tới
                </p>
                <span className="text-xs text-text2 line-clamp-3">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium similique
                  aut possimus neque nemo nobis accusamus porro dicta dolorum et. Est odit explicabo
                  doloremque quasi sed, nam corrupti delectus. Consequuntur.
                </span>
              </div>
            </div>
            <div className="rounded-lg shadow-md">
              <img
                src="https://kimnonggoldstar.vn/wp-content/uploads/2023/03/so-luoc-ve-cay-du-du-kimnonggoldtar-vn-5.jpg"
                alt=""
                className="object-cover w-full h-40 rounded-lg"
              />
              <div className="p-3">
                <p className="text-sm font-medium lg:text-base line-clamp-2 text-text1">
                  Đu đủ Thái giá rẻ
                </p>
                <span className="text-xs text-text2 line-clamp-3">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium similique
                  aut possimus neque nemo nobis accusamus porro dicta dolorum et. Est odit explicabo
                  doloremque quasi sed, nam corrupti delectus. Consequuntur.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <WeeklyFarm />
    </Fragment>
  );
};

export default Home;
