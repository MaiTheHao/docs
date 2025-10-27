# Cách Thymeleaf xác định và xử lý template

---

## 1. Nguyên lý cốt lõi

> **Thymeleaf KHÔNG tự "đoán" đường dẫn template. Nó dựa hoàn toàn vào cấu hình `TemplateResolver` mà bạn khai báo.**

---

## 2. Cấu hình TemplateResolver

```java
templateResolver.setPrefix("/WEB-INF/templates/");  // Thư mục gốc
templateResolver.setSuffix(".html");               // Đuôi file mặc định
```

> 📌 **Ghi nhớ:** Vị trí thực tế = PREFIX + templateName + SUFFIX

**Ví dụ:**

-   `templateEngine.process("home/about", context, writer);`
-   → `/WEB-INF/templates/` + `home/about` + `.html`
-   → `/WEB-INF/templates/home/about.html`

---

## 3. Luồng xử lý template

Khi bạn yêu cầu Thymeleaf render một trang, đây là các bước xảy ra:

1. **Controller (Java):** Controller của bạn xử lý request và trả về một tên View (dạng String).
2. **TemplateEngine:** TemplateEngine nhận tên View là `"home"`.
3. **TemplateResolver:** TemplateResolver áp dụng công thức đã cấu hình ở trên:
    - **Prefix:** `/WEB-INF/templates/`
    - **Tên View:** `home`
    - **Suffix:** `.html`
    - **Kết quả:** `/WEB-INF/templates/home.html`
4. **Render:** Thymeleaf tìm, đọc, và xử lý file `home.html` tại đường dẫn đó, chèn biến `userName` vào, và gửi kết quả HTML cuối cùng về cho trình duyệt.

> **Lưu ý với Spring Boot:** Spring Boot rất thông minh. Nó tự động cấu hình một TemplateResolver cho bạn với prefix mặc định là `classpath:/templates/` và suffix là `.html`. Bạn không cần cấu hình thủ công trừ khi muốn thay đổi.

---

## 4. Làm việc với Fragment (Component)

**Template con (`home/about.html`):**

```html
<div th:fragment="mainContent">
	<h2>About Us</h2>
	<p>Nội dung về chúng tôi</p>
</div>
```

**Template cha (`layout/base.html`):**

```html
<main>
	<div th:insert="${content} :: mainContent"></div>
</main>
```

**Servlet:**

```java
vars.put("content", "home/about"); // Truyền tên template
```

---

## 5. Các lỗi thường gặp & giải pháp

| Lỗi                         | Nguyên nhân                         | Fix                                |
| :-------------------------- | :---------------------------------- | :--------------------------------- |
| TemplateResolutionException | Sai prefix/suffix                   | Kiểm tra cấu hình TemplateResolver |
| Fragment không hiển thị     | Quên khai báo `th:fragment`         | Thêm `th:fragment="tenFragment"`   |
| Chèn cả template            | Dùng `th:insert` không chỉ fragment | Thêm `:: fragmentName`             |

---

## 6. Best Practices

> 💡 **Mẹo:** Đặt template trong `/WEB-INF/` để bảo mật, dùng fragment cho component tái sử dụng, đặt tên fragment rõ ràng.

-   Không hardcode đường dẫn template trong Servlet
-   Không quên khai báo fragment khi muốn chèn từng phần

---

## Tóm tắt nhanh

> **Cấu hình** → TemplateResolver định nghĩa prefix/suffix  
> **Tìm kiếm** → prefix + templateName + suffix = đường dẫn thật  
> **Phân tích** → Thymeleaf parse HTML, xử lý `th:*`  
> **Chèn component** → Dùng `th:insert/replace` + `::fragmentName`  
> **Render** → Output kết quả cuối cùng

---

Nếu cần thêm:

-   Code mẫu đầy đủ từ Servlet đến template
-   Sơ đồ tương tác chi tiết giữa các thành phần
-   Các lỗi thực tế và cách debug
