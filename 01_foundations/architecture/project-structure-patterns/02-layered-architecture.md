# Kiến Trúc Phân Lớp (Layered Architecture)

## Mục lục

-   [1. Triết lý cốt lõi](#1-triết-lý-cốt-lõi)
-   [2. Cấu trúc thư mục điển hình](#2-cấu-trúc-thư-mục-điển-hình)
-   [3. Ưu điểm và hạn chế](#3-ưu-điểm-và-hạn-chế)

---

## 1. Triết lý cốt lõi

**Kiến trúc phân lớp**, hay còn gọi là **kiến trúc N-Tier**, là mô hình tổ chức lâu đời và phổ biến nhất trong lịch sử phát triển phần mềm doanh nghiệp. Triết lý cốt lõi của mô hình này là sự **phân tách các mối quan tâm (Separation of Concerns)** dựa trên vai trò kỹ thuật.

Hệ thống được chia thành các tầng nằm ngang, nơi mỗi tầng chỉ chịu trách nhiệm cho một khía cạnh kỹ thuật cụ thể và chỉ được phép giao tiếp với tầng nằm ngay bên dưới nó.

---

## 2. Cấu trúc thư mục điển hình

Cấu trúc thư mục của một dự án phân lớp thường phản ánh trực tiếp các khái niệm kỹ thuật thay vì phản ánh nghiệp vụ của doanh nghiệp:

```
src/
├── controllers/    # Presentation Layer: Tiếp nhận request, validate input
├── services/       # Business Layer: Chứa logic nghiệp vụ
├── repositories/   # Data Access Layer: Tương tác trực tiếp với Database
├── entities/       # Data Models: Ánh xạ cấu trúc bảng database
└── utils/          # Các hàm tiện ích dùng chung
```

---

## 3. Ưu điểm và hạn chế

### 3.1. Ưu điểm

Lý tưởng của kiến trúc này nằm ở sự đơn giản và quen thuộc. Nó giảm thiểu **tải nhận thức (Cognitive Load)** ban đầu cho các lập trình viên mới, những người chỉ cần biết rằng code xử lý HTTP nằm ở `controllers` và code SQL nằm ở `repositories`.

### 3.2. Hạn chế

Ý nghĩa thực tiễn của kiến trúc này thường bị biến tướng trong các dự án lớn:

-   **Vấn đề "Database Centric"** (Lấy cơ sở dữ liệu làm trung tâm): Cấu trúc của các bảng trong cơ sở dữ liệu chi phối toàn bộ logic của ứng dụng.
-   **Anemic Domain Models** (Mô hình miền thiếu máu): Các object chỉ chứa dữ liệu mà không có hành vi, và toàn bộ logic nghiệp vụ bị dồn vào các lớp Service khổng lồ, tạo nên cái gọi là **"Big Ball of Mud"**.

> **Ghi nhớ:** Kiến trúc phân lớp phù hợp nhất cho các ứng dụng nhỏ, các bản mẫu (prototypes) hoặc các dự án có vòng đời ngắn, nơi tốc độ phát triển ban đầu quan trọng hơn khả năng bảo trì dài hạn.
