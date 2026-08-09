# Bốn Chiều Của Kiến Trúc Phần Mềm (The Four Dimensions of Software Architecture)

## Table of Contents

- [Tổng quan về 4 Dimensions](#tổng-quan-về-4-dimensions)
- [Dimension 1: Architecture Characteristics](#dimension-1-architecture-characteristics)
- [Dimension 2: Logical Components](#dimension-2-logical-components)
- [Dimension 3: Architecture Style](#dimension-3-architecture-style)
- [Dimension 4: Architecture Decisions](#dimension-4-architecture-decisions)
- [Chuỗi Tương tác và Vòng lặp Suy luận Kiến trúc](#chuỗi-tương-tác-và-vòng-lặp-suy-luận-kiến-trúc)
- [Mô hình Tư duy Cốt lõi](#mô-hình-tư-duy-cốt-lõi)
- [Tài liệu Tham khảo](#tài-liệu-tham-khảo)


---

## Tổng quan về 4 Dimensions

Kiến trúc phần mềm không đơn thuần là một sơ đồ hộp-và-đường-nối (boxes and lines diagram). Đó là sự kết hợp có chủ đích giữa 4 chiều chính: **Architecture Characteristics**, **Logical Components**, **Architecture Style**, và **Architecture Decisions**.

Bốn dimensions này trả lời các nhóm câu hỏi cốt lõi để định hình cấu trúc và hành vi hệ thống:

```mermaid
graph TD
    accTitle: Mô hình 4 Dimensions của Kiến trúc Phần mềm
    accDescr: Sơ đồ phân nhánh 4 chiều cấu thành nên kiến trúc phần mềm đầy đủ

    archNode["SOFTWARE ARCHITECTURE"] --> charDim["Architecture Characteristics<br/>(Hệ thống cần đạt capabilities gì?)"]
    archNode --> compDim["Logical Components<br/>(Hệ thống thực hiện behavior gì?)"]
    archNode --> styleDim["Architecture Style<br/>(Tổ chức cấu trúc theo pattern nào?)"]
    archNode --> decDim["Architecture Decisions<br/>(Những quy tắc & ràng buộc bắt buộc?)"]
```

Bảng tổng hợp vai trò của 4 Dimensions:

| Dimension | Đối tượng Trọng tâm | Câu hỏi Cốt lõi | Sản phẩm Đầu ra |
| :--- | :--- | :--- | :--- |
| **Architecture Characteristics** | Quality Attributes (-ilities) | Hệ thống cần hỗ trợ những năng lực gì để thành công? | Success criteria (Availability, Latency, Scalability) |
| **Logical Components** | Business Responsibilities | Hành vi nghiệp vụ được phân chia thành những mô-đun nào? | Domain models, Services, Workflows |
| **Architecture Style** | Structural Pattern | Nên sắp xếp hình thái cấu trúc tổng thể như thế nào? | Monolith, Microservices, Event-Driven |
| **Architecture Decisions** | Governance & Constraints | Những quy tắc nào bắt buộc lập trình viên phải tuân thủ? | Architectural Rules, ADRs, Dependency constraints |

---

## Dimension 1: Architecture Characteristics

Architecture characteristics (thường gọi là các **"-ilities"**) mô tả những năng lực phi chức năng mà kiến trúc bắt buộc phải hỗ trợ. Các đặc tính này đóng vai trò là tiêu chí đánh giá thành công (success criteria) của hệ thống.

Một số characteristics phổ biến bao gồm: `Availability`, `Reliability`, `Scalability`, `Performance`, `Security`, `Maintainability`, `Testability`, `Deployability`, `Observability`.

```mermaid
graph LR
    accTitle: Chuỗi Suy luận từ Characteristic đến Giải pháp
    accDescr: Sơ đồ thể hiện từ yêu cầu đặc tính kiến trúc dẫn đến ràng buộc và quyết định thiết kế

    reqNode["Yêu cầu: High Availability (99.99%)"] --> constraintNode["Architectural Constraint"]
    constraintNode --> decRedundancy["Triển khai Multi-instance"]
    constraintNode --> decFailover["Tự động Phát hiện Lỗi & Failover"]
    constraintNode --> decRep["Replication Cơ sở Dữ liệu"]
```

> [!NOTE]
> Architecture characteristics chỉ xác định **năng lực cần đạt được**, không quyết định trực tiếp công nghệ cụ thể. Việc thực thi năng lực đó là trách nhiệm của các decisions và phong cách kiến trúc.

---

## Dimension 2: Logical Components

Nếu characteristics định nghĩa **capabilities**, thì logical components định nghĩa **behavior** của ứng dụng. Đây là cách kiến trúc sư phân chia các trách nhiệm nghiệp vụ thành các khối logic.

Logical components bao gồm: Domains, Entities, Services, Workflows, và Business Capabilities.

```mermaid
graph TD
    accTitle: Phân rã Logical Components trong Hệ thống Quản lý
    accDescr: Sơ đồ cây thể hiện các khối component logic của một ứng dụng quản lý trường học

    schoolApp["School Management System"] --> idDomain["Identity Domain"]
    schoolApp --> acadDomain["Academic Domain"]
    schoolApp --> attendDomain["Attendance Domain"]

    idDomain --> userEntity["User & Auth Entities"]
    acadDomain --> studentEntity["Student & Class Entities"]
    attendDomain --> recordWorkflow["Attendance Workflow"]
```

Cần phân biệt rõ ràng giữa **Logical Component** và **Deployment Component**:

```mermaid
graph TB
    accTitle: Phân biệt Logical Component và Deployment Component
    accDescr: Sơ đồ thể hiện cùng một kiến trúc logic có thể triển khai thành Monolith hoặc Microservices

    subgraph logicalView["Logical Architecture"]
        logA["Identity Component"]
        logB["Academic Component"]
    end

    subgraph deployOption1["Deployment Option A: Monolith"]
        monoApp["Single Spring Boot JAR<br/>(Tất cả components chung 1 process)"]
    end

    subgraph deployOption2["Deployment Option B: Microservices"]
        serviceA["Identity Microservice"]
        serviceB["Academic Microservice"]
    end

    logicalView --> deployOption1
    logicalView --> deployOption2
```

> [!IMPORTANT]
> Cùng một mô hình phân rã logic có thể được hiện thực hóa bằng nhiều hình thái triển khai hạ tầng khác nhau. Điều này giúp tách biệt giữa **Hệ thống làm gì** và **Hệ thống được triển khai như thế nào**.

---

## Dimension 3: Architecture Style

Sau khi đã làm rõ đặc tính cần đạt và phân rã các khối logic, kiến trúc sư chọn **Architecture Style** làm điểm xuất phát cho cấu trúc hệ thống.

Một số phong cách kiến trúc phổ biến: `Layered`, `Modular Monolith`, `Microservices`, `Event-Driven`, `Hexagonal (Ports & Adapters)`, `Service-Based`.

```mermaid
graph TD
    accTitle: Lựa chọn Architecture Style dựa trên Requirements
    accDescr: Sơ đồ quyết định chọn Modular Monolith hoặc Microservices dựa trên đặc tính hệ thống

    reqs["System Requirements"] --> checkScale{"Yêu cầu Scale & Team?"}

    checkScale -- "Team nhỏ,<br/>Đồng bộ dữ liệu cao" --> modMono["Modular Monolith Style"]
    checkScale -- "Nhiều team độc lập,<br/>Tải phân tán lớn" --> microServ["Microservices Style"]
```

> [!TIP]
> Architecture style không nên được lựa chọn dựa trên sở thích cá nhân hay xu hướng công nghệ. Nó phải là kết quả của việc tìm ra con đường thực thi phù hợp nhất với các characteristics và cấu trúc logic đã xác định.

---

## Dimension 4: Architecture Decisions

Architecture style mới chỉ cung cấp hình thái cấu trúc ban đầu. **Architecture decisions** định nghĩa các quy tắc (rules) và ràng buộc (constraints) bắt buộc đội ngũ phát triển phải tuân theo.

Ví dụ trong kiến trúc Layered Architecture (Presentation → Service → Business → Database), kiến trúc sư có thể đưa ra quyết định:

```mermaid
graph TD
    accTitle: Quyết định Ràng buộc Truy cập trong Layered Architecture
    accDescr: Sơ đồ thể hiện Presentation Layer bị cấm truy cập trực tiếp vào Database

    presLayer["Presentation Layer (Controllers)"] --> servLayer["Application Service Layer"]
    servLayer --> bizLayer["Business / Domain Layer"]
    bizLayer --> dbLayer[("Database Layer")]

    presLayer -- "❌ BỊ CẤM (Decision Rule)" -.-X dbLayer
```

Architecture decisions biến định hướng kiến trúc thành các quy tắc thực tế điều hướng hành vi của lập trình viên:

```mermaid
graph LR
    accTitle: Chuỗi Tác động của Architecture Decisions
    accDescr: Từ ý định kiến trúc tạo ra quyết định, ràng buộc, định hướng hành vi dev và tạo nên cấu trúc hệ thống

    intent["Architectural Intent"] --> decision["Architecture Decision"]
    decision --> constraintRule["Constraint Rule"]
    constraintRule --> devBehavior["Developer Behavior"]
    devBehavior --> sysStructure["System Structure"]
```

---

## Chuỗi Tương tác và Vòng lặp Suy luận Kiến trúc

Bốn chiều không hoạt động cô lập mà tạo thành một chuỗi suy luận liên tục có tính vòng lặp (iterative refinement):

```mermaid
graph TD
    accTitle: Quy trình Suy luận và Đánh giá Kiến trúc Vòng lặp
    accDescr: Sơ đồ luồng từ Characteristics qua Components, Style, Decisions và đánh giá Trade-offs

    step1["1. Identify Characteristics"] --> step2["2. Define Logical Components"]
    step2 --> step3["3. Select Architecture Style"]
    step3 --> step4["4. Formulate Architecture Decisions"]
    step4 --> step5["5. Evaluate Trade-offs"]

    step5 -- "Phát hiện Đánh đổi Mới" --> step6{"Cần điều chỉnh?"}
    step6 -- "Có" --> step1
    step6 -- "Không" --> stepDone(["Hoàn thiện Kiến trúc Concrete"])
```

---

## Mô hình Tư duy Cốt lõi

Có thể cô đọng toàn bộ 4 Dimensions bằng 4 câu hỏi định hướng:

1. **WHAT MUST IT SUPPORT?** → Architecture Characteristics
2. **WHAT DOES IT DO?** → Logical Components
3. **HOW IS IT STRUCTURED?** → Architecture Style
4. **WHAT RULES APPLY?** → Architecture Decisions

> [!IMPORTANT]
> **Software Architecture = Capabilities + Behavior + Structural Style + Governance Decisions.** Một thiết kế kiến trúc hoàn chỉnh bắt buộc phải bao quát đầy đủ 4 chiều này.

---

## Tài liệu Tham khảo

- 📘 **[Fundamentals of Software Architecture (2nd Edition)](../../../library/fundamentals_of_software_architecture_2nd.epub)** – Mark Richards & Neal Ford *(Part I: Architectural Foundations & Dimensions)*.
- 📕 **[Clean Architecture: A Craftsman's Guide to Software Structure and Design](../../../library/clean_architecture_a_acraftsman_guide.pdf)** – Robert C. Martin *(Part V: Architecture & Components)*.

---
[← Back to README](README.md)

