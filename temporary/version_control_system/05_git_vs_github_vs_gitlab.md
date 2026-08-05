# Chương 5. Git vs GitHub vs GitLab

Chương này so sánh chi tiết khái niệm, tính năng, và trường hợp sử dụng của các nền tảng Git phổ biến, giúp bạn lựa chọn công cụ phù hợp với quy mô dự án và nhu cầu của đội ngũ.

## Mục lục

- [5.1 So sánh khái niệm](#51-so-sánh-khái-niệm)
- [5.2 So sánh tính năng](#52-so-sánh-tính-năng)
- [5.3 Khi nào nên dùng GitHub?](#53-khi-nào-nên-dùng-github)
- [5.4 Khi nào nên dùng GitLab?](#54-khi-nào-nên-dùng-gitlab)
- [5.5 Khi nào nên dùng Bitbucket?](#55-khi-nào-nên-dùng-bitbucket)
- [5.6 Các giải pháp tự host thay thế (Self-hosted alternatives)](#56-các-giải-pháp-tự-host-thay-thế-self-hosted-alternatives)

---

## 5.1 So sánh khái niệm

Để hiểu rõ sự khác biệt bản chất giữa ba thành phần này:

| Thành phần | **Git** | **GitHub** | **GitLab** |
| :--- | :--- | :--- | :--- |
| **Bản chất** | Công cụ VCS (Version Control) | Nền tảng hosting & cộng tác | Nền tảng DevOps toàn diện |
| **Giao diện** | Dòng lệnh (CLI) | Giao diện Web (SaaS) | Giao diện Web (SaaS + Self-hosted) |
| **Chi phí** | Miễn phí hoàn toàn (GPL-2.0) | Miễn phí / Trả phí theo gói | Miễn phí / Trả phí theo gói |
| **Mục đích chính** | Quản lý lịch sử và phiên bản file | Lưu trữ code, hỗ trợ làm việc nhóm | Quản lý toàn bộ DevOps lifecycle |
| **Tích hợp AI** | Không tích hợp sẵn AI | Hỗ trợ GitHub Copilot (mạnh nhất) | Hỗ trợ GitLab Duo (an toàn dữ liệu) |

---

## 5.2 So sánh tính năng

Bảng so sánh tính năng cốt lõi giữa ba nền tảng hosting Git hàng đầu:

| Tính năng | GitHub | GitLab | Bitbucket |
| :--- | :--- | :--- | :--- |
| **Hosting** | Cloud-only (SaaS) | Cloud + Self-hosted | Cloud + Data Center (doanh nghiệp lớn) |
| **CI/CD** | Actions (25K+ actions có sẵn) | GitLab CI (quản lý qua các stages) | Pipelines (tính năng ở mức cơ bản) |
| **AI Companion** | Copilot (dẫn đầu thị trường) | Duo (quét mã độc, bảo mật tốt) | Atlassian Intelligence (đang hoàn thiện) |
| **Issue tracking** | Issues + Projects | Issues + Epics | Tích hợp sâu với hệ sinh thái Jira |
| **Wiki** | Hỗ trợ | Hỗ trợ | Tích hợp với Confluence |
| **PR / MR** | Pull Requests | Merge Requests | Pull Requests |
| **Package Registry**| GitHub Packages | Container + Packages Registry | Không có sẵn (phải tích hợp bên ngoài) |
| **Bảo mật** | Advanced Security (mua thêm) | Tích hợp sẵn trong bản Ultimate | Gói Premium |
| **Self-hosted** | GitHub Enterprise Server | GitLab CE (MIT - Miễn phí) | Data Center (Enterprise) |

---

## 5.3 Khi nào nên dùng GitHub?

- Dự án mã nguồn mở (Open Source) muốn thu hút đóng góp từ cộng đồng.
- Cần công cụ hỗ trợ code AI mạnh mẽ nhất hiện nay (GitHub Copilot).
- Muốn tận dụng hệ sinh thái Action Marketplace khổng lồ để cấu hình CI/CD nhanh gọn.
- Lựa chọn mặc định (standard choice) cho các công ty khởi nghiệp (Startups) hoặc nhóm phát triển vừa và nhỏ.

---

## 5.4 Khi nào nên dùng GitLab?

- Doanh nghiệp lớn yêu cầu mô hình DevSecOps khép kín từ Code, CI/CD đến Scan bảo mật tự động.
- Cần tự chạy hệ thống lưu trữ code riêng (Self-hosted) trên hạ tầng nội bộ để đáp ứng tính riêng tư và chủ quyền dữ liệu.
- Đội ngũ DevOps cần hệ thống CI/CD tùy biến mạnh mẽ, tự quản lý các Runner để tối ưu hóa hiệu năng build.

---

## 5.5 Khi nào nên dùng Bitbucket?

- Dự án của doanh nghiệp đã đầu tư lớn vào hệ sinh thái của Atlassian (Jira, Confluence, Trello...).
- Phù hợp với các doanh nghiệp cần tích hợp native nhất với Jira để quản lý task và release tự động.
- Tiết kiệm chi phí với gói miễn phí hỗ trợ tới 5 người dùng cho các repo private.

---

## 5.6 Các giải pháp tự host thay thế (Self-hosted alternatives)

Nếu doanh nghiệp của bạn không muốn phụ thuộc vào SaaS đám mây, các giải pháp tự host (on-premise) sau đây rất đáng cân nhắc:

| Nền tảng | Giấy phép | Dung lượng RAM đề xuất | Thị phần tự host | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **GitLab CE** | MIT | 4GB - 8GB | ~42% | Đầy đủ tính năng DevOps, nặng |
| **Gitea** | MIT | 200MB - 512MB | ~28% | Viết bằng Go, siêu nhẹ, cài đặt nhanh |
| **Forgejo** | GPL v3+ | 200MB - 512MB | ~18% | Bản fork cộng đồng từ Gitea, chú trọng tính minh bạch |

---
[← Quay lại mục lục](README.md)
