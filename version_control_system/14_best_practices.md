# Chương 14. Best Practices

Chương này tổng hợp các quy tắc ứng xử chuẩn mực (Best Practices) khi làm việc với Git nhằm tối ưu hiệu suất làm việc nhóm, bảo vệ mã nguồn an toàn và xây dựng lịch sử commit rõ ràng, chuyên nghiệp.

## Mục lục

- [14.1 Quy ước Commit Message (Quy tắc 50/72)](#141-quy-ước-commit-message-quy-tắc-5072)
- [14.2 Chuẩn Conventional Commits](#142-chuẩn-conventional-commits)
- [14.3 Định danh phiên bản Semantic Versioning (SemVer)](#143-định-danh-phiên-bản-semantic-versioning-semver)
- [14.4 Quy ước đặt tên nhánh (Branch Naming)](#144-quy-ước-đặt-tên-nhánh-branch-naming)
- [14.5 Bảo mật thông tin nhạy cảm](#145-bảo-mật-thông-tin-nhạy-cảm)
- [14.6 Sử dụng tập tin loại trừ .gitignore](#146-sử-dụng-tập-tin-loại-trừ-gitignore)
- [14.7 Commit nhỏ và thường xuyên](#147-commit-nhỏ-và-thường-xuyên)
- [14.8 Quy trình Code Review trước khi gộp](#148-quy-trình-code-review-trước-khi-gộp)
- [14.9 Chiến lược sao lưu (Backup)](#149-chiến-lược-sao-lưu-backup)
- [14.10 Sử dụng Force Push an toàn](#1410-sử-dụng-force-push-an-toàn)

---

## 14.1 Quy ước Commit Message (Quy tắc 50/72)

Viết mô tả commit rõ ràng giúp đội ngũ phát triển dễ dàng hiểu được lịch sử dự án khi đọc lại:

- **Subject (Tiêu đề)**: Tối đa 50 ký tự, viết hoa chữ cái đầu tiên, sử dụng thể mệnh lệnh (ví dụ: *"Add feature"* thay vì *"Added feature"* hoặc *"Adds feature"*), và tuyệt đối không viết dấu chấm ở cuối câu. Tiêu đề cách phần thân 1 dòng trống.
- **Body (Thân mô tả)**: Xuống dòng (wrap) tại tối đa 72 ký tự để đảm bảo hiển thị đẹp mắt trên màn hình terminal của các IDE.

**Ví dụ một commit message chuẩn:**
```text
feat(api): add user authentication endpoint

Implement JWT-based authentication with refresh token support.
- POST /auth/login for user login
- POST /auth/refresh for token refresh
- Token expiry: 15 minutes (access) + 7 days (refresh)

Closes #123
```

---

## 14.2 Chuẩn Conventional Commits

Quy ước Conventional Commits cung cấp các quy tắc chung để tạo ra lịch sử commit có cấu trúc rõ ràng, hỗ trợ đắc lực cho việc tự động tạo changelog và tự động nâng phiên bản phần mềm.

**Cú pháp chuẩn (Spec 1.0.0):**
```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Bảng tra cứu loại commit và mối liên hệ với Semantic Versioning:**

| Loại Commit | Ý nghĩa | Ánh xạ Semantic Versioning (SemVer) |
| :--- | :--- | :--- |
| **`feat`** | Phát triển tính năng mới | **MINOR** |
| **`fix`** | Sửa lỗi chương trình | **PATCH** |
| **`BREAKING CHANGE`** | Thay đổi API không tương thích ngược (hoặc ký tự `!`) | **MAJOR** |
| **`docs`** | Chỉ chỉnh sửa hoặc bổ sung tài liệu | Không nâng phiên bản |
| **`refactor`** | Tái cấu trúc mã nguồn (không thêm tính năng hay fix lỗi) | Không nâng phiên bản |
| **`perf`** | Tối ưu hóa hiệu năng hệ thống | Không nâng phiên bản |
| **`test`** | Bổ sung hoặc chỉnh sửa các bài kiểm thử (unit tests) | Không nâng phiên bản |
| **`ci`** | Thay đổi cấu hình tích hợp liên tục (CI/CD) | Không nâng phiên bản |
| **`chore`** | Các công việc bảo trì nhỏ nhặt khác | Không nâng phiên bản |

---

## 14.3 Định danh phiên bản Semantic Versioning (SemVer)

Phần mềm nên được đánh số phiên bản theo cấu trúc chuẩn: **`MAJOR.MINOR.PATCH`** (Ví dụ: `2.5.1`).

- **`MAJOR`**: Tăng số khi phần mềm có những thay đổi API lớn không tương thích ngược với phiên bản cũ.
- **`MINOR`**: Tăng số khi bạn bổ sung các tính năng mới nhưng vẫn tương thích ngược với code cũ.
- **`PATCH`**: Tăng số khi bạn thực hiện sửa lỗi (bug fixes) tương thích ngược.
- **Đánh dấu bản thử nghiệm**: Sử dụng các hậu tố như `1.0.0-alpha.1`, `1.0.0-beta.2`, `1.0.0-rc.1` (Release Candidate).

---

## 14.4 Quy ước đặt tên nhánh (Branch Naming)

Sử dụng tiền tố phân loại giúp nhánh của bạn hiển thị khoa học trong danh sách quản lý:

| Định dạng tên nhánh | Mục đích sử dụng |
| :--- | :--- |
| **`feature/xxx`** | Phát triển tính năng mới |
| **`fix/xxx`** | Sửa lỗi (bug fix) thông thường |
| **`hotfix/xxx`** | Sửa lỗi khẩn cấp trực tiếp trên production |
| **`release/xxx`** | Chuẩn bị đóng gói phát hành phiên bản mới |
| **`chore/xxx`** | Các công việc bảo trì hệ thống, cấu hình CI |
| **`docs/xxx`** | Chỉ cập nhật tài liệu kỹ thuật |

---

## 14.5 Bảo mật thông tin nhạy cảm

Tuyệt đối không bao giờ được đưa các thông tin nhạy cảm (secrets) như mật khẩu, API keys, credentials, token bảo mật, private key vào file quản lý của Git.

**Thiết lập quy trình phòng thủ nhiều lớp:**
1. **Lớp 1 (Pre-commit hook)**: Cấu hình công cụ **Gitleaks** hoặc GitGuardian CLI ở máy cục bộ để tự động quét và chặn không cho commit nếu phát hiện có secret bị lộ trong code thay đổi.
2. **Lớp 2 (Push protection)**: Kích hoạt tính năng bảo vệ push trên GitHub/GitLab để server tự động từ chối nhận code push lên chứa secrets.
3. **Lớp 3 (CI Scanning)**: Cài đặt công cụ quét bảo mật tự động trên hệ thống CI/CD cho mọi PR.

> [!WARNING]
> Theo báo cáo của **GitGuardian 2025**, đã phát hiện **23.8 triệu secrets** mới bị lộ trong các commits công khai trên GitHub (tăng mạnh so với các năm trước). Đáng báo động hơn, 70% secrets bị lộ này vẫn ở trạng thái hoạt động (active) trong suốt thời gian dài.

---

## 14.6 Sử dụng tập tin loại trừ .gitignore

Luôn tạo file `.gitignore` ngay tại thư mục gốc của dự án để ngăn không cho Git theo dõi và đưa các tập tin rác hệ thống, dependencies, thư mục build, hoặc file nhạy cảm vào repo:

```gitignore
# Loại trừ các file cấu hình chứa thông tin nhạy cảm
.env
.env.*
*.pem
*.key
credentials.json

# Loại trừ thư mục dependencies tải về từ mạng
node_modules/
vendor/
.venv/
venv/
__pycache__/

# Loại trừ thư mục kết quả build/đầu ra của chương trình
dist/
build/
out/
target/
*.o
*.pyc
*.class

# Loại trừ file cấu hình IDE cá nhân
.vscode/
.idea/
*.swp
*.swo

# Loại trừ file rác của hệ điều hành
.DS_Store
Thumbs.db

# Loại trừ files log
*.log
logs/

# Loại trừ thư mục báo cáo kiểm thử
coverage/
.nyc_output/
```

---

## 14.7 Commit nhỏ và thường xuyên

- Nên phân rã các thay đổi lớn thành các commit nhỏ có tính chất logic duy nhất (logical unit).
- Theo báo cáo **DORA 2025**, thời gian review và tỷ lệ gộp thành công tăng cao nhất đối với các PR có kích thước trung vị khoảng **84 dòng code**.
- Commit nhỏ giúp các thành viên dễ review, dễ tìm bug qua bisect và đảo ngược code an toàn qua revert nếu có lỗi phát sinh.

---

## 14.8 Quy trình Code Review trước khi gộp

- Hạn chế tạo các PR quá lớn (nên dưới 400 dòng code). PR nhỏ giúp reviewer kiểm soát code kỹ lưỡng và phát hiện lỗi tốt hơn.
- Cấu hình thiết lập các luật bảo vệ nhánh chính (Branch Protection Rules): bắt buộc PR phải được ít nhất 1-2 người approve và phải vượt qua toàn bộ quy trình CI tự động (test build) thành công trước khi được bấm merge.

---

## 14.9 Chiến lược sao lưu (Backup)

- Vì Git có tính phân tán cao nên mỗi khi một thành viên clone hoặc pull dự án, họ đã tự tạo ra một bản sao lưu (full backup) đầy đủ lịch sử của toàn bộ dự án trên máy trạm của họ.
- Đối với các dự án cực kỳ quan trọng, doanh nghiệp nên duy trì đẩy code song song lên 2 remote server độc lập (ví dụ: GitHub và GitLab tự host).
- Sử dụng lệnh `git bundle` để xuất lịch sử repo thành một file nhị phân duy nhất giúp sao lưu ngoại tuyến (offline backup) vô cùng tiện lợi.

---

## 14.10 Sử dụng Force Push an toàn

Hạn chế tối đa việc sử dụng lệnh push ép buộc (`git push -f`). Nó sẽ ghi đè lịch sử trên server mà không cần quan tâm remote server đang có những thay đổi mới nào từ người khác.

Nếu bắt buộc phải sửa đổi lịch sử nhánh cá nhân và push lên server, hãy luôn sử dụng tùy chọn an toàn hơn sau đây:

```bash
# Lệnh kiểm tra remote có commit mới mà local chưa kéo về hay không trước khi ghi đè
git push --force-with-lease

# Khuyên dùng kết hợp (phiên bản nâng cao để an toàn tuyệt đối)
git push --force-with-lease --force-if-includes
```

---
[← Quay lại mục lục](README.md)
