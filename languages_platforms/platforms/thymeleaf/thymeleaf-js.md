Triển khai js vào Thymeleaf gồm 3 cách chính:
inline, internal và external.
Dưới đây là hướng dẫn chi tiết từng cách.

---

### **1. Inline JavaScript**

> Cách này giúp bạn nhúng trực tiếp mã JS vào trong thẻ `<script>`.

```html
<script th:inline="javascript">
	/*<![CDATA[*/
	var username = /*[[${user.name}]]*/ 'Guest';
	alert('Hello, ' + username + '!');
	/*]]>*/
</script>
```

Sử dụng cách trên Thymeleaf sẽ gen ra mã JS chuẩn.
Note:

-   `/*<![CDATA[*/` và `/*]]>*/` giúp tránh lỗi khi có ký tự đặc biệt trong JS. Ví dụ như `<` hoặc `&`.
-   `/*[[${user.name}]]*/` là cú pháp Thymeleaf để chèn giá trị biến `user.name` vào JS.
-   `'Guest'` là giá trị mặc định nếu biến `user.name` không tồn tại.
-   Lưu ý với `/*[[${user.name}]]*/` là HTML Expression, nên nếu giá trị có dấu nháy đơn `'` thì cần escape đúng cách. Còn `/*[(${user.name})]*/` là JavaScript Expression, sẽ không cần escape.

Ví dụ truyền `users` từ controller:

```html
<script th:inline="javascript">
	/*<![CDATAp[*/
	var users = /*[[${users}]]*/ [];
	console.log(users);
	/*]]>*/
</script>
```

Kết quả:

-   Nếu `users` là danh sách rỗng, JS sẽ nhận `var users = [];`
-   Nếu `users` có phần tử, ví dụ `["Alice", "Bob"]`, JS sẽ nhận `var users = ["Alice", "Bob"];`

### **2. Internal JavaScript**

> Cách này giúp bạn viết mã JS bên trong thẻ `<script>` nhưng không inline.

```html
<script th:src="@{/js/app.js}"></script>
```

Trong file `app.js`:

```javascript
document.addEventListener('DOMContentLoaded', function () {
	var username = /*[[${user.name}]]*/ 'Guest';
	alert('Hello, ' + username + '!');
});
```

Lưu ý: Cách này không hỗ trợ trực tiếp Thymeleaf expressions trong file JS. Bạn cần truyền dữ liệu từ HTML sang JS qua các biến toàn cục hoặc data attributes.

Tại sao không đơn giản `<script src="/js/app.js"></script>`?

-   Sử dụng `th:src` giúp Thymeleaf xử lý đường dẫn đúng với cấu hình ứng dụng, ví dụ khi có context path.
-   Khi nào không cần dùng `th:src`? Khi bạn chắc chắn đường dẫn tĩnh và không cần Thymeleaf xử lý.

### **3. External JavaScript**

> Cách này giúp bạn tách biệt hoàn toàn mã JS ra file riêng và không sử dụng Thymeleaf trong file JS.

```html
<script src="/js/app.js"></script>
<!-- hoặc CDN link -->
```

Trong file `app.js`:

```javascript
document.addEventListener('DOMContentLoaded', function () {
	alert('Hello, World!');
});
```
