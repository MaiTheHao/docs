# Thymeleaf Fragments

Trong bất kỳ website nào, việc lặp lại mã nguồn cho các thành phần chung như **Header, Footer, hay Menu** là điều không thể tránh khỏi. Thymeleaf cung cấp một giải pháp cho vấn đề này thông qua **Fragments**.

Hiểu đơn giản, **Fragment** là một "mảnh ghép" mà bạn có thể định nghĩa một lần và tái sử dụng ở nhiều nơi.

---

## 1. Các khái niệm cơ bản

### a. Định nghĩa một Fragment

Để đánh dấu một đoạn HTML là một fragment, ta sử dụng thuộc tính `th:fragment`.

Giả sử, ta tạo file `templates/fragments/common.html` để chứa các thành phần chung:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
	<body>
		<footer th:fragment="footer">&copy; 2025 The Good Thymes Virtual Grocery</footer>
	</body>
</html>
```

### b. Chèn Fragment vào trang

Để sử dụng fragment vừa tạo, bạn dùng thuộc tính `th:insert` hoặc `th:replace` với cú pháp biểu thức đặc biệt `~{...}`.

```html
<body>
	<h1>Welcome to our Grocery!</h1>

	<div th:insert="~{fragments/common :: footer}"></div>
</body>
```

**Phân tích cú pháp `~{fragments/common :: footer}`:**

-   `~{...}`: Dấu hiệu để Thymeleaf biết đây là một biểu thức fragment.
-   `fragments/common`: Đường dẫn đến file template chứa fragment (không cần `.html`).
-   `::`: Dấu phân cách.
-   `footer`: Tên của `th:fragment` mà bạn muốn chèn.

### c. `th:insert` vs. `th:replace` - Sự khác biệt cốt lõi

Đây là điểm cực kỳ quan trọng cần phân biệt rõ:

-   `th:insert`: **Chèn** fragment vào **bên trong** thẻ chủ. Thẻ chủ được giữ lại.
-   `th:replace`: **Thay thế** hoàn toàn thẻ chủ bằng fragment. Thẻ chủ bị loại bỏ.

**Ví dụ trực quan:**

```html
<div th:insert="~{fragments/common :: footer}"></div>
<div th:replace="~{fragments/common :: footer}"></div>
```

**Kết quả HTML sau khi Thymeleaf xử lý:**

```html
<div>
	<footer>&copy; 2025 The Good Thymes Virtual Grocery</footer>
</div>

<footer>&copy; 2025 The Good Thymes Virtual Grocery</footer>
```

> Trong hầu hết các trường hợp, `th:replace` thường hữu ích hơn vì nó giữ cho cấu trúc HTML cuối cùng gọn gàng hơn.

### d. Chèn Fragment không cần `th:fragment`

Bạn cũng có thể chèn bất kỳ phần nào của một file template bằng cách sử dụng **CSS selector** (như `id`, `class`).

**Ví dụ:** `fragments/common.html`

```html
<div id="copy-section">&copy; 2025 The Good Thymes Virtual Grocery</div>
```

**Cách chèn:**

```html
<div th:replace="~{fragments/common :: #copy-section}"></div>
```

---

## 2. Fragment như một hàm (Truyền tham số)

Fragments cực kỳ mạnh mẽ khi bạn có thể truyền tham số cho chúng, y hệt như gọi một hàm trong lập trình.

### a. Định nghĩa Fragment với tham số

Bạn khai báo các tham số ngay trong thuộc tính `th:fragment`.

**Ví dụ:** File `fragments/common.html`

```html
<div th:fragment="alert(type, message)">
	<div th:class="'alert alert-' + ${type}">
		<p th:text="${message}">Default message</p>
	</div>
</div>
```

### b. Gọi Fragment và truyền tham số

Bạn có thể truyền giá trị cho tham số khi gọi fragment.

```html
<div th:replace="~{fragments/common :: alert('success', 'Đăng ký thành công!')}"></div>

<div th:replace="~{fragments/common :: alert(message='Nội dung đã được cập nhật.', type='info')}"></div>
```

---

## 3. Kỹ thuật Layout linh hoạt

Đây là kỹ thuật nâng cao nhưng cực kỳ hữu dụng: **truyền một fragment làm tham số cho một fragment khác**. Điều này cho phép bạn tạo ra các layout có cấu trúc chung nhưng nội dung có thể tùy biến linh hoạt.

Hãy tưởng tượng bạn tạo một layout chung `base.html`

```html
<html th:fragment="layout(pageTitle, content)">
	<head>
		<title th:replace="${pageTitle}">Default Title</title>
	</head>
	<body>
		<header>My Website Header</header>

		<main th:replace="${content}">
			<p>Default content goes here...</p>
		</main>

		<footer>My Website Footer</footer>
	</body>
</html>
```

Bây giờ, tại trang `product.html`, bạn "kế thừa" layout này:

```html
<html th:replace="~{layouts/base :: layout(~{::title}, ~{::section})}">
	<head>
		<title>Danh sách sản phẩm</title>
	</head>
	<body>
		<section>
			<h1>Đây là trang sản phẩm</h1>
			<p>Nội dung chi tiết...</p>
		</section>
	</body>
</html>
```

**Luồng hoạt động:**

1.  Thymeleaf thay thế toàn bộ thẻ `<html>` của `product.html` bằng fragment `layout` trong `base.html`.
2.  Nó lấy fragment `~{::title}` (tức là thẻ `<title>...`) từ `product.html` và truyền vào biến `pageTitle`.
3.  Nó lấy fragment `~{::section}` (tức là thẻ `<section>...`) từ `product.html` và truyền vào biến `content`.
4.  Kết quả là một trang HTML hoàn chỉnh kết hợp từ layout chung và nội dung riêng.

**Lưu ý**: Mặc dù kỹ thuật này rất mạnh, đối với việc quản lý layout toàn trang, **[Thymeleaf Layout Dialect](https://github.com/ultraq/thymeleaf-layout-dialect)** là một giải pháp chuyên dụng và cú pháp gọn gàng hơn.

---

## 4. Dọn dẹp mã nguồn mẫu với `th:remove`

Khi thiết kế giao diện, chúng ta thường thêm các dòng dữ liệu tĩnh để xem trước. Tuy nhiên, những dòng này cần bị xóa đi khi Thymeleaf render dữ liệu thật. Thuộc tính `th:remove` được sinh ra cho mục đích này.

**Ví dụ:** Bảng sản phẩm có dữ liệu mẫu.

```html
<table>
	<thead>
		...
	</thead>
	<tbody>
		<tr th:each="prod : ${products}">
			<td th:text="${prod.name}"></td>
			<td th:text="${prod.price}"></td>
		</tr>
		<tr th:remove="all">
			<td>Sample: Blue Lettuce</td>
			<td>9.55</td>
		</tr>
		<tr th:remove="all">
			<td>Sample: Mild Cinnamon</td>
			<td>1.99</td>
		</tr>
	</tbody>
</table>
```

Khi Thymeleaf xử lý, nó sẽ lặp qua danh sách `${products}` và **xóa hoàn toàn** hai thẻ `<tr>` có `th:remove="all"`, trả về một bảng HTML sạch chỉ chứa dữ liệu động.
