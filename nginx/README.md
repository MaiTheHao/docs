# NGINX: Hướng dẫn Chuyên sâu từ Kiến trúc Hệ thống đến Cấu hình & Tối ưu hóa

Tài liệu này cung cấp bức tranh tổng thể và chi tiết về NGINX — từ định nghĩa, lịch sử ra đời, giải quyết bài toán C10K, kiến trúc Event-Driven, nguyên lý vận hành Master-Worker, cấu trúc ngữ cảnh cấu hình, giải thuật khớp Location, đến cơ chế Reverse Proxy, Cân bằng tải, Caching Engine, Bảo mật SSL/TLS và Phân tích So sánh Trade-off với các công nghệ khác.

---

## Mục lục

<details>
<summary><strong>1. Nền tảng & Kiến trúc (Foundations & Architecture)</strong></summary>

- [Chương 1. Giới thiệu về NGINX & Bài toán C10K](01_nginx_introduction.md)
- [Chương 2. Kiến trúc Hệ thống & Cơ chế Vận hành](02_architecture_and_core_concepts.md)
- [Chương 3. Các Vai trò & Kịch bản Sử dụng Cốt lõi](03_roles_and_use_cases.md)

</details>

<details>
<summary><strong>2. Cấu hình & Định tuyến (Configuration & Routing)</strong></summary>

- [Chương 4. Cấu trúc File & Ngữ cảnh Cấu hình (Contexts)](04_configuration_structure.md)
- [Chương 5. Giải thuật Khớp Location & Định tuyến URI](05_location_matching_algorithm.md)

</details>

<details>
<summary><strong>3. Reverse Proxy & Cân bằng tải (Proxy & Load Balancing)</strong></summary>

- [Chương 6. Reverse Proxy & Cân bằng tải Upstream](06_reverse_proxy_and_load_balancing.md)

</details>

<details>
<summary><strong>4. Tối ưu hóa & Bảo mật (Optimization & Security)</strong></summary>

- [Chương 7. Caching Engine & Tối ưu hóa Hiệu năng I/O](07_caching_and_performance_tuning.md)
- [Chương 8. Bảo mật, SSL/TLS Termination & HTTP Protocols](08_security_and_ssl_tls.md)

</details>

<details>
<summary><strong>5. Trade-offs & So sánh Công nghệ (Trade-offs & Comparisons)</strong></summary>

- [Chương 9. Trade-offs & Phân tích So sánh Chuyên sâu](09_tradeoffs_and_comparisons.md)

</details>

---
[← Quay lại mục lục chính](../README.md)
