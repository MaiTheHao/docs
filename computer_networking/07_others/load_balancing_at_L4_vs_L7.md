# Cân bằng tải Lớp 4 (L4) vs. Lớp 7 (L7): Cuộc chiến giữa Tốc độ và Trí thông minh

## Mục lục

*   [1. Load Balancer là gì?](#load-balancer-là-gì)
*   [2. Cân bằng tải Lớp 4 (L4): Người Giao hàng Tốc độ](#cân-bằng-tải-lớp-4-l4-người-giao-hàng-tốc-độ)
*   [3. Ưu và Nhược điểm của L4](#ưu-và-nhược-điểm-của-l4)
*   [4. Cân bằng tải Lớp 7 (L7): Người Quản lý Thông minh](#cân-bằng-tải-lớp-7-l7-người-quản-lý-thông-minh)
*   [5. Ưu và Nhược điểm của L7](#ưu-và-nhược-điểm-của-l7)
*   [6. Tổng kết](#tổng-kết)

---
## 1. Load Balancer là gì?

Một **Bộ cân bằng tải (Load Balancer - LB)** là một hệ thống được thiết kế để có **khả năng chịu lỗi (fault tolerant)**.

Từ góc độ của Client, bạn chỉ nói chuyện với _một_ địa chỉ duy nhất (của LB). Nhưng đằng sau đó, LB sẽ âm thầm nói chuyện với _rất nhiều_ máy chủ backend để xử lý yêu cầu của bạn.

> **Công thức:**
>
> **Load Balancer = Reverse Proxy + Logic Cân bằng tải**
>
> _Giải thích:_ Mọi Load Balancer đều là một Reverse Proxy, nhưng không phải mọi Reverse Proxy đều là Load Balancer. Một Reverse Proxy đơn thuần có thể chỉ chuyển tiếp yêu cầu đến _một_ backend, trong khi Load Balancer _bắt buộc_ phải có logic (như Round Robin, Least Connections) để phân phối yêu cầu cho _nhiều_ backend.

---

## 2. Cân bằng tải Lớp 4 (L4): Người Giao hàng Tốc độ

Một Bộ cân bằng tải Lớp 4 hoạt động ở **Lớp Vận chuyển (Transport Layer)**.

Điều này có nghĩa là nó chỉ "nhìn thấy" thông tin của Lớp 4: **Địa chỉ IP** và **Cổng (Port)**. Nó _hoàn toàn không biết_ (và không cần biết) nội dung bên trong các gói tin là gì. Đối với nó, HTTP, gRPC, hay WebSocket đều chỉ là một dòng chảy của các **segment (phân đoạn)** dữ liệu.

> **Ví dụ trừu tượng (Bưu điện Lớp 4):**
>
> -   **Nhiệm vụ:** Một nhân viên giao hàng (LB L4) chỉ nhìn vào **địa chỉ IP và cổng (port)** - giống như chỉ nhìn vào **màu sắc của phong bì**.
> -   **Quy tắc:** "Tất cả phong bì màu xanh (Client Connection A) phải được giao cho Người đưa thư 1 (Backend Connection 1)."
> -   **Hành động:** Nhân viên này _không mở thư_, _không đọc nội dung_ (không đọc HTTP path). Anh ta chỉ chuyển tiếp (forward) các segment một cách "mù quáng". Cứ thấy phong bì xanh là đưa cho Người 1. Cực kỳ nhanh, nhưng "ngốc".

### 2.1. Cơ chế Hoạt động Cốt lõi (Sticky Connection)

Đây là điểm mấu chốt của L4:

1.  **"Làm ấm" (Warm-up):** Khi LB khởi động, nó tạo sẵn các kết nối TCP đến các máy chủ backend (ví dụ: 10 kết nối đến mỗi backend) và giữ "ấm" chúng.
2.  **Client Kết nối:** Khi một Client tạo kết nối TCP mới đến LB, logic cân bằng tải được kích hoạt.
3.  **Ánh xạ 1:1:** LB sẽ chọn _một_ trong các kết nối backend (đã "làm ấm") và "ghép cặp" (map) nó với kết nối của Client.
4.  **Dính chặt (Sticky):** Kể từ thời điểm đó, **TẤT CẢ** các segment dữ liệu từ Client trên kết nối đó _bắt buộc_ phải được chuyển tiếp đến _chính xác_ kết nối backend đã được ghép cặp.

LB L4 không thể gửi segment 1 đến backend A và segment 2 đến backend B, vì điều đó sẽ phá vỡ hoàn toàn kết nối TCP (lỗi sequence number, v.v.). Do đó, nó "dính chặt" theo kết nối.

---

## 3. Ưu và Nhược điểm của L4

| Ưu điểm (Pros)                                                                                                                                                                              | Nhược điểm (Cons)                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Đơn giản & Siêu hiệu quả (Nhanh):** Không cần đọc hay "hiểu" dữ liệu L7. Chỉ đọc IP/port. Nó chỉ đọc và ghi (read/write) segment, không cần buffering.                                    | **Không cân bằng tải "thông minh":** Không thể đọc URL (ví dụ: `/api/analyze`) để điều hướng đến một máy chủ "khỏe" hơn.                                                                                                |
| **An toàn hơn (Không giải mã):** Không cần "chạm" vào nội dung. Không cần giải mã TLS (gần như là end-to-end).                                                                              | **"Dính chặt" (Sticky) theo kết nối:** Mọi segment trên cùng 1 kết nối _phải_ đi đến 1 máy chủ duy nhất. Không thể cân bằng tải _bên trong_ một kết nối.                                                                |
| **Hỗ trợ MỌI giao thức (Protocol Agnostic):** Đây là vẻ đẹp của L4. Vì nó không quan tâm nội dung, nó có thể chuyển tiếp MySQL, PostgreSQL, gRPC, WebSocket... bất cứ thứ gì chạy trên TCP. | **Không thể Caching:** Vì không đọc được nội dung, nó không biết cái gì có thể cache được (ví dụ: một request `GET /image.jpg`).                                                                                        |
| (Có thể dùng chế độ NAT để tạo 1 kết nối TCP duy nhất)                                                                                                                                      | **Nguy hiểm khi "hạ cấp" (Downgrade):** Khi một L7 LB gặp giao thức lạ (như `Upgrade: WebSocket`), nó có thể bị "hạ cấp" xuống L4. Điều này _bỏ qua_ mọi quy tắc bảo mật L7 (như chặn header, auth) mà bạn đã cấu hình. |

---

## 4. Cân bằng tải Lớp 7 (L7): Người Quản lý Thông minh

Một Bộ cân bằng tải Lớp 7 hoạt động ở **Lớp Ứng dụng (Application Layer)**.

Điều này có nghĩa là nó **phụ thuộc vào giao thức (protocol-specific)**. Nó _bắt buộc_ phải "hiểu" được ngôn ngữ của ứng dụng, ví dụ như **HTTP**, **gRPC**, v.v.

> **Ví dụ trừu tượng (Bưu điện Lớp 7):**
>
> -   **Nhiệm vụ:** Một người quản lý bưu điện (LB L7) _bắt buộc_ phải **mở từng phong bì** (giải mã TLS) và **đọc kỹ nội dung** (buffer và parse HTTP).
> -   **Quy tắc:** "OK, thư này (Request 1) từ anh A đòi xem `/billing`, chuyển cho phòng Kế toán (Backend 1). Thư tiếp theo (Request 2), cũng từ anh A, đòi xem `/images`, chuyển cho kho Ảnh (Backend 2)."
> -   **Hành động:** Anh ta thông minh, có thể ra quyết định phức tạp, nhưng _chậm hơn_ vì phải đọc thư. Và anh ta phải biết _thứ tiếng_ của lá thư (phải hiểu giao thức HTTP).

### 4.1. Cơ chế Hoạt động Cốt lõi (Buffering & Decryption)

Đây là điểm khác biệt lớn nhất so với L4:

1.  **Buffering (Đệm):** L7 LB _không_ chuyển tiếp (forward) từng segment. Thay vào đó, nó **nhận và đệm** tất cả các segment (ví dụ: segment 1, 2, 3) cho đến khi nó ráp lại được một **yêu cầu logic (logical request)** hoàn chỉnh (ví dụ: một request `GET /api/v1` đầy đủ, từ dòng đầu tiên đến hết header).
2.  **TLS Termination (Chấm dứt TLS):** Để đọc được nội dung (ví dụ `GET /api/v1`), L7 LB _bắt buộc_ phải **giải mã (decrypt)** traffic. Điều này có nghĩa là kết nối TLS/SSL của Client sẽ _kết thúc_ tại LB. LB sẽ "giả vờ" là máy chủ web. Do đó, bạn phải cài đặt Certificate và Private Key của mình lên LB.
3.  **Ra quyết định (Smart Routing):** _Sau khi_ đã có request hoàn chỉnh, L7 LB sẽ đọc nội dung (ví dụ: path, header) và _lúc này mới_ quyết định chọn một backend server để gửi request đó đến.

> **Ghi nhớ:**
>
> Trên L4, 1 Client Connection -> 1 Backend Connection.
>
> Trên L7, nhiều _requests_ từ _cùng 1 Client Connection_ có thể được gửi đến _nhiều Backend Server khác nhau_. (ví dụ: `GET /v2` trên cùng kết nối có thể được gửi đến một server khác với `GET /v1`).

---

## 5. Ưu và Nhược điểm của L7

| Ưu điểm (Pros)                                                                                                                                                                                                      | Nhược điểm (Cons)                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cân bằng tải thông minh:** Có thể đọc URL (path-based routing), header, cookie để điều hướng. Rất quan trọng cho **Microservices** / **API Gateway** (ví dụ: `/posts` -> Post service, `/users` -> User service). | **Đắt đỏ & Tốn kém (CPU):** Phải làm nhiều việc hơn: buffering, parsing (phân tích cú pháp), và đặc biệt là _giải mã_ traffic.                                                                      |
| **Sử dụng kết nối backend hiệu quả:** Có thể ghép (multiplex) nhiều request từ nhiều client vào một connection backend. (Ngược lại với L4, nơi 1 client có thể "chiếm" 1 connection backend).                       | **Phải giải mã (TLS Termination):** LB _phải_ giữ private key, là một rủi ro bảo mật (vì LB có thể đọc mọi traffic).                                                                                |
| **Có thể Caching:** Vì nó hiểu nội dung (ví dụ: `GET /image.jpg`), nó có thể lưu cache lại và tự trả lời mà không cần hỏi backend.                                                                                  | **Phải "Hiểu" Giao thức:** Đây là nhược điểm lớn nhất. Nếu L7 LB không hiểu gRPC, nó _không thể_ cân bằng tải gRPC. Đây là lý do người ta liên tục yêu cầu Nginx/Envoy "hỗ trợ" thêm giao thức mới. |
| **Logic API Gateway:** Có thể xử lý xác thực (authentication), rate limiting... ngay tại cổng vào.                                                                                                                  | **Gây trễ (Buffering):** Phải đợi nhận đủ các segment để ráp thành một request hoàn chỉnh rồi mới gửi đi. (Trong khi L4 chỉ nhận segment và chuyển tiếp ngay).                                      |

---

## 6. Tổng kết

Không có lựa chọn nào là "đúng" hay "sai". Đây là sự đánh đổi:

-   **Chọn Lớp 4 (L4)** khi bạn cần:

    -   **Tốc độ tối đa** và hiệu suất cao nhất.
    -   Sự đơn giản.
    -   Cân bằng tải cho các giao thức **không phải HTTP** (như cơ sở dữ liệu, game server, MQTT...).

-   **Chọn Lớp 7 (L7)** khi bạn cần:
    -   **Sự thông minh** (điều hướng dựa trên path, header).
    -   Các tính năng của **API Gateway** (xác thực, rate limiting).
    -   **Caching** nội dung.
    -   Kiến trúc **Microservices**.

---
[← Quay lại mục lục](../README.md)
