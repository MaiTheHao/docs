# Software Architecture Fundamentals - Kiến Trúc Phần Mềm Cơ Bản

## Table of Contents

- [Giới thiệu](#giới-thiệu)
- [Nguồn Tham khảo Chính](#nguồn-tham-khảo-chính)
- [Danh mục Tài liệu](#danh-mục-tài-liệu)
- [Định hướng Học tập](#định-hướng-học-tập)

---

## Giới thiệu

Thư mục **`00_fundamental`** tổng hợp các kiến thức nền tảng nhất về Kiến trúc Phần mềm (Software Architecture), dựa trên các nghiên cứu và đúc kết từ các tài liệu kinh điển trong thư viện.

Mục tiêu của phần này là xây dựng tư duy kiến trúc đúng đắn: hiểu rõ bối cảnh kỹ thuật/kinh tế, nắm vững 4 chiều cấu thành kiến trúc và tuân thủ các quy luật Trade-off trong thiết kế hệ thống.

---

## Danh mục Tài liệu

| Bài học | Chủ đề Trọng tâm | Mô tả Chi tiết |
| :--- | :--- | :--- |
| **[01. Bối cảnh Kiến trúc](01_architectural_context.md)** | Architectural Context & Economics | Tác động của chi phí hạ tầng, mã nguồn mở, DevOps và tính khả thi kinh tế của các phong cách kiến trúc. |
| **[02. 4 Chiều Kiến trúc](02_four_dimensions.md)** | The 4 Dimensions | Phân tích 4 thành tố: Characteristics (-ilities), Logical Components, Architecture Style và Architecture Decisions. |
| **[03. Các Quy luật Kiến trúc](03_laws_of_architecture.md)** | Laws of Architecture | Quy luật Trade-off (1st Law), hệ quả ẩn giấu, nguyên tắc *Why > How* (2nd Law) và phổ quyết định trung gian (3rd Law). |

---

## Định hướng Học tập

Để đạt hiệu quả tốt nhất, khuyến nghị đọc tài liệu theo đúng thứ tự tiến trình suy luận kiến trúc:

```mermaid
graph LR
    accTitle: Tiến trình Đọc và Học tập Fundamentals
    accDescr: Sơ đồ luồng thứ tự đọc tài liệu từ Bối cảnh đến 4 Dimensions và Quy luật Kiến trúc

    step1["01. Architectural Context<br/>(Hiểu bối cảnh & kinh tế)"] --> step2["02. Four Dimensions<br/>(Hiểu cấu trúc 4 chiều)"]
    step2 --> step3["03. Laws of Architecture<br/>(Làm chủ tư duy Trade-off)"]
```

---
[← Quay lại Software Architecture](../README.md)
