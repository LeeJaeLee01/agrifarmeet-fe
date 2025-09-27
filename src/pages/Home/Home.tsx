import React, { Fragment, useEffect, useState, useRef } from 'react';
import './Home.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import Section from '../../components/Section/Section';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import WeeklyFarm from '../../modules/Home/WeeklyFarm';
import { useDispatch } from 'react-redux';
import { setSelectedBoxId } from '../../store/slices/boxSlice';
import api from '../../utils/api';
import { useTitle } from '../../hooks/useTitle';
import { formatVND, formatWeight } from '../../utils/helper';
import { TBox } from '../../types/TBox';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';

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
      <MainHeader />
      {/* Banner */}
      <div className="relative w-full h-screen max-h-[850px] overflow-hidden banner">
        <div className="absolute inset-0 background">
          <img
            src="/banner.jpg"
            alt=""
            className="object-cover object-right w-full h-full lg:object-bottom"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative z-10 grid items-center justify-center h-full grid-cols-1 content lg:justify-end lg:grid-cols-2">
          <div className="flex items-center w-full h-full">
            <div className="w-full">
              <h1 className="text-5xl font-semibold tracking-tight text-white text-pretty sm:text-7xl">
                Tươi ngon từ nông trại
              </h1>
              <p className="mt-2 text-base text-white mb-9 md:text-lg/8">
                Chúng tôi giao những nông sản tươi ngon nhất của mùa và các sản phẩm nông trại lành
                mạnh đến tận cửa nhà bạn. Chúng tôi giúp bạn đơn giản hóa việc tận hưởng một cuộc
                sống với thực phẩm tốt.
              </p>
              <button
                onClick={scrollToPopular}
                className="px-8 py-3 text-base font-semibold text-white rounded-full lg:text-xl btn bg-orange2"
              >
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How it work */}
      <Section>
        <h2 className="max-w-4xl mx-auto mt-2 mb-0 text-4xl font-semibold tracking-tight text-center text-balance sm:text-5xl">
          <span className="text-green">Agri</span>
          <span className="text-brown">farmeet</span> hoạt động như thế nào?
        </h2>
        <div className="grid items-center max-w-4xl grid-cols-1 gap-5 mx-auto mt-16 gap-y-6 sm:mt-20 lg:grid-cols-2">
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
              Muốn thay đổi các loại nông sản trong đơn giao của bạn? Không vấn đề gì! Bạn có thể dễ
              dàng thêm hoặc thay thế sản phẩm trong Farm Stand trực tuyến của chúng tôi.
            </span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/illustration-fc-jam-eggs.png" alt="" className="w-40 mb-3 text-center" />
            <p className="w-full mb-5 text-2xl font-semibold text-text1">
              Thêm sản phẩm từ nông trại
            </p>
            <span className="text-sm text-text2">
              Thêm vào đơn giao của bạn những sản phẩm thủ công từ nông trại như mứt đặc biệt làm
              thủ công, trứng gà thả vườn, dầu ô liu, mật ong địa phương, các sản phẩm sữa và nhiều
              hơn nữa...
            </span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/illustration-fc-door.png" alt="" className="w-40 mb-3 text-center" />
            <p className="w-full mb-5 text-2xl font-semibold text-text1">Giao hàng và tận hưởng</p>
            <span className="text-sm text-text2">
              Khám phá sự tiện lợi và thú vị khi mở cửa đón nhận những hộp nông sản tươi ngon! Bạn
              có thể bỏ qua một lần giao hoặc thay đổi tần suất giao hàng để phù hợp với lịch trình
              hay kỳ nghỉ của mình.
            </span>
          </div>
        </div>
      </Section>

      <Section ref={popularRef}>
        <h2 className="max-w-4xl mx-auto mt-2 mb-0 text-4xl font-semibold tracking-tight text-center text-balance sm:text-5xl">
          Lựa chọn gói dành riêng cho bạn
        </h2>
        <p className="max-w-2xl mx-auto mt-6 mb-0 text-base font-medium text-center text-text3 text-pretty sm:text-lg/8">
          Lựa chọn gói dịch vụ hợp lý, được trang bị những sản phẩm tươi ngon nhất từ nông trại.
        </p>
        <div className="grid items-center grid-cols-1 gap-5 mx-auto mt-16 gap-y-6 sm:mt-20 lg:grid-cols-3">
          {boxes.slice(0, 3).map((box) => (
            <div
              key={box.id}
              className="flex flex-col justify-between h-full p-8 bg-white border sm:p-10 rounded-3xl border-gray-border"
            >
              <Link to={`/boxes/${box.id}`} className="hover:text-inherit">
                <div className="flex items-start justify-between">
                  <p className="m-0 font-semibold text-base/7 text-orange">{box.name}</p>
                  {box.isTrial && (
                    <p className="px-2 py-1 m-0 text-xs font-semibold rounded-full text-green2 bg-secondary-green">
                      Dùng thử
                    </p>
                  )}
                </div>
                <p className="m-0 mt-4 text-sm/6 text-text2">{box.description}</p>
                <p className="flex items-baseline m-0 mt-6 gap-x-2">
                  <span className="text-4xl font-semibold tracking-tight">
                    {formatVND(box.price)}
                  </span>
                  <span className="text-sm">/{box.expiredAt} tuần</span>
                </p>

                <ul role="list" className="m-0 mt-8 space-y-3 text-sm/6">
                  <li className="flex gap-x-3">
                    <CheckCircleOutlined
                      aria-hidden="true"
                      className="flex-none w-5 h-6 text-orange"
                    />
                    Khối lượng {formatWeight(box.totalWeight, 'kg')}
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircleOutlined
                      aria-hidden="true"
                      className="flex-none w-5 h-6 text-orange"
                    />
                    Bao gồm {box.products.length} sản phẩm
                  </li>
                  {!box.isTrial && (
                    <li className="flex gap-x-3">
                      <CheckCircleOutlined
                        aria-hidden="true"
                        className="flex-none w-5 h-6 text-orange"
                      />
                      Tùy chỉnh sản phẩm trong gói
                    </li>
                  )}
                </ul>
              </Link>

              <Link to={`/purchase/${box.id}`}>
                {box.isTrial ? (
                  <button
                    className="w-full bg-white text-green2 border border-green3 mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
                    onClick={() => dispatch(setSelectedBoxId(box.id))}
                  >
                    Mua ngay
                  </button>
                ) : (
                  <button
                    className="w-full bg-green2 text-white mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
                    onClick={() => dispatch(setSelectedBoxId(box.id))}
                  >
                    Mua ngay
                  </button>
                )}
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* About */}
      <div className="w-full pt-24 bg-white sm:pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-[650px] hidden md:block">
            <img src="/about.jpg" alt="" className="object-cover w-full h-full" />
          </div>
          <div className="flex items-center justify-center w-full h-full px-5 py-10 bg-beige lg:p-20">
            <div className="text-center">
              <h2 className="max-w-4xl mx-auto mt-2 mb-0 text-4xl font-semibold tracking-tight text-center text-balance sm:text-5xl text-brown">
                Hành trình nông sản sạch
              </h2>
              <p className="mt-6 text-base mb-9 md:text-lg/8 text-text2">
                Chúng tôi khởi đầu từ niềm đam mê với nông sản sạch và hữu cơ, luôn tận tâm trồng
                trọt và tuyển chọn những thực phẩm tươi ngon, đồng thời thúc đẩy các thực hành nông
                nghiệp bền vững để mang đến giá trị tốt nhất cho cộng đồng.
              </p>
              <Link
                to="/about"
                className="px-8 py-3 text-base font-semibold text-white rounded-full lg:text-xl btn bg-orange2 hover:text-white"
              >
                Xem thêm
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Blog */}
      <Section spaceBottom>
        <h2 className="max-w-4xl mx-auto mt-2 mb-0 text-4xl font-semibold tracking-tight text-center text-balance sm:text-5xl">
          Thông tin mới và blog
        </h2>
        <p className="max-w-2xl mx-auto mt-6 mb-0 text-base font-medium text-center text-text3 text-pretty sm:text-lg/8">
          Learn how to grow your business with our expert advice.
        </p>
        <div className="grid items-stretch grid-cols-1 gap-5 mx-auto mt-16 gap-y-8 sm:mt-20 lg:grid-cols-3">
          {[
            {
              img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7K5A41Y2QT8db6KbhiE8xrCzSQCNk_7egIA&s',
              title: 'Công thức nấu ăn cà tím ngon nhất',
              time: '27/09/2025',
            },
            {
              img: 'https://cdn.tgdd.vn/Files/2019/11/11/1217643/trung-ga-va-mot-so-mon-an-thuoc-giup-chua-benh-hieu-qua-201911110959178469.jpg',
              title: 'Trứng gà rất tốt cho sức khỏe',
              time: '27/09/2025',
            },
            {
              img: 'https://assets.unileversolutions.com/v1/60221576.png',
              title: 'Danh sách thực phẩm sắp tới',
              time: '27/09/2025',
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg">
              <div className="w-full aspect-[3/2]">
                <img src={item.img} alt="" className="object-cover w-full h-full rounded-lg" />
              </div>
              <div className="flex-1 mt-8">
                <span className="text-xs text-text3">{item.time}</span>
                <p className="mt-3 text-base font-semibold lg:text-lg line-clamp-2 text-text1">
                  {item.title}
                </p>
                <span className="text-sm/6 text-text2 line-clamp-3">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium similique
                  aut possimus neque nemo nobis accusamus porro dicta dolorum et. Est odit explicabo
                  doloremque quasi sed, nam corrupti delectus. Consequuntur.
                </span>
                <div className="flex gap-4 mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="">
                    <p className="m-0 font-semibold">Michael Foster</p>
                    <p className="m-0 text-sm text-text3">Co-Founder / CTO</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <MainFooter />
    </Fragment>
  );
};

export default Home;
