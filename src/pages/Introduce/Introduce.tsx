import React, { Fragment, useEffect } from 'react';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { useTitle } from '../../hooks/useTitle';
import { useLocation } from 'react-router-dom';
import './Introduce.scss';

const Introduce: React.FC = () => {
  useTitle('Giới thiệu về Farme');
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <Fragment>
      <MainHeader sticky />

      <div className="bg-bg-secondary text-text1 font-sans leading-relaxed">
        {/* HERO SECTION — ảnh trái, nội dung phải */}
        <section className="relative pt-6 pb-16 px-6 lg:pt-6 lg:pb-20 lg:px-20 bg-white overflow-hidden border-b border-[#32753A]/25">
          <div className="absolute inset-0 bg-[#32753A]/10 z-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto max-w-6xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#32753A] mb-2 tracking-tight text-center">
              Giới thiệu về Farme
            </h1>
            <p className="text-center text-sm md:text-base text-[#32753A]/90 mb-8 lg:mb-10">
              Câu chuyện phía sau mỗi hộp rau tươi ngon
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start lg:items-stretch">
              <div className="order-2 lg:order-1 w-full lg:col-span-1 lg:h-full">
                <div className="rounded-2xl overflow-hidden shadow-md border border-[#32753A]/25 bg-[#32753A]/10 aspect-[4/3] lg:aspect-auto lg:h-full">
                  <img
                    src="/DSC06501.jpg"
                    alt="Farme — nông sản tươi ngon"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-5 text-justify lg:col-span-2 lg:h-full">
                <p className="text-lg text-text2 leading-relaxed">
                🌿Farme được hình thành từ một mong muốn rất giản dị: giúp các gia đình thành phố tiếp cận nguồn rau tươi ngon, an toàn và minh bạch hơn mỗi ngày.
                </p>
                <p className="text-lg text-text2 leading-relaxed">
                Trong nhịp sống bận rộn, nhiều người phải đi sớm về muộn, quỹ thời gian dành cho việc đi chợ hay lựa chọn thực phẩm cho bữa ăn gia đình ngày càng ít đi. Việc tìm kiếm một nguồn rau vừa tươi ngon, vừa rõ ràng về nguồn gốc vì thế cũng trở nên khó khăn hơn.
                </p>
                <p className="text-lg text-text2 leading-relaxed">
                Farme ra đời để thu hẹp khoảng cách đó – kết nối trực tiếp với hợp tác xã uy tín, nông trại với căn bếp của mỗi gia đình. Giải pháp của Farme là thông qua những hộp rau tươi theo tuần, được lựa chọn theo mùa và giao tận nhà, Farme giúp việc chuẩn bị bữa ăn của mọi gia đình trở nên đơn giản và nhẹ nhàng hơn.
                </p>
                <p className="text-lg font-medium text-[#32753A] leading-relaxed border-l-4 border-[#32753A] pl-5">
                Tại Farme, chúng tôi tin rằng thực phẩm tốt không chỉ tươi ngon mà còn cần minh bạch về nguồn gốc để mỗi bữa ăn của gia đình đều đi kèm sự an tâm và tin tưởng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CÂU CHUYỆN & SỨ MỆNH */}
        <section className="py-20 px-6 lg:px-20">
          <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            <div id="cau-chuyen" className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <h2 className="text-3xl font-bold text-[#32753A] mb-6 relative pb-4">
                Câu chuyện của Farme
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#32753A] rounded-full"></span>
              </h2>
              <div className="space-y-4">
                <p className="text-text2 text-justify leading-relaxed">
                Ở nhiều vùng nông nghiệp, người nông dân vẫn ngày ngày chăm sóc những luống rau bằng sự tận tâm và kinh nghiệm lâu năm. Tuy nhiên, để những nông sản đó đến được bàn ăn của người tiêu dùng, chúng thường phải đi qua nhiều khâu trung gian, khiến người mua khó biết rõ nguồn gốc thực phẩm.
                </p>
                <p className="text-text2 text-justify leading-relaxed">
                Farme bắt đầu từ một ý tưởng đơn giản: rút ngắn khoảng cách giữa nông trại và căn bếp của mỗi gia đình.
                </p>
                <p className="text-text2 text-justify leading-relaxed">
                Chúng tôi kết nối trực tiếp với các nông trại và hợp tác xã đủ tiêu chuẩn, lựa chọn rau theo mùa và giao tận nhà mỗi tuần. Nhờ đó, các gia đình thành phố có thể dễ dàng tiếp cận nguồn rau tươi minh bạch về nguồn gốc, đồng thời tiết kiệm thời gian đi chợ và chuẩn bị bữa ăn mỗi ngày.
                </p>
                <p className="text-text2 text-justify leading-relaxed">
                Farme tin rằng khi hành trình của thực phẩm trở nên rõ ràng hơn, mỗi bữa ăn của gia đình cũng sẽ trở nên an tâm và thuận tiện hơn.
                </p>
              </div>
            </div>
            
            <div id="su-menh" className="flex flex-col bg-[#32753A] text-white p-8 md:p-12 rounded-3xl shadow-lg border border-[#1a4226]">
              <h2 className="text-3xl font-bold text-white mb-6 relative pb-4">
                Sứ mệnh của Farme
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-white/35 rounded-full"></span>
              </h2>
              <div className="space-y-5">
                <p className="text-[#e9f5ef] leading-relaxed text-justify">
                  Farme được xây dựng với sứ mệnh kết nối trực tiếp các Hợp tác xã đủ tiêu chuẩn với các hộ gia đình, giúp mọi người dễ dàng tiếp cận nguồn nông sản tươi, an toàn và minh bạch.
                </p>
                <p className="text-[#e9f5ef] leading-relaxed text-justify">
                  Chúng tôi mong muốn mỗi bữa cơm gia đình không chỉ ngon hơn mà còn mang lại sự yên tâm về chất lượng thực phẩm. Khi người tiêu dùng hiểu rõ thực phẩm mình đang sử dụng, việc lựa chọn ăn uống cũng trở nên chủ động và ý nghĩa hơn.
                </p>
                <p className="text-[#e9f5ef] leading-relaxed text-justify">
                  Bên cạnh đó, Farme cũng mong muốn góp phần tạo ra một hệ sinh thái tiêu dùng nông sản minh bạch hơn, nơi những người nông dân làm nông nghiệp tử tế có cơ hội đưa sản phẩm của mình đến đúng với những người thực sự trân trọng giá trị của chúng.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* GIÁ TRỊ CỐT LÕI */}
        <section id="gia-tri" className="py-20 px-6 lg:px-20 bg-[#32753A]/10">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-[#32753A] mb-6">Giá trị Farme theo đuổi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#E3F2FD] text-[#1E88E5] rounded-full flex items-center justify-center mb-6 text-2xl shadow-inner">🔍</div>
                <h3 className="text-xl font-bold text-text1 mb-4">Minh Bạch</h3>
                <p className="text-text2 text-base leading-relaxed">
                Khách hàng có thể biết rõ rau được trồng ở đâu, ai là người trồng và hành trình của thực phẩm trước khi đến bàn ăn.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#32753A]/15 text-[#32753A] rounded-full flex items-center justify-center mb-6 text-2xl shadow-inner">🛡️</div>
                <h3 className="text-xl font-bold text-text1 mb-4">An Toàn</h3>
                <p className="text-text2 text-base leading-relaxed">
                Farme hợp tác với các nông trại và hợp tác xã có quy trình canh tác được kiểm soát, nhằm đảm bảo chất lượng rau mỗi ngày.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FFF9C4] text-[#FBC02D] rounded-full flex items-center justify-center mb-6 text-2xl shadow-inner">🌱</div>
                <h3 className="text-xl font-bold text-text1 mb-4">Bền Vững</h3>
                <p className="text-text2 text-base leading-relaxed">
                : Farme kết nối trực tiếp nông dân và gia đình thành phố, góp phần hỗ trợ nông nghiệp sạch phát triển lâu dài.
                </p>
              </div>
            </div>
          </div>
        </section>

          {/* CAM KẾT TỪ FARME — 2/3 nội dung, 1/3 ảnh */}
        <section id="cam-ket" className="py-24 px-6 lg:px-20 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-2 flex flex-col">
                <h2 className="text-3xl font-extrabold text-text1 mb-8 tracking-tight text-center lg:text-left">
                  Cam kết từ Farme
                </h2>
                <div className="space-y-6 flex-1">
                  <p className="text-text2 text-lg leading-relaxed text-justify">
                    Mỗi sản phẩm Farme mang đến đều đi kèm với sự minh bạch và trách nhiệm. Chúng tôi luôn nỗ lực để đảm bảo rằng thực phẩm đến tay khách hàng không chỉ tươi ngon mà còn rõ ràng về nguồn gốc.
                  </p>
                  <p className="text-text2 text-lg leading-relaxed text-justify">
                    Rau được thu hoạch trực tiếp tại nông trại, đóng gói trong ngày và hạn chế tối đa việc lưu kho dài ngày. Nhờ quy trình vận chuyển nhanh và rút gọn các khâu trung gian, sản phẩm có thể được giao đến khách hàng trong thời gian sớm nhất.
                  </p>
                </div>
                <div className="mt-10 p-8 bg-[#32753A] rounded-2xl shadow-xl">
                  <h3 className="text-xl md:text-2xl font-medium text-white italic leading-relaxed text-left">
                    &quot;Với Farme, mỗi hộp rau không chỉ đơn thuần là thực phẩm cho bữa ăn, mà còn là sự an tâm mà chúng tôi mong muốn gửi gắm đến từng gia đình.&quot;
                  </h3>
                </div>
              </div>
              <div className="lg:col-span-1 lg:h-full min-h-[220px]">
                <div className="rounded-2xl overflow-hidden border border-[#32753A]/25 shadow-md bg-[#32753A]/10 h-full min-h-[220px] lg:min-h-0">
                  <img
                    src="/_DSC0070.png"
                    alt="Cam kết chất lượng Farme"
                    className="w-full h-full min-h-[220px] lg:min-h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      <MainFooter />
    </Fragment>
  );
};

export default Introduce;
