# Bốn Chiều Kiến Trúc Phần Mềm (Four Dimensions)

## Table of Contents

- [Tổng quan về Bốn Chiều Kiến Trúc](#tổng-quan-về-bốn-chiều-kiến-trúc)
- [1. Architecture Characteristics](#1-architecture-characteristics)
- [2. Logical Components](#2-logical-components)
- [3. Architecture Style](#3-architecture-style)
- [Architecture Quantum](#architecture-quantum)
- [4. Architecture Decisions](#4-architecture-decisions)
- [Vòng lặp giữa Bốn Chiều](#vòng-lặp-giữa-bốn-chiều)
- [Tư duy Cốt lõi của Kiến trúc sư](#tư-duy-cốt-lõi-của-kiến-trúc-sư)

---

## Tổng quan về Bốn Chiều Kiến Trúc

Kiến trúc phần mềm là tập hợp các quyết định thiết kế cốt lõi định hình cấu trúc hệ thống; mức độ "kiến trúc" được đo lường qua chi phí và nỗ lực cần thiết để thay đổi chúng. Theo tài liệu kinh điển *Fundamentals of Software Architecture* của Mark Richards và Neal Ford, kiến trúc hoàn chỉnh được cấu thành từ 4 chiều liên kết hữu cơ: **Characteristics → Components → Style → Decisions**.

Bảng tổng hợp vai trò và mối quan hệ giữa bốn chiều kiến trúc:

| Chiều | Trọng tâm Phân tích | Mức độ Tác động Cốt lõi |
| :--- | :--- | :--- |
| **Architecture Characteristics** | Yêu cầu phi chức năng (*non-functional requirements*) | Định hình tiêu chuẩn vận hành, độ tin cậy và khả năng mở rộng |
| **Logical Components** | Phân rã domain và ranh giới nghiệp vụ (*business capabilities*) | Xác định khối chức năng và luồng dữ liệu độc lập |
| **Architecture Style** | Khung cấu trúc tổng thể và mô hình liên kết (*topology*) | Quyết định mô hình phân tán, phân tầng hoặc hướng sự kiện |
| **Architecture Decisions** | Quy tắc bắt buộc và ràng buộc kỹ thuật (*governance*) | Bảo vệ tính toàn vẹn hệ thống và ngăn chặn xói mòn kiến trúc |

---

## 1. Architecture Characteristics

> [!NOTE]
> **Architecture Characteristics** là các yêu cầu phi chức năng độc lập với logic nghiệp vụ, nhưng quyết định trực tiếp đến cấu trúc và sự thành công trong vận hành của hệ thống.

Một tiêu chí được công nhận là đặc tính kiến trúc khi thỏa mãn ba điều kiện:
- Là cân nhắc **phi nghiệp vụ** (*non-domain centric*).
- Ảnh hưởng trực tiếp đến **cấu trúc hệ thống** (*structural impact*).
- Đóng vai trò **sống còn đối với vận hành** (*critical for operational success*).

Các nhóm đặc tính chính:
- **Operational (Vận hành):** `performance`, `scalability`, `availability`, `reliability`.
- **Structural (Cấu trúc):** `modularity`, `maintainability`, `testability`, `deployability`.
- **Cross-cutting (Xuyên suốt):** `security`, `privacy`, `feasibility`, `compliance`.

Đặc tính kiến trúc được phân loại theo hai hình thức biểu hiện:
- **Explicit (Tường minh):** Được quy định rõ ràng trong tài liệu yêu cầu (ví dụ: thời gian phản hồi API dưới 200ms, tải đỉnh 10.000 RPS).
- **Implicit (Ngầm định):** Các chuẩn mực mặc định phải đạt được dù không ghi rõ (như bảo mật, an toàn dữ liệu, tính toàn vẹn giao dịch).

Mục tiêu kinh doanh luôn cần được chuyển dịch thành đặc tính kỹ thuật tương ứng. Ví dụ, chiến lược rút ngắn thời gian ra mắt thị trường (**Time to Market**) chuyển hóa thành độ linh hoạt (**Agility**), được củng cố bởi **deployability, testability và maintainability**.

> [!IMPORTANT]
> Các đặc tính luôn tồn tại **trade-off**. Mục tiêu của kiến trúc sư không phải là tìm kiếm thiết kế hoàn mỹ tuyệt đối mà là xây dựng giải pháp **"least worst architecture"**—phương án dung hòa tối ưu nhất giữa các ràng buộc thực tế.

---

## 2. Logical Components

**Logical Components** đóng gói hành vi nghiệp vụ, mô hình domain và luồng xử lý (*workflows*) của hệ thống thành các khối chức năng có ranh giới rõ ràng.

Phân biệt giữa hai cấp độ kiến trúc:
- **Logical Architecture:** Mô tả ranh giới và cách các thành phần tương tác về mặt logic, không phụ thuộc vào công nghệ triển khai.
- **Physical Architecture:** Hiện thực hóa các thành phần logic thành hạ tầng vật lý: container, tiến trình chạy độc lập, database cluster, giao thức truyền thông (`gRPC`, `HTTP/REST`, `Kafka`).

Quy trình 5 bước xác định và tinh chỉnh component:
1. **Identify Components:** Áp dụng phương pháp phân tích luồng người dùng (*Workflow Approach*) hoặc xác định tác nhân và hành động (*Actor/Action Approach*).
2. **Assign Requirements:** Gán các yêu cầu nghiệp vụ và trách nhiệm cụ thể cho từng thành phần.
3. **Analyze Cohesion & Coupling:** Đánh giá mức độ gắn kết nội tại và khớp nối giữa các component.
4. **Apply Characteristics:** Áp dụng các đặc tính kiến trúc cần thiết vào từng khối chức năng.
5. **Refactor & Iterate:** Tái cấu trúc và lặp lại quy trình để tối ưu hóa ranh giới module.

> [!WARNING]
> **Entity Trap:** Tuyệt đối tránh ánh xạ máy móc mỗi bảng cơ sở dữ liệu (*database table*) thành một component riêng biệt. Sai lầm này biến hệ thống thành tập hợp các dịch vụ CRUD phân mảnh, làm rò rỉ logic nghiệp vụ và bùng nổ khớp nối dữ liệu.

---

## 3. Architecture Style

**Architecture Style** định hình bộ khung tổng thể của hệ thống, chi phối các yếu tố cốt lõi:
- Cấu trúc liên kết giữa các thành phần (*component topology*).
- Mô hình kiến trúc vật lý và chiến lược phân bổ hạ tầng (*physical deployment model*).
- Phương thức truyền thông và tích hợp (*communication style: sync vs. async*).
- Cấu trúc phân vùng và sở hữu dữ liệu (*data topology*).

Chiến lược phân vùng cấp cao nhất (**Top-level Partitioning**) là quyết định mang tính chiến lược:
- **Technical Partitioning (Phân vùng Kỹ thuật):** Chia nhỏ hệ thống theo các tầng kỹ thuật (Presentation Layer, Business Layer, Persistence Layer).
- **Domain Partitioning (Phân vùng Nghiệp vụ):** Chia nhỏ hệ thống theo ranh giới nghiệp vụ độc lập (Order Service, Payment Service, Inventory Service), trong đó mỗi service tự quản lý trọn vẹn từ UI, Logic đến Data.

So sánh hai phong cách phân vùng kiến trúc:

| Tiêu chí | Technical Partitioning | Domain Partitioning |
| :--- | :--- | :--- |
| **Trục phân chia** | Theo tầng kỹ thuật (Presentation, Business, Data) | Theo ranh giới nghiệp vụ (Order, Payment, Inventory) |
| **Mức độ gắn kết** | Gắn kết kỹ thuật cao, nhưng phân tán domain logic | Gắn kết nghiệp vụ cao theo từng *Bounded Context* |
| **Phù hợp tổ chức** | Đội ngũ chuyên môn hóa theo kỹ năng kỹ thuật | Đội ngũ chức năng chéo (*cross-functional teams*) theo Agile/DDD |
| **Khả năng thay đổi** | Thay đổi một tính năng nghiệp vụ phải sửa đổi xuyên suốt mọi tầng | Thay đổi cô lập trong phạm vi một domain duy nhất |

---

## Architecture Quantum

> [!IMPORTANT]
> **Architecture Quantum** là một đơn vị triển khai độc lập sở hữu tính gắn kết chức năng cao (*high functional cohesion*), khớp nối tĩnh thấp (*low static coupling*) và liên kết dữ liệu nội tại đồng nhất (*synchronous data isolation*).

Khái niệm Quantum giúp kiến trúc sư xác định phạm vi phân rã hệ thống:
- **Single Quantum (Hệ thống Đồng nhất):** Toàn bộ ứng dụng chia sẻ chung một bộ đặc tính vận hành tương đồng → Thích hợp với mô hình **Monolith** hoặc **Modular Monolith** nhằm tối ưu chi phí vận hành.
- **Multiple Quanta (Hệ thống Đa dạng):** Các phân hệ có yêu cầu về quy mô, bảo mật hoặc độ trễ hoàn toàn khác biệt (ví dụ: dịch vụ xử lý realtime có độ trễ cực thấp, dịch vụ báo cáo cần băng thông tính toán lớn) → Đòi hỏi chuyển dịch sang kiến trúc phân tán như **Microservices** hoặc **Space-based Architecture**.

---

## 4. Architecture Decisions

**Architecture Decisions** thiết lập các quy tắc, chính sách và ràng buộc kỹ thuật nhằm định hướng cách thức đội ngũ kỹ sư xây dựng hệ thống.

Một quyết định được xếp vào cấp độ kiến trúc khi tạo ra tác động trực tiếp đến:
1. **Structure:** Cấu trúc thành phần và mô hình phân vùng.
2. **Non-functional Characteristics:** Thuộc tính chất lượng vận hành và bảo mật.
3. **Dependencies:** Ranh giới và hướng phụ thuộc giữa các module.
4. **Interfaces:** Giao thức và hợp đồng truyền thông giữa các service.
5. **Construction Techniques:** Tiêu chuẩn và công nghệ nền tảng bắt buộc.

Phân biệt giữa hai mức độ ràng buộc quản trị:
- **Guidance (Khuyến nghị):** Cung cấp tài liệu định hướng mẫu, duy trì tính linh hoạt và quyền tự chủ cho kỹ sư khi giải quyết bài toán cụ thể.
- **Specification (Quy định bắt buộc):** Ràng buộc mang tính cưỡng chế cao, áp dụng khi cần bảo vệ các đặc tính kiến trúc cốt lõi.

Hai công cụ trọng tâm để thực thi và bảo vệ quyết định:
- **Architecture Decision Records (ADRs):** Lưu trữ bối cảnh (*Context*), quyết định lựa chọn (*Decision*) cùng hệ quả (*Consequences*) và lý do đánh đổi.
- **Fitness Functions:** Bộ kiểm thử kiến trúc tự động hóa tích hợp trong CI/CD (như `ArchUnit`, `NetArchTest`) nhằm ngăn ngừa hiện tượng xói mòn kiến trúc (**architectural drift**).

---

## Vòng lặp giữa Bốn Chiều

Tư duy kiến trúc không vận hành theo một đường thẳng đóng băng mà là một chu trình lặp và thích ứng liên tục:

1. **Business Goals:** Xác định mục tiêu và tầm nhìn chiến lược của doanh nghiệp.
2. **Identify Characteristics:** Chuyển hóa mục tiêu thành các đặc tính kỹ thuật cốt lõi.
3. **Define Logical Components:** Bóc tách các thành phần nghiệp vụ và luồng xử lý.
4. **Select Architecture Style:** Lựa chọn phong cách kiến trúc và mô hình phân vùng phù hợp.
5. **Enforce Decisions & ADRs:** Ban hành các quy tắc, ràng buộc kỹ thuật và đóng gói vào ADRs.
6. **Automate Fitness Functions:** Xây dựng cơ chế giám sát và kiểm thử tự động trên đường ống CI/CD.

Dữ liệu thu thập từ giám sát vận hành thực tế và các bài kiểm thử *Fitness Functions* sẽ phản hồi liên tục về pha đánh giá đặc tính, đảm bảo kiến trúc luôn tiến hóa đồng nhịp với sự phát triển của sản phẩm.

---

## Tư duy Cốt lõi của Kiến trúc sư

Để điều hướng thành công giữa bốn chiều, kiến trúc sư phần mềm cần rèn luyện 5 nguyên tắc tư duy cốt lõi:

1. **Tư duy ở cấp độ Trách nhiệm Thành phần:** Luôn phân tích hệ thống qua lăng kính component và ranh giới trách nhiệm, vượt lên trên phạm vi các class hay bảng dữ liệu đơn lẻ.
2. **Mở rộng Technical Breadth:** Ưu tiên bề rộng kiến thức kỹ thuật để có khả năng nhận diện và đánh giá đa dạng phương án giải pháp thay vì chỉ bám vào một công nghệ sở trường duy nhất.
3. **Đảm bảo Sự tương thích giữa Domain và Architecture Style:** Cấu trúc kỹ thuật phải hỗ trợ tự nhiên cho mô hình nghiệp vụ, tránh việc ép uổng nghiệp vụ vào các kiến trúc không phù hợp.
4. **Phân tách Rạch ròi giữa Policy và Implementation:** Tập trung thiết lập chính sách cốt lõi (*policy*) và tạo không gian tự do cho các kỹ sư triển khai chi tiết (*implementation details*).
5. **Làm chủ Nghệ thuật Trade-off:** Thấu hiểu sâu sắc rằng không tồn tại kiến trúc hoàn hảo cho mọi bài toán; giá trị của người kiến trúc sư nằm ở khả năng phân tích và đưa ra quyết định đánh đổi minh bạch, hiệu quả nhất.

> [!TIP]
> Kiến trúc phần mềm là hành trình cân bằng bền bỉ giữa **đặc tính chất lượng cần đạt, thành phần nghiệp vụ cốt lõi, phong cách cấu trúc nền tảng và các quyết định bảo vệ hệ thống**.

---
[← Back to README](README.md)
