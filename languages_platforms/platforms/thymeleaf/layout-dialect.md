# Layout Dialect

---

## 1. Vấn đề khi không có Layout Dialect

> **Vấn đề chính:**
>
> -   Sự lặp lại (code duplication)
> -   Tính nhất quán (consistency) trong các trang web

Một website với nhiều trang thường có các phần giống nhau:

-   **Header:** Chứa logo, menu điều hướng
-   **Footer:** Thông tin liên hệ, bản quyền
-   **Thư viện CSS/JS:** Bootstrap, jQuery, hoặc tùy chỉnh
-   **Cấu trúc layout chung:** Sidebar, vùng nội dung chính

Nếu không có cơ chế layout, bạn phải **copy-paste** các đoạn HTML này vào từng trang, dẫn đến:

| Vấn đề                   | Hệ quả                                                          |
| :----------------------- | :-------------------------------------------------------------- |
| Bảo trì khó khăn         | Sửa menu phải sửa từng file, dễ bỏ sót, gây lỗi không nhất quán |
| Code cồng kềnh, dài dòng | Nhiều code trùng lặp, khó đọc, khó quản lý                      |
| Dễ phát sinh lỗi         | Copy-paste dễ sai sót, ví dụ quên đóng thẻ div                  |

---

## 2. Tại sao cần Layout Dialect cho Thymeleaf?

Thymeleaf là engine template mạnh mẽ, nhưng **khả năng tái sử dụng layout không phải là điểm mạnh cốt lõi**.

**Layout Dialect** là một dialect mở rộng giúp quản lý layout hiệu quả, tích hợp trực tiếp với cú pháp Thymeleaf.

> 📌 **Ghi nhớ:**  
> Layout Dialect bổ sung khả năng kế thừa và sắp xếp layout mà Thymeleaf thuần túy không cung cấp tối ưu.

---

## 3. Cài đặt Layout Dialect với Maven

Thêm vào `pom.xml`:

```xml
<dependency>
    <groupId>nz.net.ultraq.thymeleaf</groupId>
    <artifactId>thymeleaf-layout-dialect</artifactId>
    <version>3.2.0</version>
</dependency>
```

Nếu dùng Spring Boot, Layout Dialect sẽ tự động cấu hình.

---

## 4. Cách hoạt động của Layout Dialect

### 4.1. Tạo Layout Template

```html
<!-- layout.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">
	<head>
		<title>My Site</title>
		<link rel="stylesheet" th:href="@{/css/main.css}" />
	</head>
	<body>
		<header>
			<h1>Header chung của tất cả trang</h1>
			<nav>... menu ...</nav>
		</header>
		<section layout:fragment="content">
			<!-- Vùng chứa nội dung thay đổi -->
		</section>
		<footer>Footer chung</footer>
	</body>
</html>
```

### 4.2. Tạo Trang Con kế thừa Layout

```html
<!-- home.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout" layout:decorate="~{layout}">
	<!-- Chỉ định layout để kế thừa -->
	<div layout:fragment="content">
		<h1>Chào mừng đến trang chủ!</h1>
		<p>Đây là nội dung DUY NHẤT của trang chủ.</p>
	</div>
</html>
```

---

## 5. Lợi ích khi dùng Layout Dialect

| Không có Layout Dialect                            | Có Layout Dialect                                          |
| :------------------------------------------------- | :--------------------------------------------------------- |
| Code trùng lặp nhiều (header, footer ở mọi trang). | **DRY (Don't Repeat Yourself):** Code chung chỉ ở một nơi. |
| Bảo trì khó khăn, dễ sai sót.                      | **Bảo trì dễ dàng,** sửa một chỗ, ảnh hưởng mọi nơi.       |
| Khó đảm bảo tính nhất quán.                        | **Nhất quán tuyệt đối** về layout.                         |
| File template lớn, lộn xộn.                        | File template gọn gàng, chỉ chứa nội dung đặc thù.         |

---

## 8. Tổng hợp cú pháp Layout Dialect trong Thymeleaf

Nó mở rộng cú pháp bằng cách thêm một nhóm thuộc tính (`layout:*`) với vài “phép thần thông” chính. Dưới đây là toàn bộ cú pháp quan trọng kèm ý nghĩa thực tế:

---

### **1. `layout:decorate`**

> Dùng trong template con để kế thừa từ layout cha.

```html
<html layout:decorate="~{layout/base}">
	<div layout:fragment="content">
		<p>Nội dung riêng của trang này.</p>
	</div>
</html>
```

_Giải thích:_ Trang này sẽ lấy `layout/base.html` làm bố cục gốc, rồi “bơm” đoạn `layout:fragment="content"` vào phần tương ứng bên trong file `base`.

---

### **2. `layout:fragment`**

> Dùng để đánh dấu vùng có thể được override (ghi đè) hoặc insert nội dung.

Trong file **layout cha**:

```html
<body>
	<header th:replace="fragments/header :: header"></header>
	<main layout:fragment="content">
		<!-- Nội dung mặc định nếu không override -->
	</main>
</body>
```

Trong file **layout con**:

```html
<div layout:fragment="content">
	<p>Trang Home</p>
</div>
```

---

### **3. `layout:include`**

> Dùng để **chèn thêm** một fragment vào vị trí cụ thể (chứ không thay thế hoàn toàn).

```html
<div layout:include="~{fragments/sidebar :: sidebar}"></div>
```

Tức là bạn “nhét” nội dung fragment kia vào đây, nhưng vẫn giữ phần cũ.

---

### **4. `layout:replace`**

> Giống `th:replace`, nhưng hỗ trợ kế thừa layout và xử lý context tốt hơn.

```html
<div layout:replace="~{fragments/footer :: footer}"></div>
```

---

### **5. `layout:title-pattern`**

> Giúp bạn gộp tiêu đề con và cha lại một cách tự động.

Trong file cha:

```html
<title layout:title-pattern="$DECORATOR_TITLE - $CONTENT_TITLE">Website</title>
```

Trong file con:

```html
<title>Trang chủ</title>
```

Kết quả hiển thị:  
**Website - Trang chủ**

---

### **6. `layout:insert` (ít dùng)**

> Gần giống `layout:include`, nhưng chèn nội dung con vào vùng cha được chỉ định.

---

### Tổng quan logic hoạt động

1. `layout:decorate` → xác định layout cha.
2. `layout:fragment` → khai báo vùng có thể ghi đè.
3. `layout:include` / `layout:replace` → chèn thêm hoặc thay nội dung.
4. `layout:title-pattern` → xử lý tiêu đề thông minh.
