# Tấn công và Phòng thủ trong JWT

Các lỗ hổng liên quan đến **JSON Web Token (JWT)** thường không xuất phát từ bản thân tiêu chuẩn, mà từ việc triển khai và cấu hình không an toàn ở phía máy chủ (server-side). Tài liệu này sẽ phân tích các kiểu tấn công phổ biến nhất và cách phòng chống chúng.

## Mục lục

1.  [Tấn công Thuật toán `none`](#1-tấn-công-thuật-toán-none)
2.  [Tấn công Lược bỏ Chữ ký (Signature Stripping)](#2-tấn-công-lược-bỏ-chữ-ký-signature-stripping)
3.  [Tấn công Bẻ khóa Khóa bí mật yếu](#3-tấn-công-bẻ-khóa-khóa-bí-mật-yếu)
4.  [Tấn công Thay thế Thuật toán (Algorithm Substitution)](#4-tấn-công-thay-thế-thuật-toán-algorithm-substitution)
5.  [Các Biện pháp Phòng thủ](#5-các-biện-pháp-phòng-thủ)
6.  [Tổng kết](#6-tổng-kết)

---

## 1. Tấn công Thuật toán `none`

Tiêu chuẩn JWT hỗ trợ một thuật toán đặc biệt là `**none**`. Đúng như tên gọi, nếu header của token chỉ định `{"alg": "none"}`, điều đó có nghĩa là token này **không có chữ ký (unsigned)**.

> **Vấn đề:** Nếu máy chủ được cấu hình để chấp nhận thuật toán `none`, kẻ tấn công có thể tự tạo ra bất kỳ token giả mạo nào và máy chủ sẽ không có cách nào để xác minh xem payload có bị giả mạo hay không.

### 1.1. Luồng tấn công

Giả sử mục tiêu của kẻ tấn công là mạo danh người dùng `admin`, trong khi hắn chỉ có tài khoản của người dùng `user`.

1.  **Bước 1: Lấy token mẫu:** Kẻ tấn công đăng nhập với tư cách `user` và nhận được một token.
2.  **Bước 2: Phân tích token:** Hắn giải mã Base64URL các phần của token.
    -   **Header gốc:** `{"alg": "HS256", "typ": "JWT"}`
    -   **Payload gốc:** `{"userID": "user"}`
3.  **Bước 3: Tạo Header giả mạo:** Kẻ tấn công tạo một Header mới, thay đổi thuật toán thành `none`.
    -   **Header mới (JSON):** `{"alg": "none", "typ": "JWT"}`
4.  **Bước 4: Tạo Payload giả mạo:** Kẻ tấn công tạo một Payload mới với thông tin hắn muốn.
    -   **Payload mới (JSON):** `{"userID": "admin"}`
5.  **Bước 5: Tạo token giả mạo:** Hắn mã hóa Base64URL Header và Payload mới, sau đó ghép chúng lại. Token này sẽ không có phần chữ ký.
    -   **Token giả mạo:** `Base64Url(Header mới).Base64Url(Payload mới)`
6.  **Bước 6: Gửi yêu cầu:** Kẻ tấn công dùng token giả mạo này để gọi một API yêu cầu quyền admin.
7.  **Kết quả:** Máy chủ đọc Header, thấy `alg: none`, và quyết định **bỏ qua hoàn toàn việc xác minh chữ ký**. Nó tin tưởng Payload và cấp quyền truy cập của `admin` cho kẻ tấn công.

---

## 2. Tấn công Lược bỏ Chữ ký (Signature Stripping)

Đây là một biến thể của cuộc tấn công `none`, nhắm vào các máy chủ được cấu hình lỏng lẻo: máy chủ _tạo ra_ token dùng thuật toán an toàn (như `HS256`) nhưng lại _chấp nhận_ cả `HS256` và `none` khi xác thực.

Kẻ tấn công "lược bỏ" chữ ký hợp lệ và thay đổi header để lừa máy chủ sử dụng thuật toán `none`.

### 2.1. Luồng tấn công

1.  **Bước 1: Lấy token hợp lệ:** Kẻ tấn công đăng nhập với tư cách `user` và nhận được một token `HS256` hợp lệ (có 3 phần `header.payload.signature`).
2.  **Bước 2: Tạo Header giả mạo:** Kẻ tấn công tạo JSON mới `{"alg": "none", "typ": "JWT"}` và mã hóa Base64URL.
3.  **Bước 3: Tạo Payload giả mạo:** Kẻ tấn công tạo JSON mới `{"userID": "admin"}` và mã hóa Base64URL.
4.  **Bước 4: Tạo token giả mạo:** Hắn ghép các phần đã sửa đổi và thêm một dấu chấm ở cuối để token trông có vẻ như có 3 phần (nhưng phần chữ ký là rỗng): `[header_giả_mạo].[payload_giả_mạo].`
5.  **Bước 5: Gửi yêu cầu:** Gửi token giả mạo này đến máy chủ.
6.  **Kết quả:** Máy chủ vẫn chấp nhận token và cấp quyền của `admin`.

> **Câu hỏi hay:** Tại sao máy chủ lại chấp nhận token `none` trong khi nó tạo ra token `HS256`?
> **Trả lời:** Lỗ hổng nằm ở việc máy chủ cho phép client **quyết định thuật toán xác thực**. Mã nguồn phía máy chủ định nghĩa một danh sách các thuật toán được phép, bao gồm cả `none`.
>
> ```javascript
> // api.js - Định nghĩa các thuật toán được phép
> const allowedAlgs = ['none', 'HS256'];
>
> // Thư viện JWT sẽ kiểm tra `alg` từ token của client
> // và thấy 'none' nằm trong danh sách được phép.
> const decoded = jwt.verify(token, secret, { algorithms: allowedAlgs });
> ```
>
> Khi thư viện JWT thực hiện xác thực, nó thấy client gửi lên `alg: none`, đối chiếu thấy `none` có trong danh sách `allowedAlgs`, và do đó nó bỏ qua việc xác minh chữ ký.

---

## 3. Tấn công Bẻ khóa Khóa bí mật yếu

Cuộc tấn công này nhắm vào thuật toán đối xứng như `HS256`. Thuật toán này dựa vào một **Khóa bí mật chung (Shared Secret)** duy nhất. Nếu khóa bí mật này yếu (ví dụ: "secret", "123456", hoặc một từ trong từ điển), kẻ tấn công có thể sử dụng tấn công **Vét cạn (Brute-force)** để tìm ra nó.

### 3.1. Luồng tấn công

1.  **Bước 1: Lấy token HS256:** Kẻ tấn công có được một token `HS256` hợp lệ bất kỳ do máy chủ cấp.
2.  **Bước 2: Chạy công cụ Brute-force:** Kẻ tấn công sử dụng một công cụ như `jwt-cracker`, cung cấp token và một bộ ký tự/từ điển.
    ```bash
    # Ví dụ lệnh tấn công với một token và bộ ký tự
    jwt-cracker <token_HS256> abcdef123456 6
    ```
3.  **Bước 3: Tìm ra khóa:** Công cụ sẽ thử ký lại token với mọi tổ hợp ký tự cho đến khi tìm thấy một chữ ký trùng khớp. Nếu khóa yếu (ví dụ: `123456`), nó sẽ bị tìm thấy rất nhanh.
4.  **Kết quả:** Khi đã có **Khóa bí mật chung**, kẻ tấn công có toàn quyền. Hắn có thể tự tạo (ký) bất kỳ token `HS256` hợp lệ nào với bất kỳ payload nào (ví dụ: `{"userID": "admin", "isAdmin": true}`) và máy chủ sẽ tin tưởng chúng 100%.

---

## 4. Tấn công Thay thế Thuật toán (Algorithm Substitution)

Đây là một cuộc tấn công tinh vi, còn được gọi là **Tấn công Nhầm lẫn Thuật toán (Algorithm Confusion Attack)**. Nó "lừa" máy chủ sử dụng thuật toán đối xứng `HS256` trong khi máy chủ nghĩ rằng nó đang dùng thuật toán bất đối xứng `RS256`.

> **Bối cảnh:**
>
> -   Máy chủ được cấu hình để dùng `RS256`.
> -   Nó dùng **Khóa riêng tư (Private Key)** để _ký_ token.
> -   Nó dùng **Khóa công khai (Public Key)** để _xác thực_ token.
> -   `Public Key` thường được coi là công khai và kẻ tấn công có thể lấy được.

### 4.1. Luồng tấn công

1.  **Bước 1: Lấy token RS256 và Public Key:** Kẻ tấn công lấy token mẫu (Header là `{"alg": "RS256"}`) và bằng cách nào đó lấy được `Public Key` của máy chủ.
2.  **Bước 2: Tạo Header giả mạo:** Tạo Header mới, thay `RS256` bằng `HS256`.
    -   **Header mới:** `{"alg": "HS256", "typ": "JWT"}`
3.  **Bước 3: Tạo Payload giả mạo:** Tạo Payload mới với `{"userID": "admin"}`.
4.  **Bước 4: Ký token giả mạo (Mấu chốt):** Kẻ tấn công tạo một chữ ký mới bằng cách:
    -   **Thuật toán:** `HS256` (như đã khai báo trong Header giả mạo).
    -   **Dữ liệu:** `Base64(Header mới) + "." + Base64(Payload mới)`.
    -   **Khóa bí mật:** Dùng chính cái `Public Key` của máy chủ làm khóa bí mật.
5.  **Bước 5: Gửi yêu cầu:** Gửi token `HS256` giả mạo này đến máy chủ.
6.  **Kết quả:** Máy chủ chấp nhận token và cấp quyền của `admin`.

> **Câu hỏi hay:** Tại sao máy chủ lại chấp nhận chữ ký `HS256` được ký bằng `Public Key`?
> **Trả lời:** Lỗi cấu hình nghiêm trọng. Máy chủ được lập trình để chấp nhận _cả hai_ `RS256` và `HS256`, và (đây là mấu chốt) nó dùng _cùng một biến khóa_ (trong trường hợp này là `publicKey`) cho cả hai trường hợp.
>
> ```javascript
> // Lỗi 1: Chấp nhận cả hai thuật toán
> const allowedAlgs = ['RS256', 'HS256'];
>
> // Lỗi 2: Dùng biến publicKey cho cả hai trường hợp
> // Thư viện sẽ đọc `alg: 'HS256'` từ token và dùng publicKey như một khóa bí mật
> const decoded = jwt.verify(token, publicKey, { algorithms: allowedAlgs });
> ```
>
> **Giải thích:**
>
> 1.  Máy chủ nhận token, đọc Header thấy `alg: HS256`.
> 2.  Nó kiểm tra mảng `allowedAlgs`, thấy `HS256` được phép.
> 3.  Nó gọi hàm `verify`, yêu cầu thư viện JWT xác thực token bằng thuật toán `HS256` và dùng khóa là `publicKey`.
> 4.  Vì kẻ tấn công cũng dùng chính `publicKey` đó để _tạo_ chữ ký `HS256`, nên việc xác thực thành công. Máy chủ đã bị "lừa" sử dụng Public Key như một Shared Secret.

---

## 5. Các Biện pháp Phòng thủ

Để ngăn chặn các cuộc tấn công đã thảo luận, cần tuân thủ các nguyên tắc bảo mật nghiêm ngặt khi triển khai JWT.

-   **Chống thuật toán `none` & Lược bỏ Chữ ký:**
    -   Khi xác thực token, **không bao giờ** đưa `none` vào danh sách trắng (whitelist) các thuật toán được phép. Luôn chỉ định thuật toán mong muốn một cách tường minh.
-   **Chống Bẻ khóa Khóa yếu:**
    -   Khi sử dụng `HS256`, luôn dùng một **Khóa bí mật chung** mạnh, dài, và được tạo ngẫu nhiên. Không dùng các mật khẩu yếu, dễ đoán.
-   **Chống Tấn công Thay thế (Substitution Attack):**
    -   **Cách 1 (Tốt nhất):** Chỉ định _chính xác một_ thuật toán được phép khi xác thực. Nếu hệ thống của bạn dùng `RS256`, hàm xác thực phải _chỉ_ chấp nhận `RS256`.
    -   **Cách 2 (Nếu bắt buộc hỗ trợ nhiều thuật toán):** Phải viết logic nghiệp vụ riêng biệt để xử lý từng thuật toán. Kiểm tra giá trị `alg` _trước_, sau đó gọi một hàm xác thực riêng (ví dụ: `validate_rs256()` dùng Public Key, `validate_hs256()` dùng Shared Secret). Không bao giờ dùng chung một hàm `verify` và một biến khóa cho nhiều thuật toán.

---

## 6. Tổng kết

-   Các lỗ hổng JWT phổ biến nhất xuất phát từ việc cấu hình sai phía máy chủ, không phải từ bản thân tiêu chuẩn.
-   Không bao giờ tin tưởng vào trường `alg` trong Header do client cung cấp.
-   Luôn thực thi một thuật toán cụ thể (ví dụ: `RS256`) phía máy chủ và bỏ qua những gì client khai báo.
-   Không bao giờ đưa `alg: none` vào danh sách các thuật toán được phép xác thực.
-   Sử dụng khóa mật mã mạnh và quản lý chúng một cách an toàn.
-   Khi dùng `RS256`, đảm bảo logic xác thực chỉ dùng `Public Key` để xác thực chữ ký `RS256`, và không bao giờ dùng nó làm khóa bí mật cho `HS256`.
