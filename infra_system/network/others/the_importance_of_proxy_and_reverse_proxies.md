# Proxy vs. Reverse Proxy: Giải mã "Người gác cổng" Mạng

Khi tìm hiểu về mạng, một trong những câu hỏi phổ biến nhất là sự khác biệt giữa **Proxy** và **Reverse Proxy**. Mặc dù đây là một khóa học về mạng, việc hiểu rõ hai khái niệm này là cầu nối quan trọng để trở thành một kỹ sư backend, bởi vì các công cụ như API Gateway, Load Balancer, hay Service Mesh (Envoy, Linkerd) đều xoay quanh hai khái niệm nền tảng này.

Bài giảng này sẽ giải thích chi tiết, từ cấp độ cao đến các chi tiết mạng cấp thấp, về từng loại và tại sao chúng ta sử dụng chúng.

## Mục lục

1.  [Proxy là gì?](#1-proxy-là-gì)
2.  [Các trường hợp sử dụng Proxy](#2-các-trường-hợp-sử-dụng-proxy)
3.  [Reverse Proxy là gì?](#3-reverse-proxy-là-gì)
4.  [Các trường hợp sử dụng Reverse Proxy](#4-các-trường-hợp-sử-dụng-reverse-proxy)
5.  [Các câu hỏi thường gặp (FAQs)](#5-các-câu-hỏi-thường-gặp-faqs)
6.  [Tổng kết](#6-tổng-kết)

---

## 1. Proxy là gì?

**Proxy** (hay "Forward Proxy") là một máy chủ trung gian **thực hiện các yêu cầu thay mặt cho bạn** (client).

> **Ví dụ trừu tượng (Người Quản gia):**
>
> -   **Bạn (Client):** Muốn lấy một cuốn sách từ Thư viện (ví dụ: `google.com`).
> -   **Đích đến:** Bạn _biết rõ_ địa chỉ Thư viện là `google.com`.
> -   **Người Quản gia (Proxy):** Bạn không tự đi. Thay vào đó, bạn nói với người Quản gia (`my-proxy.com`): "Hãy đến `google.com` và lấy cuốn sách này cho tôi."
> -   **Hành động:** Người Quản gia _tự mình_ đi đến Thư viện, lấy sách và mang về cho bạn.
> -   **Kết quả:** Thư viện (`google.com`) chỉ biết rằng ông Quản gia (`my-proxy.com`) đã đến lấy sách. Họ _không hề biết_ cuốn sách đó là dành cho bạn.

### 1.1. Luồng hoạt động Kỹ thuật

Hãy xem xét điều gì xảy ra ở các lớp mạng:

1.  **Bước 1: Cấu hình:** Máy Client (bạn) được cấu hình để "biết" hai thứ:
    -   Đích đến cuối cùng (ví dụ: `google.com`).
    -   Địa chỉ của máy chủ Proxy (ví dụ: `my-proxy.com`).
2.  **Bước 2: Kết nối Client -> Proxy:** Khi bạn truy cập `google.com`, máy của bạn _không_ tạo kết nối TCP với `google.com`. Thay vào đó, nó tạo một **kết nối TCP** với `my-proxy.com`.
3.  **Bước 3: Gửi yêu cầu (Lớp 7):** Bên trong kết nối TCP đó, bạn gửi một yêu cầu Lớp 7 (ví dụ: `GET google.com ...`).
4.  **Bước 4: Kết nối Proxy -> Server:** Máy chủ Proxy nhận yêu cầu của bạn, "quay lại", và tạo một **kết nối TCP hoàn toàn mới** từ chính nó (với IP của Proxy) đến `google.com`.
5.  **Bước 5: Che giấu (Lớp 4):** Từ góc độ Lớp 4 (TCP/IP), `google.com` _chỉ_ thấy kết nối đến từ IP của Proxy. Nó hoàn toàn không biết gì về IP gốc của bạn.

> **Định nghĩa (Proxy):**
>
> -   **Client (Bạn) BIẾT** máy chủ đích cuối cùng (Thư viện).
> -   **Máy chủ (Thư viện) KHÔNG BIẾT** Client gốc là ai (chỉ thấy Quản gia).

> **Câu hỏi hay:** Máy chủ có _thực sự_ không biết Client là ai?
> **Trả lời:** Ở Lớp 4 (TCP/IP) thì không. Nhưng ở Lớp 7 (HTTP), Proxy _có thể_ chọn cách "mách" cho máy chủ đích bằng cách thêm một header đặc biệt, ví dụ: `X-Forwarded-For: [IP_gốc_của_bạn]`.

---

## 2. Các trường hợp sử dụng Proxy

Tại sao chúng ta lại cần "người quản gia" này?

-   **Anonymity (Ẩn danh):** Ẩn địa chỉ IP thật của bạn khỏi máy chủ đích. Tuy nhiên, bạn phải tin tưởng Proxy (vì Proxy biết bạn là ai).
-   **Caching (Bộ nhớ đệm):** Các Proxy trong tổ chức (trường học, công ty) có thể lưu cache các trang web tĩnh. Nếu 1000 sinh viên cùng truy cập một trang, Proxy chỉ cần tải nó một lần và phục vụ 999 người còn lại từ cache.
-   **Block Sites (Chặn trang web):** Rất phổ biến trong các tổ chức. Vì mọi traffic đều đi qua Proxy, Proxy có thể "nhìn" vào yêu cầu (ví dụ: `GET facebook.com`) và từ chối, chặn truy cập.
-   **Logging & Monitoring (Ghi log & Giám sát):** Đây là khái niệm cốt lõi của **Service Mesh (Lưới dịch vụ)**. Mỗi ứng dụng (microservice) sẽ có một "sidecar proxy" (như Envoy) chạy bên cạnh. Mọi request đi ra/đi vào ứng dụng đều phải đi qua Proxy này, cho phép ghi log, đo lường độ trễ, và theo dõi.
-   **Debugging (Gỡ lỗi):** Các công cụ như **Fiddler** hay Charles Proxy hoạt động như một Proxy. Chúng đứng giữa ứng dụng của bạn và Internet, cho phép bạn "nhìn trộm" và thậm chí là giải mã (decrypt) các yêu cầu HTTPS để gỡ lỗi.

---

## 3. Reverse Proxy là gì?

**Reverse Proxy (Proxy Đảo ngược)** là khái niệm _hoàn toàn ngược lại_ với Proxy.

> **Ví dụ trừu tượng (Người Lễ tân Tổng đài):**
>
> -   **Bạn (Client):** Muốn gọi điện cho một công ty lớn (ví dụ: `google.com`).
> -   **Đích đến:** Bạn _chỉ biết_ số Tổng đài duy nhất (`google.com`). Bạn _không hề biết_ số máy lẻ của phòng Kế toán hay phòng Nhân sự.
> -   **Người Lễ tân (Reverse Proxy):** Người Lễ tân (`google.com`) nhấc máy. Đây là "máy chủ" duy nhất mà bạn nói chuyện.
> -   **Hành động:** Bạn nói: "Tôi muốn gặp phòng Kế toán" (ví dụ: truy cập `/api/billing`). Người Lễ tân sẽ _tự động chuyển hướng_ cuộc gọi của bạn đến máy chủ Kế toán (backend-server-1). Nếu bạn nói "Tôi muốn xem tin tức" (truy cập `/news`), Lễ tân sẽ chuyển bạn đến máy chủ Tin tức (backend-server-2).
> -   **Kết quả:** Bạn (Client) hoàn toàn không biết rằng mình đang nói chuyện với các máy chủ backend khác nhau. Bạn chỉ nghĩ rằng mình đang nói chuyện với `google.com`.

### 3.1. Luồng hoạt động Kỹ thuật

1.  **Bước 1: Kết nối Client -> Reverse Proxy:** Client tạo một kết nối TCP đến `google.com`, và _tin rằng_ đây chính là máy chủ cuối cùng sẽ phục vụ mình.
2.  **Bước 2: Ẩn giấu Backend:** Client _hoàn toàn không biết_ về sự tồn tại của các máy chủ backend thực sự (ví dụ: `app-server-1`, `app-server-2`).
3.  **Bước 3: Kết nối Reverse Proxy -> Backend:** Reverse Proxy (ví dụ: Nginx, HAProxy) nhận yêu cầu. Dựa trên các quy tắc (ví dụ: đường dẫn, header), nó "quay lại" và tạo một **kết nối TCP mới** đến một máy chủ backend (mà nó lựa chọn) để xử lý yêu cầu.

> **Định nghĩa (Reverse Proxy):**
>
> -   **Client (Bạn) KHÔNG BIẾT** máy chủ đích thực sự (Kế toán, Nhân sự).
> -   **Client (Bạn) CHỈ BIẾT** Reverse Proxy (Tổng đài) và coi đó là đích đến cuối cùng.

---

## 4. Các trường hợp sử dụng Reverse Proxy

Đây là một khái niệm cực kỳ mạnh mẽ và là nền tảng của kiến trúc web hiện đại:

-   **Load Balancing (Cân bằng tải):** Trường hợp sử dụng phổ biến nhất. Reverse Proxy đứng trước 5 máy chủ backend giống hệt nhau và phân phối các yêu cầu đến (round-robin, least connections, v.v.) để đảm bảo không máy chủ nào bị quá tải.
-   **Ingress / API Gateway:** Cổng vào của kiến trúc **Microservices**. Reverse Proxy (như Kubernetes Ingress) đọc đường dẫn URL và điều hướng thông minh:
    -   `GET /api/posts` -> Chuyển đến Dịch vụ Post (Post Service).
    -   `GET /api/messages` -> Chuyển đến Dịch vụ Tin nhắn (Message Service).
-   **Caching (Bộ nhớ đệm):** Một **CDN (Content Delivery Network)** về cơ bản là một "Reverse Proxy được tôn vinh". Nó là một Reverse Proxy đặt cache (ví dụ: ảnh, video) ở các vị trí địa lý gần người dùng, sau đó nó sẽ kết nối về máy chủ gốc (origin server) ở Mỹ để lấy nội dung nếu cache không có.
-   **Canary Deployment (Triển khai Canary):** Cho phép bạn kiểm thử tính năng mới một cách an toàn. Bạn cấu hình Reverse Proxy để:
    -   90% request đi đến các server đang chạy code cũ (v9).
    -   10% request đi đến 1 server duy nhất chạy code mới (v10).
-   **Authentication (Xác thực):** Reverse Proxy có thể xử lý việc xác thực (ví dụ: kiểm tra JWT token) ngay tại "cổng vào", trước khi cho phép bất kỳ yêu cầu nào đi vào hệ thống microservice bên trong.

---

## 5. Các câu hỏi thường gặp (FAQs)

> **Câu hỏi hay:** Có thể sử dụng Proxy và Reverse Proxy cùng một lúc không?
> **Trả lời:** Có. Bạn (Client) _biết_ mình đang dùng Proxy (vì bạn tự cấu hình nó trong trình duyệt hoặc hệ điều hành). Nhưng bạn _không thể biết_ liệu máy chủ đích (ví dụ `google.com`) có phải là một Reverse Proxy hay không. Hoàn toàn có thể xảy ra trường hợp: Bạn (Client) -> Proxy của công ty bạn -> Internet -> Reverse Proxy (Load Balancer) của Google -> Backend Server của Google.

> **Câu hỏi hay:** Tôi có thể dùng Proxy thay cho VPN để ẩn danh không?
> **Trả lời:** Đây là một ý không hay, vì chúng hoạt động ở các lớp khác nhau.
>
> -   **Proxy** (như HTTP Proxy) thường hoạt động ở Lớp 4 hoặc Lớp 7. Nó _cần biết_ giao thức bạn đang dùng (HTTP, SOCKS) và _có thể_ nhìn thấy nội dung traffic của bạn (vì nó giải mã yêu cầu để đọc URL, header).
> -   **VPN** hoạt động ở Lớp 3 (IP). Nó _mã hóa toàn bộ_ gói tin IP và không quan tâm bên trong là giao thức gì. Do đó, VPN an toàn hơn cho việc ẩn danh.

> **Câu hỏi hay:** Proxy có phải chỉ dành cho traffic HTTP không?
> **Trả lời:** Không. HTTP Proxy là phổ biến nhất, nhưng cũng có các loại khác như SOCKS Proxy, TCP Proxy, v.v.
>
> **Ghi nhớ (Bonus):** Ngay cả với HTTPS, có một chế độ đặc biệt gọi là **HTTP Tunnel (Đường hầm HTTP)**. Client gửi một lệnh `CONNECT` đến Proxy (ví dụ: `CONNECT google.com:443`). Proxy sẽ mở một "đường ống TCP" (dumb pipe) từ Client đến Server. Sau đó, Client thực hiện bắt tay TLS/SSL _xuyên qua_ đường hầm đó. Trong chế độ này, Proxy chỉ truyền byte qua lại và _không thể_ đọc được nội dung đã bị mã hóa.

---

## 6. Tổng kết

Cách đơn giản nhất để ghi nhớ:

-   **Proxy (Người Quản gia):**

    -   Là đại diện cho **Client**.
    -   Client _biết_ đích đến cuối cùng.
    -   Máy chủ _không biết_ Client gốc.
    -   Thường dùng để: Ẩn danh, Chặn web, Gỡ lỗi, Giám sát (Sidecar).

-   **Reverse Proxy (Người Lễ tân):**
    -   Là đại diện cho **Server**.
    -   Client _không biết_ đích đến thực sự (chỉ biết Lễ tân).
    -   Thường dùng để: Cân bằng tải, API Gateway, Caching (CDN), Xác thực.
