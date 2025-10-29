Tiếp nối bài giới thiệu tổng quan, chúng ta sẽ đào sâu vào một trong những giao thức nền tảng cơ bản nhất để mã hóa giao tiếp: **TLS (Transport Layer Security)**.

Chúng ta phải xây dựng một tiêu chuẩn cho việc mã hóa, bởi vì chúng ta không thể cứ thế gửi các gói tin IP với dữ liệu ở dạng "trần trụi" (plaintext) mà bất kỳ ai trên mạng cũng có thể đọc được.

Chủ đề của bài giảng hôm nay là TLS. Rõ ràng là tôi không thể đi vào _mọi_ chi tiết, bởi vì TLS thực sự rất phong phú và có lịch sử lâu đời, nó xứng đáng có cả một khóa học riêng. Nhưng chúng ta sẽ dành khoảng 30 phút để thảo luận về các khái niệm cốt lõi.

---

### Mục lục

-   [1. TLS nằm ở đâu trong Mô hình OSI?](#1-tls-nằm-ở-đâu-trong-mô-hình-osi)
-   [2. HTTP "Trần" (Vanilla HTTP) - Vấn đề là gì?](#2-http-trần-vanilla-http---vấn-đề-là-gì)
-   [3. HTTPS (HTTP + TLS) - Giải pháp là gì?](#3-https-http--tls---giải-pháp-là-gì)
-   [4. Bài toán "Trao đổi Khóa" (The Key Problem)](#4-bài-toán-trao-đổi-khóa-the-key-problem)
-   [5. TLS 1.2 Handshake (Cách làm của RSA)](#5-tls-12-handshake-cách-làm-của-rsa)
-   [6. Lỗ hổng của RSA: Thiếu "Perfect Forward Secrecy"](#6-lỗ-hổng-của-rsa-thiếu-perfect-forward-secrecy)
-   [7. Giải pháp: Trao đổi khóa Diffie-Hellman (DH)](#7-giải-pháp-trao-đổi-khóa-diffie-hellman-dh)
-   [8. TLS 1.3 - Nhanh hơn, An toàn hơn](#8-tls-13---nhanh-hơn-an-toàn-hơn)
-   [9. Tổng kết](#9-tổng-kết)

---

## 1\. TLS nằm ở đâu trong Mô hình OSI?

Bạn có thể xây dựng TLS trên _bất kỳ_ giao thức nào, nhưng nó nằm ở đâu trong mô hình OSI?

Người ta tranh luận rằng vị trí tốt nhất để "nhét" nó vào là **Layer 5 (Lớp Phiên - Session Layer)**.

Tại sao? Bởi vì nó _có trạng thái_ (stateful). Nó phải quản lý trạng thái của các biến phiên (session variables), các khóa mã hóa đã được thống nhất, v.v., ngay bên trên **TCP (Layer 4)**. Nếu TCP là người vận chuyển, thì TLS là người quản lý phiên an toàn cho chuyến hàng đó.

(Một lần nữa, đây không phải là "ghi trên đá", nó chỉ là một cách phân loại mang tính học thuật).

---

## 2\. HTTP "Trần" (Vanilla HTTP) - Vấn đề là gì?

Hãy xem HTTP hoạt động như thế nào khi _không_ có mã hóa (thường là trên cổng 80).

1.  **Bắt tay TCP:** Client và Server thực hiện bắt tay 3 bước (SYN, SYN-ACK, ACK) để mở một kết nối TCP.
2.  **Gửi yêu cầu:** Client gửi một yêu cầu HTTP. Về cơ bản, nó là một tệp văn bản thuần túy:
    ```
    GET /index.html HTTP/1.1
    Host: example.com
    ...
    ```
3.  **Phân đoạn:** Yêu cầu này được chia thành các phân đoạn TCP (TCP segments), sau đó đóng gói thành các gói tin IP (IP packets) và gửi đi.
4.  **Phản hồi:** Server nhận được, hiểu yêu cầu, và gửi lại một phản hồi (cũng là văn bản thuần túy):

    ```
    HTTP/1.1 200 OK
    Content-Type: text/html

    <html>...</html>
    ```

> **Vấn đề chí mạng:**
> Mọi thứ đều là **plaintext**. Bất kỳ ai ở giữa (như Router, hoặc nhà cung cấp dịch vụ Internet - ISP, nơi mà tất cả các gói tin IP của bạn phải đi qua) đều có thể _nhìn thấy_ chính xác yêu cầu của bạn và nội dung trang web bạn nhận được.

---

## 3\. HTTPS (HTTP + TLS) - Giải pháp là gì?

Để khắc phục điều này, chúng ta sử dụng HTTPS (HTTP qua TLS). Luồng hoạt động có thêm một bước quan trọng:

1.  **Bắt tay TCP:** (Giống như trên).
2.  **Bắt tay TLS (TLS Handshake):** _Đây là bước mới\!_ Trước khi gửi bất kỳ dữ liệu HTTP nào, Client và Server thực hiện một loạt các bước đàm phán.
3.  **Mục tiêu của Handshake:** Mục tiêu cuối cùng của quá trình này là để cả Client và Server cùng sở hữu một **khóa đối xứng (symmetric key)** bí mật.
4.  **Giao tiếp an toàn:**
    -   Client dùng khóa bí mật này để _mã hóa_ yêu cầu `GET /...`.
    -   Gói tin được mã hóa đi qua mạng (ISP không thể đọc được).
    -   Server dùng _chính khóa bí mật đó_ để _giải mã_ yêu cầu.
    -   Server _mã hóa_ phản hồi (HTML,...) bằng khóa đó và gửi lại.

Câu hỏi là: Làm thế nào để Client và Server có thể trao đổi cái khóa bí mật đó một cách an toàn? Đây chính là "chìa khóa" (pun intended) của vấn đề.

---

## 4\. Bài toán "Trao đổi Khóa" (The Key Problem)

Chúng ta có hai loại thuật toán mã hóa chính:

| Loại               | Mã hóa Đối xứng (Symmetric)                                                                                           | Mã hóa Bất đối xứng (Asymmetric)                                                     |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **Cách hoạt động** | Dùng **cùng 1 khóa** để mã hóa và giải mã.                                                                            | Dùng 1 khóa để mã hóa (Public Key) và 1 khóa _khác_ để giải mã (Private Key).        |
| **Tốc độ**         | **Siêu nhanh.** (Thường dùng phép toán XOR, cực kỳ nhanh cho CPU).                                                    | **Siêu chậm.** (Dựa trên các phép toán mũ, rất tốn CPU và năng lượng).               |
| **Vấn đề**         | Làm thế nào để _chia sẻ_ cái khóa duy nhất đó một cách an toàn? (Bạn không thể gửi nó qua mạng, kẻ gian sẽ bắt được). | Rất chậm, không thể dùng để mã hóa lượng lớn dữ liệu (như một file JavaScript 16MB). |

> **Giải pháp thiên tài của TLS:**
> Chúng ta kết hợp cả hai\! (Mô tả quá trình)
>
> -   **You**: Hey Server, tui muốn kết nối an toàn.
> -   **Server**: OK, tui tạo Public key và gửi cho bạn ngay.
> -   **You**: OK! Đã nhận key. Để tui tạo một Symmetric key cho phiên này. Tui sẽ mã hóa nó bằng Public key của bạn và gửi lại.
> -   **Server**: Nhận được rồi! Tui dùng Private key của tui để giải mã và lấy ra Symmetric key.
>
> => Cả hai bên bây giờ đều có Symmetric key để mã hóa và giải mã dữ liệu. Mọi giao tiếp HTTP sau đó đều được mã hóa bằng Symmetric key này (siêu nhanh và an toàn).

---

## 5\. TLS 1.2 Handshake (Cách làm của RSA)

Đây là cách TLS 1.2 (phiên bản rất phổ biến) thường làm, sử dụng thuật toán **RSA** để trao đổi khóa.

1.  **Bắt tay TCP:** Xong.
2.  **Client Hello:** Client gửi tin nhắn đầu tiên: "Hi Server, tui muốn kết nối TLS. Các thuật toán tui hỗ trợ là: Trao đổi khóa bằng **RSA**, mã hóa đối xứng bằng **AES**..."
3.  **Server Hello:** Server trả lời: "OK. Chúng ta sẽ dùng RSA và AES. Đây là **Certificate (Chứng thư số)** của tui, và quan trọng nhất, bên trong nó có chứa **Public Key** của tui."
4.  **Client tạo bí mật:**
    -   Client kiểm tra Certificate (xem có tin cậy không, có đúng tên miền không, v.v.).
    -   Client _tự tạo ra_ một chuỗi byte bí mật (gọi là "pre-master", từ đó sẽ sinh ra cái "khóa vàng" - symmetric key).
    -   Client dùng **Public Key** (vừa nhận từ Server) để _mã hóa_ cái bí mật này.
5.  **Client gửi bí mật:** Client gửi cái cục bí mật đã được mã hóa này cho Server.
    -   _Kỳ diệu ở đây:_ Chỉ có Server (người giữ Private Key tương ứng) mới có thể giải mã được cục này. Bất kỳ ai ở giữa (ISP) có bắt được nó cũng vô dụng.
6.  **Server giải mã:** Server nhận được cục dữ liệu, nó dùng **Private Key** (tuyệt đối bí mật) của mình để _giải mã_ và lấy ra được bí mật mà Client đã tạo.
7.  **Hoàn tất:** Cả Client và Server bây giờ đều có cùng một bí mật "pre-master". Họ độc lập dùng bí mật này để sinh ra một bộ khóa đối xứng ("khóa vàng") giống hệt nhau.

Từ giờ, mọi giao tiếp HTTP sẽ được mã hóa bằng "khóa vàng" này.

---

## 6\. Lỗ hổng của RSA: Thiếu "Perfect Forward Secrecy"

Cách làm của RSA có một vấn đề _cực kỳ nghiêm trọng_ gọi là thiếu **Perfect Forward Secrecy (PFS) - Tính bảo mật chuyển tiếp hoàn hảo**.

Hãy xem xét kịch bản tấn công này:

1.  **Ghi âm:** Một kẻ tấn công (ví dụ: ISP hoặc hacker ở Starbucks) ngồi ở giữa và _ghi lại toàn bộ_ lưu lượng HTTPS của bạn trong suốt 1 năm. Tất cả đều đã được mã hóa, nên (tạm thời) vô dụng.
2.  **Đánh cắp khóa:** 1 năm sau, kẻ tấn công thực hiện một vụ hack (ví dụ: lỗ hổng **Heartbleed** nổi tiếng) và _trộm_ được cái **Private Key** (khóa bí mật lâu dài) của Server.
3.  **Thảm họa:**
    -   Kẻ tấn công giờ quay lại đống dữ liệu đã ghi âm từ 1 năm trước.
    -   Với _mỗi_ phiên kết nối, kẻ tấn công dùng cái Private Key vừa trộm được để _giải mã_ cái "pre-master" (ở bước 6).
    -   Có "pre-master", hắn sinh ra được "khóa vàng" của phiên đó.
    -   Hắn giải mã _toàn bộ_ cuộc hội thoại của bạn.

> **Ghi nhớ:**
> Vấn đề của RSA là: Nếu **Private Key** (lâu dài) của Server bị lộ, _tất cả các cuộc hội thoại trong quá khứ_ đều bị giải mã. Đó là lý do tại sao các nhà đăng ký (CA) đang rút ngắn thời hạn của Certificate xuống (3 tháng, thậm chí 2 tuần) để giảm thiểu rủi ro này.

---

## 7\. Giải pháp: Trao đổi khóa Diffie-Hellman (DH)

Để giải quyết vấn đề này, chúng ta cần một cách trao đổi khóa mà cái **Private Key** (lâu dài) của Server _không_ tham gia vào việc mã hóa "khóa vàng".

Chào mừng **Diffie-Hellman (DH)**. Đây là một phép toán kỳ diệu.

**Ý tưởng (giản lược tối đa):**

-   Mục tiêu là Client và Server cùng tính ra một con số bí mật chung **(G^XY)**.
-   Client tạo ra bí mật riêng **(X)**. Server tạo ra bí mật riêng **(Y)**.
-   Client tính **(G^X)** và gửi cho Server. Kẻ gian không thể tìm ra X từ G^X.
-   Server tính **(G^Y)** và gửi cho Client. Kẻ gian không thể tìm ra Y từ G^Y.
-   Client nhận (G^Y) và tính: **(G^Y)^X** = **G^XY**.
-   Server nhận (G^X) và tính: **(G^X)^Y** = **G^XY**.

**Luồng hoạt động (với DH):**

1.  **Client Hello:** "Hi Server, tui muốn dùng **Diffie-Hellman**. Đây là phần công khai của tui **(G^X)**."
2.  **Server Hello:** "OK. Đây là phần công khai của tui **(G^Y)** (và đây là Certificate của tui để chứng minh tui là ai)."
3.  **Hoàn tất:**
    -   Server tính ra khóa bí mật: (G^X)^Y = **G^XY**.
    -   Client tính ra khóa bí mật: (G^Y)^X = **G^XY**.

Cả hai bên đều có "khóa vàng" **(G^XY)**.

> **Tại sao điều này đạt được "Perfect Forward Secrecy"?**
> Kẻ tấn công ghi âm cuộc hội thoại chỉ thấy **G^X** và **G^Y**. Ngay cả khi 1 năm sau hắn _trộm được Private Key_ của Server, cái Private Key đó **hoàn toàn vô dụng**. Nó không dính dáng gì đến việc tạo ra G^XY. Các bí mật **X** và **Y** là _tạm thời_ (ephemeral), chúng chỉ tồn tại trong phiên đó và bị vứt bỏ. Kẻ tấn công không thể quay ngược thời gian để giải mã các phiên trong quá khứ.

---

## 8\. TLS 1.3 - Nhanh hơn, An toàn hơn

TLS 1.2 vẫn hỗ trợ RSA (vì lý do tương thích ngược), nhưng **TLS 1.3 (phiên bản hiện đại nhất)** đã "cấm cửa" RSA khỏi việc trao đổi khóa.

-   **An toàn hơn:** TLS 1.3 **bắt buộc** phải dùng các thuật toán có Perfect Forward Secrecy (như Diffie-Hellman, hoặc phiên bản xịn hơn là Elliptic Curve Diffie-Hellman - ECDH).
-   **Nhanh hơn (Chỉ 1-RTT):**
    -   TLS 1.2 (với RSA) cần 2 vòng trao đổi (2 round-trips) để hoàn tất handshake.
    -   TLS 1.3 (với DH) siêu hiệu quả. Ngay trong tin nhắn **Client Hello** đầu tiên, Client _đã gửi luôn_ phần (G^X) của mình. Nó không cần đàm phán, nó "giả định" luôn là Server sẽ dùng DH.
    -   Server nhận được, tạo ra Y, tính ra khóa, và gửi lại (G^Y) + Certificate.
    -   Bùm\! Xong. Chỉ **1 round-trip**.
-   **Siêu nhanh (0-RTT):** Nếu Client và Server đã từng nói chuyện với nhau trước đó, TLS 1.3 còn cho phép gửi dữ liệu HTTP (đã mã hóa) ngay trong tin nhắn đầu tiên (Client Hello) mà không cần chờ handshake.

---

## 9\. Tổng kết

-   **HTTP "Trần":** Không mã hóa, mọi người đều đọc được.
-   **HTTPS:** Là HTTP + TLS.
-   **TLS 1.2 (RSA):** Dùng cặp Public/Private Key của Server để trao đổi khóa đối xứng. **Vấn đề:** Không có Perfect Forward Secrecy. Cần 2 round-trip.
-   **TLS 1.3 (DH/ECDH):** Dùng Diffie-Hellman để cả hai bên cùng tính ra khóa đối xứng. **An toàn:** Có Perfect Forward Secrecy. **Nhanh:** Chỉ cần 1 round-trip (hoặc 0-RTT).

Hi vọng bài giảng này đã giúp bạn hiểu rõ hơn về "đường hầm" an toàn này\!

Bạn có muốn chúng ta tiếp tục tìm hiểu về vai trò của **Certificate (Chứng thư số)** và cách nó xác thực danh tính của máy chủ không?

[def]: https://www.google.com/search?q=%239-t%E1%BB%95ng-k%E1%BA%BFt
