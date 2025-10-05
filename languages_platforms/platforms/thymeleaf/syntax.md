# Bảng Tổng Hợp Syntax của Thymeleaf

| Syntax           | Mô tả                                     | Ví dụ                                        |
| ---------------- | ----------------------------------------- | -------------------------------------------- |
| `${...}`         | Biểu thức biến (Variable Expression)      | `${user.name}`                               |
| `*{...}`         | Biểu thức lựa chọn (Selection Expression) | `*{address.city}`                            |
| `#{...}`         | Biểu thức message (Message Expression)    | `#{welcome.message}`                         |
| `@{...}`         | Biểu thức URL (Link Expression)           | `@{/products/list}`                          |
| `~{...}`         | Biểu thức fragment (Fragment Expression)  | `~{fragments/header}`                        |
| `th:text`        | Hiển thị text, escape HTML                | `<span th:text="${user.name}"></span>`       |
| `th:utext`       | Hiển thị text, không escape HTML          | `<span th:utext="${user.bio}"></span>`       |
| `th:each`        | Lặp qua collection                        | `<li th:each="item : ${items}"></li>`        |
| `th:if`          | Điều kiện hiển thị                        | `<div th:if="${user.active}"></div>`         |
| `th:unless`      | Điều kiện ngược lại với `th:if`           | `<div th:unless="${user.active}"></div>`     |
| `th:attr`        | Gán thuộc tính HTML                       | `<img th:attr="src=${user.avatar}" />`       |
| `th:attrappend`  | Thêm giá trị vào thuộc tính               | `<div th:attrappend="class='active'"></div>` |
| `th:attrprepend` | Thêm giá trị vào đầu thuộc tính           | `<div th:attrprepend="class='pre'"></div>`   |
| `th:classappend` | Thêm class vào thuộc tính class           | `<div th:classappend="'active'"></div>`      |
| `th:replace`     | Thay thế node bằng fragment               | `<div th:replace="fragments/footer"></div>`  |
| `th:insert`      | Chèn fragment vào node                    | `<div th:insert="fragments/menu"></div>`     |
| `th:remove`      | Loại bỏ node                              | `<div th:remove="all"></div>`                |
| `th:object`      | Đặt đối tượng lựa chọn cho `*{...}`       | `<form th:object="${user}"></form>`          |
| `th:with`        | Định nghĩa biến cục bộ                    | `<div th:with="age=${user.age}"></div>`      |
| `th:switch`      | Switch-case cho điều kiện                 | `<div th:switch="${user.role}"></div>`       |
| `th:case`        | Case trong switch                         | `<span th:case="'ADMIN'"></span>`            |

**Tham khảo chi tiết:**

-   [Thymeleaf Documentation](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html#using-texts)
