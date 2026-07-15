# Chương 6. Cài đặt Git

Chương này hướng dẫn cách cài đặt Git trên các hệ điều hành phổ biến, cấu hình ban đầu cần thiết cho người dùng mới và thiết lập kết nối SSH bảo mật đến các dịch vụ Git hosting.

## Mục lục

- [6.1 Cài đặt Git](#61-cài-đặt-git)
- [6.2 Cấu hình ban đầu](#62-cấu-hình-ban-đầu)
- [6.3 Cấu hình SSH Key](#63-cấu-hình-ssh-key)
- [6.4 So sánh HTTPS vs SSH](#64-so-sánh-https-vs-ssh)

---

## 6.1 Cài đặt Git

> [!NOTE]
> Phiên bản Git ổn định được sử dụng trong tài liệu này là: **2.55.0** (cập nhật đến tháng 7/2026).

Hướng dẫn cài đặt nhanh qua dòng lệnh cho từng hệ điều hành:

### Trên hệ điều hành Linux
Với Debian/Ubuntu:
```bash
sudo apt update
sudo apt install git-all
```
Với Fedora/RHEL/CentOS:
```bash
sudo dnf install git
```

### Trên hệ điều hành macOS
Sử dụng Homebrew:
```bash
brew install git
```
Hoặc cài đặt thông qua Xcode Command Line Tools:
```bash
xcode-select --install
```

### Trên hệ điều hành Windows
Sử dụng Winget (Windows Package Manager):
```powershell
winget install --id Git.Git -e --source winget
```
Hoặc tải bộ cài đặt giao diện đồ họa (`.exe`) trực tiếp tại trang chủ: [git-scm.com](https://git-scm.com).

---

## 6.2 Cấu hình ban đầu

Sau khi cài đặt thành công, việc cấu hình thông tin định danh là bắt buộc để Git ghi nhận tác giả cho mỗi commit:

```bash
# Thiết lập tên người dùng hiển thị
git config --global user.name "Your Name"

# Thiết lập email đăng ký tài khoản Git
git config --global user.email "email@example.com"

# Đặt tên nhánh mặc định khi khởi tạo repo là 'main' (thay vì 'master')
git config --global init.defaultBranch main

# Cấu hình tự động rebase khi thực hiện lệnh pull
git config --global pull.rebase true

# Tự động liên kết và theo dõi nhánh remote tương ứng khi push
git config --global push.autoSetupRemote true
```

### Ba cấp độ cấu hình của Git
- **`--system`**: Cấu hình áp dụng cho toàn bộ người dùng trên hệ điều hành này (lưu tại `/etc/gitconfig`).
- **`--global`**: Cấu hình áp dụng riêng cho người dùng hiện tại (lưu tại `~/.gitconfig` hoặc `~/.config/git/config`).
- **`--local`**: Cấu hình áp dụng riêng cho repository hiện tại (lưu tại `.git/config` của repo đó). Đây là cấu hình có độ ưu tiên cao nhất.

---

## 6.3 Cấu hình SSH Key

Kết nối SSH giúp bạn làm việc với remote repository (GitHub/GitLab) mà không cần phải nhập mật khẩu hoặc personal access token mỗi lần giao tiếp.

```bash
# Tạo SSH key mới sử dụng thuật toán bảo mật Ed25519
ssh-keygen -t ed25519 -C "your_email@example.com"

# Khởi chạy ssh-agent dưới nền
eval "$(ssh-agent -s)"

# Thêm private key vào ssh-agent
ssh-add ~/.ssh/id_ed25519

# Đọc public key để add vào phần cài đặt SSH trên GitHub/GitLab
cat ~/.ssh/id_ed25519.pub
```

---

## 6.4 So sánh HTTPS vs SSH

| Đặc tính | **HTTPS** | **SSH** |
| :--- | :--- | :--- |
| **Cơ chế xác thực** | Username + Personal Access Token (PAT) | SSH Key Pair (Public & Private Key) |
| **Độ khó thiết lập** | Rất đơn giản, không cần cấu hình khóa | Cần tạo key và add public key lên web |
| **Bảo mật** | Tốt (Token có thể cài đặt thời gian hết hạn) | Cực tốt (Mã hóa khóa bất đối xứng khó bị bẻ khóa) |
| **Hỗ trợ 2FA** | Bắt buộc phải dùng PAT/OAuth thay mật khẩu | Hỗ trợ xác thực khóa an toàn bình thường |
| **Khuyến nghị** | Phù hợp cho người mới bắt đầu (Beginner) | Khuyên dùng cho các lập trình viên (Developer) |

---
[← Quay lại mục lục](README.md)
