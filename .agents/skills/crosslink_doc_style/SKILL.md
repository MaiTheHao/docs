---
name: crosslink_doc_style
description: Dệt lưới giao thoa giữa các tài liệu trong cùng thư mục/nhánh - quy chuẩn section "Liên quan", liên kết hai chiều, và tiêu chí khái niệm chung. Áp dụng khi khởi tạo hoặc chỉnh sửa tài liệu đã đạt chuẩn cấu trúc đơn lẻ.
---

# Mục Đích

Skill này bổ trợ cho `standardize_doc_style`: skill đó đảm bảo **chất lượng từng tài liệu đơn lẻ** (cấu trúc, văn phong, sơ đồ), còn skill này đảm bảo **sự giao thoa chủ động giữa các tài liệu** — biến thư mục từ tập hợp bài viết rời rạc thành mạng tri thức có topology.

Nguyên lý nền: liên kết giữa các tài liệu phải là **quyết định thiết kế có chủ đích**, không để mặc nhiên phát sinh. Mỗi cross-link phải gắn với một **khái niệm chung** được nêu rõ, mang lại ngữ cảnh mới cho người đọc.

## Table of Contents

- [1. Phạm vi Áp dụng và Ranh giới với Skill Gốc](#1-phạm-vi-áp-dụng-và-ranh-giới-với-skill-gốc)
- [2. Quy Chuẩn Section "Liên quan"](#2-quy-chuẩn-section-liên-quan)
- [3. Tiêu chí Chất lượng Cross-link](#3-tiêu-chí-chất-lượng-cross-link)
- [4. Quy Tắc Liên kết Hai Chiều](#4-quy-tắc-liên-kết-hai-chiều)
- [5. Quy Tắc Bảo trì và Ổn định Đường dẫn](#5-quy-tắc-bảo-trì-và-ổn-định-đường-dẫn)
- [6. Checklist Kiểm Duyệt Hoàn Tất](#6-checklist-kiểm-duyệt-hoàn-tất)

---

## 1. Phạm vi Áp dụng và Ranh giới với Skill Gốc

*   **Điều kiện tiên quyết:** Tài liệu đã đạt chuẩn cấu trúc đơn lẻ theo `standardize_doc_style` (một `# H1`, `## Table of Contents`, footer `[← Back to README]`).
*   **Không đụng README:** File `README.md` giữ nguyên tính chất **Mục lục điều hướng thuần túy**. Skill này không bắt README chứa ma trận so sánh hay sơ đồ khái niệm. Bản đồ giao thoa thuộc về các section `## Liên quan` trong từng tài liệu chi tiết.
*   **Không vẽ sơ đồ:** Tuân theo nguyên tắc của skill gốc — không tự ý vẽ sơ đồ Mermaid trừ khi người dùng yêu cầu rõ ràng.

---

## 2. Quy Chuẩn Section "Liên quan"

### Vị trí bắt buộc

*   Section `## Liên quan` là **đề mục `H2` cuối cùng** của tài liệu, đặt ngay trước footer điều hướng, có `---` phân cách phía trên.
*   Cấu trúc chuẩn cuối trang:

    ```markdown
    ---

    ## Liên quan

    *   [Tên tài liệu](đường-dẫn-tương-đối.md) — 1 câu nêu khái niệm giao thoa.

    ---
    [← Back to README](README.md)
    ```

### Định dạng từng mục

*   Mỗi dòng là một bullet: **link + 1 câu nêu rõ khái niệm chung**. Tuyệt đối không để list link trần trụi không kèm diễn giải.
*   Câu diễn giải phải chỉ ra trục khái niệm cụ thể (ví dụ: *cùng nguyên lý **Decoupling qua Interface***, *cùng cơ chế **Trade-off giữa bảo mật và trải nghiệm***), không viết kiểu chung chung ("bài này cũng hay", "liên quan đến design pattern").
*   Thuật ngữ khái niệm trong câu diễn giải tuân theo quy chuẩn văn phong của skill gốc: giữ nguyên thuật ngữ tiếng Anh in đậm, không viết kiểu tiếng Việt mở ngoặc tiếng Anh.

### Phạm vi liên kết

*   **Ưu tiên cùng nhánh:** Ưu tiên link tới tài liệu cùng thư mục hoặc cùng nhánh cha trước.
*   **Cross-link liên nhánh:** Cho phép link xuyên nhánh (ví dụ `design_patterns` ↔ `software_architecture`) khi khái niệm giao thoa thực sự mạnh; dùng đường dẫn tương đối (`../`) và tuân thủ `snake_case` ổn định.

---

## 3. Tiêu chí Chất lượng Cross-link

### Ép chất, không ép lượng

*   Mỗi tài liệu chứa **1–3 cross-link chất lượng cao**. Không ép đạt đủ số lượng bằng liên kết rác.
*   Nếu tài liệu không có liên kết khái niệm nào thực sự đáng kể, được phép bỏ qua section `## Liên quan` — nhưng phải là quyết định cân nhắc, không phải thiếu sót.

### Tiêu chí "khái niệm chung đáng link"

Một liên kết đáng đặt khi thỏa ít nhất một trong các điều kiện:

1.  **Cùng trục trừu tượng:** Hai tài liệu cùng vận hành một nguyên lý nền (ví dụ: *Separation of Concerns*, *Lifecycle*, *Boundary*, *Trade-off*).
2.  **Quan hệ nối tiếp:** Một tài liệu là tiền đề hoặc phần tiếp theo của tài liệu kia (ví dụ: Authorization Code Flow server-side → bảo vệ token trong SPA).
3.  **Quan hệ đối chiếu:** Hai tài liệu giải cùng một vấn đề bằng hướng tiếp cận khác nhau, đáng để so sánh (ví dụ: lưu token bằng Cookie vs WebCrypto).

### Điều kiện loại

Không đặt cross-link khi:

*   Chỉ cùng chủ đề bề mặt nhưng không chia sẻ trục tư duy.
*   Liên kết mang tính điều hướng (việc này đã do README đảm nhiệm).
*   Diễn giải khái niệm chung phải gồng ép, gượng gạo, làm vỡ mạch đọc.

---

## 4. Quy Tắc Liên kết Hai Chiều

*   Khi thêm link `A → B`, **bắt buộc rà soát và bổ sung chiều ngược** `B → A` trong section `## Liên quan` của `B` (nếu chưa có).
*   Câu diễn giải hai chiều **không nhất thiết giống hệt nhau** — mỗi phía diễn giải khái niệm giao thoa dưới góc nhìn của tài liệu mình.
*   Khi **gỡ link** `A → B`, phải gỡ chiều ngược tại `B` tương ứng.

---

## 5. Quy Tắc Bảo trì và Ổn định Đường dẫn

*   Toàn bộ cross-link dùng **đường dẫn tương đối** từ vị trí file hiện tại, không dùng đường dẫn tuyệt đối từ gốc repo.
*   Khi đổi tên hoặc di chuyển tài liệu, **bắt buộc rà soát toàn bộ section `## Liên quan` của các tài liệu cùng nhánh** để cập nhật link trỏ vào.
*   Đặt tên file/thư mục ổn định theo quy chuẩn `snake_case` của skill gốc — đổi tên vô cớ là nguồn gốc chết link.
*   Trước khi hoàn tất phiên chỉnh sửa, chạy kiểm tra link trỏ đúng (một lượt quét đường dẫn là đủ; công cụ tuỳ chọn `grep`/script tùy môi trường).

---

## 6. Checklist Kiểm Duyệt Hoàn Tất

Một tài liệu chỉ được coi là đạt chuẩn giao thoa khi thỏa mãn:

- [ ] Section `## Liên quan` (nếu có): là `H2` cuối trước footer, có `---` phân cách; mỗi link kèm 1 câu nêu khái niệm chung; không có link trần trụi.
- [ ] Số lượng link trong ngưỡng 1–3; mỗi link thỏa ít nhất một tiêu chí khái niệm chung ở mục 3.
- [ ] Tính 2 chiều: mọi link `A → B` có chiều ngược `B → A` tương ứng.
- [ ] Đường dẫn tương đối chính xác, không chết link; tuân thủ `snake_case`.
- [ ] README các cấp không bị thêm ma trận so sánh hay sơ đồ — giữ thuần điều hướng.
