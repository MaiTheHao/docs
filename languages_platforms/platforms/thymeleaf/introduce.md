# Giới thiệu về Thymeleaf

Thymeleaf là một "template engine" (bộ máy tạo mẫu) hiện đại phía máy chủ (server-side) cho các ứng dụng Java, được thiết kế để tạo ra các trang HTML động.

Mục tiêu chính của Thymeleaf là cung cấp một cách thanh lịch để tích hợp dữ liệu động vào HTML. Điểm đặc biệt của nó là các file template Thymeleaf vẫn là các file HTML hợp lệ, có thể mở và hiển thị trực tiếp trên trình duyệt (giúp designer dễ dàng xem trước giao diện) mà không bị lỗi.

---

## Ví dụ về cú pháp Thymeleaf

Hãy xem một đoạn mã HTML đơn giản hiển thị danh sách sản phẩm.

```html
<table>
	<thead>
		<tr>
			<th th:text="#{product.name}">Tên Sản Phẩm</th>
			<th th:text="#{product.price}">Giá</th>
		</tr>
	</thead>
	<tbody>
		<tr th:each="prod : ${allProducts}">
			<td th:text="${prod.name}">Cam sành</td>
			<td th:text="${#numbers.formatDecimal(prod.price, 1, 2)}">0.99</td>
		</tr>
	</tbody>
</table>
```

## Phân tích cú pháp

### `th:each="prod : ${allProducts}"`

Đây là một vòng lặp. Nó sẽ lặp qua từng đối tượng `prod` trong danh sách `allProducts` (danh sách này được gửi từ Java Controller). Thẻ `<tr>` này sẽ được nhân bản cho mỗi sản phẩm.

### `th:text="${prod.name}"`

Thuộc tính `th:text` sẽ thay thế toàn bộ nội dung văn bản bên trong thẻ `<td>` bằng giá trị của `prod.name`. Nội dung "Cam sành" chỉ là dữ liệu mẫu để xem trước. Khi chạy, nó sẽ bị thay thế.s

### `th:text="${#numbers.formatDecimal(...)}"`

`#numbers` là một đối tượng tiện ích (utility object) của Thymeleaf, cho phép bạn thực hiện các thao tác định dạng số. Biểu thức này định dạng lại giá sản phẩm theo mẫu (ví dụ: 15.50).

### `th:text="#{product.name}"`

Dấu `#{...}` được sử dụng để lấy văn bản từ các file `messages.properties`. Đây là kỹ thuật dùng cho đa ngôn ngữ (i18n). Nếu không tìm thấy, nó sẽ hiển thị "Tên Sản Phẩm".

---

Tóm lại: Thymeleaf thêm các thuộc tính đặc biệt (bắt đầu bằng `th:`) vào HTML. Máy chủ sẽ đọc các thuộc tính này, xử lý chúng, và trả về một file HTML "sạch" (không còn `th:`) với dữ liệu động đã được chèn vào.

**Xem thêm:** [Bảng tổng hợp cú pháp Thymeleaf](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#standard-expression-syntax)

> 📌 **Ghi nhớ công thức:** Vị trí file thực tế = PREFIX + Tên View + SUFFIX
