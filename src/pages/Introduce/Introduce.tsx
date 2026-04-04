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
        {/* HERO SECTION */}
        <section className="relative py-20 px-6 lg:px-20 bg-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#f0f8f4] opacity-80 z-0 border-b border-[#d8f3dc]" />
          <div className="container relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1b4332] mb-8 tracking-tight">
              Giới thiệu về Farme
            </h1>
            <div className="space-y-4">
              <p className="text-lg text-text2 leading-loose text-justify md:text-center">
                Farme được hình thành từ một mong muốn rất giản dị: mang nguồn nông sản tươi ngon, an toàn và đáng tin cậy đến gần hơn với các gia đình thành phố.
              </p>
              <p className="text-lg text-text2 leading-loose text-justify md:text-center">
                Trong nhịp sống bận rộn, nhiều người phải đi sớm về muộn, quỹ thời gian dành cho việc đi chợ hay lựa chọn thực phẩm cho bữa ăn gia đình ngày càng ít đi. Việc tìm kiếm một nguồn rau vừa tươi ngon, vừa rõ ràng về nguồn gốc vì thế cũng trở nên khó khăn hơn.
              </p>
              <p className="text-lg text-text2 leading-loose text-justify md:text-center">
                Không ít gia đình mong muốn ăn sạch và lành mạnh hơn, nhưng lại luôn băn khoăn về nơi thực phẩm được trồng, cách chúng được chăm sóc và hành trình trước khi đến bàn ăn.
              </p>
              <p className="text-lg font-medium text-[#2d6a4f] leading-loose mt-4 text-justify md:text-center border-l-4 border-[#40916c] pl-6 md:border-l-0 md:pl-0">
                Farme ra đời từ chính những trăn trở đó. Chúng tôi mong muốn trở thành cầu nối giữa nông trại và căn bếp của mỗi gia đình, giúp việc tiếp cận nguồn thực phẩm minh bạch và đáng tin cậy trở nên dễ dàng hơn trong cuộc sống hiện đại.
              </p>
            </div>
          </div>
        </section>

        {/* CÂU CHUYỆN & SỨ MỆNH */}
        <section className="py-20 px-6 lg:px-20">
          <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            <div id="cau-chuyen" className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <h2 className="text-3xl font-bold text-[#1b4332] mb-6 relative pb-4">
                Câu chuyện của Farme
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-green rounded-full"></span>
              </h2>
              <div className="space-y-4">
                <p className="text-text2 text-justify leading-relaxed">
                  Ở nhiều vùng nông nghiệp, người nông dân vẫn đang ngày ngày chăm sóc những luống rau tươi tốt bằng sự tận tâm và kinh nghiệm lâu năm. Tuy nhiên, hành trình để những nông sản đó đến được với người tiêu dùng thường phải đi qua nhiều khâu trung gian.
                </p>
                <p className="text-text2 text-justify leading-relaxed">
                  Khi đến thành phố, thực phẩm có thể đã trải qua một quãng đường dài, khiến người mua khó biết được nguồn gốc thực sự của chúng.
                </p>
                <p className="text-text2 text-justify leading-relaxed">
                  Farme chọn bắt đầu từ một ý tưởng đơn giản: <span className="font-semibold text-[#2d6a4f]">rút ngắn khoảng cách giữa người trồng và người tiêu dùng.</span>
                </p>
                <p className="text-text2 text-justify leading-relaxed">
                  Thông qua việc kết nối trực tiếp với các nông trại và hợp tác xã đủ tiêu chuẩn, Farme mang những sản phẩm tươi ngon từ nông trại đến tận nhà các gia đình. Mỗi loại rau không chỉ là một thực phẩm cho bữa ăn, mà còn là kết quả của sự chăm sóc từ người nông dân và điều kiện tự nhiên của vùng đất nơi nó được trồng.
                </p>
                <p className="text-text2 text-justify leading-relaxed mt-2 font-medium">
                  Chúng tôi tin rằng khi hành trình của thực phẩm trở nên rõ ràng hơn, niềm tin của người tiêu dùng cũng sẽ được xây dựng một cách bền vững hơn.
                </p>
              </div>
            </div>
            
            <div id="su-menh" className="flex flex-col bg-[#1b4332] text-white p-8 md:p-12 rounded-3xl shadow-lg border border-[#0d2818]">
              <h2 className="text-3xl font-bold text-white mb-6 relative pb-4">
                Sứ mệnh của Farme
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#52b788] rounded-full"></span>
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
        <section id="gia-tri" className="py-20 px-6 lg:px-20 bg-[#f0f8f4]">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-[#1b4332] mb-6">Giá trị Farme theo đuổi</h2>
            <p className="text-text2 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              Ngay từ những ngày đầu, Farme được xây dựng dựa trên ba giá trị cốt lõi: <br className="hidden md:block"/>
              <strong className="text-[#2d6a4f] font-bold text-xl block mt-2">Minh Bạch - An Toàn - Bền Vững</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#E3F2FD] text-[#1E88E5] rounded-full flex items-center justify-center mb-6 text-2xl shadow-inner">🔍</div>
                <h3 className="text-xl font-bold text-text1 mb-4">Minh Bạch</h3>
                <p className="text-text2 text-base leading-relaxed">
                  Là nguyên tắc quan trọng trong cách Farme vận hành. Chúng tôi tin rằng người tiêu dùng có quyền biết rõ thực phẩm của mình đến từ đâu và được trồng như thế nào.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-secondary-green text-green rounded-full flex items-center justify-center mb-6 text-2xl shadow-inner">🛡️</div>
                <h3 className="text-xl font-bold text-text1 mb-4">An Toàn</h3>
                <p className="text-text2 text-base leading-relaxed">
                  Là tiêu chuẩn được đặt lên hàng đầu khi lựa chọn sản phẩm. Farme hợp tác với các nông trại và hợp tác xã có quy trình sản xuất được kiểm soát, nhằm đảm bảo chất lượng.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FFF9C4] text-[#FBC02D] rounded-full flex items-center justify-center mb-6 text-2xl shadow-inner">🌱</div>
                <h3 className="text-xl font-bold text-text1 mb-4">Bền Vững</h3>
                <p className="text-text2 text-base leading-relaxed">
                  Là giá trị mà Farme mong muốn xây dựng lâu dài. Khi người tiêu dùng lựa chọn những sản phẩm minh bạch, những người nông dân làm nông nghiệp tử tế sẽ có thêm động lực để tiếp tục canh tác và phát triển.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HÀNH TRÌNH TỪ NÔNG TRẠI ĐẾN BÀN ĂN */}
        <section id="hanh-trinh" className="py-20 px-6 lg:px-20 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-[#1b4332] mb-16">Hành trình từ nông trại đến bàn ăn</h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-start gap-6 border-b border-border pb-8 last:border-0 last:pb-0">
                <div className="flex-shrink-0 bg-green text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold text-xl shadow-md">1</div>
                <div>
                  <p className="text-text2 text-lg leading-relaxed text-justify md:text-left">
                    Mỗi hộp rau Farme bắt đầu từ những luống rau ngoài nông trại. Vào buổi sáng sớm, khi rau đạt độ tươi ngon nhất, người nông dân bắt đầu thu hoạch.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-6 border-b border-border pb-8 last:border-0 last:pb-0">
                <div className="flex-shrink-0 bg-green text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold text-xl shadow-md">2</div>
                <div>
                  <p className="text-text2 text-lg leading-relaxed text-justify md:text-left">
                    Sau đó, rau được phân loại và đóng gói ngay trong ngày để giữ được độ tươi tự nhiên của sản phẩm.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-6 border-b border-border pb-8 last:border-0 last:pb-0">
                <div className="flex-shrink-0 bg-green text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold text-xl shadow-md">3</div>
                <div>
                  <p className="text-text2 text-lg leading-relaxed text-justify md:text-left">
                    Sau đó những hộp rau được vận chuyển giao đến tận nhà khách hàng trong thời gian ngắn nhất. Nhờ rút ngắn các khâu trung gian, rau có thể đến tay người tiêu dùng khi vẫn giữ được độ tươi ngon và giá trị dinh dưỡng.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-6 pb-4">
                <div className="flex-shrink-0 bg-green text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold text-xl shadow-md">4</div>
                <div>
                  <p className="text-text2 text-lg leading-relaxed text-justify md:text-left">
                    Chỉ với thời gian ngắn những luống rau ngoài đồng đã có thể xuất hiện trong căn bếp của một gia đình. Đó là một hành trình ngắn hơn, minh bạch hơn và gần gũi hơn giữa nông trại và bàn ăn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ĐỂ BỮA CƠM NHẸ NHÀNG HƠN */}
        <section className="py-20 px-6 lg:px-20 bg-gradient-to-tr from-[#f0f8f4] to-white">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold text-[#1b4332] mb-8">Để bữa cơm gia đình trở nên nhẹ nhàng hơn</h2>
            <div className="bg-white p-8 md:p-14 rounded-3xl shadow-sm border border-border">
              <p className="text-text2 mb-6 text-lg leading-relaxed text-justify md:text-center">
                Farme mang đến các gói rau tươi theo tuần và theo tháng, được lựa chọn theo mùa và giao tận nhà mỗi tuần. Nhờ đó, các gia đình có thể dễ dàng chuẩn bị bữa ăn mà không cần dành quá nhiều thời gian cho việc đi chợ hay tìm kiếm nguồn thực phẩm an toàn.
              </p>
              <p className="text-text2 text-lg leading-relaxed text-justify md:text-center">
                Một hộp rau Farme không chỉ giúp tiết kiệm thời gian mà còn mang lại sự an tâm về chất lượng và nguồn gốc thực phẩm. Trong nhịp sống bận rộn, đôi khi điều một gia đình cần chỉ đơn giản là một nguồn thực phẩm đáng tin cậy để bữa cơm mỗi ngày trở nên trọn vẹn hơn.
              </p>
            </div>
          </div>
        </section>

        {/* CAM KẾT TỪ FARME */}
        <section id="cam-ket" className="py-24 px-6 lg:px-20 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="mb-6 text-[#1b4332] inline-block bg-[#e9f5ef] p-5 rounded-full shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-text1 mb-8 tracking-tight">Cam kết từ Farme</h2>
            <div className="space-y-6">
              <p className="text-text2 text-lg leading-relaxed text-justify md:text-center">
                Mỗi sản phẩm Farme mang đến đều đi kèm với sự minh bạch và trách nhiệm. Chúng tôi luôn nỗ lực để đảm bảo rằng thực phẩm đến tay khách hàng không chỉ tươi ngon mà còn rõ ràng về nguồn gốc.
              </p>
              <p className="text-text2 text-lg leading-relaxed text-justify md:text-center">
                Rau được thu hoạch trực tiếp tại nông trại, đóng gói trong ngày và hạn chế tối đa việc lưu kho dài ngày. Nhờ quy trình vận chuyển nhanh và rút gọn các khâu trung gian, sản phẩm có thể được giao đến khách hàng trong thời gian sớm nhất.
              </p>
            </div>
            <div className="mt-12 p-8 bg-[#1b4332] rounded-2xl shadow-xl">
              <h3 className="text-xl md:text-2xl font-medium text-white italic leading-relaxed">
                "Với Farme, mỗi hộp rau không chỉ đơn thuần là thực phẩm cho bữa ăn, mà còn là sự an tâm mà chúng tôi mong muốn gửi gắm đến từng gia đình thành phố."
              </h3>
            </div>
          </div>
        </section>

      </div>

      <MainFooter />
    </Fragment>
  );
};

export default Introduce;
