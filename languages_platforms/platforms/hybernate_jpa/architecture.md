# Kiến trúc Hibernate JPA

---

## 1. Tổng quan về kiến trúc Hibernate JPA

Hibernate JPA là một giải pháp ORM hiện đại, sử dụng Hibernate làm implementation cho đặc tả Java Persistence API (JPA). Kiến trúc này giúp chúng ta quản lý dữ liệu một cách nhất quán, portable và dễ tích hợp với các hệ thống Java hiện đại.

<img src="imgs/JPA-architecture.png" style="margin: 0 auto; display: block;" />

---

## 2. Các thành phần cốt lõi trong Hibernate JPA

|        Thành phần        | Vai trò chính                                      |          Đặc điểm nổi bật          |
| :----------------------: | :------------------------------------------------- | :--------------------------------: |
|   **Persistence Unit**   | Nhóm cấu hình cho tập Entity, quản lý kết nối DB   | Định nghĩa trong `persistence.xml` |
| **EntityManagerFactory** | Tạo ra các EntityManager, quản lý tài nguyên lớn   |    Thread-safe, dùng Singleton     |
|    **EntityManager**     | Thực hiện CRUD, quản lý vòng đời Entity            |      Mỗi request một instance      |
| **Persistence Context**  | Vùng nhớ tạm, theo dõi trạng thái Entity           |       Gắn với EntityManager        |
|        **Entity**        | Đại diện cho bảng dữ liệu dưới dạng đối tượng Java |    Được đánh dấu bằng `@Entity`    |
|   **JPQL/TypedQuery**    | Truy vấn dữ liệu theo hướng đối tượng              |      Độc lập DB, dùng Entity       |

---

## 3. Luồng hoạt động Hibernate JPA

1. **Khởi tạo cấu hình**: Định nghĩa Persistence Unit trong `persistence.xml`.
2. **Tạo EntityManagerFactory**: Singleton cho toàn ứng dụng.
3. **Tạo EntityManager**: Mỗi request/session tạo một instance mới.
4. **Quản lý Entity**: EntityManager thao tác CRUD, trạng thái Entity được quản lý trong Persistence Context.
5. **Truy vấn dữ liệu**: Sử dụng JPQL hoặc TypedQuery để lấy dữ liệu theo Entity.
6. **Commit Transaction**: Thay đổi được ghi xuống DB khi commit.

> [Xem thêm: để hiểu rõ hơn về các thành phần](./jpa.md)
