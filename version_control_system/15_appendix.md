# Phụ lục

Phần phụ lục này cung cấp bảng tra cứu nhanh các lệnh Git thường dùng (Cheat Sheet), giải nghĩa các thuật ngữ Git bằng tiếng Việt, giải đáp các câu hỏi thường gặp (FAQ) và tổng hợp danh sách tài liệu tham khảo chất lượng cao.

## Mục lục

- [Phụ lục A. Bảng tra cứu nhanh lệnh Git (Cheat Sheet)](#phụ-lục-a-bảng-tra-cứu-nhanh-lệnh-git-cheat-sheet)
- [Phụ lục B. Thuật ngữ Git Việt hóa](#phụ-lục-b-thuật-ngữ-git-việt-hóa)
- [Phụ lục C. Câu hỏi thường gặp (FAQ)](#phụ-lục-c-câu-hỏi-thường-gặp-faq)
- [Phụ lục D. Tài liệu tham khảo](#phụ-lục-d-tài-liệu-tham-khảo)
- [Phụ lục E. Sách và bài viết nên đọc](#phụ-lục-e-sách-và-bài-viết-nên-đọc)

---

## Phụ lục A. Bảng tra cứu nhanh lệnh Git (Cheat Sheet)

Bảng tổng hợp nhanh các lệnh Git thiết yếu cho công việc hàng ngày:

| Tác vụ | Lệnh Git tương ứng | Chi tiết |
| :--- | :--- | :--- |
| Khởi tạo kho lưu trữ | `git init` | Tạo repo Git cục bộ tại thư mục hiện tại. |
| Sao chép kho lưu trữ | `git clone <url>` | Clone repo từ trên server về máy cục bộ. |
| Kiểm tra trạng thái | `git status -s` | Xem ngắn gọn các thay đổi trong vùng làm việc. |
| Thêm file vào vùng chờ | `git add <file>` | Đưa thay đổi của file vào Staging Area. |
| Lưu trữ trạng thái | `git commit -m "msg"` | Ghi nhận snapshot của Index vào lịch sử. |
| Gửi code lên máy chủ | `git push origin <branch>`| Đẩy commit mới từ local lên remote. |
| Tải thông tin từ máy chủ | `git fetch origin` | Tải commit mới nhưng không tự động merge. |
| Tải và gộp code | `git pull --rebase` | Tải commit mới và tiến hành dời gốc nhánh. |
| Tạo nhánh mới | `git switch -c <name>` | Tạo và chuyển nhanh sang nhánh mới. |
| Chuyển đổi nhánh | `git switch <name>` | Chuyển đổi môi trường làm việc sang nhánh khác. |
| Hợp nhất nhánh | `git merge <branch>` | Hợp nhất nhánh chỉ định vào nhánh hiện tại. |
| Dời gốc nhánh | `git rebase <branch>` | Phát lại các commit cục bộ lên đỉnh nhánh khác. |
| Xem lịch sử rút gọn | `git log --oneline --graph`| Xem lịch sử commit dưới dạng đồ thị một dòng. |
| Xem chi tiết khác biệt | `git diff` | So sánh sự khác biệt chưa stage ở Working Dir. |
| Tạm cất thay đổi | `git stash push -m "msg"` | Lưu tạm code dở dang và dọn sạch Working Dir. |
| Đưa file ra khỏi Index | `git restore --staged <file>`| Hủy stage file nhưng giữ nguyên nội dung thay đổi. |
| Hủy bỏ thay đổi file | `git restore <file>` | Xóa sạch các sửa đổi chưa stage trên file. |
| Hoàn tác commit (local) | `git reset --soft HEAD~1` | Hủy commit gần nhất nhưng giữ file ở Index. |
| Hoàn tác commit (shared) | `git revert <commit-hash>` | Tạo commit mới đảo ngược thay đổi của commit cũ. |
| Tìm lỗi nhị phân | `git bisect start` | Khởi chạy thuật toán tìm kiếm nhị phân để dò lỗi. |

---

## Phụ lục B. Thuật ngữ Git Việt hóa

Bảng giải thích ý nghĩa tiếng Việt của các khái niệm chuyên môn trong Git:

| Thuật ngữ tiếng Anh | Thuật ngữ tiếng Việt | Vai trò/Mô tả |
| :--- | :--- | :--- |
| **Commit** | Chụp ảnh trạng thái | Lưu trữ ảnh chụp của Staging Area vào lịch sử vĩnh viễn. |
| **Stage** | Chuẩn bị / Đóng gói | Đưa thay đổi vào vùng chờ sẵn sàng để commit. |
| **Branch** | Nhánh | Luồng phát triển độc lập song song trong dự án. |
| **Merge** | Hợp nhất / Dung hợp | Gộp lịch sử phát triển của nhánh này vào nhánh khác. |
| **Conflict** | Xung đột | Xảy ra khi gộp hai đoạn code sửa đổi cùng một vị trí. |
| **Rebase** | Phát lại / Dời gốc | Đặt tuần tự các commit cục bộ lên trên đỉnh nhánh khác. |
| **Reflog** | Nhật ký tham chiếu | Lịch sử ghi lại mọi chuyển động đầu con trỏ HEAD cục bộ. |
| **Detached HEAD** | Trạng thái trôi nổi | Trạng thái con trỏ HEAD trỏ vào commit hash (không phải nhánh). |
| **Remote** | Kho lưu trữ từ xa | Repository được đặt trên máy chủ đám mây hoặc mạng. |
| **Stash** | Tạm cất | Lưu tạm thời các thay đổi chưa commit vào bộ nhớ đệm Git. |

---

## Phụ lục C. Câu hỏi thường gặp (FAQ)

**1. Sự khác nhau cốt lõi giữa Git và GitHub là gì?**
- **Git** là phần mềm quản lý phiên bản dòng lệnh (CLI engine) cài đặt trên máy cá nhân để ghi nhận lịch sử code.
- **GitHub** là dịch vụ hosting trên đám mây cung cấp giao diện Web UI thân thiện, hỗ trợ lưu trữ Git repo trực tuyến và cung cấp các tính năng cộng tác (Pull Requests, Actions, Copilot).

**2. Khi nào nên dùng Rebase, khi nào nên dùng Merge?**
- Dùng **Rebase** cho các nhánh tính năng cá nhân đang phát triển ở local để giữ lịch sử commit thẳng thắp, sạch đẹp trước khi merge.
- Dùng **Merge** đối với các nhánh chung (nhánh chia sẻ cho nhiều người làm việc như main, develop) để bảo toàn chính xác tiến trình thời gian và topo lịch sử gộp code của đội ngũ.

**3. Sự khác nhau giữa `git reset` và `git revert`?**
- Lệnh `reset` di chuyển con trỏ nhánh lùi về quá khứ và có thể xóa bỏ hoàn toàn các commit phía trước (làm thay đổi lịch sử). Chỉ nên dùng cho local commits chưa push lên server.
- Lệnh `revert` tạo ra một commit hoàn toàn mới mang nội dung đảo ngược lại thay đổi của commit cũ (không làm mất lịch sử). Đây là lựa chọn an toàn tuyệt đối cho các commit đã push lên remote.

**4. Nếu lỡ tay reset --hard mất commit quan trọng, tôi phải làm thế nào?**
Bạn hãy chạy lệnh `git reflog` để xem lại lịch sử dịch chuyển của đầu con trỏ HEAD cục bộ, tìm lại mã hash của commit trước khi reset, sau đó chạy lệnh `git reset --hard <commit-hash>` để khôi phục trạng thái cũ.

**5. Làm thế nào để hủy bỏ lệnh commit vừa chạy xong nhưng vẫn giữ lại toàn bộ code đã viết ở Staging Area?**
Hãy chạy lệnh hoàn tác: `git reset --soft HEAD~1`.

**6. Sự khác biệt giữa `--force` và `--force-with-lease` khi push?**
- `--force` sẽ ghi đè lịch sử local lên server vô điều kiện, có nguy cơ xóa sạch commits mới của đồng nghiệp vừa đẩy lên remote.
- `--force-with-lease` sẽ kiểm tra xem server có chứa commits mới nào mà máy local chưa fetch về hay không. Nếu có, Git sẽ từ chối đè lịch sử để bảo vệ an toàn.

**7. Mô hình Git Flow có còn là lựa chọn tốt nhất hiện nay không?**
Có, đối với các phần mềm đóng gói sản phẩm có đánh số phiên bản phát hành rõ ràng (release cycles). Tuy nhiên, đối với các ứng dụng web / SaaS phát hành liên tục trong ngày, Git Flow bị đánh giá là quá cồng kềnh, phức tạp. Các mô hình tối giản hơn như GitHub Flow hoặc Trunk-Based Development được khuyên dùng.

**8. Làm thế nào để dò tìm commit đầu tiên xuất hiện lỗi một cách tự động?**
Sử dụng công cụ `git bisect`. Bạn cung cấp mốc commit tốt (good) và commit lỗi (bad), sau đó viết script chạy test tự động để Git tự thực hiện thuật toán tìm kiếm nhị phân thông qua lệnh `git bisect run <script-test>`.

**9. Tại sao Linus Torvalds lại đặt tên công cụ là "Git"?**
"Git" trong tiếng lóng của Anh mang ý nghĩa hài hước là "người khó ưa". Linus tự trào rằng ông đặt tên tất cả các dự án của mình theo tên của chính ông (trước tiên là nhân Linux, tiếp theo là Git).

**10. Có phải hệ thống SVN đã hoàn toàn biến mất khỏi ngành công nghiệp?**
Không hoàn toàn. Mặc dù thị phần đã giảm sâu chỉ còn khoảng 2%, hệ thống SVN (và Perforce) vẫn được duy trì rộng rãi trong các dự án phát triển game lớn có tài nguyên đồ họa nặng (binary files nặng) hoặc các hệ thống kế thừa của doanh nghiệp lâu năm.

---

## Phụ lục D. Tài liệu tham khảo

- **Trang chủ tài liệu Git**: [git-scm.com/docs](https://git-scm.com/docs)
- **Sách Pro Git (Scott Chacon & Ben Straub)**: [git-scm.com/book/en/v2](https://git-scm.com/book/en/v2) (Đầy đủ và miễn phí)
- **Báo cáo GitHub Octoverse 2025**: [github.com](https://github.com)
- **Báo cáo DORA State of DevOps Report**: [dora.dev](https://dora.dev)
- **Quy ước Conventional Commits**: [conventionalcommits.org](https://conventionalcommits.org)
- **Chuẩn Semantic Versioning**: [semver.org](https://semver.org)
- **Git Flow Model**: [nvie.com](http://nvie.com/posts/a-successful-git-branching-model/)
- **Trunk-Based Development**: [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com)

---

## Phụ lục E. Sách và bài viết nên đọc

1. **Pro Git Book** (Tác giả: Scott Chacon, Ben Straub) — Cuốn sách "gối đầu giường" đầy đủ nhất về Git.
2. **Git Internals** (Tác giả: John Wiegley) — Sách phân tích sâu cơ chế tổ chức filesystem định địa chỉ theo nội dung của Git.
3. **Conventional Commits Specification v1.0.0** — Tài liệu đặc tả chuẩn viết commit message.
4. **Semantic Versioning Specification v2.0.0** — Chuẩn đặc tả đánh số phiên bản phần mềm.
5. **DORA State of DevOps Reports** (Hàng năm) — Báo cáo phân tích hiệu suất DevOps và TBD của Google Cloud.
6. **Linus Torvalds Google Tech Talk 2007** (Xem trên YouTube) — Video Linus Torvalds giới thiệu và giải thích triết lý viết Git tại trụ sở Google.

---
[← Quay lại mục lục](README.md)
