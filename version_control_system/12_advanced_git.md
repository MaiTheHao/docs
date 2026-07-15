# Chương 12. Git nâng cao

Chương này giới thiệu các công cụ và tính năng nâng cao trong Git phục vụ cho việc quản lý các dự án phức tạp, gỡ lỗi hiệu quả, nhúng các thư viện mã nguồn ngoài và tối ưu hóa quy trình tự động hóa.

## Mục lục

- [13.1 Tạm cất thay đổi với Git Stash](#131-tạm-cất-thay-đổi-với-git-stash)
- [13.2 Đánh dấu phiên bản với Git Tag](#132-đánh-dấu-phiên-bản-với-git-tag)
- [13.3 Tìm lỗi bằng nhị phân với Git Bisect](#133-tìm-lỗi-bằng-nhị-phân-với-git-bisect)
- [13.4 Truy vết tác giả dòng code với Git Blame](#134-truy-vết-tác-giả-dòng-code-với-git-blame)
- [13.5 Đóng gói mã nguồn với Git Archive](#135-đóng-gói-mã-nguồn-với-git-archive)
- [13.6 Nhúng repository với Git Submodule](#136-nhúng-repository-với-git-submodule)
- [13.7 Giải pháp thay thế Git Subtree](#137-giải-pháp-thay-thế-git-subtree)
- [13.8 Tự động hóa quy trình với Git Hooks](#138-tự-đồng-hóa-quy-trình-với-git-hooks)
- [13.9 Quản lý file dung lượng lớn với Git LFS](#139-quản-lý-file-dung-lượng-lớn-với-git-lfs)

---

## 13.1 Tạm cất thay đổi với Git Stash

Khi bạn đang phát triển tính năng dở dang trên một nhánh nhưng cần phải chuyển gấp sang nhánh khác để fix bug khẩn cấp, lệnh `stash` giúp bạn tạm thời cất đi các thay đổi chưa commit để có một working directory sạch sẽ.

```bash
# Tạm cất các thay đổi kèm ghi chú mô tả
git stash push -m "WIP: login logic draft"

# Xem danh sách các bản stash đang lưu trữ
git stash list

# Lấy lại thay đổi ở bản stash gần nhất và xóa bản stash đó đi
git stash pop

# Áp dụng thay đổi từ bản stash gần nhất nhưng vẫn giữ lại bản stash trong list
git stash apply

# Tạo nhanh một nhánh mới từ trạng thái của bản stash
git stash branch new-branch-name
```

---

## 13.2 Đánh dấu phiên bản với Git Tag

Lệnh `tag` được dùng để đánh dấu các mốc phát hành quan trọng (Release Milestones như v1.0.0, v2.1.0) trong lịch sử dự án.

```bash
# Tạo một Annotated Tag (Khuyên dùng vì lưu thông tin tác giả, ngày tháng, tin nhắn mô tả)
git tag -a v1.0.0 -m "Release version 1.0.0 stable"

# Tạo một Lightweight Tag (Chỉ là con trỏ tĩnh trỏ nhanh vào commit)
git tag v1.0.0

# Gửi tag lên remote repository
git push origin v1.0.0
```

---

## 13.3 Tìm lỗi bằng nhị phân với Git Bisect

Khi dự án xuất hiện một bug nghiêm trọng nhưng bạn không biết nó bắt đầu xuất hiện từ commit nào trong số hàng trăm commits cũ, `git bisect` giúp bạn thực hiện thuật toán tìm kiếm nhị phân (binary search) để khoanh vùng và tìm ra chính xác commit gây lỗi với số bước thử tối thiểu ($O(\log N)$).

**Quy trình chạy thủ công:**
```bash
# Khởi động quy trình bisect
git bisect start

# Đánh dấu commit hiện tại là lỗi (bad)
git bisect bad HEAD

# Đánh dấu một commit ổn định trong quá khứ là sạch (good)
git bisect good v1.0

# Lúc này Git sẽ tự động checkout về một commit ở giữa dải lịch sử để bạn test.
# Sau khi kiểm tra code (chạy test hoặc chạy thử app), bạn thông báo kết quả cho Git:
git bisect good  # Nếu commit này không có lỗi
# Hoặc:
git bisect bad   # Nếu commit này vẫn có lỗi

# Lặp lại quy trình trên cho đến khi Git chỉ ra chính xác commit đầu tiên gây lỗi.
# Sau khi hoàn thành gỡ lỗi, quay lại nhánh ban đầu:
git bisect reset
```

**Quy trình chạy tự động qua script:**
Nếu bạn có sẵn một script kiểm thử tự động (ví dụ: trả về exit code `0` khi pass, exit code `non-zero` khi lỗi), Git có thể tự chạy test để tìm bug:
```bash
git bisect start HEAD v1.0
git bisect run npm test
```

---

## 13.4 Truy vết tác giả dòng code với Git Blame

Lệnh `blame` giúp bạn kiểm tra chi tiết từng dòng trong tập tin được sửa đổi lần cuối bởi ai, vào thời gian nào và ở commit hash nào.

```bash
# Xem thông tin tác giả cho toàn bộ các dòng trong file
git blame file.txt

# Chỉ xem thông tin từ dòng 10 đến dòng 20
git blame -L 10,20 file.txt
```

---

## 13.5 Đóng gói mã nguồn với Git Archive

Đóng gói mã nguồn của một nhánh hoặc một tag cụ thể thành một file nén dạng zip hoặc tar.gz để chia sẻ nhanh cho người khác mà không kèm theo thư mục lịch sử `.git/`.

```bash
# Đóng gói nhánh main thành file zip
git archive --format=zip --output=project.zip main

# Đóng gói tag v1.0.0 thành file tar.gz
git archive --format=tar.gz --output=project.tar.gz v1.0.0
```

---

## 13.6 Nhúng repository với Git Submodule

**Submodule** cho phép bạn nhúng một Git repository độc lập khác vào như một thư mục con của repository hiện tại. Thường dùng để quản lý các thư viện dùng chung (shared libraries).

```bash
# Thêm submodule mới vào thư mục lib/
git submodule add https://github.com/user/lib.git lib/

# Khi clone một repo có chứa submodule, cần chạy thêm lệnh sau để kéo code của submodule về:
git clone --recurse-submodules repo-url
# Hoặc:
git submodule update --init --recursive
```

---

## 13.7 Giải pháp thay thế Git Subtree

**Subtree** là giải pháp thay thế cho Submodule. Thay vì chỉ lưu trữ con trỏ trỏ sang repo khác, Subtree sao chép trực tiếp toàn bộ mã nguồn và lịch sử của repo nhúng vào repo chính.

```bash
# Thêm subtree mới vào thư mục lib/
git subtree add --prefix=lib/ repo-url main --squash

# Cập nhật code mới từ repo nhúng về
git subtree pull --prefix=lib/ repo-url main
```

### So sánh chi tiết Git Submodule vs Git Subtree

| Đặc tính | **Git Submodule** | **Git Subtree** |
| :--- | :--- | :--- |
| **Bản chất lưu trữ** | Chỉ lưu liên kết con trỏ (pointer) trỏ sang commit của repo nhúng | Sao chép trực tiếp toàn bộ file và lịch sử của repo nhúng vào repo chính |
| **Độ phức tạp clone** | Phức tạp (Cần chạy thêm lệnh init/update để kéo code submodule) | Đơn giản (Chỉ clone thông thường như một thư mục code vật lý) |
| **Ảnh hưởng dung lượng**| Siêu nhẹ (Không làm tăng dung lượng repo gốc) | Làm tăng dung lượng repo chính do chứa cả file và lịch sử của repo nhúng |
| **Khả năng đóng góp** | Dễ dàng chỉnh sửa và đẩy ngược (push) code về repo nhúng gốc | Khá phức tạp khi muốn trích xuất lịch sử commit và đẩy ngược về repo nhúng |

---

## 13.8 Tự động hóa quy trình với Git Hooks

**Git Hooks** là các đoạn script tự động chạy khi xảy ra các sự kiện cụ thể trong chu trình làm việc của Git. Chúng được viết bằng các ngôn ngữ script (Shell, Python, Node.js...) và lưu trữ tại thư mục `.git/hooks/`.

- **Client-side Hooks**: Chạy trên máy của lập trình viên.
  - `pre-commit`: Kích hoạt trước khi viết commit message. Thường dùng để chạy linter, formatter hoặc unit test tự động.
  - `commit-msg`: Kích hoạt để kiểm tra cú pháp commit message có đúng chuẩn không (ví dụ: kiểm tra Conventional Commits).
  - `pre-push`: Chạy trước khi đẩy code lên server. Thường dùng để chạy test cuối cùng.
- **Server-side Hooks**: Chạy trên server Git (như GitHub/GitLab).
  - `pre-receive`: Chạy trước khi server chấp nhận code push lên. Có thể dùng để từ chối các push chứa code lỗi hoặc lộ secrets.
  - `post-receive`: Chạy sau khi code đã được push thành công. Thường dùng để kích hoạt các trigger CI/CD bên ngoài.

> [!NOTE]
> Thư mục `.git/hooks/` không được đưa vào hệ thống quản lý phiên bản (không push lên remote). Để chia sẻ cấu hình hooks chung cho cả team, doanh nghiệp thường dùng cấu hình thay đổi đường dẫn hooks `core.hooksPath` hoặc sử dụng các công cụ như **Husky** (đối với Node.js) hoặc framework **pre-commit** (đối với Python).

---

## 13.9 Quản lý file dung lượng lớn với Git LFS

**Git LFS (Large File Storage)** là extension của Git giúp giải quyết bài toán lưu trữ các file nhị phân dung lượng lớn (như hình ảnh PSD, video, file 3D, dataset nhị phân...). Thay vì đẩy file lớn vào `.git/` làm repo bị phình to, LFS thay thế file bằng một file text pointer siêu nhẹ chứa metadata, còn nội dung thật được lưu trên server lưu trữ LFS riêng.

```bash
# Cài đặt Git LFS trên hệ thống
git lfs install

# Thiết lập LFS theo dõi các file Photoshop (.psd)
git lfs track "*.psd"

# Đưa file cấu hình theo dõi của LFS vào Git
git add .gitattributes

# Thực hiện add và commit file lớn bình thường
git add file.psd
git commit -m "docs: add design file"
```

**Giới hạn lưu trữ thông thường trên GitHub (2026):**
- **Tài khoản Free**: Hạn mức 2GB lưu trữ LFS miễn phí, kích thước file đơn lẻ tối đa 5GB.
- **Tài khoản Enterprise**: Cho phép nâng mức lưu trữ LFS lên tới hàng trăm GB và hỗ trợ file dung lượng lớn hơn.

---
[← Quay lại mục lục](README.md)
