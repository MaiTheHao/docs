# Vertical Slice Architecture: Hướng Tới Sự Gọn Nhẹ

## Mục lục

-   [1. Triết lý thiết kế](#1-triết-lý-thiết-kế)
-   [2. Đặc điểm chính](#2-đặc-điểm-chính)

---

## 1. Triết lý thiết kế

**Vertical Slice Architecture** là một biến thể hiện đại và thực dụng của việc tổ chức code. Thay vì tư duy theo lớp (Layer) hay theo Module lớn, Vertical Slice chia nhỏ ứng dụng theo từng **tính năng cụ thể (Feature)**.

> **Công thức:** > **"Code thay đổi cùng nhau nên ở cùng nhau"**
> (Code that changes together, stays together)

---

## 2. Đặc điểm chính

Trong cấu trúc này, một tính năng như `PlaceOrder` sẽ là một thư mục chứa tất cả mọi thứ nó cần:

-   Controller
-   Command
-   Handler
-   Domain Logic
-   SQL Query

**Ưu điểm:**

-   Không còn các lớp Service khổng lồ dùng chung (Shared Services)
-   Tối ưu hóa tối đa cho tốc độ phát triển và bảo trì tính năng
-   Giảm thiểu sự phụ thuộc chéo (Coupling) giữa các tính năng không liên quan
