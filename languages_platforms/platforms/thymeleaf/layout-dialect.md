# Thymeleaf Layout Dialect

Layout Dialect là một phần mở rộng (dialect) cho Thymeleaf, giúp bạn giải quyết triệt để bài toán **tái sử dụng layout** một cách chuyên nghiệp. Nó cho phép bạn tạo một "khung sườn" chung và chỉ cần thay đổi phần nội dung chính cho từng trang.

---

## 1. Cài đặt

### Thêm dependency vào `pom.xml` (Maven)

```xml
<dependency>
    <groupId>nz.net.ultraq.thymeleaf</groupId>
    <artifactId>thymeleaf-layout-dialect</artifactId>
    <version>3.3.0</version>
</dependency>
```

### Kích hoạt

-   **Với Spring Boot**: Spring Boot sẽ tự động nhận diện và cấu hình Layout Dialect cho bạn.
-   **Không dùng Spring Boot**: Bạn phải tự thêm dialect vào `TemplateEngine`.

    ```java
    import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;

    TemplateEngine templateEngine = new TemplateEngine();
    templateEngine.addDialect(new LayoutDialect());
    ```

---

## 2. Nguyên tắc hoạt động và Cú pháp chính

Layout Dialect hoạt động dựa trên **Decorator Pattern**:

1.  **`layout.html` (Layout cha)**: Là một cái "khung" rỗng, định nghĩa các phần chung (header, footer) và xác định "ô trống" để các trang con lấp vào.
2.  **`home.html` (Trang con)**: Là mảnh nội dung độc nhất, nó sẽ được "lắp" vào "ô trống" của layout cha.

### Các thuộc tính

#### 1. `layout:decorate="~{path/to/layout}"`

Đây là thuộc tính quan trọng nhất, dùng trong **trang con** để chỉ định file layout cha mà nó muốn dùng.

**Ví dụ:** `home.html`

```html
<!DOCTYPE html>
<html xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout" layout:decorate="~{/layouts/main}">
	<body></body>
</html>
```

#### 2. `layout:fragment="fragment-name"`

Thuộc tính này có hai vai trò:

-   **Trong layout cha**: Đánh dấu một vùng là "ô trống" có thể được ghi đè bởi trang con.
-   **Trong trang con**: Đánh dấu đâu là phần nội dung sẽ được "bơm" vào "ô trống" tương ứng của layout cha.

**Ví dụ:** `/layouts/main.html`

```html
<!DOCTYPE html>
<html>
	<body>
		<header>
			<h1>Đây là Header chung</h1>
		</header>

		<main layout:fragment="content">
			<p>Nếu trang con không định nghĩa fragment 'content', nội dung này sẽ hiện ra.</p>
		</main>

		<footer>
			<p>Đây là Footer chung</p>
		</footer>
	</body>
</html>
```

**File trang con:** `home.html`

```html
<!DOCTYPE html>
<html xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout" layout:decorate="~{/layouts/main}">
	<body>
		<div layout:fragment="content">
			<h1>Chào mừng đến Trang Chủ!</h1>
			<p>Đây là nội dung độc nhất của trang chủ sẽ được lắp vào layout.</p>
		</div>
	</body>
</html>
```

**Kết quả cuối cùng khi render `home.html`:** Header và Footer từ `main.html` sẽ bao bọc nội dung từ `home.html`.

---

### Các thuộc tính bổ trợ

#### 3. `layout:title-pattern`

Dùng cho việc tạo các tiêu đề linh hoạt theo từng trang.

**Trong layout cha:**

```html
<head>
	<title layout:title-pattern="$CONTENT_TITLE - $DECORATOR_TITLE">My Website</title>
</head>
```

-   `$CONTENT_TITLE`: Tiêu đề của trang con.
-   `$DECORATOR_TITLE`: Tiêu đề của trang cha.

**Trong trang con:**

```html
<html layout:decorate="~{/layouts/main}">
	<head>
		<title>Sản phẩm</title>
	</head>
	...
</html>
```

**Kết quả tiêu đề trên trình duyệt:** `Sản phẩm - My Website`

#### 4. `layout:replace` và `layout:include`

Hai thuộc tính này tương tự `th:replace` và `th:include` của Thymeleaf, dùng để chèn các mảnh HTML nhỏ (fragments) vào trang. Tuy nhiên, trong thực tế, bạn nên **ưu tiên dùng `th:replace` và `th:insert`** vì chúng là cú pháp lõi của Thymeleaf và đã đủ mạnh mẽ.

**Ví dụ (dùng cú pháp Thymeleaf chuẩn):**

Trong file `main.html`:

```html
<body>
	<div th:replace="~{/fragments/header :: header}"></div>

	<main layout:fragment="content"></main>

	<div th:replace="~{/fragments/footer :: footer}"></div>
</body>
```
