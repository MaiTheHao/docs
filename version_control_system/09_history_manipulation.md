# Chương 9. Làm việc với lịch sử

Chương này hướng dẫn các kỹ thuật nâng cao để kiểm tra lịch sử dự án, phục hồi mã nguồn bị mất, và các công cụ mạnh mẽ để hoàn tác (undo), chỉnh sửa lịch sử (rewrite history) một cách an toàn.

## Mục lục

- [9.1 Lọc tìm lịch sử với Git Log](#91-lọc-tìm-lịch-sử-với-git-log)
- [9.2 Nhật ký HEAD với Git Reflog](#92-nhật-ký-head-với-git-reflog)
- [9.3 Hoàn tác thay đổi với Git Reset](#93-hoàn-tác-thay-đổi-với-git-reset)
- [9.4 Khôi phục tập tin với Git Restore](#94-khôi-phục-tập-tin-với-git-restore)
- [9.5 Thay thế Git Checkout (Legacy)](#95-thay-thế-git-checkout-legacy)
- [9.6 Đảo ngược commit với Git Revert](#96-đảo-ngược-commit-với-git-revert)
- [9.7 Sửa đổi commit cuối với Git Amend](#97-sửa-đổi-commit-cuối-với-git-amend)
- [9.8 Biên tập lịch sử với Interactive Rebase](#98-biên-tập-lịch-sử-với-interactive-rebase)

---

## 9.1 Lọc tìm lịch sử với Git Log

Lệnh `git log` hỗ trợ rất nhiều bộ lọc mạnh mẽ giúp tìm kiếm chính xác các thay đổi trong lịch sử:

```bash
# Xem dạng đồ thị rút gọn của tất cả các nhánh
git log --oneline --graph --decorate --all

# Hiển thị số lượng commit theo từng tác giả đóng góp
git shortlog -sn

# Xem các commit được tạo ra trong vòng 2 tuần qua
git log --since="2 weeks"

# Chỉ xem lịch sử các thay đổi liên quan đến một tập tin cụ thể
git log -- README.md
```

---

## 9.2 Nhật ký HEAD với Git Reflog

**Reflog** (Reference Log) là nhật ký ghi lại lịch sử MỌI sự thay đổi và chuyển động của con trỏ `HEAD` (bao gồm switch branch, commit, reset, rebase, merge...).

- **Điểm khác biệt**: `git log` hiển thị lịch sử của commit (lịch sử chung), còn `git reflog` hiển thị lịch sử thao tác của riêng cá nhân bạn trên máy cục bộ.
- **Tính riêng tư**: Reflog là **cục bộ (LOCAL)** và không bao giờ được gửi lên remote repository khi push.
- **Thời hạn lưu giữ**: Git tự động dọn dẹp reflog sau 90 ngày đối với các commit có thể tiếp cận được (reachable) và 30 ngày đối với các commit bị trôi nổi (unreachable).

### Phục hồi commit bị "mất" (do lỡ reset --hard)
Khi bạn lỡ reset mất commit mà chưa kịp push lên server, bạn vẫn có thể tìm lại mã hash của nó thông qua reflog:
```bash
# Bước 1: Xem lại lịch sử thao tác con trỏ HEAD
git reflog
# Output mẫu:
# abc1234 HEAD@{0}: reset: moving to HEAD~1
# def5678 HEAD@{1}: commit: feature x

# Bước 2: Khôi phục lại trạng thái commit 'feature x' qua mã hash tìm được
git reset --hard def5678
```

---

## 9.3 Hoàn tác thay đổi với Git Reset

Lệnh `git reset` được sử dụng để di chuyển con trỏ HEAD hiện tại về một commit cụ thể trong lịch sử. Lệnh này có 3 chế độ hoạt động ảnh hưởng đến các vùng làm việc khác nhau:

| Chế độ Reset | Tác động lên HEAD | Tác động lên Index | Tác động lên Working Directory |
| :--- | :--- | :--- | :--- |
| **`--soft`** | ✅ Di chuyển con trỏ | ❌ Giữ nguyên vùng chờ | ❌ Giữ nguyên mã nguồn |
| **`--mixed`** (Mặc định) | ✅ Di chuyển con trỏ | ✅ Reset lại vùng chờ | ❌ Giữ nguyên mã nguồn |
| **`--hard`** | ✅ Di chuyển con trỏ | ✅ Reset lại vùng chờ | ✅ Reset lại toàn bộ mã nguồn |

```bash
# 1. Soft Reset: Hủy commit gần nhất nhưng giữ nguyên file đã stage ở Index
git reset --soft HEAD~1

# 2. Mixed Reset: Hủy commit, bỏ file khỏi Index (unstage), giữ nguyên file ở ổ cứng
git reset HEAD~1

# 3. Hard Reset: Xóa sạch commit, Index, và các thay đổi ở Working Directory (Nguy hiểm!)
git reset --hard HEAD~1
```

---

## 9.4 Khôi phục tập tin với Git Restore

Lệnh `git restore` (được giới thiệu từ Git 2.23+) được thiết kế chuyên biệt để khôi phục hoặc loại bỏ các thay đổi ở cấp độ tập tin, giúp tránh nhầm lẫn so với lệnh checkout cũ:

```bash
# Loại bỏ các thay đổi chưa được đưa vào Staging Area (Working Directory)
git restore file.txt

# Đưa tập tin ra khỏi Staging Area (giống lệnh git reset ở mức file)
git restore --staged file.txt

# Khôi phục trạng thái tập tin từ 2 commit trước đó (-s nghĩa là source)
git restore -s HEAD~2 file.txt
```

---

## 9.5 Thay thế Git Checkout (Legacy)

Trong các phiên bản Git cũ, lệnh `git checkout` phải gánh vác hai nhiệm vụ hoàn toàn khác nhau, dẫn đến nhiều sự nhầm lẫn:
- Chuyển nhánh: `git checkout main`
- Khôi phục file: `git checkout -- file.txt`

Hiện tại, cả hai chức năng trên đã được tách biệt rõ ràng và thay thế bởi hai lệnh mới an toàn hơn:
- `git switch` (chuyên dùng cho chuyển nhánh).
- `git restore` (chuyên dùng cho khôi phục file).

---

## 9.6 Đảo ngược commit với Git Revert

Khác với `git reset` (viết lại lịch sử và xóa bỏ commit cũ), `git revert` thực hiện việc tạo ra một **commit mới** có nội dung hoàn toàn đảo ngược (neutralize) lại các thay đổi của commit cũ. Đây là cách hoàn tác an toàn nhất khi làm việc trên các nhánh chung đã push lên remote.

```bash
# Đảo ngược thay đổi của commit gần nhất
git revert HEAD

# Đảo ngược một commit cụ thể qua hash
git revert abc1234

# Đảo ngược một commit merge (cần chỉ định -m 1 hoặc 2 để chọn nhánh cha giữ lại)
git revert -m 1 merge-commit-hash
```

---

## 9.7 Sửa đổi commit cuối với Git Amend

Khi bạn vừa commit xong và phát hiện ra mình viết sai commit message hoặc quên chưa add một file nhỏ, bạn có thể chỉnh sửa trực tiếp commit cuối cùng này (lưu ý: chỉ dùng khi **CHƯA** push commit lên server):

```bash
# Thay đổi tin nhắn của commit cuối cùng
git commit --amend -m "feat: add user authentication with fixed message"

# Gộp thêm file vừa quên vào commit cuối cùng và giữ nguyên tin nhắn cũ
git add forgotten_file.txt
git commit --amend --no-edit
```

---

## 9.8 Biên tập lịch sử với Interactive Rebase

Đây là một trong những công cụ chỉnh sửa lịch sử mạnh mẽ nhất trước khi bạn thực hiện push Pull Request. Bạn có thể gộp các commit vụn vặt (squash), sửa tin nhắn commit cũ (reword), xóa bỏ commit (drop), hoặc thay đổi thứ tự của chúng.

```bash
# Tiến hành rebase tương tác cho 5 commit gần nhất
git rebase -i HEAD~5
```

Khi chạy lệnh này, Git sẽ mở một trình soạn thảo văn bản liệt kê 5 commit kèm các lệnh hành động ở đầu dòng:
- **`pick`**: Giữ nguyên commit.
- **`reword`**: Giữ commit nhưng đổi tin nhắn mô tả.
- **`edit`**: Dừng lại để sửa nội dung commit.
- **`squash`**: Gộp nội dung commit này vào commit phía trước nó và gộp tin nhắn mô tả.
- **`fixup`**: Gộp nội dung commit vào commit phía trước nhưng bỏ qua tin nhắn mô tả của nó.
- **`drop`**: Xóa hoàn toàn commit khỏi lịch sử.

---
[← Quay lại mục lục](README.md)
