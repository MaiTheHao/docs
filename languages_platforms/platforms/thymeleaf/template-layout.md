# Tạo Layout Cơ Bản với Thymeleaf

Khi xây dựng website, các thành phần như **Header** và **Footer** thường xuất hiện trên mọi trang. Nếu copy-paste mã HTML cho từng trang, việc bảo trì sẽ rất khó khăn. Thymeleaf giải quyết vấn đề này bằng cách cho phép tái sử dụng các "mảnh" (fragment) HTML.

---

## 1. Vấn đề: Lặp lại mã nguồn

Ví dụ hai trang có cấu trúc giống nhau:

**`index.html`:**

```html
<body>
	<header>
		<nav>
			<a href="/">Trang chủ</a>
			<a href="/products">Sản phẩm</a>
		</nav>
	</header>
	<main>
		<h1>Đây là Trang chủ</h1>
	</main>
	<footer>&copy; 2025 My Website</footer>
</body>
```

**`products.html`:**

```html
<body>
	<header>
		<nav>
			<a href="/">Trang chủ</a>
			<a href="/products">Sản phẩm</a>
		</nav>
	</header>
	<main>
		<h1>Đây là trang Sản phẩm</h1>
	</main>
	<footer>&copy; 2025 My Website</footer>
</body>
```

Các phần `<header>` và `<footer>` bị lặp lại.

---

## 2. Giải pháp: Sử dụng Fragment

Thay vì lặp lại, hãy định nghĩa các fragment chung và chèn vào trang cần thiết.

### a. Định nghĩa fragment

Tạo file `templates/fragments/common.html`:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
	<body>
		<header th:fragment="header">
			<nav>
				<a href="/">Trang chủ</a>
				<a href="/products">Sản phẩm</a>
			</nav>
		</header>
		<footer th:fragment="footer">&copy; 2025 My Website</footer>
	</body>
</html>
```

### b. Chèn fragment vào trang

**`index.html`:**

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
	<head>
		<title>Trang chủ</title>
	</head>
	<body>
		<div th:replace="~{fragments/common :: header}"></div>
		<main>
			<h1>Đây là Trang chủ</h1>
		</main>
		<div th:replace="~{fragments/common :: footer}"></div>
	</body>
</html>
```

**`products.html`:**

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
	<head>
		<title>Sản phẩm</title>
	</head>
	<body>
		<div th:replace="~{fragments/common :: header}"></div>
		<main>
			<h1>Đây là trang Sản phẩm</h1>
		</main>
		<div th:replace="~{fragments/common :: footer}"></div>
	</body>
</html>
```

> Khi cần sửa menu, chỉ cần chỉnh một file fragment.

---

## 3. `th:insert` vs. `th:replace`

-   `th:insert`: Chèn fragment vào bên trong thẻ chủ, giữ lại thẻ chủ.
-   `th:replace`: Thay thế hoàn toàn thẻ chủ bằng fragment.

**Ví dụ:**

```html
<div th:insert="~{fragments/common :: footer}">Đây là thẻ chủ</div>
<div th:replace="~{fragments/common :: footer}">Đây là thẻ chủ</div>
```

**Kết quả:**

```html
<div>
	Đây là thẻ chủ
	<footer>&copy; 2025 My Website</footer>
</div>
<footer>&copy; 2025 My Website</footer>
```

> `th:replace` giúp HTML gọn gàng, tránh thẻ bọc thừa.

---

## 4. Hạn chế & Hướng phát triển

### Hạn chế của phương pháp fragment cơ bản

-   Việc sử dụng fragment giúp tái sử dụng các phần giao diện như header và footer, nhưng vẫn còn hạn chế:
    -   Các thẻ như `<html>`, `<head>`, `<link>`, `<script>`, và `<body>` vẫn phải lặp lại ở từng trang.
    -   Nếu muốn thay đổi cấu trúc chung, phải chỉnh sửa nhiều file.
    -   Việc tùy biến `<title>` cho từng trang cũng không thuận tiện.

### Hướng phát triển: Thymeleaf Layout Dialect

-   Có thể tối ưu hơn bằng cách định nghĩa một layout chung duy nhất, chỉ cần chèn phần nội dung riêng (ví dụ: `<main>`) vào layout đó.
-   Thymeleaf hỗ trợ truyền fragment như tham số, giúp xây dựng hệ thống layout kế thừa linh hoạt mà không cần dùng thêm thư viện ngoài.
-   Nhờ đó, việc quản lý giao diện tổng thể và tùy biến từng trang trở nên dễ dàng, nhất quán.

> Trong tài liệu tiếp theo, bạn sẽ được hướng dẫn cách dùng Thymeleaf Layout Dialect và áp dụng để xây dựng layout mạnh mẽ hơn với Thymeleaf.
