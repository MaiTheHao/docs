# IP Address, Subnet, và Default Gateway

---

## 1. IP Address

-   Thuộc tính tầng 3 (Layer 3) trong mô hình OSI/TCP-IP
-   Thiết lập tự động (DHCP) hoặc tĩnh (Static)
-   Gồm phần **Network** và **Host**
-   IPv4 có 4 bytes (32 bits), ví dụ: `192.168.1.10`

---

## 2. Network vs Host

-   Định dạng: `a.b.c.d/x` (`a.b.c.d` là số nguyên, `x` là số bit mạng)
-   Ví dụ: `192.168.254.0/24`
    -   24 bit đầu là **Network**
    -   8 bit còn lại là **Host**
-   Số lượng mạng: `2^24` (~16.7 triệu)
-   Số lượng host mỗi mạng: `2^8` (256)
-   Host đầu tiên (.0) là địa chỉ mạng, host cuối cùng (.255) là địa chỉ broadcast

---

## 3. Subnet Mask

-   Subnet xác định bằng địa chỉ và mask, ví dụ: `192.168.254.0/24` với mask `255.255.255.0`
-   Subnet mask dùng để phân biệt phần Network và Host trong địa chỉ IP
-   So sánh hai IP cùng subnet: thực hiện phép bitwise AND với subnet mask
    -   Ví dụ:
        -   `192.168.254.10` AND `255.255.255.0` = `192.168.254.0`
        -   `192.168.254.20` AND `255.255.255.0` = `192.168.254.0` (cùng subnet)
        -   `192.168.253.10` AND `255.255.255.0` = `192.168.253.0` (khác subnet)
-   Một số subnet phổ biến:
    -   `/24` = `255.255.255.0` = 256 hosts
    -   `/16` = `255.255.0.0` = 65,536 hosts
    -   `/8` = `255.0.0.0` = ~16.7 triệu hosts

---

## 4. Default Gateway

-   Gateway là địa chỉ trung gian để các host giao tiếp ra ngoài subnet
-   Host giao tiếp trực tiếp nếu cùng subnet, nếu khác subnet sẽ gửi qua gateway
-   Mỗi host cần biết địa chỉ gateway để kết nối ra ngoài mạng
