# Phân tích Chuyên sâu về JWT

Tài liệu này sẽ đi sâu vào từng thành phần của **JSON Web Token (JWT)**, bao gồm Header, Payload, và Signature (Chữ ký), đồng thời phân tích chi tiết các thuật toán ký phổ biến nhất là `HS256` và `RS256`.

## Mục lục

1.  [Header (Phần đầu)](#1-header-phần-đầu)
2.  [Payload (Phần dữ liệu)](#2-payload-phần-dữ-liệu)
3.  [Signature (Chữ ký)](#3-signature-chữ-ký)
4.  [Thuật toán HS256 (Khóa Đối xứng)](#4-thuật-toán-hs256-khóa-đối-xứng)
5.  [Thuật toán RS256 (Khóa Bất đối xứng)](#5-thuật-toán-rs256-khóa-bất-đối-xứng)
6.  [So sánh HS256 và RS256](#6-so-sánh-hs256-và-rs256)
7.  [Tổng kết](#7-tổng-kết)

---

## 1\. Header (Phần đầu)

**Header** là phần đầu tiên của JWT, chứa siêu dữ liệu (metadata) về token. Nó mô tả loại token và thuật toán ký được sử dụng.

Sau khi được giải mã Base64URL, một Header điển hình có dạng JSON như sau:

```json
{
	"alg": "HS256",
	"typ": "JWT"
}
```

-   `**typ**` (Type): Khai báo rằng đây là một token loại "JWT".
-   `**alg**` (Algorithm): Chỉ định thuật toán mật mã được sử dụng để tạo chữ ký. Ví dụ: `HS256`, `RS256`.

> **Ghi nhớ:** Thông tin `alg` trong Header là tối quan trọng. **Máy chủ Tài nguyên (Resource Server)** đọc giá trị này để biết chính xác phải sử dụng thuật toán nào để xác thực chữ ký của token.

---

## 2\. Payload (Phần dữ liệu)

**Payload** là phần thứ hai của JWT, chứa các **tuyên bố (claims)**. Đây là nơi chứa thông tin về người dùng (chủ thể) và các dữ liệu bổ sung.

Sau khi giải mã Base64URL, một Payload mẫu có thể trông như sau:

```json
{
	"userID": "securestore",
	"isAdmin": false,
	"iat": 1516239022,
	"iss": "localhost",
	"exp": 1516242622
}
```

Payload chứa hai loại claims:

1.  **Tuyên bố Tùy chỉnh (Custom Claims):** Do nhà phát triển tự định nghĩa để phục vụ logic nghiệp vụ.
    -   `userID`: Tên người dùng.
    -   `isAdmin`: Xác định quyền quản trị của người dùng.
2.  **Tuyên bố Đăng ký (Registered Claims):** Các trường chuẩn, không bắt buộc nhưng được khuyến nghị sử dụng để tăng tính tương thích và bảo mật.
    -   `**iat**` (Issued At): Thời điểm token được phát hành (tính bằng giây từ Epoch).
    -   `**iss**` (Issuer): Định danh của bên đã phát hành token (ví dụ: máy chủ xác thực).
    -   `**exp**` (Expiration Time): Thời điểm token hết hạn (tính bằng giây từ Epoch).

---

## 3\. Signature (Chữ ký)

**Chữ ký (Signature)** là phần cuối cùng và quan trọng nhất của JWT. Mục đích của nó là để **đảm bảo tính toàn vẹn** của token, xác nhận rằng Header và Payload không hề bị thay đổi trên đường truyền.

> **Công thức:** > **Chữ ký = Thuật toán(Base64(Header) + "." + Base64(Payload), Khóa bí mật)**

Khi **Máy chủ Tài nguyên (Resource Server)** nhận được JWT, nó sẽ tự tính toán lại chữ ký bằng các thành phần tương tự để xác minh token. Hai thuật toán ký được sử dụng phổ biến nhất là `HS256` và `RS256`.

---

## 4\. Thuật toán HS256 (Khóa Đối xứng)

**HS256** (HMAC-SHA256) là một thuật toán xác thực thông điệp dựa trên hash (HMAC) sử dụng thuật toán băm SHA-256. Đây là một thuật toán **mật mã đối xứng (Symmetric-key)**.

### 4.1. Quy trình tạo và xác thực

1.  **Tạo chữ ký:** Thuật toán lấy `Base64(Header) + "." + Base64(Payload)` và áp dụng hàm HMAC-SHA256 với một **Khóa bí mật chung (Shared Secret)**.
2.  **Xác thực chữ ký:** Resource Server cũng lấy `Base64(Header) + "." + Base64(Payload)` nhận được, và dùng _chính Khóa bí mật chung đó_ để thực hiện lại hàm HMAC-SHA256, sau đó so sánh kết quả với chữ ký trong token.

> **Lưu ý quan trọng:** Với `HS256`, chỉ có **một (1) khóa bí mật duy nhất** (Shared Secret). Khóa này phải được biết bởi cả **Máy chủ Xác thực (Authorization Server)** (để _tạo_ token) và _tất cả_ **Máy chủ Tài nguyên (Resource Server)** (để _xác thực_ token).

### 4.2. Luồng hoạt động

1.  **Bước 1: Yêu cầu xác thực:** Client gửi thông tin đăng nhập đến **Authorization Server**.
2.  **Bước 2: Tạo Token:** Authorization Server xác thực thành công, sau đó dùng **Khóa bí mật chung** để tạo JWT.
3.  **Bước 3: Phân phối khóa:** **Khóa bí mật chung** _bắt buộc_ phải được phân phối một cách an toàn đến tất cả các **Resource Server**.
4.  **Bước 4: Yêu cầu tài nguyên:** Client gửi JWT đến Resource Server để yêu cầu tài nguyên.
5.  **Bước 5: Xác thực Token:** Resource Server sử dụng _cùng một_ **Khóa bí mật chung** để xác thực chữ ký của JWT. Nếu hợp lệ, tài nguyên được trả về.

### 4.3. Các vấn đề bảo mật (Nhược điểm)

`HS256` đơn giản nhưng tiềm ẩn rủi ro bảo mật trong các hệ thống phân tán:

-   **Rò rỉ khi phân phối:** Khóa bí mật phải được chia sẻ đến tất cả các Resource Server, tạo ra nguy cơ bị đánh cắp trong quá trình phân phối.
-   **Điểm yếu tập trung:** Nếu _một_ Resource Server bị xâm nhập (compromised), kẻ tấn công sẽ lấy được Khóa bí mật chung. Vì khóa này cũng dùng để _tạo_ token, kẻ tấn công có thể giả mạo bất kỳ token nào và truy cập toàn bộ hệ thống.
-   **Nguy cơ Brute-force:** Nếu Khóa bí mật chung được chọn quá yếu (ví dụ: một từ đơn giản), nó có thể bị tấn công bẻ khóa Brute-force.

---

## 5\. Thuật toán RS256 (Khóa Bất đối xứng)

**RS256** (RSA-SHA256) sử dụng thuật toán **mật mã bất đối xứng (Asymmetric-key)**. Nó sử dụng một cặp khóa: một **Khóa bí mật (Private Key)** để ký và một **Khóa công khai (Public Key)** để xác thực.

### 5.1. Quy trình tạo và xác thực

1.  **Tạo chữ ký (Tại Authorization Server):**
    -   Thuật toán lấy `Base64(Header) + "." + Base64(Payload)` và tạo một bản băm (hash) SHA-256 của chuỗi này.
    -   Sau đó, nó dùng **Private Key** để _ký (sign)_ lên bản băm này, tạo ra chữ ký số.
2.  **Xác thực chữ ký (Tại Resource Server):**
    -   Resource Server nhận JWT, nó sử dụng **Public Key** tương ứng để _xác minh (verify)_ chữ ký.
    -   Quá trình này xác nhận rằng chữ ký _chỉ có thể_ được tạo ra bởi người nắm giữ **Private Key** (tức là Authorization Server).

### 5.2. Luồng hoạt động

1.  **Bước 1: Yêu cầu xác thực:** Client gửi thông tin đăng nhập đến **Authorization Server**.
2.  **Bước 2: Tạo Token:** Authorization Server xác thực thành công, sau đó dùng **Private Key** (chỉ mình nó sở hữu) để _ký_ và tạo ra JWT.
3.  **Bước 3: Yêu cầu tài nguyên:** Client gửi JWT đến Resource Server.
4.  **Bước 4: Xác thực Token:** Resource Server sử dụng **Public Key** (có thể được phân phối công khai) để _xác thực_ chữ ký của JWT. Nếu hợp lệ, tài nguyên được trả về.

> **Vấn đề:** Điều gì xảy ra nếu kẻ tấn công xâm nhập được vào một Resource Server?
> **Giải pháp:** Kẻ tấn công sẽ _không thể_ tạo ra token giả mạo. Lý do là Resource Server _chỉ_ lưu giữ **Public Key**, vốn chỉ dùng để _xác thực_. Kẻ tấn công không có **Private Key** (vẫn đang an toàn tại Authorization Server) để _ký_ token mới.

### 5.3. Lợi ích

`RS256` giải quyết được các nhược điểm chí mạng của `HS256`:

-   **Bảo mật khóa cao:** **Private Key** _chỉ_ tồn tại duy nhất tại Authorization Server và không bao giờ rời khỏi đó.
-   **Phân tách vai trò rõ ràng:** Chỉ máy chủ nắm giữ **Private Key** mới có quyền _tạo_ token. Các máy chủ khác chỉ có **Public Key** để _xác thực_.
-   **Chống Brute-force:** Khóa RSA (ví dụ: 2048-bit) đủ dài và phức tạp để chống lại các cuộc tấn công Brute-force hiệu quả.

---

## 6\. So sánh HS256 và RS256

Đây là bảng so sánh tóm tắt hai thuật toán:

| Đặc điểm           | **HS256 (Đối xứng)**                                 | **RS256 (Bất đối xứng)**                                                    |
| :----------------- | :--------------------------------------------------- | :-------------------------------------------------------------------------- |
| **Loại khóa**      | **Khóa bí mật chung** (Shared Secret)                | **Cặp khóa Public/Private**                                                 |
| **Tạo Token**      | Authorization Server (dùng Shared Secret)            | Authorization Server (dùng **Private Key**)                                 |
| **Xác thực Token** | Resource Server (dùng _cùng_ Shared Secret)          | Resource Server (dùng **Public Key**)                                       |
| **Lưu trữ khóa**   | Khóa bí mật phải được chia sẻ cho _tất cả_ server    | **Private Key** chỉ ở Auth Server. **Public Key** ở tất cả Resource Server. |
| **Rủi ro chính**   | Nếu 1 server bị xâm nhập, toàn bộ hệ thống thất thủ. | Nếu Auth Server bị xâm nhập (khó hơn nhiều).                                |
| **Độ phức tạp**    | Đơn giản, nhanh hơn về mặt tính toán.                | Phức tạp hơn, chậm hơn một chút do tính toán RSA.                           |

---

## 7\. Tổng kết

-   **Header** chứa `alg` (thuật toán) và `typ` (loại) để chỉ dẫn cho máy chủ cách xác thực token.
-   **Payload** chứa các **claims** (tuyên bố) về người dùng (`userID`, `isAdmin`) và các siêu dữ liệu (`iat`, `exp`, `iss`).
-   **Signature** là bằng chứng mật mã đảm bảo Header và Payload không bị giả mạo.
-   `**HS256**` (Đối xứng) dùng **một khóa bí mật chung** cho cả việc tạo và xác thực. Nó nhanh nhưng kém an toàn vì khóa phải được chia sẻ.
-   `**RS256**` (Bất đối xứng) dùng **Private Key** để ký (tạo) và **Public Key** để xác minh. Đây là lựa chọn an toàn vượt trội, đặc biệt cho các hệ thống microservices, vì chỉ Authorization Server mới có khả năng tạo token.
