## Hướng dẫn tích hợp JavaScript với Thymeleaf

Tài liệu này hướng dẫn cách **truyền dữ liệu từ Backend (Java/Spring Model) sang JavaScript** ở phía Client, dành cho người đã biết JavaScript.

Có hai phương pháp chính:

1. **Inline JavaScript**: Viết JS trực tiếp trong file HTML, dùng cú pháp Thymeleaf để inject biến từ server.
2. **External JavaScript (qua Data Attributes)**: Tách biệt file `.js`, truyền dữ liệu qua thuộc tính `data-*` của HTML, JS sẽ đọc từ các thuộc tính này.

---

### 1. Inline JavaScript (`th:inline="javascript"`)

Dùng Thymeleaf để sinh mã JavaScript ngay trong thẻ `<script>`.

**Khi dùng**: Khởi tạo biến JS bằng dữ liệu từ server cho các script nhỏ.

**Cách thực hiện**:

```html
<script th:inline="javascript">
	/*<![CDATA[*/

	// Lấy biến String
	var username = /*[[${username}]]*/ 'Guest';
	console.log('Hello, ' + username);

	// Lấy Object/Array (serialize thành JSON)
	var user = /*[(${user})]*/ {};
	console.log('User ID:', user.id);
	console.log('User Roles:', user.roles);

	/*]]>*/
</script>
```

**Giải thích cú pháp:**

| Cú pháp                     | Ý nghĩa                           | Khi dùng                               |
| --------------------------- | --------------------------------- | -------------------------------------- |
| `/*[(${...})]*/`            | Serialize Object/Array thành JSON | Dùng cho kiểu phức tạp                 |
| `/*[[${...}]]*/`            | Serialize String/Number/Boolean   | Dùng cho kiểu đơn giản                 |
| `/*<![CDATA[*/ ... /*]]>*/` | Bảo vệ ký tự đặc biệt JS          | Luôn dùng với `th:inline="javascript"` |

---

### 2. External JavaScript (Data Attributes)

Tách biệt logic, truyền dữ liệu qua thuộc tính HTML.

**Khi dùng**: Hầu hết trường hợp, giúp code dễ bảo trì và test.

**Bước 1: Gắn dữ liệu vào `data-*`**

```html
<div id="user-info" th:data-user-id="${userId}" th:data-username="${username}" th:data-user-json="/*[(${user})]*/">Xin chào, <span th:text="${username}">Guest</span></div>
```

**Bước 2: Link file JS**

```html
<script th:src="@{/js/app.js}"></script>
```

**Bước 3: Đọc dữ liệu trong JS**

```javascript
// /js/app.js
document.addEventListener('DOMContentLoaded', function () {
	const el = document.getElementById('user-info');
	if (el) {
		const userId = el.dataset.userId;
		const username = el.dataset.username;
		console.log('User ID:', userId);
		console.log('Username:', username);

		try {
			const userObj = JSON.parse(el.dataset.userJson);
			console.log('User Object:', userObj);
			console.log('User Roles:', userObj.roles);
		} catch (e) {
			console.error('Parse user JSON failed', e);
		}
	}
});
```

---

### Tổng kết

| Phương pháp            | Ưu điểm                   | Nhược điểm                |
| ---------------------- | ------------------------- | ------------------------- |
| **Inline**             | Nhanh, tiện cho logic nhỏ | Trộn JS/HTML, khó bảo trì |
| **External (Data-\*)** | Sạch, dễ bảo trì, test    | Cần đọc dữ liệu từ DOM    |

> **Khuyến nghị:** Ưu tiên External/Data Attributes cho mọi tác vụ. Inline chỉ dùng cho biến cấu hình nhỏ.
