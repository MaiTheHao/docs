# Domain-Driven Design (DDD) Và Các Kiến Trúc Hướng Tâm

## Mục lục

-   [1. Triết lý Domain-Driven Design](#1-triết-lý-domain-driven-design)
-   [2. Các mẫu kiến trúc hướng tâm](#2-các-mẫu-kiến-trúc-hướng-tâm)
-   [3. Cấu trúc thư mục Clean Architecture](#3-cấu-trúc-thư-mục-clean-architecture)
-   [4. Ý nghĩa và đánh đổi](#4-ý-nghĩa-và-đánh-đổi)
-   [5. Các khái niệm cốt lõi trong DDD](#5-các-khái-niệm-cốt-lõi-trong-ddd)

---

## 1. Triết lý Domain-Driven Design

Phản ứng lại với sự hỗn loạn của các hệ thống phân lớp truyền thống khi quy mô tăng lên, cộng đồng kỹ thuật đã chuyển dịch sang các triết lý thiết kế lấy nghiệp vụ làm trung tâm, tiêu biểu là **Domain-Driven Design (DDD)** được Eric Evans giới thiệu năm 2003.

**Domain-Driven Design (DDD)** đặt **Domain** (nghiệp vụ cốt lõi) làm trung tâm thay vì kỹ thuật, bởi đây là ngôn ngữ chung mà khách hàng bản thân họ thấu hiểu nhất. Mục tiêu cốt lõi của DDD là xóa bỏ rào cản giao tiếp bằng cách mô hình hóa phần mềm dựa trên chính tư duy vận hành của khách hàng/doanh nghiệp, biến các quy tắc kinh doanh trừu tượng thành **logic nghiệp vụ** cụ thể trong mã nguồn. Cách tiếp cận này đảm bảo hệ thống không chỉ vận hành đúng mà còn phản ánh chính xác bức tranh tư duy của khách hàng; tuy nhiên, thách thức lớn nhất nằm ở việc lập trình viên phải rũ bỏ tư duy kỹ thuật thuần túy để thực sự thấu cảm nghiệp vụ, từ đó đặt chính xác từng mảnh ghép logic vào đúng vị trí trong hệ thống.

Triết lý của DDD không tập trung vào việc tổ chức thư mục như thế nào, mà tập trung vào việc mô hình hóa phần mềm dựa trên:

-   **Ngôn ngữ chung (Ubiquitous Language)**
-   **Ngữ cảnh giới hạn (Bounded Contexts)**

---

## 2. Các mẫu kiến trúc DDD

Từ triết lý DDD, các mẫu kiến trúc cụ thể đã ra đời với cùng một lý tưởng: **Đảo ngược sự phụ thuộc (Dependency Inversion)**:

| Mẫu kiến trúc              | Đặc điểm                                |
| -------------------------- | --------------------------------------- |
| **Hexagonal Architecture** | Ports and Adapters                      |
| **Onion Architecture**     | Các lớp vỏ hành bao quanh Domain        |
| **Clean Architecture**     | Tách biệt rõ ràng Use Cases và Entities |

Trong các mô hình này, **"Domain"** (nghiệp vụ cốt lõi) nằm ở trung tâm của kiến trúc và không phụ thuộc vào bất kỳ yếu tố bên ngoài nào (database, framework, giao diện người dùng). Ngược lại, mọi thứ bên ngoài đều phụ thuộc vào Domain.

---

## 3. Cấu trúc thư mục Clean Architecture

Cấu trúc thư mục của một dự án áp dụng Clean Architecture thể hiện rõ sự phân tách:

```
src/
├── domain/              # Core: Entities, Value Objects, Repository Interfaces
│   ├── rules/
│   └── exceptions/
├── application/         # Use Cases: Phối hợp logic, implement interfaces từ Domain
│   ├── commands/
│   └── queries/
├── infrastructure/      # Adapters: Database implementation, External APIs
│   ├── persistence/
│   └── messaging/
└── presentation/        # UI/API: Controllers, DTOs
```

---

## 4. Ý nghĩa và đánh đổi

### 4.1. Ưu điểm

-   **Khả năng kiểm thử (Testability)**: Bằng cách cô lập Domain, các lập trình viên có thể viết Unit Test cho logic nghiệp vụ phức tạp mà không cần khởi động database hay web server.
-   **Tính linh hoạt**: Cho phép thay đổi công nghệ (ví dụ: chuyển từ MySQL sang MongoDB) mà không làm ảnh hưởng đến dòng code nghiệp vụ nào, vì lớp Domain chỉ giao tiếp thông qua các Interfaces trừu tượng.

### 4.2. Đánh đổi

Cái giá phải trả là sự phức tạp gia tăng và số lượng **code boilerplate** lớn để chuyển đổi dữ liệu giữa các lớp.

---

## 5. Các khái niệm cốt lõi trong DDD

### Ubiquitous Language - Ngôn ngữ chung

-   Ngôn ngữ chung giữa domain expert và developer là yếu tố hàng đầu, giúp tránh nhầm lẫn trong quá trình phát triển.
-   Được phản ánh vào source code qua tên package, class, method, properties...
-   Được sử dụng trong cả kỹ thuật lẫn nghiệp vụ, phản ánh trong mọi tính năng của hệ thống.

### Bounded Context - Ngữ cảnh giới hạn

-   Chia hệ thống thành các domain độc lập, mỗi domain phục vụ cho từng đối tượng/ngữ cảnh cụ thể.
-   Các domain được kết nối với nhau thông qua **Anti-Corruption Layer**.
-   Độc lập về database, phù hợp để áp dụng cho microservice.
-   Các ngữ cảnh nhỏ đều dựa trên một domain lớn, liên quan nhưng cần tách biệt và không phụ thuộc lẫn nhau.

### Basic Elements - Những thành phần cơ bản

#### Entity

-   Có định danh bất biến và duy nhất trong toàn hệ thống.
-   Chứa life cycle: creation và deletion.
-   Nên chứa các logic của riêng nó thay vì thiết kế theo anemic model.

#### Value Type (Value Object)

-   Không có định danh, chỉ lưu giá trị.
-   Nếu các thuộc tính đều có cùng giá trị thì là các object như nhau.
-   Tính bất biến: một khi được tạo ra thì không thể thay đổi trong vòng đời.

#### Aggregates

-   Một tập hợp các thực thể, có thể xem như một đơn vị thống nhất.
-   Các xử lý đều thông qua root entity (aggregate root).
-   Aggregate phải chứa các xử lý logic liên quan đến tất cả entity bên trong nó.

#### Domain Services

-   Nơi chứa các chức năng của domain.
-   Chứa các logic phức tạp mà không thể chứa trong phạm vi entity hoặc những logic làm việc với nhiều aggregate.

---

## Lời kết

DDD giúp mô hình hóa phần mềm sát với nghiệp vụ thực tế, tăng khả năng kiểm thử, linh hoạt và dễ mở rộng. Tuy nhiên, cần cân nhắc về độ phức tạp và chi phí phát triển khi áp dụng vào dự án thực tế.
