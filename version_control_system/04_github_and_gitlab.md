# Chương 4. GitHub và GitLab

Chương này giới thiệu về các nền tảng hosting Git lớn nhất hiện nay bao gồm GitHub, GitLab, và Bitbucket, đồng thời giải thích bản chất khác biệt giữa Git và GitHub.

## Mục lục

- [4.1 GitHub là gì?](#41-github-là-gì)
- [4.2 GitLab là gì?](#42-gitlab-là-gì)
- [4.3 Bitbucket là gì?](#43-bitbucket-là-gì)
- [4.4 GitHub có phải là Git không?](#44-github-có-phải-là-git-không)
- [4.5 GitHub hoạt động như thế nào?](#45-github-hoạt-động-như-thế-nào)
- [4.6 GitLab hoạt động như thế nào?](#46-gitlab-hoạt-động-như-thế-nào)

---

## 4.1 GitHub là gì?

**GitHub** là nền tảng lưu trữ (hosting) mã nguồn Git lớn nhất thế giới, được thành lập năm 2008 và được Microsoft mua lại vào năm 2018 với giá trị **7.5 tỷ USD**.

**Thống kê thị trường (cập nhật đến tháng 7/2026):**

| Chỉ số | Số liệu | Chi tiết |
| :--- | :--- | :--- |
| **Developers** | **180M+** | Thêm 36M người dùng mới trong năm 2025. |
| **Repositories** | **630M+** | Khoảng 121M repo được tạo mới trong năm 2025. |
| **Public Repos** | **63%** (395M) | Tỷ lệ kho mã nguồn công khai trên hệ thống. |
| **Private Contributions** | **81.5%** | Các đóng góp mã nguồn trong dự án riêng tư chiếm ưu thế. |
| **Pull Requests merged/month** | **43.2M** | Tốc độ tích hợp code trung bình hàng tháng. |
| **Commits trong năm 2025** | **~1 tỷ** | Tổng số lượng commits được ghi nhận. |
| **Fortune 100 sử dụng** | **90%** | Mức độ phổ biến trong các doanh nghiệp lớn. |
| **Organizations** | **4M+** | Số lượng tổ chức/doanh nghiệp đăng ký. |

**Số liệu về GitHub Copilot (AI Pair Programming):**

| Chỉ số | Số liệu | Chi tiết |
| :--- | :--- | :--- |
| **Users** | **20M+ cumulative** | Số lượng người dùng tích lũy sử dụng công cụ AI. |
| **Paid subscribers** | **4.7M** | Tăng trưởng 75% so với cùng kỳ năm ngoái (YoY). |
| **Enterprise adoption** | **90% Fortune 100** | Mức độ tiếp cận và tin dùng trong doanh nghiệp lớn. |
| **Code generation** | **46% code** | Tỷ lệ code được tạo ra bởi AI đối với active users. |
| **Market share AI coding** | **42%** | Chiếm ưu thế trong thị trường AI coding trị giá $7.37B. |
| **Product gain** | **+55%** | Tốc độ hoàn thành công việc của lập trình viên tăng đáng kể. |

**Bảng giá dịch vụ (2026):**
- **Free**: Không giới hạn repo cá nhân/công khai, tối đa 3 cộng tác viên cho repo private, miễn phí 2,000 phút GitHub Actions mỗi tháng.
- **Team**: $4/user/tháng (miễn phí 3,000 phút Actions, 2GB bộ nhớ lưu trữ Packages).
- **Enterprise**: $21/user/tháng (miễn phí 50,000 phút Actions, 50GB bộ nhớ lưu trữ).
- **Copilot**: Bản Business giá $19/user/tháng, bản Enterprise giá $39/user/tháng.

---

## 4.2 GitLab là gì?

**GitLab** là một nền tảng DevOps hoàn chỉnh hỗ trợ vòng đời phát triển phần mềm toàn diện từ khâu quản lý code đến CI/CD, giám sát hệ thống. GitLab được thành lập vào năm 2011 và chính thức IPO vào năm 2021 (mã chứng khoán NASDAQ: GTLB).

**Thống kê tài chính và người dùng (FY2026):**

| Chỉ số | Số liệu | Chi tiết |
| :--- | :--- | :--- |
| **Total Revenue** | **$955.2M** | Tăng trưởng 26% so với cùng kỳ năm ngoái (YoY). |
| **ARR (Annual Recurring Revenue)** | **$1B+** | Doanh thu định kỳ hàng năm cán mốc 1 tỷ USD. |
| **Users** | **50M+** | Số lượng người dùng đăng ký trên hệ thống. |
| **Customers >$100K ARR** | **1,456** | Tăng trưởng 18% so với cùng kỳ năm ngoái (YoY). |
| **Net retention rate** | **118%** | Tỷ lệ giữ chân khách hàng và mở rộng quy mô sử dụng. |
| **Fortune 100** | **50%+ là khách hàng** | Các tập đoàn lớn tin cậy lựa chọn. |

**Đặc điểm nổi bật của GitLab:**
- **DevSecOps tích hợp sẵn (All-in-one)**: Các tính năng quét bảo mật như SAST, DAST, quét container, và kiểm tra thư viện phụ thuộc (dependency scanning) được tích hợp trực tiếp thay vì cài thêm add-on.
- **Linh hoạt tự host (Self-hosted)**: Cung cấp phiên bản GitLab Community Edition (CE) miễn phí theo giấy phép MIT — đây là lựa chọn tự host miễn phí phổ biến nhất hiện nay.
- **GitLab Duo AI**: Hỗ trợ gợi ý code AI, trò chuyện hỗ trợ, review code tự động và phân tích nguyên nhân lỗi (root cause analysis).
- **Bảng giá dịch vụ (2026)**: Bản Free (miễn phí 400 phút CI/CD), bản Premium ($29/user/tháng), bản Ultimate ($99/user/tháng).

---

## 4.3 Bitbucket là gì?

**Bitbucket** là nền tảng quản lý và lưu trữ Git repository được phát triển bởi **Atlassian**, hiện có khoảng hơn 15 triệu lập trình viên sử dụng. Điểm mạnh lớn nhất của Bitbucket là khả năng tích hợp chặt chẽ với hệ sinh thái quản lý dự án Jira và Confluence.

**Bảng giá dịch vụ (2026):**
- **Free**: Miễn phí tối đa cho nhóm 5 người dùng.
- **Standard**: $3.30/user/tháng.
- **Premium**: $6.00/user/tháng.

> [!WARNING]
> Phiên bản tự host Bitbucket Server đã chính thức dừng hỗ trợ hoàn toàn (EOL) kể từ tháng 2/2024. Khách hàng doanh nghiệp được hướng dẫn chuyển đổi sang Bitbucket Cloud hoặc sử dụng phiên bản Bitbucket Data Center (Hybrid License).

---

## 4.4 GitHub có phải là Git không?

**KHÔNG.** Đây là sự hiểu nhầm phổ biến nhất của người mới học lập trình:

- **Git** = **Công cụ/Engine**: Là phần mềm quản lý phiên bản phân tán, hoạt động chủ yếu thông qua dòng lệnh (CLI) ở máy tính cục bộ.
- **GitHub** = **Dịch vụ/Nền tảng**: Là một dịch vụ lưu trữ đám mây cung cấp giao diện web thân thiện bên trên Git, bổ sung thêm các tính năng cộng tác nhóm, quản lý dự án, CI/CD và AI.

> [!TIP]
> Một cách so sánh dễ hiểu: **Git** giống như giao thức gửi thư điện tử **Email**, còn **GitHub** là dịch vụ web mail cụ thể như **Gmail**.

---

## 4.5 GitHub hoạt động như thế nào?

1. Lưu trữ (host) các Git repository an toàn trên đám mây.
2. Cung cấp giao diện Web UI trực quan để duyệt code, xem commit history và quản lý phân quyền.
3. Hỗ trợ quy trình cộng tác thông qua **Pull Requests** và **Code Review**.
4. **GitHub Actions**: Hệ thống CI/CD tự động hóa quy trình test, build, deploy với hơn 25,000 hành động có sẵn trên Marketplace.
5. Hỗ trợ lập trình viên thông qua các công cụ như GitHub Copilot, Issues, Projects, Discussions, Pages.
6. Cung cấp gói bảo mật nâng cao **GitHub Advanced Security** (quét mã độc, tự động phát hiện secret bị lộ trong code).

---

## 4.6 GitLab hoạt động như thế nào?

1. Quản lý Git repository linh hoạt trên đám mây (SaaS) hoặc trên server riêng của doanh nghiệp (Self-hosted).
2. Tích hợp sẵn hệ thống **GitLab CI/CD** vô cùng mạnh mẽ dựa trên Docker-first runner.
3. Quản lý luồng cộng tác qua **Merge Requests** và giao diện review code trực quan.
4. Tích hợp bảo mật tự động ngay trong luồng CI/CD (SAST/DAST).
5. Tích hợp sẵn Container Registry để lưu trữ Docker image và Package Registry cho các package phần mềm (npm, maven, nuget...).
6. Hỗ trợ các tính năng doanh nghiệp như **Merge Trains** (đảm bảo code luôn deploy được sau khi merge) và quản lý **Feature Flags**.

---
[← Quay lại mục lục](README.md)
