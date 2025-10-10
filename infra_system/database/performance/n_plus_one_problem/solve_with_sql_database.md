# Giải Quyết N+1 Với PostgreSQL

---

## Mục lục

-   [Biểu hiện với ORM](#biểu-hiện-với-orm)
-   [Giải pháp: JOIN](#giải-pháp-join)
-   [Giải pháp: Batch với IN](#giải-pháp-batch-với-in)
-   [Chiến lược nâng cao](#chiến-lược-nâng-cao)

---

## Biểu hiện với ORM

Ví dụ lược đồ: bảng `users` và `posts`, `posts.user_id` là khóa ngoại đến `users.id`.

📌 **Ví dụ với Django ORM:**

```python
# Truy vấn 1
users = User.objects.all()
for user in users:
    # N truy vấn: mỗi user một truy vấn lấy posts
    print(f"Người dùng {user.name} có {user.posts.count()} bài viết.")
```

> Đoạn mã này tạo ra 1 truy vấn lấy users, sau đó N truy vấn lấy posts cho từng user (anti-pattern N+1).

---

## Giải pháp: JOIN

Tìm nạp tất cả dữ liệu cần thiết trong một truy vấn duy nhất bằng JOIN SQL.

```sql
SELECT
  users.id AS user_id,
  users.name AS user_name,
  posts.id AS post_id,
  posts.title AS post_title
FROM
  users
LEFT JOIN
  posts ON users.id = posts.user_id;
```

ORM tương ứng:

-   Django: `User.objects.select_related('profile').all()`
-   SQLAlchemy: `session.query(User).options(joinedload(User.posts)).all()`
-   JPA/Hibernate: `SELECT u FROM User u JOIN FETCH u.posts`

> **Ưu điểm:** Một chuyến đi khứ hồi, giảm độ trễ mạng.
> **Nhược điểm:** Có thể tạo ra tập kết quả lớn, dư thừa (tích Descartes).

---

## Giải pháp: Batch với IN

Hai truy vấn: lấy cha, sau đó lấy con với mệnh đề IN.

```sql
-- Truy vấn 1
SELECT * FROM users;
-- Truy vấn 2
SELECT * FROM posts WHERE user_id IN (1, 2, 3, ...);
```

ORM tương ứng:

-   Django: `User.objects.prefetch_related('posts').all()`
-   Ruby on Rails: `User.includes(:posts)`
-   GraphQL: Dataloader pattern

> **Ưu điểm:** Tránh tích Descartes, hiệu quả cho nhiều mối quan hệ một-nhiều.
> **Nhược điểm:** Hai chuyến đi khứ hồi.

---

## Chiến lược nâng cao

-   **Bỏ qua ORM:** Dùng SQL thô cho truy vấn phức tạp, tối ưu hóa kế hoạch truy vấn.
-   **Caching:** Lưu trữ dữ liệu bán tĩnh trong Redis/Memcached để giảm tải truy vấn lặp lại.

> **Tóm tắt:** Sự lựa chọn giữa JOIN và Batch IN là sự đánh đổi giữa số lượng chuyến đi khứ hồi và khối lượng dữ liệu truyền tải.
