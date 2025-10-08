# Thymeleaf Syntaxs

Đây là bảng tổng hợp các biểu thức và thuộc tính phổ biến nhất trong Thymeleaf, được sắp xếp theo chức năng để bạn dễ dàng tìm kiếm.

### 1. Các Loại Biểu Thức Cơ Bản

Đây là các biểu thức cốt lõi được sử dụng bên trong các thuộc tính `th:*`.

| Cú pháp  | Chức năng                                                                                             | Ví dụ                                                          |
| :------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| `${...}` | Truy cập các biến được truyền từ backend (Model).                                                     | `<span th:text="${user.name}"><span>`                          |
| `*{...}` | Truy cập thuộc tính của một đối tượng đã được chọn trước đó bằng `th:object`. Rất hữu ích trong form. | `<form th:object="${user}"><input th:field="*{name}" /><form>` |
| `#{...}` | Lấy văn bản từ các file `messages.properties` để đa ngôn ngữ (i18n).                                  | `<h1 th:text="#{welcome.title}"><h1>`                          |
| `@{...}` | Tạo URL, tự động thêm context path của ứng dụng.                                                      | `<a th:href="@{/products/all}">View<a>`                        |
| `~{...}` | Tham chiếu đến một mảnh template (fragment) để tái sử dụng.                                           | `<div th:replace="~{fragments/footer :: copy}"><div>`          |

---

### 2. Xử Lý Text & HTML

| Thuộc tính | Chức năng                                                                      | Ví dụ                                     |
| :--------- | :----------------------------------------------------------------------------- | :---------------------------------------- |
| `th:text`  | Thay thế nội dung của thẻ. Tự động escape các ký tự HTML (an toàn, chống XSS). | `<p th:text="${user.description}"></p>`   |
| `th:utext` | Tương tự `th:text` nhưng không escape HTML (Unescaped Text).                   | `<p th:utext="${user.htmlBio}"></p>`      |
| `[[...]]`  | Inlining (Escaped): Cú pháp rút gọn cho `th:text`.                             | `<span>Welcome, [[${user.name}]]!</span>` |
| `[(...)]`  | Inlining (Unescaped): Cú pháp rút gọn cho `th:utext`.                          | `<span>Bio: [(${user.htmlBio})]</span>`   |

---

### 3. Logic Điều Kiện

| Thuộc tính            | Chức năng                                                                     | Ví dụ                                                                                                                        |
| :-------------------- | :---------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `th:if`               | Hiển thị phần tử nếu điều kiện là `true`.                                     | `<div th:if="${user.isAdmin}">Admin Panel</div>`                                                                             |
| `th:unless`           | Ngược lại với `th:if`. Hiển thị phần tử nếu điều kiện là `false` hoặc `null`. | `<div th:unless="${user.isAdmin}">User Panel</div>`                                                                          |
| `th:switch / th:case` | Cấu trúc `switch-case` để xử lý nhiều điều kiện.                              | `<div th:switch="${user.role}"> <p th:case="'ADMIN'">Admin</p> <p th:case="'USER'">User</p> <p th:case="*">Guest</p> </div>` |

---

### 4. Vòng Lặp

| Thuộc tính | Chức năng                                                                                       | Ví dụ                                                                                                                      |
| :--------- | :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `th:each`  | Lặp qua các phần tử của một Collection (List, Set, Map). Cung cấp biến trạng thái (`prodStat`). | `<tr th:each="prod, prodStat : ${products}"> <td th:text="${prodStat.count}"></td> <td th:text="${prod.name}"></td> </tr>` |

---

### 5. Xử Lý Thuộc Tính HTML

| Thuộc tính       | Chức năng                                              | Ví dụ                                                                             |
| :--------------- | :----------------------------------------------------- | :-------------------------------------------------------------------------------- |
| `th:attr`        | Gán giá trị cho một thuộc tính HTML bất kỳ.            | `<img th:attr="src=@{/images/logo.png}, alt=#{logo.alt}" />`                      |
| `th:value`       | Gán giá trị cho thuộc tính `value`.                    | `<input th:value="${user.name}" />`                                               |
| `th:href`        | Gán giá trị cho thuộc tính `href`.                     | `<a th:href="@{/users/details(id=${user.id})}"></a>`                              |
| `th:src`         | Gán giá trị cho thuộc tính `src`.                      | `<img th:src="@{${user.avatarUrl}}" />`                                           |
| `th:classappend` | Nối thêm một class CSS vào thuộc tính `class` hiện có. | `<div class="item" th:classappend="${product.featured} ? 'featured' : ''"></div>` |

---

### 6. Fragment Syntax

| Thuộc tính    | Chức năng                                                     | Ví dụ                                                  |
| :------------ | :------------------------------------------------------------ | :----------------------------------------------------- |
| `th:fragment` | Định nghĩa một mảnh template có thể tái sử dụng.              | `<footer th:fragment="copy">...</footer>`              |
| `th:insert`   | Chèn fragment vào bên trong thẻ chủ. Thẻ chủ được giữ lại.    | `<div th:insert="~{fragments/footer :: copy}"></div>`  |
| `th:replace`  | Thay thế hoàn toàn thẻ chủ bằng fragment. Thẻ chủ bị loại bỏ. | `<div th:replace="~{fragments/footer :: copy}"></div>` |
| `th:remove`   | Xóa một phần tử. Hữu ích để loại bỏ code HTML mẫu.            | `<tr th:remove="all"><td>Example Data</td></tr>`       |

---

### 7. Form và Biến Cục Bộ

| Thuộc tính  | Chức năng                                                                                              | Ví dụ                                                                                                         |
| :---------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `th:object` | Khai báo một đối tượng làm "đối tượng chọn" cho các biểu thức `*{...}` bên trong nó.                   | `<form th:action="@{/save}" th:object="${user}" method="post">...</form>`                                     |
| `th:field`  | "Phép thuật" cho form. Tự động gán các thuộc tính `id`, `name`, `value` dựa trên trường của đối tượng. | `<input type="text" th:field="*{firstName}" />`                                                               |
| `th:with`   | Tạo một biến cục bộ và sử dụng nó trong phạm vi của phần tử đó.                                        | `<div th:with="fullName=${user.firstName} + ' ' + ${user.lastName}"> <p>Welcome, [[${fullName}]]!</p> </div>` |

[Thymeleaf Documentation](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html#using-texts)
