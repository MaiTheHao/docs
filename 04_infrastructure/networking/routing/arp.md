# Tổng quan Giao thức ARP (Address Resolution Protocol)

**ARP** là một trong những giao thức nền tảng nhất của mạng máy tính. Mặc dù đơn giản, nó đóng vai trò cực kỳ quan trọng trong việc kết nối giữa hai tầng mạng: **Data Link (Layer 2)** và **Network (Layer 3)**.

## Vấn đề cần giải quyết: Tại sao cần ARP?

Trong mạng máy tính, chúng ta có hai loại địa chỉ chính:

1.  **Địa chỉ IP (Layer 3):** Giống như tên của một người trong danh bạ. Nó mang tính logic, giúp chúng ta xác định _ai_ là người chúng ta muốn nói chuyện, dù họ ở bất kỳ đâu trên thế giới. Khi bạn truy cập `google.com`, bạn đang dùng địa chỉ IP.
2.  **Địa chỉ MAC (Layer 2):** Giống như địa chỉ nhà cụ thể của người đó trong một khu phố. Nó là địa chỉ vật lý, được "đốt" cứng vào card mạng (NIC). Để gửi một gói tin _trực tiếp_ đến một máy trong cùng một mạng cục bộ (LAN), bạn **bắt buộc** phải biết địa chỉ MAC của nó.

**Vấn đề là:** Hầu hết thời gian, ứng dụng của bạn chỉ biết địa chỉ IP của đích đến (ví dụ: `192.168.1.100`), nhưng để card mạng có thể gửi đi một khung tin (frame), nó cần biết địa chỉ MAC tương ứng. ARP chính là giao thức "phiên dịch viên" giúp giải quyết vấn đề này.

> **Nói cách khác, ARP trả lời cho câu hỏi: "Với địa chỉ IP X, địa chỉ MAC là gì?"**

---

## Cách ARP hoạt động

Để tăng hiệu quả, mỗi máy tính và thiết bị mạng đều duy trì một bộ nhớ đệm gọi là **Bảng ARP (ARP Table/ARP Cache)**. Bảng này lưu lại các cặp ánh xạ IP -> MAC mà nó đã học được gần đây.

Hãy xem xét hai kịch bản phổ biến nhất.

### Kịch bản 1: Giao tiếp trong cùng một mạng cục bộ (LAN)

Giả sử máy **A** (`192.168.1.2`, MAC `AA:AA...`) muốn gửi dữ liệu đến máy **B** (`192.168.1.5`, MAC `BB:BB...`) trong cùng một mạng.

1.  **Kiểm tra bảng ARP:** Máy A đầu tiên sẽ kiểm tra Bảng ARP của mình xem nó đã biết địa chỉ MAC của `192.168.1.5` chưa.
2.  **Gửi ARP Request (nếu chưa biết):** Nếu không tìm thấy trong bảng, máy A sẽ gửi một gói tin **ARP Request** đến toàn bộ mạng (broadcast, địa chỉ MAC đích là `FF:FF:FF:FF:FF:FF`). Gói tin này mang thông điệp: **"Ai có địa chỉ IP `192.168.1.5`? Hãy cho tôi biết địa chỉ MAC của bạn."**
3.  **Xử lý yêu cầu:** Tất cả các máy trong mạng LAN đều nhận được yêu cầu này.
    -   Các máy không có IP `192.168.1.5` sẽ bỏ qua gói tin.
    -   Máy B nhận ra IP đó là của mình.
4.  **Gửi ARP Reply:** Máy B sẽ trả lời trực tiếp cho máy A (unicast) bằng một gói tin **ARP Reply**. Gói tin này có nghĩa là: **"Tôi đây, IP `192.168.1.5` có địa chỉ MAC là `BB:BB...`."**
5.  **Cập nhật bảng ARP và gửi dữ liệu:** Máy A nhận được phản hồi, cập nhật Bảng ARP của mình (`192.168.1.5` -> `BB:BB...`), và bây giờ nó có thể đóng gói dữ liệu vào một khung tin với địa chỉ MAC đích là `BB:BB...` và gửi đi.

### Kịch bản 2: Giao tiếp với một mạng bên ngoài (Internet)

Giả sử máy **A** (`192.168.1.2`) muốn truy cập một trang web có IP là `8.8.8.8`.

1.  **Xác định vị trí:** Máy A áp dụng subnet mask của nó và nhận ra rằng `8.8.8.8` **không** nằm trong mạng cục bộ của mình.
2.  **Tìm Gateway:** Khi đích đến ở bên ngoài, máy A biết rằng nó phải gửi gói tin đến **Default Gateway** (thường là router, ví dụ có IP là `192.168.1.1`). Gateway sẽ chịu trách nhiệm chuyển gói tin đi tiếp.
3.  **ARP cho Gateway:** Bây giờ, vấn đề trở thành: "Địa chỉ MAC của Default Gateway (`192.168.1.1`) là gì?"
    -   Máy A sẽ thực hiện quy trình ARP y hệt như Kịch bản 1, nhưng lần này mục tiêu là IP của Gateway.
    -   Nó sẽ gửi một ARP Request: **"Ai có IP `192.168.1.1`?"**
    -   Router Gateway sẽ trả lời bằng ARP Reply với địa chỉ MAC của nó (ví dụ `FF:FF...`).
4.  **Gửi dữ liệu đến Gateway:** Máy A cập nhật Bảng ARP và gửi khung tin đi.
    -   **Quan trọng:** Trong khung tin này, **địa chỉ MAC đích là của Gateway** (`FF:FF...`), nhưng **địa chỉ IP đích vẫn là `8.8.8.8`**.
    -   Gateway sẽ nhận khung tin, "mở" nó ra, đọc địa chỉ IP đích, và sau đó tự định tuyến gói tin IP đó ra Internet.

---

## Vấn đề bảo mật: ARP Poisoning / ARP Spoofing

Vì ARP hoạt động dựa trên sự tin tưởng và không có cơ chế xác thực, nó rất dễ bị tấn công trong mạng LAN.

**ARP Poisoning** (đầu độc ARP) là một kỹ thuật tấn công trong đó kẻ tấn công gửi các gói tin ARP Reply giả mạo đến các máy trong mạng.

-   **Kịch bản tấn công phổ biến:** Kẻ tấn công (máy **C**) gửi một ARP Reply giả mạo đến máy A, nói rằng: "IP của Gateway `192.168.1.1` có địa chỉ MAC là `CC:CC...` (MAC của kẻ tấn công)."
-   **Hậu quả:** Máy A tin tưởng và cập nhật Bảng ARP của mình. Từ thời điểm đó, tất cả lưu lượng mà máy A muốn gửi ra Internet sẽ được gửi đến máy của kẻ tấn công thay vì Gateway thật.
-   Điều này cho phép kẻ tấn công thực hiện một cuộc tấn công **Man-in-the-Middle (MITM)**, có thể đọc, sửa đổi, hoặc chặn toàn bộ dữ liệu của nạn nhân.

---

## Tóm tắt

-   **ARP là cầu nối** giữa địa chỉ IP (logic, Layer 3) và địa chỉ MAC (vật lý, Layer 2).
-   Chúng ta **cần địa chỉ MAC** để gửi các khung tin (frames) trong cùng một mạng cục bộ.
-   Khi một máy cần gửi dữ liệu, nó sẽ hỏi **"Ai có IP này?"** bằng **ARP Request** (broadcast) và nhận lại địa chỉ MAC qua **ARP Reply** (unicast).
-   Khi giao tiếp với mạng bên ngoài, máy tính sẽ dùng ARP để tìm địa chỉ MAC của **Default Gateway**.
-   ARP không an toàn và dễ bị tấn công **ARP Poisoning**, dẫn đến các cuộc tấn công Man-in-the-Middle.
