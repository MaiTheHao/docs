# Đặc tả Thiết kế & Kế hoạch Triển khai: Chuẩn hóa Tài liệu OAuth & OIDC

Bản tài liệu này đóng vai trò là kim chỉ nam kỹ thuật vĩnh viễn, ghi lại toàn bộ quyết định thiết kế, quy hoạch đặt tên, danh sách tài nguyên ảnh tĩnh và kế hoạch triển khai chi tiết cho quá trình tái cấu trúc toàn diện 19 bài giảng thuộc chuyên đề **OAuth & OpenID Connect** tại thư mục `/security/oauth/`.

## 1. Tóm tắt Thấu hiểu (Understanding Summary)

*   **Phạm vi:** 1 tệp mục lục chính `security/oauth/README.md` và 19 tệp nội dung phân bổ trong 5 thư mục con (`overview`, `api_security_concepts`, `oauth_for_server_side_app`, `oauth_for_spa`, `openidconnect`).
*   **Mục tiêu:** Nâng cấp hệ thống tài liệu đạt chuẩn cao nhất về tính trực quan, tính khoa học, cấu trúc trang trí thẩm mỹ và khả năng liên kết hoàn hảo không lỗi.
*   **Người sử dụng:** Lập trình viên đang tìm hiểu sâu về luồng xác thực/ủy quyền mật mã và thực chiến bảo mật API.

---

## 2. Các Giả định Thiết kế (Design Assumptions)

*   **Khả năng tương thích nền tảng:** Toàn bộ liên kết tương đối sẽ dùng kiểu chữ thường `snake_case` không dấu để tránh lỗi phân biệt chữ hoa/thường (Case-sensitivity) trên hệ điều hành Linux/Unix.
*   **Sơ đồ Mermaid:** Thiết kế tối giản, trực quan, hỗ trợ tự động thích ứng Light/Dark theme của môi trường xem (IDE, GitHub) mà không dùng cấu hình tĩnh.

---

## 3. Nhật ký Quyết định (Decision Log)

| Quyết định | Giải pháp Lựa chọn | Phương án Thay thế | Lý do Lựa chọn |
| :--- | :--- | :--- | :--- |
| **Bố cục Tài liệu** | **Tái cấu trúc từng Mô-đun độc lập (19 file)** | Gom nhóm thành 5 tệp master lớn | Bảo toàn nguyên vẹn tính độc lập, chuyên sâu và mạch giảng giải của tác giả; dễ tra cứu và mở rộng sau này. |
| **Quản lý Ảnh tĩnh** | **Đưa vào thư mục `assets/` con + Đổi tên snake_case** | Xóa hoàn toàn ảnh tĩnh; hoặc giữ nguyên vị trí cũ | Sắp xếp ngăn nắp tài nguyên; vá lỗi liên kết hỏng; giữ lại hình ảnh vẽ tay/đồ họa chất lượng cao làm tài liệu tham khảo song song. |
| **Sơ đồ Trình tự** | **Tích hợp thêm sơ đồ Mermaid thích ứng song song** | Chỉ dùng ảnh tĩnh cũ | Sơ đồ Mermaid nhẹ, đáp ứng tốt chế độ sáng/tối, hỗ trợ tìm kiếm chữ và dễ dàng chỉnh sửa nội dung mã nguồn. |

---

## 4. Kế hoạch Triển khai Chi tiết (Phân kỳ Thực hiện)

### Giai đoạn 1: Đổi tên và Quy hoạch Tài nguyên (Renaming & Asset Migration)
Thực hiện đổi tên thư mục, file và di chuyển ảnh tĩnh bằng lệnh Git an toàn:
1.  Đổi tên thư mục `oauth_for_SPA/` thành `oauth_for_spa/`.
2.  Di chuyển và đổi tên các file Markdown chứa ký tự viết hoa:
    *   `oauth_for_SPA/authorization_code_flow_for_SPA.md` $\rightarrow$ `oauth_for_spa/authorization_code_flow_for_spa.md`.
    *   `openidconnect/how_ID_token_diff_from_access_token.md` $\rightarrow$ `openidconnect/how_id_token_diff_from_access_token.md`.
    *   `openidconnect/obtaining_an_ID_token.md` $\rightarrow$ `openidconnect/obtaining_an_id_token.md`.
    *   `openidconnect/validating_and_using_an_ID_token.md` $\rightarrow$ `openidconnect/validating_and_using_an_id_token.md`.
    *   `openidconnect/what_is_ID_token.md` $\rightarrow$ `openidconnect/what_is_id_token.md`.
3.  Tạo các thư mục con `assets/` và đổi tên các ảnh tĩnh:
    *   Trong `oauth_for_server_side_app/assets/`:
        *   `image.png` $\rightarrow$ `step_1_create_pkce_secret.png`
        *   `image-1.png` $\rightarrow$ `step_2_redirect_to_auth_server.png`
        *   `image-2.png` $\rightarrow$ `front_channel_explanation.png`
        *   `image-3.png` $\rightarrow$ `step_3_return_auth_code.png`
        *   `image-4.png` $\rightarrow$ `step_4_back_channel_exchange.png`
        *   `image-5.png` $\rightarrow$ `step_5_call_api_with_token.png`
    *   Trong `oauth_for_spa/assets/`:
        *   `image.png` $\rightarrow$ `spa_auth_code_flow_overview.png`

### Giai đoạn 2: Chuẩn hóa Mục lục chính Chuyên đề (Refactor security/oauth/README.md)
*   Chuyển đổi các thẻ `<details>` và `<summary>` cũ sang cấu trúc phân cấp danh sách rõ ràng, thẩm mỹ.
*   Cập nhật 100% đường dẫn trỏ chính xác đến các file/thư mục viết thường mới.
*   Thêm liên kết chân trang điều hướng về `../../README.md`.

### Giai đoạn 3: Chuẩn hóa Mô-đun 1 - Tổng quan (overview/)
*   **File:** `oauth_vs_oidc.md`.
*   **Nội dung:** Chuẩn hóa H1, thêm mục lục TOC, đổi blockquotes sang Alerts, thêm chân trang điều hướng. Vẽ sơ đồ băm trực quan phân tách vai trò giữa OAuth và OIDC.

### Giai đoạn 4: Chuẩn hóa Mô-đun 2 - Khái niệm Bảo mật (api_security_concepts/)
*   **Danh sách file:** `app_identity.md`, `application_types.md`, `front_channel_&_back_channel.md`, `oauth_clients.md`, `roles_permissions.md`, `user_consent.md`.
*   **Cải tiến:**
    *   *roles_permissions.md:* Thêm sơ đồ Mermaid luồng hoạt động 5 bước của OAuth 2.0.
    *   *front_channel_&_back_channel.md:* Thêm sơ đồ so sánh trực quan cơ chế Front-channel (qua trình duyệt) và Back-channel (trực tiếp qua API HTTPS).
    *   Áp dụng đồng bộ cấu trúc H1, TOC, Alerts, chân trang điều hướng cho cả 6 tệp tin.

### Giai đoạn 5: Chuẩn hóa Mô-đun 3 - Web Application Server-Side (oauth_for_server_side_app/)
*   **Danh sách file:** `registering.md`, `authorization_code_flow_for_web_application.md`.
*   **Cải tiến:**
    *   Cập nhật lại toàn bộ đường dẫn ảnh tĩnh mới trỏ vào tệp trong `assets/`.
    *   *authorization_code_flow_for_web_application.md:* Tích hợp thêm **Sơ đồ trình tự Mermaid toàn diện cho Authorization Code Flow (Server-side)** có kèm Client Secret.
    *   Áp dụng H1, TOC, Alerts, chân trang điều hướng.

### Giai đoạn 6: Chuẩn hóa Mô-đun 4 - SPA Trình duyệt (oauth_for_spa/)
*   **Danh sách file:** `authorization_code_flow_for_spa.md`, `problem_with_browser_env.md`, `protecting_browser_with_backend.md`, `protecting_token_in_browser.md`.
*   **Cải tiến:**
    *   *authorization_code_flow_for_spa.md:* Tích hợp **Sơ đồ trình tự Mermaid cho Authorization Code Flow với PKCE** (Public Client).
    *   Cập nhật đường dẫn ảnh tĩnh trong `assets/`.
    *   Áp dụng H1, TOC, Alerts, chân trang điều hướng.

### Giai đoạn 7: Chuẩn hóa Mô-đun 5 - OpenID Connect (openidconnect/)
*   **Danh sách file:** `how_id_token_diff_from_access_token.md`, `hybrid_openid_connect_flow.md`, `obtaining_an_id_token.md`, `validating_and_using_an_id_token.md`, `what_is_id_token.md`.
*   **Cải tiến:**
    *   *hybrid_openid_connect_flow.md:* Vẽ **Sơ đồ trình tự Mermaid cho OIDC Hybrid Flow**.
    *   Áp dụng đồng bộ cấu trúc H1, TOC, Alerts, chân trang điều hướng cho cả 5 tệp tin.

### Giai đoạn 8: Hậu kiểm và Nghiệm thu (Verification & QA)
*   Chạy công cụ kiểm tra tính toàn vẹn của toàn bộ liên kết nội bộ.
*   Kiểm tra tính thẩm mỹ hiển thị của các sơ đồ Mermaid trên cả hai chế độ sáng/tối.

---

## 5. Quy trình Kiểm thử Nghiệm thu (QA Checklist)

- [ ] 100% tệp tin chi tiết bắt đầu bằng duy nhất 1 tiêu đề H1.
- [ ] 100% tiêu đề H2 được phân tách logic bằng đường kẻ ngang `---`.
- [ ] Mọi tệp chi tiết đều có phần `## Mục lục` hoạt động chính xác.
- [ ] Tất cả blockquotes cũ được chuyển đổi thành Alerts `> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`, `> [!IMPORTANT]`.
- [ ] Mọi sơ đồ Mermaid đều kết xuất chính xác, văn bản đọc tốt ở cả giao diện tối và sáng.
- [ ] Không có liên kết hỏng (Broken Link) nào tồn tại.
- [ ] Chân trang điều hướng `[← Quay lại mục lục](README.md)` hiện diện ở cuối tất cả các tệp con.
