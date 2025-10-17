# Ưu và Nhược điểm của TCP

TCP nổi bật với triết lý "đảm bảo truyền tải tin cậy", tập trung vào độ tin cậy, kiểm soát luồng và thứ tự dữ liệu. Tuy nhiên, sự phức tạp này cũng mang lại một số hạn chế về hiệu năng và độ trễ.

---

# Mục lục

-   [1. Ưu điểm của TCP](#1-ưu-điểm-của-tcp)
-   [2. Nhược điểm của TCP](#2-nhược-điểm-của-tcp)
-   [3. Tóm tắt](#3-tóm-tắt)

---

## 1. Ưu điểm của TCP

| Đặc điểm                  | Mô tả                                                                                                     |
| :------------------------ | :-------------------------------------------------------------------------------------------------------- |
| **Đảm bảo độ tin cậy**    | Dữ liệu được xác nhận, kiểm tra lỗi, tự động gửi lại nếu mất gói, đảm bảo đến nơi đầy đủ, đúng thứ tự.    |
| **Kiểm soát luồng**       | Điều chỉnh tốc độ gửi phù hợp với khả năng nhận của phía đối diện, tránh mất mát dữ liệu do quá tải.      |
| **Kiểm soát tắc nghẽn**   | Tự động giảm tốc độ khi mạng tắc nghẽn, giúp mạng ổn định hơn.                                            |
| **Kết nối có trạng thái** | Quản lý trạng thái kết nối, hỗ trợ truyền dữ liệu lớn, liên tục, phù hợp cho các ứng dụng cần độ tin cậy. |

**Ứng dụng phổ biến:** Web (HTTP/HTTPS), Email (SMTP, IMAP, POP3), truyền file (FTP), SSH, Telnet.

---

## 2. Nhược điểm của TCP

| Đặc điểm                             | Mô tả                                                                                                |
| :----------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Độ trễ cao hơn UDP**               | Quá trình "bắt tay" (handshake), xác nhận, kiểm tra lỗi làm tăng độ trễ, không phù hợp cho realtime. |
| **Header lớn hơn UDP**               | Header tối thiểu 20 bytes, chiếm nhiều băng thông hơn UDP.                                           |
| **Quản lý trạng thái phức tạp**      | Máy chủ phải lưu trạng thái kết nối, tốn bộ nhớ khi phục vụ nhiều client đồng thời.                  |
| **Không hỗ trợ broadcast/multicast** | Chỉ truyền dữ liệu điểm-điểm, không gửi một gói tin đến nhiều thiết bị cùng lúc như UDP.             |

---

## 3. Tóm tắt

-   TCP lý tưởng cho ứng dụng cần độ tin cậy, truyền dữ liệu lớn, liên tục.
-   Đảm bảo dữ liệu đến nơi đầy đủ, đúng thứ tự, kiểm soát luồng và tắc nghẽn.
-   Độ trễ cao hơn UDP, header lớn, không hỗ trợ broadcast/multicast, quản lý trạng thái phức tạp.
