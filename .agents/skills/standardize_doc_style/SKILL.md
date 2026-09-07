---
name: standardize_doc_style
description: Chuẩn hóa cấu trúc tài liệu, quy chuẩn README, kiểm soát sơ đồ Mermaid, xử lý thuật ngữ và văn phong kỹ thuật tiếng Việt nhất quán.
---

# Mục Đích

Tài liệu này định nghĩa toàn bộ quy chuẩn bắt buộc áp dụng khi khởi tạo hoặc chỉnh sửa bất kỳ tài liệu Markdown nào trong toàn bộ dự án.

## Table of Contents

- [1. Quy Chuẩn Đặt Tên](#1-quy-chuẩn-đặt-tên)
- [2. Quy Chuẩn Riêng Cho File README](#2-quy-chuẩn-riêng-cho-file-readme)
- [3. Quy Chuẩn Cấu Trúc Tài Liệu Chi Tiết](#3-quy-chuẩn-cấu-trúc-tài-liệu-chi-tiết)
- [4. Quy Chuẩn Sơ Đồ Mermaid](#4-quy-chuẩn-sơ-đồ-mermaid)
- [5. Quy Chuẩn Khối Mã Nguồn](#5-quy-chuẩn-khối-mã-nguồn)
- [6. Bảng Biểu và GitHub Alerts](#6-bảng-biểu-và-github-alerts)
- [7. Văn Phong Kỹ Thuật và Xử Lý Thuật Ngữ](#7-văn-phong-kỹ-thuật-và-xử-lý-thuật-ngữ)
- [8. Checklist Kiểm Duyệt Hoàn Tất](#8-checklist-kiểm-duyệt-hoàn-tất)

---

## 1. Quy Chuẩn Đặt Tên

*   Thư mục gốc: Sử dụng tiền tố số thứ tự và `snake_case` (ví dụ: `01_fundamentals/`, `02_architecture/`).
*   Thư mục con và file: Sử dụng `snake_case`, chỉ dùng chữ cái viết thường, không chứa khoảng trắng hay ký tự đặc biệt.
*   Tài nguyên tĩnh (hình ảnh, tài liệu đính kèm): Lưu trữ tập trung tại thư mục `assets/`.

---

## 2. Quy Chuẩn Riêng Cho File README

File `README.md` đóng vai trò là **Mục lục điều hướng (Navigation Index)** thuần túy. Để tránh làm vỡ cấu trúc và phân tán luồng đọc, mọi file README phải tuân thủ nghiêm ngặt các quy tắc sau:

### Bắt buộc có Abstract liền mạch
*   Ngay sau tiêu đề `# H1` (hoặc sau hộp trích dẫn nguồn sách `> [!IMPORTANT]`), bắt buộc phải có **1 đoạn Abstract tổng quan**.
*   Abstract phải là **một đoạn văn xuôi duy nhất, liền mạch**, khái quát bức tranh toàn cảnh của module hoặc thư mục đó. Không ngắt quãng thành nhiều đoạn vụn, không sử dụng bullet list trong phần abstract này.

### Tính chất Mục lục thuần (Pure Index)
*   README chỉ cung cấp mục lục và định hướng truy cập vào các bài viết con.
*   **Tuyệt đối không chứa các mục so sánh (Comparison/Compare matrix)** giữa các chủ đề hay giữa các mẫu thiết kế bên trong README. Mọi phân tích so sánh chi tiết phải được đặt ở tài liệu con tương ứng hoặc bài chuyên đề riêng.
*   **Tuyệt đối không chèn sơ đồ Mermaid** và **không chèn khối code (`code block`)** vào README.

### Định dạng các mục con trong README
*   Mỗi mục con (tương ứng với một bài viết chi tiết) có thể có một phần giới thiệu ngắn.
*   Phần giới thiệu này **bắt buộc phải là một đoạn văn liền mạch (single cohesive paragraph)**.
*   **Tuyệt đối không dùng danh sách gạch đầu dòng (bulleted lists)** dạng `* Mục đích: ... * Đặc điểm: ... * Lợi ích: - ...`. Việc lồng ghép danh sách làm bố cục mục lục bị vỡ và rối mắt.
*   Kết thúc đoạn văn mô tả bằng một liên kết điều hướng rõ ràng tới tài liệu chi tiết, ví dụ: `[Xem chi tiết Observer Pattern](./observer.md)`.

---

## 3. Quy Chuẩn Cấu Trúc Tài Liệu Chi Tiết

Mỗi tài liệu nội dung chi tiết cần có bố cục rõ ràng, mạch lạc và nhất quán:

*   **Tiêu đề:** Sử dụng duy nhất một `# H1` ở đầu tài liệu.
*   **Mục lục nội bộ:** Đặt `## Table of Contents` ngay sau H1, chỉ chứa danh sách liên kết neo trỏ đến các đề mục `H2`.
*   **Phân cách đề mục:** Luôn chèn đường kẻ ngang `---` trước mỗi đề mục `H2`.
*   **Điều hướng cuối trang:** Luôn kết thúc tài liệu bằng liên kết quay lại README:
    ```markdown
    ---
    [← Back to README](README.md)
    ```

---

## 4. Quy Chuẩn Sơ Đồ Mermaid

*   **Nguyên tắc tiên quyết:** **KHÔNG tự ý vẽ sơ đồ Mermaid trừ khi được người dùng yêu cầu rõ ràng.** Mặc định ưu tiên diễn giải bằng văn phong kỹ thuật súc tích và bảng biểu logic để tránh làm tài liệu cồng kềnh.
*   **Tự do định nghĩa:** Khi có yêu cầu vẽ, không ràng buộc cứng nhắc quy chuẩn kỹ thuật hay cấu trúc giao diện; tự do lựa chọn phong cách biểu diễn (style, theme, bố cục, cú pháp) phù hợp nhất với nội dung và ngữ cảnh.

---

## 5. Quy Chuẩn Khối Mã Nguồn

### Nguyên Tắc Tinh Gọn (Code Minimization & Architecture First)
*   **Tập trung vào bản chất:** Tài liệu kỹ thuật tập trung mô tả bối cảnh, ý đồ thiết kế, ranh giới và luồng hoạt động chứ không phải là bài tập lập trình cú pháp.
*   **Hạn chế Boilerplate Code:** Giảm thiểu tối đa việc sao chép mã nguồn cài đặt dài dòng. Chỉ đưa vào các đoạn mã ngắn mô tả giao diện (`interface`), ranh giới (`boundary`), hoặc một cấu trúc then chốt khi thực sự cần thiết.

### Quy Cách Trình Bày Khối Mã
*   Bắt buộc khai báo thẻ ngôn ngữ (ví dụ: `java`, `python`, `typescript`, `bash`).
*   Bắt buộc có một câu mô tả ngắn gọn đặt ngay trước khối mã.
*   Mọi văn bản tiếng Việt xuất hiện trong code block (chú thích, chuỗi thông báo) phải có dấu thanh đầy đủ, tuyệt đối không dùng tiếng Việt không dấu.

---

## 6. Bảng Biểu và GitHub Alerts

### Bảng Biểu (Tables)
*   Bắt buộc sử dụng bảng để giải thích các luồng phức tạp hoặc tóm tắt vai trò của các thành phần:
    ```markdown
    | Thành phần | Vai trò | Trách nhiệm chi tiết |
    | :--- | :--- | :--- |
    ```
*   Sử dụng định dạng **in đậm** cho thuật ngữ nghiệp vụ và `inline code` cho tên tệp tin, lệnh, lớp, biến hoặc kiểu dữ liệu.

### GitHub Alerts
*   Ưu tiên sử dụng GitHub Alerts thay cho blockquote trích dẫn thông thường.
*   Sử dụng đúng mục đích: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`.

---

## 7. Văn Phong Kỹ Thuật và Xử Lý Thuật Ngữ

### Cách Hành Văn và Xử Lý Thuật Ngữ Kỹ Thuật
*   **Văn phong:** Toàn bộ tài liệu được trình bày bằng tiếng Việt kỹ thuật tự nhiên, câu từ khúc chiết, mạch lạc, trực diện và đậm chất tư duy kỹ sư.
*   **Ưu tiên nguyên văn thuật ngữ:** Giữ nguyên văn các thuật ngữ kỹ thuật tiếng Anh (định dạng **in đậm** hoặc `inline code`). Chỉ dịch sang tiếng Việt khi đã có bản dịch chuẩn xác và được cộng đồng kỹ thuật thừa nhận rộng rãi.
*   **Chống mở ngoặc thừa thãi:** **Tuyệt đối hạn chế tối đa cách viết "Tiếng Việt rồi mở ngoặc tiếng Anh"** (ví dụ tránh viết: *"sự đánh đổi (trade-offs)"*, *"liên kết lỏng (loose coupling)"*, *"đặc tính kiến trúc (architectural characteristics)"*). Cách viết này gây rườm rà, thừa thãi và phân mảnh câu. Thay vào đó, hãy dùng thẳng thuật ngữ tiếng Anh trong mạch câu tiếng Việt:
    *   *Kém:* "Mẫu này giúp giảm sự phụ thuộc chặt chẽ (tight coupling) và tăng tính gắn kết (cohesion)."
    *   *Chuẩn:* "Mẫu này giúp giảm thiểu **Tight Coupling** và gia tăng **Cohesion** giữa các mô-đun."
*   **Các thuật ngữ tiêu chuẩn luôn giữ nguyên tiếng Anh:** **Trade-off**, **Coupling**, **Cohesion**, **Fitness Functions**, **Runtime**, **Compile-time**, **Subject**, **Observer**, **Context**, **Strategy**, **Microservices**, **Monolith**, **ADR**, **CI/CD**, v.v.

### Cấu Trúc Kể Chuyện Kỹ Thuật (Technical Storytelling)
*   **Bối cảnh đi trước định nghĩa:** Ưu tiên luồng `Bối cảnh → Động lực → Định nghĩa` thay vì đưa ngay định nghĩa trừu tượng vào đầu mục.
*   **Luồng tư duy:** Duy trì mạch phân tích `Tại sao (Why) → Như thế nào (How) → Áp dụng ở đâu (Where) → Đánh đổi (Trade-off)`.
*   **Nhịp điệu câu:** Đan xen linh hoạt giữa câu ngắn dứt khoát và câu phức giải thích logic, tránh lặp lại cùng một cấu trúc mở đầu câu quá 2 lần trong một bài.
*   **Ngôn ngữ định lượng:** Ưu tiên các chỉ số có thể đo lường được như `latency`, `throughput`, `memory footprint`, `O(n)` thay vì dùng các tính từ mơ hồ như "rất nhanh", "vô cùng tối ưu".

---

## 8. Checklist Kiểm Duyệt Hoàn Tất

Một tài liệu chỉ được coi là đạt chuẩn khi thỏa mãn toàn bộ các tiêu chí:

- [ ] Đối với `README.md`: Có 1 đoạn Abstract liền mạch; không có bảng compare; không có khối code; không có sơ đồ Mermaid; các mục con được mô tả bằng 1 đoạn văn liền mạch (không dùng list).
- [ ] Đối với tài liệu chi tiết: Chỉ có đúng một `# H1`; `## Table of Contents` nằm ngay sau H1 và chỉ chứa link tới các `H2`; có `---` trước mỗi `H2`; có link `[← Back to README](README.md)` ở cuối.
- [ ] Sơ đồ Mermaid: **Chỉ xuất hiện khi có yêu cầu rõ ràng từ người dùng**; phong cách biểu diễn tự do theo ngữ cảnh và nội dung.
- [ ] Mã nguồn: Hạn chế boilerplate code thừa; khối mã có khai báo ngôn ngữ và mô tả phía trước; tiếng Việt trong code có dấu đầy đủ.
- [ ] Thuật ngữ & Hành văn: Sử dụng tiếng Việt tự nhiên; giữ nguyên thuật ngữ kỹ thuật tiếng Anh; không viết kiểu tiếng Việt mở ngoặc chú thích tiếng Anh thừa thãi.
- [ ] Định dạng: Sử dụng đúng GitHub Alerts thay vì blockquote thông thường; bảng biểu căn chỉnh rõ ràng.