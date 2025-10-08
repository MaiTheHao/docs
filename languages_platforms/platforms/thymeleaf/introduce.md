# Giới thiệu về Thymeleaf

Thymeleaf là một template engine hiện đại Server-side-rendering cho Java, hỗ trợ cả môi trường web và standalone.

Mục tiêu chính của Thymeleaf là mang lại các template tự nhiên, thanh lịch vào quy trình phát triển — HTML có thể hiển thị đúng trên trình duyệt và đồng thời hoạt động như prototype tĩnh, giúp tăng cường hợp tác giữa các thành viên trong nhóm.

## Mẫu code Thymeleaf

```html
<table>
	<thead>
		<tr>
			<th th:text="#{msgs.headers.name}">Name</th>
			<th th:text="#{msgs.headers.price}">Price</th>
		</tr>
	</thead>
	<tbody>
		<tr th:each="prod: ${allProducts}">
			<td th:text="${prod.name}">Oranges</td>
			<td th:text="${#numbers.formatDecimal(prod.price, 1, 2)}">0.99</td>
		</tr>
	</tbody>
</table>
```

### Phân tích sơ lược cú pháp

-   `th:text`: Thay thế nội dung của thẻ bằng giá trị động (biến, biểu thức, hoặc message).
-   `th:each`: Lặp qua một collection (ở đây là `allProducts`), tạo một dòng cho mỗi phần tử.
-   `${...}`: Biểu thức truy xuất giá trị từ model hoặc context.
-   `#{...}`: Truy xuất message từ file resource (i18n).
-   `#numbers.formatDecimal(...)`: Hàm tiện ích để định dạng số thập phân.

#### Mở rộng cú pháp

-   `[[${...}]]`: Chèn giá trị động vào nội dung hoặc thuộc tính HTML, tự động escape ký tự đặc biệt.
-   `[(${...})]`: Chèn giá trị động mà không escape ký tự đặc biệt, phù hợp với dữ liệu JSON hoặc HTML thô.
-   `th:if`, `th:unless`: Điều kiện hiển thị phần tử dựa trên biểu thức. Ví dụ: `<span th:if="${user.active}">Active</span>`.
-   `th:attr`: Gán giá trị động cho một hoặc nhiều thuộc tính HTML. Ví dụ: `<a th:attr="href=${link.url}">Link</a>`.
-   `th:replace`, `th:include`: Chèn hoặc thay thế nội dung từ template khác. Ví dụ: `<div th:replace="fragments/header :: header"></div>`.

> [Xem thêm: Trang chủ Thymeleaf](https://www.thymeleaf.org/)
