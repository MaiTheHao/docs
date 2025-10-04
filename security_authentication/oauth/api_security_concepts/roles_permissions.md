# Các Vai trò trong OAuth 2.0

## 1. Tổng quan

Trước khi có OAuth, các phương pháp xác thực API phổ biến như xác thực bằng mật khẩu hoặc cookie thường yêu cầu chia sẻ thông tin đăng nhập hoặc quản lý cookie phiên, dẫn đến nhiều rủi ro bảo mật. OAuth 2.0 ra đời để giải quyết các vấn đề này, cho phép truy cập API an toàn mà không cần chia sẻ mật khẩu, nhờ vào việc phân tách rõ ràng các vai trò và sử dụng **mã truy cập (access token)**.

---

## 2. Các vai trò chính trong OAuth 2.0

| Vai trò OAuth             | Thuật ngữ thông thường | Mô tả                                            |
| ------------------------- | ---------------------- | ------------------------------------------------ |
| **Chủ sở hữu tài nguyên** | Người dùng             | Người sở hữu dữ liệu.                            |
| **Tác nhân người dùng**   | Thiết bị               | Trình duyệt hoặc thiết bị mà người dùng sử dụng. |
| **Ứng dụng khách OAuth**  | Ứng dụng               | Phần mềm yêu cầu truy cập API.                   |
| **Máy chủ tài nguyên**    | API                    | Máy chủ lưu trữ dữ liệu được bảo vệ.             |
| **Máy chủ ủy quyền**      | -                      | Cấp mã truy cập sau khi xác thực người dùng.     |

-   **Chủ sở hữu tài nguyên (Resource Owner)**: Người sở hữu dữ liệu, ví dụ: người dùng có tài khoản.
-   **Tác nhân người dùng (User Agent)**: Thiết bị hoặc phần mềm mà người dùng sử dụng, như trình duyệt web hoặc điện thoại di động.
-   **Ứng dụng khách OAuth (OAuth Client)**: Phần mềm yêu cầu truy cập API, ví dụ: ứng dụng web hoặc di động.
-   **Máy chủ tài nguyên (Resource Server)**: Máy chủ lưu trữ dữ liệu được bảo vệ, nơi ứng dụng khách gửi yêu cầu.
-   **Máy chủ ủy quyền (Authorization Server)**: Máy chủ xác thực người dùng và cấp **mã truy cập** cho ứng dụng khách.

📌 Các thuật ngữ này được sử dụng trong đặc tả OAuth 2.0 để đảm bảo tính chính xác. Trong giao tiếp thông thường, bạn có thể dùng các từ như “người dùng,” “thiết bị,” “ứng dụng,” và “API,” nhưng cần chú ý “ứng dụng” trong OAuth chỉ phần mềm truy cập API.

---

## 3. Quy trình hoạt động của OAuth 2.0

1. Ứng dụng khách OAuth chuyển hướng Tác nhân người dùng (ví dụ: trình duyệt) đến máy chủ ủy quyền.
2. Người dùng xác thực tại máy chủ ủy quyền (nhập tên đăng nhập, mật khẩu).
3. Máy chủ ủy quyền cấp **mã truy cập** cho ứng dụng khách.
4. Ứng dụng khách sử dụng mã truy cập để gửi yêu cầu đến máy chủ tài nguyên.
5. Máy chủ tài nguyên xác thực mã truy cập (thường phối hợp với máy chủ ủy quyền hoặc kiểm tra chữ ký JWT) và trả về dữ liệu.

💡 **Lợi ích:** Ứng dụng khách không bao giờ thấy thông tin đăng nhập của người dùng, tăng cường bảo mật, đặc biệt với ứng dụng bên thứ ba.

---

## 4. Lưu ý về vai trò và thành phần

-   Các vai trò trong OAuth 2.0 là khái niệm logic, không nhất thiết là các thành phần vật lý riêng biệt.
-   Trong hệ thống nhỏ, máy chủ ủy quyền và máy chủ tài nguyên có thể cùng một hệ thống.
-   Trong kiến trúc microservices, nhiều API (máy chủ tài nguyên) có thể được bảo vệ bởi một máy chủ ủy quyền duy nhất, thường đứng sau API Gateway.

---

## 5. Tại sao OAuth an toàn hơn các phương pháp cũ?

-   OAuth 2.0 sử dụng **mã truy cập** có thời hạn ngắn và giới hạn phạm vi quyền, thay vì lưu trữ cookie phiên lâu dài hoặc chia sẻ mật khẩu.
-   Giảm thiểu rủi ro lộ thông tin đăng nhập, phù hợp cho truy cập bên thứ ba.

---

## 6. Tiếp theo là gì?

Sau khi nắm vững các vai trò, bạn sẽ tìm hiểu về các luồng OAuth 2.0 (ví dụ: Authorization Code flow) và cách các loại ứng dụng khách khác nhau (web, mobile) tương tác với máy chủ ủy quyền.

---

## 7. Ghi chú về thuật ngữ và dịch thuật

-   Sử dụng các thuật ngữ chuẩn tiếng Việt: “Chủ sở hữu tài nguyên,” “Tác nhân người dùng,” “Ứng dụng khách OAuth,” “Máy chủ tài nguyên,” “Máy chủ ủy quyền.”
-   Ưu tiên “mã truy cập” thay cho “token” để rõ ràng, đúng chuẩn kỹ thuật.
-   Giữ các từ như “API” vì phổ biến trong ngành.
-   Ngôn ngữ tự nhiên, mạch lạc, phù hợp tài liệu kỹ thuật và giáo dục.

---

> Nếu bạn cần bổ sung ví dụ mã, hình minh họa, hoặc dịch các phần khác, hãy để lại yêu cầu!
