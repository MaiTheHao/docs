# Bố cục Template

## 1 Bao gồm các đoạn template

Định nghĩa và tham chiếu fragment  
Trong các template, chúng ta thường muốn bao gồm các phần từ template khác, như footer, header, menu...

Để làm được điều này, Thymeleaf yêu cầu chúng ta định nghĩa các phần này, gọi là “fragment”, để chèn vào, sử dụng thuộc tính `th:fragment`.

Giả sử muốn thêm một footer bản quyền chuẩn cho tất cả các trang grocery, ta tạo file `/WEB-INF/templates/footer.html` với nội dung:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
	<body>
		<div th:fragment="copy">&copy; 2011 The Good Thymes Virtual Grocery</div>
	</body>
</html>
```

Đoạn code trên định nghĩa một fragment tên là `copy` có thể dễ dàng chèn vào trang chủ bằng thuộc tính `th:insert` hoặc `th:replace`:

```html
<body>
	...
	<div th:insert="~{footer :: copy}"></div>
</body>
```

📌 **Ghi nhớ:** `th:insert` yêu cầu một biểu thức fragment (`~{...}`), là biểu thức trả về một fragment.

### Cú pháp chỉ định fragment

Cú pháp biểu thức fragment khá đơn giản, có ba dạng:

-   `~{templatename::selector}`: Bao gồm fragment kết quả từ selector trên template `templatename`. Selector có thể là tên fragment, ví dụ: `~{footer :: copy}`.
-   `~{templatename}`: Bao gồm toàn bộ template tên `templatename`.
-   `~{::selector}` hoặc `~{this::selector}`: Chèn fragment từ chính template hiện tại, khớp selector.

Cả `templatename` và `selector` đều có thể là biểu thức đầy đủ (kể cả điều kiện):

```html
<div th:insert="~{ footer :: (${user.isAdmin}? #{footer.admin} : #{footer.normaluser}) }"></div>
```

Fragment có thể chứa bất kỳ thuộc tính `th:*`. Các thuộc tính này sẽ được đánh giá khi fragment được chèn vào template đích và có thể truy cập biến context của template đích.

💡 **Mẹo:** Fragment có thể viết trong trang hoàn chỉnh, hợp lệ với trình duyệt, vẫn có thể chèn vào template khác bằng Thymeleaf.

### Tham chiếu fragment không dùng th:fragment

Nhờ Markup Selector, có thể chèn fragment không dùng thuộc tính `th:fragment`, thậm chí là markup từ ứng dụng khác:

```html
<div id="copy-section">&copy; 2011 The Good Thymes Virtual Grocery</div>
```

Chỉ cần tham chiếu bằng id như CSS selector:

```html
<body>
	...
	<div th:insert="~{footer :: #copy-section}"></div>
</body>
```

### Phân biệt th:insert và th:replace

-   `th:insert`: Chèn fragment làm nội dung của thẻ chủ.
-   `th:replace`: Thay thế thẻ chủ bằng fragment.

Ví dụ:

```html
<footer th:fragment="copy">&copy; 2011 The Good Thymes Virtual Grocery</footer>
```

Chèn hai lần:

```html
<body>
	...
	<div th:insert="~{footer :: copy}"></div>
	<div th:replace="~{footer :: copy}"></div>
</body>
```

Kết quả:

```html
<body>
	...
	<div>
		<footer>&copy; 2011 The Good Thymes Virtual Grocery</footer>
	</div>
	<footer>&copy; 2011 The Good Thymes Virtual Grocery</footer>
</body>
```

---

## 2 Chữ ký fragment có thể truyền tham số

Để tạo fragment giống hàm, có thể định nghĩa tham số trong `th:fragment`:

```html
<div th:fragment="frag (onevar,twovar)">
	<p th:text="${onevar} + ' - ' + ${twovar}">...</p>
</div>
```

Gọi fragment bằng hai cách:

```html
<div th:replace="~{ ::frag (${value1},${value2}) }">...</div>
<div th:replace="~{ ::frag (onevar=${value1},twovar=${value2}) }">...</div>
```

Thứ tự không quan trọng:

```html
<div th:replace="~{ ::frag (twovar=${value2},onevar=${value1}) }">...</div>
```

#### Biến cục bộ fragment không có tham số

Fragment không có tham số vẫn có thể truyền biến cục bộ:

```html
<div th:fragment="frag">...</div>
<div th:replace="~{::frag (onevar=${value1},twovar=${value2})}"></div>
```

Tương đương với:

```html
<div th:replace="~{::frag}" th:with="onevar=${value1},twovar=${value2}"></div>
```

📌 **Ghi nhớ:** Truyền biến cục bộ không làm rỗng context, fragment vẫn truy cập được biến context của template gọi.

#### th:assert kiểm tra điều kiện trong template

`th:assert` nhận danh sách biểu thức, tất cả phải trả về true, nếu không sẽ báo lỗi:

```html
<div th:assert="${onevar},(${twovar} != 43)">...</div>
```

Áp dụng kiểm tra tham số:

```html
<header th:fragment="contentheader(title)" th:assert="${!#strings.isEmpty(title)}">...</header>
```

---

## 3 Bố cục linh hoạt: hơn cả chèn fragment

Nhờ biểu thức fragment, có thể truyền tham số là fragment markup.

Ví dụ sử dụng biến `title` và `links`:

```html
<head th:fragment="common_header(title,links)">
	<title th:replace="${title}">The awesome application</title>
	<!-- Common styles and scripts -->
	<link rel="stylesheet" type="text/css" media="all" th:href="@{/css/awesomeapp.css}" />
	<link rel="shortcut icon" th:href="@{/images/favicon.ico}" />
	<script type="text/javascript" th:src="@{/sh/scripts/codebase.js}"></script>
	<!--/* Placeholder cho các link bổ sung */-->
	<th:block th:replace="${links}" />
</head>
```

Gọi fragment:

```html
<head th:replace="~{ base :: common_header(~{::title},~{::link}) }">
	<title>Awesome - Main</title>
	<link rel="stylesheet" th:href="@{/css/bootstrap.min.css}" />
	<link rel="stylesheet" th:href="@{/themes/smoothness/jquery-ui.css}" />
</head>
```

Kết quả:

```html
<head>
	<title>Awesome - Main</title>
	<!-- Common styles and scripts -->
	<link rel="stylesheet" type="text/css" media="all" href="/awe/css/awesomeapp.css" />
	<link rel="shortcut icon" href="/awe/images/favicon.ico" />
	<script type="text/javascript" src="/awe/sh/scripts/codebase.js"></script>
	<link rel="stylesheet" href="/awe/css/bootstrap.min.css" />
	<link rel="stylesheet" href="/awe/themes/smoothness/jquery-ui.css" />
</head>
```

#### Sử dụng fragment rỗng

Fragment đặc biệt `~{}` dùng để chỉ không có markup:

```html
<head th:replace="~{ base :: common_header(~{::title},~{}) }">
	<title>Awesome - Main</title>
</head>
```

Kết quả:

```html
<head>
	<title>Awesome - Main</title>
	<!-- Common styles and scripts -->
	<link rel="stylesheet" type="text/css" media="all" href="/awe/css/awesomeapp.css" />
	<link rel="shortcut icon" href="/awe/images/favicon.ico" />
	<script type="text/javascript" src="/awe/sh/scripts/codebase.js"></script>
</head>
```

#### Sử dụng token no-operation

Token no-op (`_`) dùng để giữ nguyên markup mặc định của fragment:

```html
<head th:replace="~{base :: common_header(_,~{::link})}">
	<title>Awesome - Main</title>
	<link rel="stylesheet" th:href="@{/css/bootstrap.min.css}" />
	<link rel="stylesheet" th:href="@{/themes/smoothness/jquery-ui.css}" />
</head>
```

Kết quả:

```html
<head>
	<title>The awesome application</title>
	<!-- Common styles and scripts -->
	<link rel="stylesheet" type="text/css" media="all" href="/awe/css/awesomeapp.css" />
	<link rel="shortcut icon" href="/awe/images/favicon.ico" />
	<script type="text/javascript" src="/awe/sh/scripts/codebase.js"></script>
	<link rel="stylesheet" href="/awe/css/bootstrap.min.css" />
	<link rel="stylesheet" href="/awe/themes/smoothness/jquery-ui.css" />
</head>
```

#### Chèn fragment có điều kiện

Kết hợp fragment rỗng và no-op để chèn fragment theo điều kiện:

```html
<div th:insert="${user.isAdmin()} ? ~{common :: adminhead} : ~{}">...</div>
```

Hoặc giữ nguyên markup nếu điều kiện không thỏa:

```html
<div th:insert="${user.isAdmin()} ? ~{common :: adminhead} : _">Welcome [[${user.name}]], click <a th:href="@{/support}">here</a> for help-desk support.</div>
```

Kiểm tra tồn tại fragment:

```html
<div th:insert="~{common :: salutation} ?: _">Welcome [[${user.name}]], click <a th:href="@{/support}">here</a> for help-desk support.</div>
```

---

## 4 Loại bỏ fragment template

Ví dụ template danh sách sản phẩm:

```html
<table>
	<tr>
		<th>NAME</th>
		<th>PRICE</th>
		<th>IN STOCK</th>
		<th>COMMENTS</th>
	</tr>
	<tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
		<td th:text="${prod.name}">Onions</td>
		<td th:text="${prod.price}">2.41</td>
		<td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
		<td>
			<span th:text="${#lists.size(prod.comments)}">2</span> comment/s
			<a href="comments.html" th:href="@{/product/comments(prodId=${prod.id})}" th:unless="${#lists.isEmpty(prod.comments)}">view</a>
		</td>
	</tr>
</table>
```

Nếu mở trực tiếp bằng trình duyệt, chỉ có một dòng dữ liệu mẫu. Để prototype thực tế hơn, thêm vài dòng:

```html
<table>
	<tr>
		<th>NAME</th>
		<th>PRICE</th>
		<th>IN STOCK</th>
		<th>COMMENTS</th>
	</tr>
	<tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
		<td th:text="${prod.name}">Onions</td>
		<td th:text="${prod.price}">2.41</td>
		<td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
		<td>
			<span th:text="${#lists.size(prod.comments)}">2</span> comment/s
			<a href="comments.html" th:href="@{/product/comments(prodId=${prod.id})}" th:unless="${#lists.isEmpty(prod.comments)}">view</a>
		</td>
	</tr>
	<tr class="odd">
		<td>Blue Lettuce</td>
		<td>9.55</td>
		<td>no</td>
		<td><span>0</span> comment/s</td>
	</tr>
	<tr>
		<td>Mild Cinnamon</td>
		<td>1.99</td>
		<td>yes</td>
		<td>
			<span>3</span> comment/s
			<a href="comments.html">view</a>
		</td>
	</tr>
</table>
```

Khi Thymeleaf xử lý, hai dòng cuối vẫn còn vì chỉ dòng đầu có lặp.

Để loại bỏ, dùng thuộc tính `th:remove` trên hai dòng cuối:

```html
<tr class="odd" th:remove="all">
	<td>Blue Lettuce</td>
	<td>9.55</td>
	<td>no</td>
	<td><span>0</span> comment/s</td>
</tr>
<tr th:remove="all">
	<td>Mild Cinnamon</td>
	<td>1.99</td>
	<td>yes</td>
	<td>
		<span>3</span> comment/s
		<a href="comments.html">view</a>
	</td>
</tr>
```

Kết quả sau xử lý:

```html
<table>
	<tr>
		<th>NAME</th>
		<th>PRICE</th>
		<th>IN STOCK</th>
		<th>COMMENTS</th>
	</tr>
	<tr>
		<td>Fresh Sweet Basil</td>
		<td>4.99</td>
		<td>yes</td>
		<td><span>0</span> comment/s</td>
	</tr>
	<tr class="odd">
		<td>Italian Tomato</td>
		<td>1.25</td>
		<td>no</td>
		<td>
			<span>2</span> comment/s
			<a href="/gtvg/product/comments?prodId=2">view</a>
		</td>
	</tr>
	<tr>
		<td>Yellow Bell Pepper</td>
		<td>2.50</td>
		<td>yes</td>
		<td><span>0</span> comment/s</td>
	</tr>
	<tr class="odd">
		<td>Old Cheddar</td>
		<td>18.75</td>
		<td>yes</td>
		<td>
			<span>1</span> comment/s
			<a href="/gtvg/product/comments?prodId=4">view</a>
		</td>
	</tr>
</table>
```

#### Ý nghĩa giá trị thuộc tính th:remove

`th:remove` có 5 giá trị:

| Giá trị         | Ý nghĩa                               |
| --------------- | ------------------------------------- |
| `all`           | Xóa cả thẻ chứa và toàn bộ con        |
| `body`          | Giữ thẻ chứa, xóa toàn bộ con         |
| `tag`           | Xóa thẻ chứa, giữ nguyên con          |
| `all-but-first` | Xóa toàn bộ con trừ phần tử đầu tiên  |
| `none`          | Không làm gì (dùng cho đánh giá động) |

💡 **Mẹo:** `all-but-first` giúp tiết kiệm khi prototype:

```html
<tbody th:remove="all-but-first">
	<tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
		<td th:text="${prod.name}">Onions</td>
		<td th:text="${prod.price}">2.41</td>
		<td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
		<td>
			<span th:text="${#lists.size(prod.comments)}">2</span> comment/s
			<a href="comments.html" th:href="@{/product/comments(prodId=${prod.id})}" th:unless="${#lists.isEmpty(prod.comments)}">view</a>
		</td>
	</tr>
	<tr class="odd">
		<td>Blue Lettuce</td>
		<td>9.55</td>
		<td>no</td>
		<td><span>0</span> comment/s</td>
	</tr>
	<tr>
		<td>Mild Cinnamon</td>
		<td>1.99</td>
		<td>yes</td>
		<td>
			<span>3</span> comment/s
			<a href="comments.html">view</a>
		</td>
	</tr>
</tbody>
```

`th:remove` nhận bất kỳ biểu thức Thymeleaf Standard Expression trả về giá trị hợp lệ (`all`, `tag`, `body`, `all-but-first`, `none`):

```html
<a href="/something" th:remove="${condition}? tag : none">Link text not to be removed</a>
```

Nếu trả về `null`, sẽ tương đương với `none`:

```html
<a href="/something" th:remove="${condition}? tag">Link text not to be removed</a>
```

---

## 5 Kế thừa bố cục

Để có một file làm layout, dùng fragment. Ví dụ layout đơn giản với `title` và `content`:

```html
<!DOCTYPE html>
<html th:fragment="layout (title, content)" xmlns:th="http://www.thymeleaf.org">
	<head>
		<title th:replace="${title}">Layout Title</title>
	</head>
	<body>
		<h1>Layout H1</h1>
		<div th:replace="${content}">
			<p>Layout content</p>
		</div>
		<footer>Layout footer</footer>
	</body>
</html>
```

File kế thừa layout:

```html
<!DOCTYPE html>
<html th:replace="~{layoutFile :: layout(~{::title}, ~{::section})}">
	<head>
		<title>Page Title</title>
	</head>
	<body>
		<section>
			<p>Page content</p>
			<div>Included on page</div>
		</section>
	</body>
</html>
```

Thẻ `html` sẽ bị thay thế bởi layout, trong layout, `title` và `content` sẽ được thay bằng các block tương ứng.

Có thể chia layout thành nhiều fragment như header, footer nếu muốn.
