# Các Loại Ứng Dụng (Client Types) trong OAuth 2.0

## 1. Định nghĩa

Trong OAuth, **client type** (loại ứng dụng khách) là cách phân loại dựa trên các thuộc tính bảo mật của ứng dụng khi tương tác với hệ thống xác thực.

OAuth 2.0 định nghĩa hai loại chính:

| Loại ứng dụng    | Đặc điểm chính                                 |
| ---------------- | ---------------------------------------------- |
| **Confidential** | Có thể giữ bí mật an toàn (có client secret)   |
| **Public**       | Không thể giữ bí mật an toàn (không có secret) |

---

## 2. Sự khác biệt cơ bản

-   **Confidential clients**:

    -   Có **client secret** hoặc thông tin định danh khác.
    -   Thường là ứng dụng chạy trên máy chủ (server-side), ví dụ: web server, backend API.
    -   Có thể lưu trữ bí mật trong file cấu hình hoặc biến môi trường mà người dùng không truy cập được.

-   **Public clients**:
    -   Không có hoặc không thể bảo vệ **client secret**.
    -   Thường là ứng dụng chạy trên thiết bị người dùng, ví dụ: mobile app, single-page app (SPA), desktop app, IoT device.
    -   Mọi bí mật nhúng trong mã nguồn đều có thể bị lộ.

---

## 3. Ứng dụng thực tế

| Loại ứng dụng    | Ví dụ điển hình                               | Có thể giữ secret? |
| ---------------- | --------------------------------------------- | ------------------ |
| **Confidential** | Web server (Java, .NET, PHP…), backend API    | Có                 |
| **Public**       | SPA (React, Angular…), mobile app, IoT device | Không              |

-   Với **SPA**, mã nguồn tải về trình duyệt nên mọi secret đều bị lộ.
-   Với **mobile app**, có thể bị trích xuất secret từ file nhị phân.
-   Bất kỳ ứng dụng nào chạy trên thiết bị do người dùng kiểm soát đều không thể giữ bí mật an toàn.

---

## 4. Liên quan đến OAuth

-   **Confidential client** có thể xác thực với Authorization Server bằng client secret.
-   **Public client** không thể xác thực chắc chắn, Authorization Server phải áp dụng chính sách bảo mật chặt chẽ hơn (ví dụ: hạn chế cấp refresh token, rút ngắn thời gian sống của token, yêu cầu xác thực bổ sung).

| Loại client  | Xác thực với server | Rủi ro giả mạo | Chính sách bảo mật |
| ------------ | ------------------- | -------------- | ------------------ |
| Confidential | Có                  | Thấp           | Linh hoạt          |
| Public       | Không               | Cao            | Nghiêm ngặt        |

---

## 5. Về client secret và các phương pháp bảo mật

-   **Client secret**: Chuỗi ký tự bí mật dùng để xác thực ứng dụng với Authorization Server (giống API key hoặc password).
-   **Phương pháp mạnh hơn**:
    -   Mutual TLS (xác thực hai chiều qua chứng chỉ số)
    -   Sử dụng cặp khóa công khai/riêng để ký JWT

Các phương pháp này thường dùng trong môi trường yêu cầu bảo mật cao.

---

## 6. Tóm tắt

-   **Confidential clients**: Ứng dụng chạy trên server, có thể giữ bí mật an toàn.
-   **Public clients**: Ứng dụng chạy trên thiết bị người dùng, không thể giữ bí mật an toàn.
-   Không bao giờ nhúng client secret vào mobile app hoặc SPA.
-   Khi đăng ký ứng dụng với OAuth server, cần chọn đúng loại client và bảo vệ credentials nếu có.
