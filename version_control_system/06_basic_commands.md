# Chương 6. Các lệnh Git cơ bản

Chương này trình bày các nhóm lệnh Git cơ bản và thiết yếu nhất mà bạn sẽ sử dụng hàng ngày để làm việc trên local và đồng bộ hóa code lên máy chủ từ xa.

## Mục lục

- [7.1 Khởi tạo Repository](#71-khởi-tạo-repository)
- [7.2 Theo dõi và kiểm tra thay đổi](#72-theo-dõi-và-kiểm-tra-thay-đổi)
- [7.3 Đưa thay đổi vào Staging Area](#73-đưa-thay-đổi-vào-staging-area)
- [7.4 Commit - Ghi nhận lịch sử](#74-commit---ghi-nhận-lịch-sử)
- [7.5 Xem lịch sử commit](#75-xem-lịch-sử-commit)
- [7.6 Đồng bộ hóa với Remote Repository](#76-đồng-bộ-hóa-với-remote-repository)

---

## 7.1 Khởi tạo Repository

### Lệnh `git init`
Khởi tạo một kho lưu trữ Git mới ngay tại thư mục hiện tại.
```bash
# Khởi tạo repo tại thư mục hiện tại
git init

# Khởi tạo repo và tạo thư mục dự án mới
git init my-project

# Khởi tạo một bare repository (dùng cho server làm trung tâm nhận push)
git init --bare repo.git
```

### Lệnh `git clone`
Sao chép một repository đã có từ trên máy chủ (Remote) về máy tính cá nhân.
```bash
# Clone qua giao thức HTTPS
git clone https://github.com/user/repo.git

# Clone qua giao thức SSH
git clone git@github.com:user/repo.git

# Clone nông (shallow clone) - chỉ lấy commit cuối cùng, giúp tải cực nhanh
git clone --depth 1 https://github.com/user/repo.git
```

---

## 7.2 Theo dõi và kiểm tra thay đổi

### Lệnh `git status`
Kiểm tra trạng thái hiện tại của thư mục làm việc (Working Directory) và vùng chờ (Staging Area).
```bash
# Xem chi tiết các tập tin đang thay đổi
git status

# Xem trạng thái dưới định dạng ngắn gọn
git status -s
```

### Lệnh `git diff`
Xem nội dung chi tiết các thay đổi trong tập tin.
```bash
# Xem thay đổi ở Working Directory so với Staging Area (chưa stage)
git diff

# Xem thay đổi đã được đưa vào Staging Area so với HEAD commit
git diff --staged

# Xem toàn bộ thay đổi ở Working Directory so với HEAD commit
git diff HEAD

# So sánh sự khác biệt giữa hai nhánh
git diff main..feature-branch
```

---

## 7.3 Đưa thay đổi vào Staging Area

### Lệnh `git add`
Đưa các thay đổi từ thư mục làm việc vào Staging Area để chuẩn bị commit.
```bash
# Stage một tập tin cụ thể
git add file.txt

# Stage toàn bộ các thay đổi (tạo mới, sửa đổi, xóa bỏ) trong dự án
git add .

# Stage từng phần nhỏ của file (interactive staging)
git add -p
```

---

## 7.4 Commit - Ghi nhận lịch sử

### Lệnh `git commit`
Chụp ảnh trạng thái (snapshot) của Staging Area và lưu chính thức vào lịch sử của repository.
```bash
# Commit kèm tin nhắn mô tả ngắn gọn
git commit -m "feat: add login functionality"

# Tự động stage toàn bộ file đã được tracking và commit (bỏ qua file untracked)
git commit -am "fix: resolve auth validation bug"

# Thay đổi tin nhắn hoặc gộp thêm file vào commit gần nhất (chỉ dùng khi chưa push)
git commit --amend
```

---

## 7.5 Xem lịch sử commit

### Lệnh `git log`
Hiển thị danh sách các commit đã thực hiện trong quá khứ theo thứ tự thời gian ngược.
```bash
# Xem lịch sử dạng đồ thị rút gọn trên 1 dòng
git log --oneline --graph --decorate --all

# Xem 10 commit gần nhất
git log --oneline -10

# Lọc commits được thực hiện bởi tác giả cụ thể
git log --author="Linus"

# Tìm các commit có nội dung thay đổi liên quan đến từ khóa cụ thể
git log -S "function_name"
```

### Lệnh `git show`
Hiển thị chi tiết thay đổi và thông tin tác giả của một commit cụ thể.
```bash
# Xem chi tiết commit hiện tại (HEAD)
git show HEAD

# Xem chi tiết một commit qua mã hash
git show abc1234
```

---

## 7.6 Đồng bộ hóa với Remote Repository

### Lệnh `git fetch`
Tải toàn bộ các commits và nhánh mới từ remote repository về máy, nhưng **KHÔNG** tự động gộp (merge) vào code hiện tại của bạn. Đây là lệnh an toàn để kiểm tra trạng thái trên server.
```bash
# Fetch từ remote mặc định (origin)
git fetch origin

# Fetch từ tất cả các remote cấu hình trong repo
git fetch --all
```

### Lệnh `git pull`
Tải các thay đổi từ remote và tự động gộp (merge hoặc rebase) vào nhánh hiện tại.
```bash
# Pull nhánh main từ origin và merge vào nhánh hiện tại
git pull origin main

# Khuyên dùng: Pull kết hợp rebase để giữ lịch sử commit thẳng, sạch đẹp
git pull --rebase origin main
```

### Lệnh `git push`
Gửi toàn bộ commit cục bộ của bạn lên remote repository trên server.
```bash
# Push nhánh main lên remote origin
git push origin main

# Thiết lập nhánh upstream theo dõi mặc định và push lần đầu
git push -u origin feature-branch

# Ghi đè lịch sử trên remote bằng lịch sử local (an toàn hơn push -f)
git push --force-with-lease
```

---
[← Quay lại mục lục](README.md)
