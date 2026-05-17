# Chuyên đề: JSON Web Token (JWT)

Chuyên đề này cung cấp cái nhìn toàn diện từ cơ bản đến nâng cao về **JSON Web Token (JWT)** - một tiêu chuẩn mở (RFC 7519) được sử dụng rộng rãi nhất hiện nay cho việc xác thực (Authentication) và ủy quyền (Authorization) trong các ứng dụng Web và kiến trúc Microservices.

---

## Danh sách Bài học & Chuyên đề

Dưới đây là sơ đồ lộ trình học tập và tra cứu chi tiết được thiết kế khoa học:

| Bài học | Nội dung cốt lõi | Tài liệu chi tiết |
| :--- | :--- | :--- |
| **Bài 1: Giới thiệu JWT** | Tìm hiểu khái niệm, đặc tính, cấu trúc 3 phần cơ bản, cơ chế Base64URL, và sơ đồ luồng hoạt động xác thực API tiêu chuẩn. | [Tìm hiểu về JSON Web Token (JWT) →](introduce.md) |
| **Bài 2: Phân tích Chuyên sâu** | Giải phẫu chi tiết cấu trúc Header, Payload (Custom & Registered Claims), Signature, so sánh sâu thuật toán đối xứng `HS256` và bất đối xứng `RS256`. | [Phân tích Chuyên sâu về JWT →](indepth.md) |
| **Bài 3: Tấn công & Phòng thủ** | Vạch trần các lỗ hổng từ kinh điển (`none` alg, bẻ khóa yếu, Algorithm Confusion) đến hiện đại (JWKS Spoofing, `kid` Path Traversal) kèm sơ đồ và cách cấu hình phòng thủ. | [Tấn công và Phòng thủ trong JWT →](attacks_and_defenses.md) |

---

## Mục tiêu của Chuyên đề

1.  **Nắm vững Lý thuyết:** Hiểu sâu bản chất mật mã học đằng sau các thuật toán ký token đối xứng và bất đối xứng.
2.  **Làm chủ Thực chiến:** Có khả năng thiết kế hệ thống xác thực an toàn bằng JWT trong các dự án thực tế, đặc biệt là hệ thống Microservices.
3.  **Tư duy Bảo mật (Security Mindset):** Biết cách rà soát code, phát hiện nhanh các lỗi cấu hình sai lầm phổ biến và vá lỗ hổng triệt để.

---
[← Quay lại mục lục chính](../../README.md)
