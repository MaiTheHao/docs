# Tìm hiểu về JSON Web Token (JWT)

**JSON Web Token** (thường được viết tắt là **JWT**) là một tiêu chuẩn mở được định nghĩa trong [RFC 7519](https://tools.ietf.org/html/rfc7519). Nó định nghĩa một cách thức nhỏ gọn (compact) và khép kín (self-contained) để truyền tải thông tin một cách an toàn giữa các bên dưới dạng một đối tượng JSON.

Nói một cách đơn giản, **JWT** là một định dạng chuẩn hóa được sử dụng để truyền thông tin an toàn giữa hai bên.

> **Lưu ý quan trọng:** Khi nói "truyền thông tin an toàn", điều đó không có nghĩa là JWT chứa thông tin bí mật. Ý nghĩa của nó là bạn có thể sử dụng JWT để xác định xem người yêu cầu một thông tin cụ thể có được **ủy quyền (authorized)** để truy cập thông tin đó hay không.

Vì vậy, JWT có hai đặc tính chính:

-   Trao đổi thông tin.
-   Đảm bảo thông tin được trao đổi giữa các bên đã được ủy quyền.

## Mục lục

1.  [Cấu trúc của JWT](#1-cấu-trúc-của-jwt)
2.  [Base64URL Encoding là gì?](#2-base64url-encoding-là-gì)
3.  [Giải mã Header và Payload](#3-giải-mã-header-và-payload)
4.  [JWT hoạt động như thế nào?](#4-jwt-hoạt-động-như-thế-nào)
5.  [Tổng kết](#5-tổng-kết)

---

## 1. Cấu trúc của JWT

Một JWT về cơ bản chứa ba phần, được ngăn cách bởi hai dấu chấm (`.`).

> **Công thức:**
>
> ```
> Header.Payload.Signature
> ```

Đây là một ví dụ về một JWT thực tế:

-   **Phần 1: Header (Phần đầu):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
-   **Phần 2: Payload (Phần dữ liệu):** `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`
-   **Phần 3: Signature (Chữ ký):** `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

> **Ghi nhớ:** Hai phần đầu tiên (Header và Payload) **không được mã hóa bảo mật (encrypted)**, chúng chỉ đơn giản là được **mã hóa (encoded)** bằng **Base64URL**. Điều này có nghĩa là bất kỳ ai cũng có thể giải mã và đọc được nội dung của chúng.

> **Vấn đề:** Sự khác biệt giữa "Encode" và "Encrypt" là gì?
> **Giải pháp:**
>
> -   **Encode (Mã hóa):** Chỉ chuyển đổi dữ liệu sang một định dạng khác để thuận tiện lưu trữ hoặc truyền tải. Quá trình này không bảo vệ dữ liệu. Ví dụ: Base64URL chỉ giúp dữ liệu dễ truyền qua mạng.
> -   **Encrypt (Mã hóa bảo mật):** Sử dụng thuật toán và khóa bí mật để biến đổi dữ liệu thành dạng không thể đọc được nếu không có khóa giải mã. Chỉ những ai có khóa mới đọc được nội dung gốc.
>
> **Kết luận:** JWT chỉ **encode** Header và Payload, không **encrypt**. Do đó, không nên lưu thông tin bí mật trong Payload.

Phần thứ ba, **Signature (Chữ ký)**, được tạo ra bằng các thuật toán mật mã (ví dụ: `HS256`, `RS256`) để đảm bảo tính toàn vẹn của token (rằng Header và Payload không bị thay đổi).

---

## 2. Base64URL Encoding là gì?

Bạn có thể đã nghe về **Base64**, một phương thức phổ biến để mã hóa văn bản khi truyền qua mạng. Tuy nhiên, các ký tự được sử dụng trong Base64 (như `+`, `/`) đôi khi có thể gây ra sự cố khi truyền qua URL hoặc trong header HTTP.

**Base64URL Encoding** là một biến thể của Base64 giải quyết vấn đề này, và đây là phương thức được JWT sử dụng.

### 2.1. So sánh Base64 và Base64URL

| Tính năng           | **Base64 (Truyền thống)** | **Base64URL (Sử dụng trong JWT)** |
| :------------------ | :------------------------ | :-------------------------------- |
| **Ký tự `+`**       | Sử dụng                   | Thay thế bằng `-` (dấu gạch nối)  |
| **Ký tự `/`**       | Sử dụng                   | Thay thế bằng `_` (dấu gạch dưới) |
| **Ký tự đệm (`=`)** | Thường thấy ở cuối        | Bị loại bỏ (không bắt buộc)       |

> **Lưu ý quan trọng:** Đây là lý do tại sao bạn sẽ không thấy các ký tự `+`, `/` hoặc `=` trong một chuỗi JWT.

---

## 3. Giải mã Header và Payload

Vì Header và Payload chỉ được mã hóa Base64URL, chúng ta có thể dễ dàng giải mã chúng để xem nội dung văn bản gốc (clear text).

### 3.1. Header

Header thường chứa hai phần: loại token (`typ`) và thuật toán ký (`alg`) được sử dụng cho chữ ký.

-   **Encoded:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
-   **Decoded (Giải mã):**

```json
{
	"alg": "HS256",
	"typ": "JWT"
}
```

### 3.2. Payload

Payload chứa các **claims (tuyên bố)**. Đây là các thông tin về một thực thể (thường là người dùng) và các dữ liệu bổ sung.

-   **Encoded:** `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`
-   **Decoded (Giải mã):**

```json
{
	"sub": "1234567890",
	"name": "John Doe",
	"iat": 1516239022
}
```

> **Câu hỏi hay:** Nếu ai cũng đọc được Payload, vậy JWT bảo mật ở điểm nào?
> **Trả lời:** Tính bảo mật của JWT không nằm ở việc che giấu dữ liệu (confidentiality), mà nằm ở việc **xác thực (authentication)** và **đảm bảo tính toàn vẹn (integrity)**. Chữ ký (Signature) đảm bảo rằng dữ liệu trong Payload không hề bị sửa đổi kể từ khi nó được tạo ra.

---

## 4. JWT hoạt động như thế nào?

Hãy xem xét một luồng xác thực và ủy quyền điển hình sử dụng JWT.

Giả sử chúng ta có:

-   **Client:** (ví dụ: ứng dụng di động, trang web)
-   **Authorization Server (Máy chủ Ủy quyền):** (còn gọi là Máy chủ Xác thực) - nơi xử lý đăng nhập và tạo token.
-   **Resource Server (Máy chủ Tài nguyên):** (còn gọi là API Server) - nơi chứa dữ liệu cần bảo vệ.

Luồng hoạt động sẽ diễn ra như sau:

1.  **Bước 1: Client Xác thực:** Client liên hệ với **Authorization Server** và gửi thông tin đăng nhập (ví dụ: username/password).
2.  **Bước 2: Máy chủ Ủy quyền Xác minh:** Authorization Server kiểm tra thông tin đăng nhập (thường là so khớp với cơ sở dữ liệu).
3.  **Bước 3: Tạo và Trả về JWT:** Nếu xác thực thành công, Authorization Server tạo ra một JWT (bao gồm Header, Payload và một Signature được ký bằng một **signing key** bí mật) và trả về cho Client.
4.  **Bước 4: Client Gửi Yêu cầu với JWT:** Giờ đây, mỗi khi Client muốn truy cập tài nguyên từ **Resource Server**, nó sẽ gửi JWT này kèm theo yêu cầu (thường là trong `Authorization` header).
5.  **Bước 5: Máy chủ Tài nguyên Xác minh JWT:** Resource Server nhận được JWT. Nó thực hiện xác minh tính toàn vẹn của token. Quá trình này bao gồm việc kiểm tra chữ ký (signature) xem nó có hợp lệ không (bằng cách sử dụng signing key mà nó cũng biết) và kiểm tra xem token có hết hạn hay không.
6.  **Bước 6: Trả về Tài nguyên:** Nếu JWT hợp lệ, Resource Server tin tưởng rằng Client đã được ủy quyền và trả về tài nguyên (dữ liệu) mà Client yêu cầu.

> **Vấn đề:** Kẻ tấn công (Attacker) muốn truy cập tài nguyên thì phải làm sao?
> **Giải pháp:** Kẻ tấn công không thể lấy được tài nguyên vì không có JWT hợp lệ. Để có JWT hợp lệ, hắn có hai lựa chọn:
>
> 1.  Đánh cắp thông tin đăng nhập (credentials) của người dùng để yêu cầu Authorization Server cấp JWT.
> 2.  Đánh cắp **signing key** (khóa ký) từ Authorization Server (hoặc Resource Server) để tự tạo JWT giả mạo.
>
> Cả hai kịch bản này đều yêu cầu kẻ tấn công phải xâm nhập (compromise) vào một phần của hệ thống, chứ không thể đơn giản là sửa đổi Payload.

---

## 5. Tổng kết

-   **JWT** là một tiêu chuẩn mở (RFC 7519) để truyền thông tin an toàn dưới dạng JSON.
-   Nó không dùng để che giấu dữ liệu (encryption) mà để **xác thực** và **đảm bảo tính toàn vẹn** (integrity).
-   Một JWT có 3 phần: `Header.Payload.Signature`.
-   Header và Payload được mã hóa **Base64URL** (không phải Base64 truyền thống) và có thể bị giải mã bởi bất kỳ ai.
-   **Signature (Chữ ký)** là phần quan trọng nhất, được tạo bằng thuật toán mật mã và một khóa bí mật (signing key), giúp chống lại việc giả mạo dữ liệu.
-   Luồng phổ biến là: Client đăng nhập -> Nhận JWT -> Gửi JWT kèm mỗi yêu cầu API -> Server xác minh JWT -> Trả về dữ liệu.
