# IMAGE SIZES (Farme FE)

Tài liệu này tổng hợp **kích thước ảnh đang hiển thị trong UI** (theo CSS/Tailwind hiện tại) và **kích thước ảnh upload khuyến nghị** để ảnh nét (2x/3x).

## URL website (page) tương ứng

Trong tài liệu này, “URL web” nghĩa là **đường dẫn trang trên website** nơi ảnh đang được hiển thị (không phải URL file ảnh).

Các route public hiện có trong FE (tham khảo `src/App.tsx`):

- `https://farme.vn/` (Landing)
- `https://farme.vn/boxes` (Danh sách gói)
- `https://farme.vn/boxes/<id>` (Chi tiết gói)
- `https://farme.vn/purchase/<slug>` (Mua gói)
- `https://farme.vn/order` (Đặt hàng)
- `https://farme.vn/order-lookup` (Tra cứu đơn)
- `https://farme.vn/shipper` (Shipper)

---

## 1) Landing – Đối tác (logo HTX / cooperative)

- **Hiển thị**: cao tối đa **100px**, card rộng khoảng **180–200px**, `object-fit: contain`
- **Tỉ lệ khuyến nghị**: logo **ngang**, nền trong suốt (**PNG**)
- **Upload khuyến nghị**:
  - **2x**: 400×200px
  - **3x**: 600×300px
- **URL web (page)**: `https://farme.vn/` (section “Đối tác”)

---

## 1.1) Landing – Hero slide (ảnh nền slider đầu trang)

- **Hiển thị**: full màn hình, theo CSS:
  - Chiều cao: \(100vh - header\) → `height: calc(100vh - 80px)` (mobile) và `calc(100vh - 96px)` (>= 768px)
  - Chiều rộng: full viewport (`width: 100%`), `object-fit: cover`
- **Tỉ lệ khuyến nghị**: **16:9** (ảnh ngang) để đẹp khi cover
- **Upload khuyến nghị**:
  - **Desktop**: **1920×1080px**
  - **Retina/đẹp hơn**: **2560×1440px**
  - (Tối thiểu nên >= 1600px chiều ngang để không mờ trên màn lớn)
- **URL web (page)**: `https://farme.vn/` (hero slider ở đầu trang)

---

## 2) ProductCard – ảnh sản phẩm (list/grid)

- **Hiển thị**: cao **160px** (`h-40`), rộng theo card (`w-full`), `object-fit: cover`
- **Tỉ lệ khuyến nghị**: **4:3** (ưu tiên) hoặc **1:1**
- **Upload khuyến nghị**:
  - 4:3: **800×600px** (tối thiểu 600px cạnh ngắn)
  - 1:1: **800×800px**
- **URL web (page)**:
  - `https://farme.vn/` (section “Rau tuần này có gì?”)

---

## 3) Purchase / Order – ảnh box trong “Thông tin đơn hàng”

- **Hiển thị**: **112×112px** (`w-28 h-28`), `object-fit: cover`
- **Tỉ lệ khuyến nghị**: **1:1**
- **Upload khuyến nghị**:
  - **2x**: 224×224px
  - **3x**: 336×336px
- **URL web (page)**:
  - `https://farme.vn/purchase/<slug>` (sidebar “Thông tin đơn hàng”)
  - `https://farme.vn/order` (sidebar “Thông tin đơn hàng”)

---

## 4) Purchase – ảnh từng sản phẩm trong box (sidebar)

- **Hiển thị**: **80×80px** (`w-20 h-20`), `object-fit: cover`
- **Tỉ lệ khuyến nghị**: **1:1**
- **Upload khuyến nghị**:
  - **2x**: 160×160px
  - **3x**: 240×240px
- **URL web (page)**: `https://farme.vn/purchase/<slug>` (danh sách sản phẩm trong box ở sidebar)

---

## 5) Cart / FarmStand – thumbnail sản phẩm

- **Hiển thị**: **56×56px** (`w-14 h-14`), `object-fit: cover`
- **Tỉ lệ khuyến nghị**: **1:1**
- **Upload khuyến nghị**:
  - **2x**: 112×112px
  - **3x**: 168×168px
- **URL web (page)**:
  - Cart: hiện tại **route `/cart` đang bị comment** trong `src/App.tsx` (nếu bật lại, URL sẽ là `https://farme.vn/cart`)
  - FarmStand: route `/farm-stand` cũng đang comment (nếu bật lại, URL sẽ là `https://farme.vn/farm-stand`)

---

## 6) BoxDetails – ảnh box (trang chi tiết gói)

- **Hiển thị**: rộng theo cột (`w-full`), cao tối đa **320px** (`max-h-80`), `object-fit: cover`
- **Tỉ lệ khuyến nghị**: **4:3** (ảnh gói) hoặc **16:9** (banner)
- **Upload khuyến nghị**:
  - 4:3: **1200×900px**
  - 16:9: **1280×720px**
- **URL web (page)**: `https://farme.vn/boxes/<id>` (ảnh box ở đầu trang chi tiết)

---

## 7) BoxDetails – ảnh sản phẩm trong bảng “Sản phẩm trong gói”

- **Hiển thị**: **96×80px** (`w-24 h-20`), `object-fit: cover`
- **Tỉ lệ khuyến nghị**: gần **6:5** (1.2:1) hoặc **4:3**
- **Upload khuyến nghị**:
  - 6:5: **240×200px**
  - 4:3: **400×300px**
- **URL web (page)**: `https://farme.vn/boxes/<id>` (bảng “Sản phẩm trong gói”)

---

## 8) BoxDetails – modal “Product Detail” (ảnh sản phẩm lớn)

- **Hiển thị**:
  - Desktop: **160×160px** (`sm:w-40 sm:h-40`)
  - Mobile: `w-full h-auto`
- **Tỉ lệ khuyến nghị**: **1:1**
- **Upload khuyến nghị**: **600×600px** hoặc **800×800px**
- **URL web (page)**: `https://farme.vn/boxes/<id>` (mở modal “chi tiết sản phẩm”)

---

## 9) BoxDetails – bảng cooperative trong modal (ảnh HTX)

- **Hiển thị**: **80×80px** (`w-20 h-20`), `object-fit: cover`
- **Tỉ lệ khuyến nghị**: **1:1** (logo chữ nên dùng PNG nền trong suốt)
- **Upload khuyến nghị**:
  - **2x**: 160×160px
  - **3x**: 240×240px
- **URL web (page)**: `https://farme.vn/boxes/<id>` (mở modal “chi tiết sản phẩm” → bảng HTX)

---

## 10) Shipper – ảnh box trong bảng

- **Hiển thị**: **40×40px** (`w-10 h-10`), `object-fit: cover`
- **Tỉ lệ khuyến nghị**: **1:1**
- **Upload khuyến nghị**:
  - **2x**: 80×80px
  - **3x**: 120×120px
- **URL web (page)**: `https://farme.vn/shipper` (bảng đơn hàng shipper)

