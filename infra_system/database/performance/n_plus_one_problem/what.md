# Vấn Đề N+1: Định Nghĩa, Nguyên Nhân và Tác Động

---

## Mục lục

-   [Định nghĩa N+1](#định-nghĩa-n1)
-   [Nguyên nhân phổ biến](#nguyên-nhân-phổ-biến)
-   [Tác động hiệu năng](#tác-động-hiệu-năng)

---

## Định nghĩa N+1

Vấn đề truy vấn N+1: 1 truy vấn lấy danh sách cha, N truy vấn lấy dữ liệu con liên quan.

📌 **Ví dụ:**

```sql
-- 1 Query:
SELECT * FROM authors;
-- N Query:
SELECT * FROM posts WHERE author_id = 1;
SELECT * FROM posts WHERE author_id = 2;
-- ... tiếp tục cho các author khác
```

> Tổng cộng: 1 + N truy vấn cho một tác vụ duy nhất.

---

## Nguyên nhân phổ biến

Các ORM như Hibernate, Django ORM, ActiveRecord thường mặc định dùng _Lazy Loading_.

📌 **Ví dụ với JPA:**

```java
// Truy vấn 1
List<Author> authors = authorRepository.findAll();
for (Author author : authors) {
    // N+1 vấn đề kích hoạt tại đây
    List<Post> posts = author.getPosts(); // Lazy loading
    System.out.println(author.getName() + " có " + posts.size() + " bài viết.");
}
```

> Sự tiện lợi của ORM khuyến khích mô hình duyệt đồ thị đối tượng, mâu thuẫn với truy xuất dữ liệu hiệu quả.

---

## Tác động hiệu năng

-   **Tăng độ trễ:** Độ trễ mạng tích lũy, ví dụ: 100 truy vấn × 5ms = 505ms.
-   **Tăng tải cho cơ sở dữ liệu:** Connection pool, CPU, tranh chấp tài nguyên.
-   **Giới hạn khả năng mở rộng:** Hiệu năng suy giảm tuyến tính khi dữ liệu tăng.

> **Ghi nhớ:** Mức độ nghiêm trọng tỷ lệ thuận với độ trễ giữa ứng dụng và cơ sở dữ liệu.
