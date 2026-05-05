# Tài liệu các API thay đổi (UserBox Quantity)

Dưới đây là danh sách các API đã được cập nhật để hỗ trợ tính năng cộng dồn số lượng gói (`totalQuantity`).

---

## 1. API cho Client (Người dùng)

### POST /boxes/payment/qr
**Mô tả:** Tạo mã QR thanh toán VNPay cho đơn mua gói.
*   **Thay đổi**: Thêm trường `quantity` vào Request Body. Hệ thống không còn chặn mua trùng nếu đã có gói `active`.
*   **Request Body**:
```json
{
  "orderId": "ORDER123",
  "amount": 1200000,
  "phone": "0912345678",
  "box_id": "BOX_ID_UUID",
  "quantity": 2, // <--- THÊM MỚI
  "subscription_weeks": 4,
  "note": "Ghi chú nếu có"
}
```
*   **Response**: (Giữ nguyên cấu trúc VNPay QR)

### GET /boxes/user-box/:userBoxId
**Mô tả:** Lấy thông tin chi tiết gói của người dùng.
*   **Thay đổi**: Thêm trường `totalQuantity` trong `data`. 
*   **Response mẫu**:
```json
{
  "status": 200,
  "data": {
    "id": "USER_BOX_UUID",
    "status": "active",
    "boxId": "BOX_UUID",
    "totalQuantity": 2, // <--- THÊM MỚI
    "box_details": [...],
    "user_add_ons": [...]
  }
}
```

---

## 2. API cho Quản trị (Admin)

### GET /admin/user-boxes
**Mô tả:** Thống kê/Danh sách toàn bộ các gói đã bán. 
*   **Thay đổi**: Mỗi item trong danh sách trả về có thêm trường `totalQuantity`.
*   **Response mẫu**:
```json
{
  "status": 200,
  "data": {
    "items": [
      {
        "id": "...",
        "totalQuantity": 5, // <--- THÊM MỚI
        "status": "active",
        "user": { ... },
        "box": { ... }
      }
    ],
    "meta": { "total": 100, ... }
  }
}
```

### GET /admin/user-boxes/:id
**Mô tả:** Chi tiết một gói cụ thể cho admin.
*   **Thay đổi**: Thêm `totalQuantity` trong `data`.
*   **Response mẫu**: Giống item của `GET /admin/user-boxes`.

### PATCH /admin/user-boxes/:id
**Mô tả:** Cập nhật trạng thái hoặc thông tin gói.
*   **Thay đổi**: Cho phép chỉnh sửa `totalQuantity` thông qua Request Body.
*   **Request Body**:
```json
{
  "status": "active",
  "totalQuantity": 10 // <--- THÊM MỚI (Cho phép Admin điều chỉnh thủ công)
}
```
*   **Response**: Trả về [UserBox](file:///home/leejaelee/agrifarmeet-be/src/db/entities/user-box.entity.ts#17-58) đã cập nhật bao gồm cả `totalQuantity`.

---

## Ghi chú về Logic "Cộng dồn":
1.  **Mua thêm gói**: Nếu người dùng đã có gói cùng loại đang `active`, khi thanh toán thành công đơn hàng mới:
    *   Hệ thống sẽ cộng dồn giá trị `quantity` của đơn mới vào `totalQuantity` của gói cũ.
    *   Cộng dồn số tuần (`subscription_weeks`) vào ngày hết hạn (`expiredAt`) hiện tại.
2.  **Giao hàng**: Không còn trừ số lượng khi đơn giao hoàn thành (đã bỏ logic `remaining_quantity` theo yêu cầu).
