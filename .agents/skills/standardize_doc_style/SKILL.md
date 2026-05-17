---
name: standardize_doc_style
description: "Quy chuẩn hóa cấu trúc, phong cách, định dạng và tính nhất quán cho tài liệu trong repository này."
risk: safe
source: local
date_added: "2026-05-17"
---

# Skill: Standardizing Documentation Style

Tài liệu này định nghĩa quy chuẩn hóa phong cách tài liệu (Style Guidelines) dành cho toàn bộ dự án tài liệu kỹ thuật này. Mục tiêu là đảm bảo mọi tài liệu do lập trình viên hoặc Agent viết ra đều đồng nhất, chuyên nghiệp, trực quan và tối ưu hóa hiển thị.

---

## 1. Quy tắc Đặt tên Thư mục & File (Naming Conventions)

Để duy trì cấu trúc thư mục sạch sẽ và dễ điều hướng:

*   **Thư mục chuyên đề gốc (Root Categories):** Sử dụng dạng `##_snake_case` viết thường, bắt đầu bằng số thứ tự hai chữ số (ví dụ: `01_java`, `02_spring_boot`, `03_design_patterns`). Điều này giúp duy trì thứ tự đọc hợp lý.
*   **Thư mục con & File chi tiết (Child Docs):** Sử dụng `snake_case` viết thường toàn bộ (ví dụ: `single_responsibility_principle.md`, `open_closed_principle.md`). Tuyệt đối không chứa khoảng trắng, ký tự viết hoa hoặc ký tự đặc biệt.
*   **Thư mục tài nguyên (Assets Directory):** Nếu tài liệu có sử dụng hình ảnh tĩnh hoặc biểu đồ vẽ tay bên ngoài, hãy tạo thư mục `assets/` tại thư mục con tương ứng để lưu trữ tài nguyên.

---

## 2. Tiêu chuẩn Cấu trúc Trang (Page Structure)

Mọi trang tài liệu chi tiết phải tuân thủ nghiêm ngặt cấu trúc phân cấp sau:

1.  **Tiêu đề chính (H1):** Mỗi file chỉ được phép có duy nhất một tiêu đề H1 ở đầu trang (ví dụ: `# Single Responsibility Principle (SRP)`).
2.  **Mục lục (TOC):** Đặt ngay sau tiêu đề H1. Sử dụng tiêu đề `## Mục lục` và danh sách liên kết neo đến các thẻ H2 trong trang.
3.  **Đường phân tách logic (`---`):** Sử dụng một đường ngang `---` trước mỗi tiêu đề H2 chính để phân tách rõ ràng các luồng nội dung khác nhau.
4.  **Điều hướng ở chân trang (Footer Navigation):** Cuối mỗi tài liệu chi tiết bắt buộc phải có liên kết chân trang để quay lại mục lục chuyên đề:
    ```markdown
    ---
    [← Quay lại mục lục](README.md)
    ```

---

## 3. Quy chuẩn Sơ đồ Minh họa (Mermaid Diagrams)

Mọi quy trình logic, tương tác giữa các lớp hoặc thiết kế kiến trúc nên được minh họa bằng Mermaid chart để tăng tính trực quan.

### 🔴 Quy tắc Tối ưu hóa VS Code & GitHub Auto-Theme
Để đảm bảo sơ đồ tự động tương thích tốt trên cả giao diện sáng (Light theme) và tối (Dark theme):

*   **TUYỆT ĐỐI KHÔNG** khai báo cứng theme trong code block (như `%%{init: {'theme': 'dark'}}%%` hoặc `%%{init: {'theme': 'neutral'}}%%`). Hãy để IDE hoặc trình duyệt tự động quyết định theme.
*   **Định nghĩa màu đa năng (Adaptive Colors):** Sử dụng các mã màu pastel trung tính có độ tương phản cao với cả nền đen và nền trắng.
*   **Không ghi đè màu chữ:** Tránh dùng `style` để ép cứng màu chữ (`color`). Hãy để màu chữ kế thừa theo theme hệ thống để không bị hiện tượng chữ bị "tàng hình" khi người đọc đổi theme.
*   **Sử dụng Style đúng cách:** Chỉ sử dụng `style` hoặc `classDef` để điều chỉnh màu viền (`stroke`), độ dày (`stroke-width`), hoặc highlight nhẹ các node trạng thái quan trọng.
*   **Tránh lỗi cú pháp:** Luôn bao bọc nhãn của các Node có chứa ký tự đặc biệt như dấu ngoặc đơn, ngoặc vuông trong dấu nháy kép (ví dụ: `A["AreaCalculator (Bad Design)"]`).

---

## 4. Quy chuẩn Bảng Giải thích (Explanatory Tables)

Sau mỗi sơ đồ Mermaid (hoặc khi cần so sánh, giải thích cấu trúc phức tạp), bắt buộc phải có một bảng phân tích chi tiết để làm rõ ý nghĩa:

*   **Cấu trúc cột tiêu chuẩn:**
    ```markdown
    | Thành phần/Bước | Vai trò/Mô tả | Chi tiết |
    | :--- | :--- | :--- |
    ```
*   **Quy tắc định dạng chữ:**
    *   Sử dụng **Chữ đậm (Bold)** cho các thuật ngữ chuyên môn quan trọng.
    *   Sử dụng khối code inline (`code`) cho các tên file, câu lệnh terminal, tên lớp, hoặc kiểu dữ liệu.

---

## 5. Sử dụng Hộp Ghi chú & Cảnh báo (GitHub-style Alerts)

Hãy nâng cao trải nghiệm đọc bằng cách sử dụng các hộp cảnh báo chuyên nghiệp của GitHub thay vì blockquote thông thường:

```markdown
> [!NOTE]
> Sử dụng cho thông tin nền tảng, bối cảnh lịch sử hoặc giải thích bổ sung.

> [!TIP]
> Sử dụng cho các mẹo tối ưu hiệu năng, kinh nghiệm thực tế hoặc quy tắc viết code nhanh.

> [!IMPORTANT]
> Sử dụng cho các yêu cầu nghiệp vụ cốt lõi, bước cấu hình bắt buộc không thể bỏ qua.

> [!WARNING]
> Sử dụng cho các rủi ro, lỗi phổ biến thường gặp hoặc nguy cơ gây ra Git conflict.
```

---

## 6. Quy chuẩn Khối Mã nguồn (Code Blocks)

*   **Chỉ định ngôn ngữ rõ ràng:** Luôn khai báo tag ngôn ngữ ngay sau dấu mở code block (ví dụ: ````java`, ````bash`, ````mermaid`, ````yaml`).
*   **Giải thích ngắn gọn:** Trước mỗi khối code ví dụ, phải có 1-2 dòng giải thích ngắn gọn về vai trò của khối code đó.
*   **Sử dụng Code sạch:** Tránh viết code ví dụ quá dài dòng không liên quan đến bài học chính. Chỉ tập trung làm nổi bật điểm mấu chốt kỹ thuật.

---

## 7. Quy trình Kiểm tra Chất lượng (Quality Checklist)

Trước khi nghiệm thu hoặc lưu trữ tài liệu mới, lập trình viên/Agent phải tự kiểm tra theo checklist sau:

- [ ] Tài liệu chỉ có duy nhất 1 tiêu đề H1 ở đầu trang.
- [ ] Có đầy đủ Mục lục (`## Mục lục`) liên kết đúng đến các phần.
- [ ] Không có liên kết nào bị hỏng (Broken Links), các liên kết tương đối hoạt động tốt.
- [ ] Sơ đồ Mermaid không chứa cú pháp cấu hình cứng theme (`%%{init...}`).
- [ ] Mọi ví dụ code đều được chỉ định rõ tag ngôn ngữ và có giải thích.
- [ ] Có đầy đủ liên kết điều hướng chân trang quay về `README.md`.
- [ ] Thuật ngữ chuyên môn kỹ thuật tiếng Việt được sử dụng đồng nhất toàn trang.
