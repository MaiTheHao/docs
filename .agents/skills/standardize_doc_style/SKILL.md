---
name: standardize_doc_style
description: Quy chuẩn hóa cấu trúc, phong cách, định dạng và tính nhất quán cho tài liệu kỹ thuật. LLM tuân thủ khi tạo hoặc chỉnh sửa Markdown.
---

# Technical Documentation Style Specification

Quy chuẩn bắt buộc cho mọi tài liệu Markdown trong repository.

## 1. Naming Conventions

* **Root Category Directory:** `##_snake_case` (ví dụ: `01_java`, `02_spring_boot`, `03_design_patterns`).
* **Child Directory & File:** `snake_case` viết thường toàn bộ (ví dụ: `single_responsibility_principle.md`). Không chứa khoảng trắng, chữ in hoa hoặc ký tự đặc biệt.
* **Assets Directory:** Lưu trữ ảnh/biểu đồ tĩnh tại `assets/` nằm trong thư mục con tương ứng.

## 2. Document Structure & Layout

Mọi file Markdown chi tiết tuân thủ phân cấp:

1. **H1 Title:** Duy nhất 1 tiêu đề H1 ở đầu trang (`# <Title>`).
2. **Table of Contents (TOC):** Đặt ngay sau H1, dùng header `## Mục lục` chứa danh sách link neo đến các H2.
3. **Logic Dividers:** Đặt đường phân tách `---` trước mỗi header H2.
4. **Footer Navigation:** Bắt buộc ở cuối file chi tiết:
   ```markdown
   ---
   [← Quay lại mục lục](README.md)
   ```

## 3. Technical Format & Syntax Rules

### Code Blocks
* **Language Tag Required:** Bắt buộc khai báo ngôn ngữ (ví dụ: ````java`, ````bash`, ````yaml`, ````mermaid`).
* **Description:** 1-2 dòng mô tả vai trò trước mỗi khối code.

### Mermaid Diagrams
Quy chuẩn thiết kế sơ đồ Mermaid trực quan, chuẩn xác và tương thích tối đa với mọi IDE/GitHub:

* **Strictly Plain Styling (No Custom Colors/Themes):**
  * Cấm hardcode theme (ví dụ: `%%{init: {'theme': '...'}}%%` hoặc YAML theme).
  * Cấm dùng `style`, `classDef`, `linkStyle`, `fill`, `stroke`, hoặc ép màu chữ (`color`). Giữ code sơ đồ dạng chuẩn (plain) để tự động thích ứng với Light/Dark mode của IDE/GitHub.
* **Label Quoting & Escaping:**
  * LUÔN bọc nhãn Node trong dấu nháy kép `""`, đặc biệt khi chứa khoảng trắng hoặc ký tự đặc biệt (ví dụ: `A["AreaCalculator (Bad Design)"]`).
* **Node ID Rules:**
  * Dùng camelCase, không chứa khoảng trắng.
  * Cấm dùng từ khóa bảo lưu `end` làm ID (dùng `End` hoặc `A["end"]`).
  * Tránh bắt đầu Node ID bằng chữ `o` hoặc `x` (gây lỗi render edge/arrowhead).
* **Syntax & Formatting:**
  * Xuống dòng trong nhãn dùng `<br/>`, KHÔNG dùng `\n`.
  * Khai báo rõ hướng sơ đồ (`TD`/`TB` hoặc `LR`).
  * Comment trong sơ đồ dùng `%%` ở đầu dòng.
* **Accessibility & Title:**
  * Mọi sơ đồ nên bao gồm `accTitle: <Tiêu đề ngắn>` và `accDescr: <Mô tả chi tiết>` ở đầu khối sơ đồ.
* **Node Shapes & Sizing:**
  * Nhất quán hình dạng node (`[...]` hành động, `{...}` rẽ nhánh, `[(...)]` CSDL, `([...])` Bắt đầu/Kết thúc).
  * Giữ sơ đồ tinh gọn (tối ưu 5-15 nodes, tối đa 25 nodes).


### Explanatory Tables
Bắt buộc có bảng giải thích sau sơ đồ Mermaid hoặc khối logic phức tạp:
```markdown
| Thành phần/Bước | Vai trò/Mô tả | Chi tiết |
| :--- | :--- | :--- |
```
* **Chữ đậm (Bold):** Thuật ngữ chuyên môn chính.
* **Inline code (`code`):** Tên file, command, class, variable, data type.

### GitHub Alerts
Sử dụng GitHub Alert syntax thay cho blockquote:
* `> [!NOTE]` — Thông tin nền tảng, bối cảnh bổ sung.
* `> [!TIP]` — Mẹo tối ưu hiệu năng, kinh nghiệm thực tế.
* `> [!IMPORTANT]` — Yêu cầu nghiệp vụ cốt lõi, cấu hình bắt buộc.
* `> [!WARNING]` — Rủi ro, lỗi phổ biến, nguy cơ Git conflict.

## 4. Quality Checklist

Tài liệu hợp lệ khi đáp ứng đủ 100% tiêu chí:
- [ ] Duy nhất 1 H1 ở đầu trang.
- [ ] TOC (`## Mục lục`) liên kết đúng các H2 trong trang.
- [ ] Không chứa broken link (link tương đối hợp lệ).
- [ ] Khối code có language tag và giải thích phía trước.
- [ ] Mermaid diagram tuân thủ plain style (không hardcode theme/custom color), nhãn có ký tự đặc biệt được bọc trong nháy kép `""`.
- [ ] Bảng giải thích đúng cấu trúc 3 cột (`Thành phần/Bước | Vai trò/Mô tả | Chi tiết`).
- [ ] Chân trang có link `[← Quay lại mục lục](README.md)`.
- [ ] Ngôn ngữ: Tiếng Việt kỹ thuật chuyên ngành, thuật ngữ nhất quán.
