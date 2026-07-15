# Chương 9. Làm việc với Remote Repository

Chương này hướng dẫn cách làm việc với các kho lưu trữ từ xa (Remote Repository), làm rõ các thuật ngữ như origin, upstream, cách quản lý nhánh từ xa và so sánh chi tiết giữa lệnh fetch và pull.

## Mục lục

- [10.1 Khái niệm về Remote Repository](#101-khái niệm-về-remote-repository)
- [10.2 Tên mặc định origin là gì?](#102-tên-mặc-định-origin-là-gì)
- [10.3 Nhánh nguồn upstream là gì?](#103-nhánh-nguồn-upstream-là-gì)
- [10.4 Quản lý Remote Branch](#104-quản-lý-remote-branch)
- [10.5 Cấu hình Tracking Branch](#105-cấu-hình-tracking-branch)
- [10.6 So sánh Fetch vs Pull](#106-so-sánh-fetch-vs-pull)

---

## 10.1 Khái niệm về Remote Repository

**Remote Repository (Kho lưu trữ từ xa)** là bản sao của dự án được lưu trữ trên một máy chủ mạng hoặc internet (như GitHub, GitLab...). Nó cho phép các thành viên trong dự án gửi các thay đổi của mình lên và tải các thay đổi của người khác về máy để cộng tác.

---

## 10.2 Tên mặc định origin là gì?

**`origin`** đơn thuần là tên gọi bí danh (alias) mặc định mà Git đặt cho URL của remote repository đầu tiên khi bạn thực hiện lệnh `git clone`. Bạn hoàn toàn có thể đổi tên này hoặc thêm nhiều remote khác nhau trong một project (ví dụ: một remote trỏ lên GitHub, một remote trỏ lên GitLab).

---

## 10.3 Nhánh nguồn upstream là gì?

- **Upstream** thường được dùng để chỉ repository gốc (nguồn chính) trong quy trình làm việc phân nhánh (Fork Workflow). Khi bạn fork một dự án về tài khoản cá nhân, repository cá nhân của bạn sẽ là `origin`, còn kho gốc của dự án sẽ được đặt tên là `upstream`.
- Ngoài ra, **Upstream** cũng dùng để chỉ mối quan hệ theo dõi (tracking relationship) giữa một nhánh cục bộ ở máy cá nhân với một nhánh tương ứng trên remote server.

---

## 10.4 Quản lý Remote Branch

Nhánh remote (Remote branch) là các nhánh lưu trữ thông tin về trạng thái của các nhánh trên server tại thời điểm bạn fetch gần nhất. Chúng có tiền tố tên là `origin/` (ví dụ: `origin/main`, `origin/feature-x`).

```bash
# Xem danh sách tất cả các nhánh remote đang có
git branch -r

# Cập nhật toàn bộ thông tin mới nhất về các nhánh remote từ server
git fetch origin
```

---

## 10.5 Cấu hình Tracking Branch

Nhánh theo dõi (Tracking branch) là một nhánh cục bộ có liên kết trực tiếp với một nhánh từ xa. Khi đã thiết lập liên kết này, bạn có thể chạy nhanh lệnh `git pull` hoặc `git push` mà không cần ghi rõ tên remote và tên nhánh.

```bash
# Thiết lập liên kết theo dõi (upstream) cho nhánh hiện tại
git branch -u origin/main

# Thiết lập liên kết và push code lên nhánh mới trên remote lần đầu tiên
git push -u origin feature-branch
```

---

## 10.6 So sánh Fetch vs Pull

Hiểu rõ sự khác biệt giữa hai lệnh đồng bộ này giúp hạn chế tối đa xung đột code ngoài ý muốn:

| Đặc tính | **`git fetch`** | **`git pull`** |
| :--- | :--- | :--- |
| **Tải commits mới** | ✅ Có | ✅ Có |
| **Tự động merge** | ❌ Không | ✅ Có (Mặc định tự merge sau khi tải về) |
| **Độ rủi ro** | Không có rủi ro, không ảnh hưởng đến working directory | Có thể tạo ra commit merge thừa hoặc gây conflict bất ngờ |
| **Khuyến nghị** | An toàn hơn. Nên fetch trước để xem thay đổi rồi mới merge thủ công | Tiện lợi nhưng cần chạy cẩn thận, khuyên dùng kèm `--rebase` |

> [!TIP]
> Quy trình đồng bộ an toàn được khuyên dùng đối với các lập trình viên chuyên nghiệp là chạy lệnh `git fetch origin` để kiểm tra thay đổi trên server, sau đó chạy `git merge origin/main` hoặc `git rebase origin/main` thay vì dùng lệnh `git pull` trực tiếp.

---
[← Quay lại mục lục](README.md)
