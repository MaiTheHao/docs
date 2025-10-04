# Giới thiệu về Thymeleaf

Thymeleaf là một template engine hiện đại Server-side-rendering cho Java, hỗ trợ cả môi trường web và standalone.

Mục tiêu chính của Thymeleaf là mang lại các template tự nhiên, thanh lịch vào quy trình phát triển — HTML có thể hiển thị đúng trên trình duyệt và đồng thời hoạt động như prototype tĩnh, giúp tăng cường hợp tác giữa các thành viên trong nhóm.

Thymeleaf cung cấp module cho Spring Framework, tích hợp với nhiều công cụ phổ biến, và khả năng mở rộng chức năng tùy chỉnh, phù hợp cho phát triển web HTML5 trên JVM hiện đại — và còn nhiều hơn thế nữa.
Các template HTML viết bằng Thymeleaf vẫn giữ nguyên cú pháp HTML, cho phép template chạy trong ứng dụng vừa là artifact thiết kế hữu ích.

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

> [Xem thêm: Trang chủ Thymeleaf](https://www.thymeleaf.org/)
