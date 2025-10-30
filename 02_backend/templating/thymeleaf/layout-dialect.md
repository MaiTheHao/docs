# Hướng Dẫn Thymeleaf Layout Dialect (Tái Sử Dụng Layout)

Thymeleaf Layout Dialect giúp bạn tái sử dụng layout website một cách chuyên nghiệp, tránh lặp lại header/footer ở mọi file HTML. Bạn chỉ cần tạo một "khung sườn" chung, các trang con sẽ tự động "lắp" nội dung của mình vào đó.

---

## 1. Cài Đặt

### Với Spring Boot

Chỉ cần thêm dependency vào `pom.xml`, Spring Boot sẽ tự động nhận diện và kích hoạt:

```xml
<dependency>
	<groupId>nz.net.ultraq.thymeleaf</groupId>
	<artifactId>thymeleaf-layout-dialect</artifactId>
	<version>3.3.0</version>
</dependency>
```

### Không dùng Spring Boot

Thêm dependency và tự cấu hình Dialect vào `TemplateEngine`:

```java
import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;

TemplateEngine templateEngine = new TemplateEngine();
templateEngine.addDialect(new LayoutDialect());
```

---

## 2. Nguyên Tắc Hoạt Động

Layout Dialect dựa trên **Decorator Pattern**:

-   **Layout Cha (`main.html`)**: Định nghĩa các phần chung (header, footer), có "ô trống" để trang con lấp vào.
-   **Trang Con (`home.html`)**: Chỉ chứa nội dung riêng, sẽ được "bọc" bởi layout cha.

---

## 3. Hướng Dẫn Từng Bước

**Cấu trúc thư mục mẫu:**

```
templates/
├── layouts/
│   └── main.html
├── home.html
└── products.html
```

### Bước 1: Tạo Layout Cha

**`layouts/main.html`**

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>My Website</title>
	</head>
	<body>
		<header>
			<h1>Đây là HEADER chung của website</h1>
		</header>
		<main layout:fragment="content">
			<p>Đây là nội dung mặc định nếu trang con không cung cấp.</p>
		</main>
		<footer>
			<p>Đây là FOOTER chung của website</p>
		</footer>
	</body>
</html>
```

> `layout:fragment="content"` là "ô trống" để trang con lấp vào.

### Bước 2: Tạo Trang Con

**`home.html`**

```html
<!DOCTYPE html>
<html lang="en" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout" layout:decorate="~{/layouts/main}">
	<head>
		<title>Trang Chủ</title>
	</head>
	<body>
		<div layout:fragment="content">
			<h2>Chào mừng đến Trang Chủ</h2>
			<p>Đây là nội dung riêng biệt của trang chủ.</p>
		</div>
	</body>
</html>
```

### Bước 3: Kết Quả

Khi render, nội dung của `home.html` sẽ được lắp vào "ô trống" của layout cha:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Trang Chủ</title>
	</head>
	<body>
		<header>
			<h1>Đây là HEADER chung của website</h1>
		</header>
		<main>
			<div>
				<h2>Chào mừng đến Trang Chủ</h2>
				<p>Đây là nội dung riêng biệt của trang chủ.</p>
			</div>
		</main>
		<footer>
			<p>Đây là FOOTER chung của website</p>
		</footer>
	</body>
</html>
```

---

## 4. Tùy Chỉnh Tiêu Đề `<title>`

**Trong layout cha:**

```html
<head>
	<title layout:title-pattern="$CONTENT_TITLE | $DECORATOR_TITLE">My App</title>
</head>
```

**Trong trang con:**

```html
<head>
	<title>Trang Chủ</title>
</head>
```

> Kết quả: `Trang Chủ | My App`

---

## 5. Kết Hợp layout:decorate và th:replace

Nên quản lý các fragment (header/footer) ở file riêng và chèn vào layout bằng `th:replace`.

**`fragments/common.html`**

```html
<header th:fragment="page-header">
	<h1>Đây là Header từ file fragment</h1>
</header>
<footer th:fragment="page-footer">
	<p>Đây là Footer từ file fragment</p>
</footer>
```

**`layouts/main.html`**

```html
<!DOCTYPE html>
<html lang="en" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">
	<head>
		<title layout:title-pattern="$CONTENT_TITLE | $DECORATOR_TITLE">My App</title>
	</head>
	<body>
		<div th:replace="~{/fragments/common :: page-header}"></div>
		<main layout:fragment="content">
			<p>Nội dung mặc định</p>
		</main>
		<div th:replace="~{/fragments/common :: page-footer}"></div>
	</body>
</html>
```

**`home.html`** (không thay đổi)

```html
<!DOCTYPE html>
<html lang="en" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout" layout:decorate="~{/layouts/main}">
	<head>
		<title>Trang Chủ</title>
	</head>
	<body>
		<div layout:fragment="content">
			<h2>Nội dung chính của trang chủ</h2>
		</div>
	</body>
</html>
```

---

> **Tham khảo:** [Thymeleaf Layout Dialect Documentation](https://ultraq.github.io/thymeleaf-layout-dialect/)
