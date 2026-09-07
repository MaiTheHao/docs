# Behavioral Patterns (Nhóm mẫu hành vi)

> [!IMPORTANT]
> Toàn bộ nội dung và phân tích trong tài liệu về các mẫu thiết kế Behavioral được bản thân đúc kết trực tiếp từ cuốn sách kinh điển [*Design Patterns: Elements of Reusable Object-Oriented Software*](../../../library/books/design_patterns.epub).

## Table of Contents

- [Tổng quan về Behavioral Patterns](#tổng-quan-về-behavioral-patterns)
- [1. Observer](#1-observer)
- [2. Strategy](#2-strategy)

---

## Tổng quan về Behavioral Patterns

Nhóm **Behavioral Patterns** tập trung vào việc phân bổ trách nhiệm giữa các đối tượng và cách các đối tượng liên lạc, tương tác với nhau. Các mẫu này không chỉ mô tả các thực thể (objects/classes) mà còn mô tả mô hình truyền thông và phân tách phụ thuộc giữa chúng trong thời gian chạy (runtime).

---

## 1. Observer

*   **Mục đích:** Định nghĩa mối quan hệ phụ thuộc một-nhiều (one-to-many) giữa các đối tượng, sao cho khi một đối tượng thay đổi trạng thái, tất cả đối tượng phụ thuộc đều nhận được thông báo và tự động cập nhật.
*   **Đặc điểm và ứng dụng:** Thường được gọi là mô hình **Publish-Subscribe**. Được ứng dụng rộng rãi trong hệ thống xử lý sự kiện (event-driven systems), giao diện người dùng (UI event binding), lắng nghe thay đổi dữ liệu, và messaging queues.
*   **Lợi ích:**
    *   **Loose Coupling:** Đối tượng phát thông báo (**Subject**) không cần biết chi tiết triển khai cụ thể của từng đối tượng nhận (**Observer**).
    *   Tuân thủ nguyên tắc **Open/Closed Principle (OCP)** khi dễ dàng thêm các observer mới mà không làm thay đổi subject.
*   **Chi tiết tài liệu:** [Xem chi tiết Observer Pattern](./observer.md)

---

## 2. Strategy

*   **Mục đích:** Định nghĩa một họ thuật toán, đóng gói từng thuật toán lại thành các lớp riêng biệt và giúp chúng có thể hoán đổi linh hoạt cho nhau tại runtime.
*   **Đặc điểm và ứng dụng:** Tách rời phần thuật toán hay xử lý nghiệp vụ cụ thể ra khỏi đối tượng ngữ cảnh (**Context**). Được dùng phổ biến trong tính toán giá/chiết khấu, các chiến lược thanh toán (payment methods), thuật toán định tuyến, nén tệp tin, hoặc sắp xếp dữ liệu.
*   **Lợi ích:**
    *   Loại bỏ các khối điều kiện `if-else` hoặc `switch-case` phức tạp khi lựa chọn thuật toán.
    *   Tăng tính mở rộng và độc lập khi muốn bổ sung hoặc tinh chỉnh thuật toán mới mà không can thiệp vào mã nguồn gọi nó.
*   **Chi tiết tài liệu:** [Xem chi tiết Strategy Pattern](./strategy.md)

---
[← Back to README](../../README.md)
