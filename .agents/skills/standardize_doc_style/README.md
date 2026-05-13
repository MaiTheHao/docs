# Skill: Standardizing Documentation Style

---

## Mục tiêu
Đảm bảo tất cả tài liệu trong repository này đồng nhất về mặt thẩm mỹ, cấu trúc chuyên nghiệp và tối ưu hiển thị cho VS Code (đặc biệt là auto-theme của Mermaid).

## Quy chuẩn Format Tài liệu

### 1. Cấu trúc trang
- **Tiêu đề (H1)**: Mỗi file bắt đầu bằng `# Tiêu đề`.
- **Mục lục**: Ngay sau tiêu đề, sử dụng `## Mục lục` kèm theo danh sách liên kết đến các phần trong trang.
- **Phân tách**: Sử dụng `---` để ngăn cách các phần chính (H2).
- **Ngôn ngữ**: Sử dụng Tiếng Việt chuyên môn, gãy gọn.

### 2. Sơ đồ minh họa (Mermaid)
Mọi quy trình, lifecycle hoặc kiến trúc cần được minh họa bằng Mermaid.
- **Loại sơ đồ**: Linh hoạt chọn loại sơ đồ phù hợp nhất với ngữ cảnh (ví dụ: `flowchart`, `sequenceDiagram`, `stateDiagram`, `classDiagram`, `erDiagram`...). Không bắt buộc cố định một loại.
- **Tối ưu VS Code Auto-Theme**: 
    - **TUYỆT ĐỐI KHÔNG** dùng cú pháp định nghĩa theme trong chart (ví dụ: `%%{init: {'theme': 'dark'}}%%`) để VS Code tự quyết định theme.
    - **Màu sắc đa năng**: Sử dụng các màu fill có độ tương phản tốt trên cả nền sáng và nền tối (ví dụ các mã màu pastel trung tính).
    - **Style**: Chỉ dùng `style` hoặc `classDef` để bo viền (`stroke`), độ dày (`stroke-width`) hoặc highlight nhẹ, tránh override hoàn toàn màu chữ/nền của theme.
    - **Labels**: Đặt ID node và Label rõ ràng.

### 3. Bảng giải thích chi tiết
Sau mỗi sơ đồ Mermaid (nếu cần thiết), phải có một bảng tóm tắt hoặc giải thích các thành phần:
- **Cột**: | Thành phần/Bước | Vai trò/Mô tả | Chi tiết |
- **Định dạng**: Dùng **Bold** cho các thuật ngữ quan trọng và `code` cho lệnh/file extension.

### 4. Ghi chú và Lưu ý
- Sử dụng blockquote `> **Lưu ý:**` cho các thông tin quan trọng.
- Sử dụng code block kèm ngôn ngữ (java, bash, mermaid...) rõ ràng.

## Ví dụ mẫu áp dụng
Khi được yêu cầu viết tài liệu:
1. Tạo Mục lục.
2. Chọn loại Mermaid chart phù hợp (Flowchart cho quy trình, Sequence cho tương tác, v.v.).
3. Thiết kế sơ đồ với style trung tính, đa năng.
4. Tạo bảng giải thích mapping với các thành phần trong sơ đồ.
5. Kiểm tra lỗi chính tả và sự đồng nhất của các thuật ngữ kỹ thuật.
