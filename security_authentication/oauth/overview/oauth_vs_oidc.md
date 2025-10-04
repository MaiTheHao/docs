# OAuth vs OpenID Connect – Tổng hợp

## 1. Tư duy cốt lõi

-   **OAuth**: Chỉ quan tâm đến việc **ứng dụng có quyền làm gì** với tài nguyên (API) – không cần biết người dùng là ai.
-   **OpenID Connect (OIDC)**: Mở rộng OAuth, bổ sung **danh tính người dùng** để ứng dụng biết _“đây là ai”_.

---

## 2. Ví dụ “khách sạn”

| Thành phần            | Trong khách sạn                                                 | Trong OAuth/OIDC                                                       |
| --------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Lễ tân**            | Kiểm tra CMND và thẻ tín dụng của bạn, rồi đưa thẻ phòng        | Authorization Server (nơi xác thực và phát token)                      |
| **Thẻ phòng**         | Mở được một số cửa phòng, hồ bơi, phòng gym…                    | Access Token (chỉ chứa quyền truy cập, không chứa thông tin bạn là ai) |
| **Cửa phòng**         | Chỉ kiểm tra xem thẻ có mở được không, không cần biết bạn là ai | Resource Server (API)                                                  |
| **Thông tin cá nhân** | Tên, hình ảnh của bạn khi check-in                              | ID Token (OIDC – chứa thông tin nhận dạng người dùng)                  |

📌 Trong **OAuth**, “cửa” chỉ cần biết thẻ hợp lệ, không cần biết người cầm thẻ là ai.  
📌 Trong **OIDC**, ngoài việc có thẻ hợp lệ, ứng dụng còn được biết danh tính người dùng từ **ID Token**.

---

## 3. Trong phần mềm

-   **OAuth**: App A muốn upload file lên Google Drive của bạn → chỉ cần Access Token để gọi API, không cần biết bạn là ai.
-   **OIDC**: Nếu App A muốn hiển thị tên và avatar của bạn trong giao diện → cần OIDC để nhận **ID Token** chứa thông tin người dùng.

---

## 4. Khác biệt ngắn gọn

|                          | **OAuth**                            | **OpenID Connect**                          |
| ------------------------ | ------------------------------------ | ------------------------------------------- |
| **Mục tiêu**             | Truy cập API (quyền)                 | Xác định danh tính (ai)                     |
| **Token chính**          | Access Token                         | Access Token + ID Token                     |
| **Thông tin người dùng** | Không có                             | Có                                          |
| **Dùng khi**             | App chỉ cần thao tác dữ liệu qua API | App cần hiển thị / lưu thông tin người dùng |

---

## 5. Chốt ý dễ nhớ

> OAuth = “Có quyền gì?”  
> OIDC = “Bạn là ai?”

## 6. Phân tách ý nghĩa từng từ

### OAuth

-   **O** = **Open** (Mở) → Giao thức mở, không độc quyền
-   **Auth** = **Authorization** (Phân quyền) → Tập trung vào việc cấp quyền truy cập

### OIDC (OpenID Connect)

-   **Open** = Mở → Giao thức công khai, miễn phí
-   **ID** = **Identity** (Danh tính) → Xác định người dùng là ai
-   **Connect** = Kết nối → Liên kết danh tính với ứng dụng

### So sánh trực quan

```
OAuth     → OPEN + AUTHORIZATION = Mở + Phân quyền
OIDC      → OPEN + IDENTITY + CONNECT = Mở + Danh tính + Kết nối
```

💡 **Ghi nhớ**:

-   OAuth có chữ **"Auth"** → chỉ quan tâm **phân quyền**
-   OIDC có chữ **"ID"** → quan tâm **danh tính** người dùng
