# 1. Tổng hợp các Annotation quan trọng trong Hibernate/JPA

Chào mừng bạn đến với tài liệu tổng hợp các annotation thường dùng nhất trong **Hibernate** và **JPA**. Mình đã sắp xếp chúng thành các nhóm rõ ràng, kèm theo giải thích và link tham khảo để chúng ta dễ dàng tra cứu và học tập.

---

## 2. Mục lục nội dung

-   [3. Các Annotation cơ bản](#3-các-annotation-cơ-bản)
-   [4. Các Annotation cho Quan hệ (Mapping)](#4-các-annotation-cho-quan-hệ-mapping)
-   [5. Tài liệu tham khảo chính thức](#5-tài-liệu-tham-khảo-chính-thức)

---

## 3. Các Annotation cơ bản

Đây là những annotation dùng để định nghĩa cấu trúc của một _Entity_, bao gồm bảng, cột, khóa chính và các thuộc tính cơ bản khác.

| Annotation                          | Mục đích                                                                                                | Tham khảo (GeeksforGeeks)                                                                      |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------- |
| **`@Entity`**                       | Đánh dấu một class là một _Entity_, tương ứng với một bảng trong cơ sở dữ liệu.                         | [Link](https://www.geeksforgeeks.org/advance-java/jpa-creating-an-entity/)                     |
| **`@Table`**                        | Tùy chỉnh tên bảng và các thuộc tính khác (schema, catalog) mà Entity sẽ được map tới.                  | [Link](https://www.geeksforgeeks.org/advance-java/spring-data-jpa-table-annotation/)           |
| **`@Id`**                           | Đánh dấu một thuộc tính là khóa chính (primary key) của Entity.                                         | [Link](https://www.geeksforgeeks.org/advance-java/spring-data-jpa-id-annotation/)              |
| **`@GeneratedValue`**               | Cấu hình cách sinh giá trị tự động cho khóa chính (ví dụ: `AUTO`, `IDENTITY`, `SEQUENCE`).              | [Link](https://www.geeksforgeeks.org/advance-java/hibernate-generatedvalue-annotation-in-jpa/) |
| **`@Column`**                       | Tùy chỉnh tên cột, độ dài, ràng buộc `nullable`, `unique` cho một thuộc tính.                           | [Link](https://www.geeksforgeeks.org/advance-java/spring-data-jpa-column-annotation/)          |
| **`@Transient`**                    | Đánh dấu một thuộc tính để Hibernate bỏ qua, không lưu vào cơ sở dữ liệu.                               | [Link](https://www.geeksforgeeks.org/java/hibernate-transient-annotation-with-example/)        |
| **`@Version`**                      | Dùng cho cơ chế _Optimistic Locking_, giúp ngăn ngừa xung đột dữ liệu khi nhiều giao tác cùng cập nhật. | [Link](https://www.geeksforgeeks.org/java/hibernate-version-annotation-with-example/)          |
| **`@Embeddable`** / **`@Embedded`** | Cho phép nhúng một đối tượng (component) vào trong một Entity khác, giúp tái sử dụng và gom nhóm logic. | [Link](https://www.geeksforgeeks.org/java/hibernate-embeddable-and-embedded-annotation/)       |
| **`@OrderBy`**                      | Sắp xếp các phần tử trong một collection (ví dụ: `List` trong quan hệ One-to-Many) theo một thứ tự.     | [Link](https://www.geeksforgeeks.org/java/hibernate-orderby-annotation-with-example/)          |

> 📌 **Ghi nhớ:** Một Entity tối thiểu cần có `@Entity` và `@Id`. Các annotation còn lại dùng để tùy chỉnh chi tiết hơn.

---

## 4. Các Annotation cho Quan hệ (Mapping)

Nhóm này dùng để định nghĩa các mối quan hệ giữa các Entity, chẳng hạn như `One-to-One`, `One-to-Many`.

| Loại quan hệ          | Mục đích                                                                                                | Tham khảo (GeeksforGeeks)                                                        |
| :-------------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------- |
| **`@OneToOne`**       | Định nghĩa quan hệ 1-1 giữa hai Entity.                                                                 | [Link](https://www.geeksforgeeks.org/advance-java/hibernate-one-to-one-mapping/) |
| **`@OneToMany`**      | Định nghĩa quan hệ 1-nhiều. Một thực thể ở phía "One" sẽ liên kết với nhiều thực thể ở phía "Many".     | [Link](https://www.geeksforgeeks.org/java/hibernate-one-to-many-mapping/)        |
| **`@ManyToOne`**      | Định nghĩa quan hệ nhiều-1, là phía ngược lại của `@OneToMany`.                                         | [Link](https://www.geeksforgeeks.org/java/hibernate-many-to-one-mapping/)        |
| **`@ManyToMany`**     | Định nghĩa quan hệ nhiều-nhiều. Thường yêu cầu một bảng trung gian (join table) để lưu trữ mối quan hệ. | [Link](https://www.geeksforgeeks.org/java/hibernate-many-to-many-mapping/)       |
| **Component Mapping** | Không phải annotation, mà là kỹ thuật dùng `@Embeddable` để ánh xạ một đối tượng phức tạp.              | [Link](https://www.geeksforgeeks.org/java/hibernate-component-mapping/)          |
