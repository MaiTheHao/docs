# NestJS: Sự Hiện Đại Và Linh Hoạt Của TypeScript

## Mục lục

-   [1. Triết lý kiến trúc: Tại sao NestJS ép buộc dùng Module?](#1-triết-lý-kiến-trúc-tại-sao-nestjs-ép-buộc-dùng-module)
-   [2. Xung đột kiến trúc: OOP Container vs Data-First Ecosystem](#2-xung-đột-kiến-trúc-oop-container-vs-data-first-ecosystem)
-   [3. Chiến lược kiểm soát ranh giới (Boundaries Strategy)](#3-chiến-lược-kiểm-soát-ranh-giới-boundaries-strategy)
-   [4. Khi nào chọn NestJS?](#4-khi-nào-chọn-nestjs)

---

## 1. Triết lý kiến trúc: Tại sao NestJS ép buộc dùng Module?

Khác với Express.js (nơi bạn tự do tổ chức file), NestJS chịu ảnh hưởng nặng nề từ Angular. Nó ép buộc bạn phải tư duy theo **Graph**.

-   **Cơ chế `@Module`:** Mọi thành phần (Controller, Service) đều phải thuộc về một Module. NestJS sử dụng Module để xây dựng cây Dependency Injection.
-   **Hệ quả kiến trúc:** Điều này khiến NestJS trở thành **Modular Monolith by Default**. Bạn không thể viết code "trôi nổi" lung tung; bạn buộc phải gom nhóm chúng lại.

**Cấu trúc thư mục tiêu chuẩn:**

```text
src/
├── app.module.ts      # Root Module (Nơi lắp ráp)
├── modules/
│   ├── users/
│   │   ├── users.module.ts  # Đóng gói logic User
│   │   ├── users.service.ts
│   │   └── users.controller.ts
│   └── auth/
│       ├── auth.module.ts
│       └── ...
```

Hệ thống **Dependency Injection** của NestJS hoạt động dựa trên Tokens, cho phép dễ dàng áp dụng các nguyên lý SOLID và Clean Architecture. Ví dụ, ta có thể inject một Interface (Abstract) vào Controller và tráo đổi Implementation (MySQL hay Mongo) ở tầng Module mà không cần sửa code Controller.

---

## 2. Xung đột kiến trúc: OOP Container vs Data-First Ecosystem

Đây là điểm thú vị nhất khi chọn kiến trúc cho NestJS.

-   **NestJS (Vỏ):** Hướng đối tượng (OOP), sử dụng Class, Decorators, Dependency Injection (DI) để quản lý kiến trúc. Điều này rất giống Spring (Java).
-   **Hệ sinh thái Node/Prisma (Ruột):** Hướng dữ liệu và Functional Programming (FP). Prisma sinh ra các Type (Interface) chứ không phải Class Entity giàu logic.

**Lựa chọn cấu trúc:**

-   **DDD (Rich Model):** Tự viết các Class Entity thủ công và map dữ liệu từ Prisma sang Entity này. Đảm bảo Clean Architecture nhưng tốn công sức (Boilerplate).
-   **Pragmatic (Anemic Model):** Chấp nhận dùng Type của Prisma làm Model. Logic nghiệp vụ nằm ở Service (dạng Pipeline).

> **Ghi nhớ:** Trong JS/TS, việc tách Data và Behavior là tự nhiên. "Anemic Model" không hẳn là xấu nếu bạn viết Service theo phong cách hàm thuần khiết (Pure Functions).

---

> **Kết luận:** Chọn NestJS là chọn Modular Monolith. Tuy nhiên, vẫn còn sự thiếu hụt về Encapsulation của TypeScript.
