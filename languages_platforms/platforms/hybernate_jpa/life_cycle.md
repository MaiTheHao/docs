# Vòng đời Entity trong JPA (Hibernate Compatible)

-   [1. Tóm tắt trạng thái Entity](#tóm-tắt-trạng-thái-entity)
-   [2. Chi tiết từng trạng thái](#chi-tiết-từng-trạng-thái)
-   [3. Ví dụ thực tế đầy đủ](#ví-dụ-thực-tế-đầy-đủ)
-   [4. Lưu ý quan trọng](#lưu-ý-quan-trọng)

---

## 1. Tóm tắt trạng thái Entity

| Trạng thái   | Đặc điểm                  | Kết nối EntityManager | Ảnh hưởng DB |
| ------------ | ------------------------- | --------------------- | ------------ |
| **New**      | Object mới tạo bằng `new` | ❌ Không              | ❌ Không     |
| **Managed**  | Được quản lý bởi EM       | ✅ Có                 | ✅ Tự động   |
| **Detached** | EM đã đóng hoặc clear     | ❌ Không              | ❌ Không     |
| **Removed**  | Được đánh dấu xóa         | ✅ Có                 | ✅ Sẽ bị xóa |

---

## 2. Chi tiết từng trạng thái

### 2.1. New (Trạng thái mới)

**Đặc điểm:** Object mới được tạo, chưa từng được kết nối với EntityManager nào.

```java
Employee employee = new Employee();
employee.setName("John Doe");
employee.setSalary(new BigDecimal("5000"));
```

-   Tạo bằng toán tử `new`
-   Chưa có ID (trừ khi gán thủ công)
-   Thay đổi không ảnh hưởng database

---

### 2.2. Managed (Được quản lý)

**Đặc điểm:** Object được quản lý bởi EntityManager, mọi thay đổi được tự động đồng bộ với DB.

```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("my-pu");
EntityManager em = emf.createEntityManager();

em.getTransaction().begin();
em.persist(employee);  // Chuyển từ New → Managed

employee.setSalary(new BigDecimal("6000"));  // ✅ DB sẽ được update

em.getTransaction().commit();
em.close();
```

**Phương thức chuyển sang Managed:**

-   `em.persist()`
-   `em.merge()`
-   `em.find()`
-   `em.getReference()`

---

### 2.3. Detached (Tách rời)

**Đặc điểm:** Object đã từng là Managed, nhưng EntityManager đã đóng hoặc clear.

```java
em.close();  // Tất cả Managed objects → Detached

employee.setSalary(new BigDecimal("7000"));  // ❌ Không ảnh hưởng DB
```

**Cách reattach (kết nối lại):**

```java
EntityManager em2 = emf.createEntityManager();
em2.getTransaction().begin();

// Cách 1: merge() - trả về bản copy Managed
Employee managedEmployee = em2.merge(employee);

em2.getTransaction().commit();
em2.close();
```

---

### 2.4. Removed (Bị xóa)

**Đặc điểm:** Object được đánh dấu để xóa khỏi database.

```java
EntityManager em = emf.createEntityManager();
em.getTransaction().begin();

Employee employee = em.find(Employee.class, 1L);
em.remove(employee);  // → Removed state

em.getTransaction().commit();  // ✅ Xóa khỏi DB thực tế
em.close();
```

---

## 3. Ví dụ thực tế đầy đủ

```java
// 1. NEW - Object mới
Employee emp = new Employee("John", new BigDecimal("5000"));

EntityManagerFactory emf = Persistence.createEntityManagerFactory("my-pu");
EntityManager em = emf.createEntityManager();
em.getTransaction().begin();

// 2. MANAGED - Được quản lý bởi EntityManager
em.persist(emp);
emp.setSalary(new BigDecimal("6000"));  // ✅ Tự động update DB

em.getTransaction().commit();

// 3. DETACHED - EntityManager đã đóng
em.close();
emp.setSalary(new BigDecimal("7000"));  // ❌ Không ảnh hưởng DB

// 4. REATTACH - Kết nối lại
EntityManager em2 = emf.createEntityManager();
em2.getTransaction().begin();

Employee reattachedEmp = em2.merge(emp);
reattachedEmp.setSalary(new BigDecimal("8000"));  // ✅ Lại ảnh hưởng DB

// 5. REMOVED - Đánh dấu xóa
em2.remove(reattachedEmp);

em2.getTransaction().commit();
em2.close();
```

---

## 4. Lưu ý quan trọng

1. **Chỉ Managed objects mới đồng bộ với DB**
2. **Detached objects cần được merge trước khi update**
3. **`merge()` an toàn hơn `update()`** (tránh NonUniqueObjectException)
4. **`remove()` chỉ đánh dấu xóa, thực tế xóa khi commit**

> 💡 **Mẹo:** Sử dụng EntityManager giúp code portable, dễ tích hợp với Spring/JTA.

---
