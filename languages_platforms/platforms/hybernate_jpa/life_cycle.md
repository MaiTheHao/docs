# Vòng đời Entity trong JPA (Hibernate Compatible)

-   [1. Tóm tắt trạng thái Entity](#1-tóm-tắt-trạng-thái-entity)
-   [2. Chi tiết từng trạng thái](#2-chi-tiết-từng-trạng-thái)
-   [3. Ví dụ thực tế đầy đủ](#3-ví-dụ-thực-tế-đầy-đủ)
-   [4. Lưu ý quan trọng](#4-lưu-ý-quan-trọng)
-   [5. Sự kiện vòng đời (Lifecycle Callbacks)](#5-sự-kiện-vòng-đời-lifecycle-callbacks)

---

## 1. Tóm tắt trạng thái Entity

| Trạng thái   | Tên khác (chuẩn JPA) | Đặc điểm                               | Kết nối EntityManager | Ảnh hưởng DB                   |
| ------------ | -------------------- | -------------------------------------- | --------------------- | ------------------------------ |
| **New**      | Transient            | Object mới tạo bằng `new`              | ❌ Không              | ❌ Không                       |
| **Managed**  | Persistent           | Được quản lý trong Persistence Context | ✅ Có                 | ✅ Tự đồng bộ khi flush/commit |
| **Detached** | Detached             | Tách khỏi Persistence Context          | ❌ Không              | ❌ Không                       |
| **Removed**  | Removed              | Đánh dấu xóa                           | ✅ Có                 | ✅ Xóa khi flush/commit        |

---

## 2. Chi tiết từng trạng thái

### 2.1. New (Transient)

**Đặc điểm:** Object vừa `new`, chưa gắn với EntityManager (EM).

```java
Employee employee = new Employee();
employee.setName("John Doe");
employee.setSalary(new BigDecimal("5000"));
```

-   Chưa có ID (trừ khi gán thủ công)
-   Mọi thay đổi không tác động DB

---

### 2.2. Managed (Persistent)

**Đặc điểm:** EM theo dõi thay đổi (dirty checking); SQL chạy khi flush/commit.

```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("my-pu");
EntityManager em = emf.createEntityManager();

em.getTransaction().begin();
em.persist(employee);                 // New → Managed

employee.setSalary(new BigDecimal("6000"));  // ✅ Sẽ cập nhật khi flush/commit

em.getTransaction().commit();
em.close();
```

**Chuyển sang Managed qua:**

-   `em.persist(entity)` với entity New
-   `em.merge(detachedEntity)` trả về một bản Managed
-   `em.find(...)`, `em.getReference(...)` tải entity vào context

---

### 2.3. Detached

**Đặc điểm:** Đã từng Managed nhưng bị tách (đóng EM, `clear()`, hoặc qua ranh giới phiên).

```java
em.close();                           // Tất cả Managed → Detached
employee.setSalary(new BigDecimal("7000"));  // ❌ Không ảnh hưởng DB
```

**Kết nối lại (reattach) qua `merge()`:**

```java
EntityManager em2 = emf.createEntityManager();
em2.getTransaction().begin();

Employee managedEmployee = em2.merge(employee); // managedEmployee là Managed

em2.getTransaction().commit();
em2.close();
```

---

### 2.4. Removed

**Đặc điểm:** Bị đánh dấu xóa; xóa thực tế xảy ra khi flush/commit.

```java
EntityManager em = emf.createEntityManager();
em.getTransaction().begin();

Employee employee = em.find(Employee.class, 1L);
em.remove(employee);                  // Managed → Removed

em.getTransaction().commit();         // ✅ Thực sự xóa khỏi DB
em.close();
```

---

## 3. Ví dụ thực tế đầy đủ

```java
// 1) NEW - Object mới
Employee emp = new Employee("John", new BigDecimal("5000"));

EntityManagerFactory emf = Persistence.createEntityManagerFactory("my-pu");
EntityManager em = emf.createEntityManager();
em.getTransaction().begin();

// 2) MANAGED - EM quản lý
em.persist(emp);
emp.setSalary(new BigDecimal("6000"));  // ✅ Sẽ cập nhật khi flush/commit

em.getTransaction().commit();

// 3) DETACHED - EM đóng
em.close();
emp.setSalary(new BigDecimal("7000"));  // ❌ Không ảnh hưởng DB

// 4) REATTACH - Kết nối lại qua merge()
EntityManager em2 = emf.createEntityManager();
em2.getTransaction().begin();

Employee reattachedEmp = em2.merge(emp);
reattachedEmp.setSalary(new BigDecimal("8000"));  // ✅ Lại ảnh hưởng DB

// 5) REMOVED - Đánh dấu xóa
em2.remove(reattachedEmp);

em2.getTransaction().commit();
em2.close();
```

---

## 4. Lưu ý quan trọng

1. Chỉ entity ở trạng thái Managed mới được đồng bộ với DB (khi flush/commit).
2. Detached cần `merge()` trước khi thay đổi có hiệu lực.
3. `merge()` an toàn trong môi trường nhiều phiên, tránh NonUniqueObjectException (so với cách “update” kiểu ORM khác).
4. `remove()` chỉ đánh dấu xóa; SQL delete chạy ở flush/commit.
5. Dirty checking: chỉ khi dữ liệu thực sự đổi mới có SQL update.
6. Giao dịch có thể rollback nếu callback persist/remove ném exception.

> 💡 Mẹo: Ưu tiên thao tác qua EntityManager/Repository để tận dụng transaction, dirty checking, và lifecycle callbacks.

---

## 5. Sự kiện vòng đời (Lifecycle Callbacks)

JPA cung cấp các sự kiện tùy chọn để can thiệp vào vòng đời entity. Có thể:

-   Gắn trực tiếp trên entity, hoặc
-   Dùng lớp listener qua `@EntityListeners(...)`.
-   Phương thức callback bắt buộc trả về `void`. Có thể gắn nhiều annotation trên một phương thức.

**Danh sách sự kiện:**

-   `@PrePersist` — trước khi insert
-   `@PostPersist` — sau khi insert; nếu dùng `@GeneratedValue`, ID sẵn sàng tại đây
-   `@PreRemove` — trước khi delete
-   `@PostRemove` — sau khi delete
-   `@PreUpdate` — trước khi update; chỉ gọi khi thực sự có thay đổi (có SQL update)
-   `@PostUpdate` — sau khi update; luôn được gọi dù có thay đổi hay không
-   `@PostLoad` — sau khi entity được load

Lưu ý thời điểm: các sự kiện “Post\*” có thể xảy ra ngay sau thao tác, sau một lần flush, hoặc vào cuối transaction tùy nhà cung cấp JPA.

```java
@Entity
@EntityListeners(AuditTrailListener.class)
public class User {
    @Id @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;
    @Transient
    private String fullName;

    @PrePersist
    void beforeInsert() { /* ghi log/khởi tạo */ }

    @PostPersist
    void afterInsert() { /* ID sẵn sàng tại đây */ }

    @PreUpdate
    void beforeUpdate() { /* chỉ gọi khi có thay đổi thực sự */ }

    @PostUpdate
    void afterUpdate() { /* luôn được gọi sau update */ }

    @PostLoad
    void afterLoad() { fullName = firstName + " " + lastName; }
}

public class AuditTrailListener {
    @PrePersist @PreUpdate @PreRemove
    private void beforeAnyChange(User user) { /* audit chung */ }

    @PostPersist @PostUpdate @PostRemove
    private void afterAnyChange(User user) { /* audit chung */ }
}
```

> 📌 Ghi nhớ: Callback ném exception trong quá trình persist/remove có thể khiến transaction bị rollback.

---
