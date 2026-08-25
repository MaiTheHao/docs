# Tư Duy Kiến Trúc (Architectural Thinking)

## Table of Contents

- [Bản chất của Tư duy Kiến trúc](#bản-chất-của-tư-duy-kiến-trúc)
- [Quang phổ giữa Kiến trúc và Thiết kế](#quang-phổ-giữa-kiến-trúc-và-thiết-kế)
- [Bề rộng Tri thức và Bề sâu Kỹ thuật](#bề-rộng-tri-thức-và-bề-sâu-kỹ-thuật)
- [Nghệ thuật Phân tích Đánh đổi](#nghệ-thuật-phân-tích-đánh-đổi)
- [Chuyển dịch Động lực Kinh doanh thành Đặc tính Kỹ thuật](#chuyển-dịch-động-lực-kinh-doanh-thành-đặc-tính-kỹ-thuật)
- [Hai Định luật Cốt lõi của Kiến trúc Phần mềm](#hai-định-luật-cốt-lõi-của-kiến-trúc-phần-mềm)
- [Thiết lập Ranh giới và Nguyên tắc Giữ Lựa chọn Mở](#thiết-lập-ranh-giới-và-nguyên-tắc-giữ-lựa-chọn-mở)
- [Tránh Bẫy Kiến trúc sư Ngồi Ghế Bành](#tránh-bẫy-kiến-trúc-sư-ngồi-ghế-bành)

---

## Bản chất của Tư duy Kiến trúc

Tư duy kiến trúc đại diện cho sự chuyển đổi căn bản trong hệ quy chiếu nhận thức của kỹ nghệ phần mềm: chuyển từ **Góc nhìn Chiến thuật (*Tactical Perspective*)** sang **Góc nhìn Chiến lược (*Strategic Perspective*)**.

Dưới **Góc nhìn Chiến thuật**, trọng tâm kỹ thuật tập trung vào giải pháp cục bộ: tối ưu hóa thuật toán vi mô, hiện thực hóa tính năng nhanh chóng và hoàn thiện mã nguồn theo từng đặc tả cụ thể. 

Ngược lại, **Góc nhìn Chiến lược** đòi hỏi cái nhìn bao quát về toàn bộ hệ thống: hiểu rõ cách các thành phần tương tác, nhận diện các ranh giới và ràng buộc cốt lõi, đồng thời lường trước tác động lâu dài của từng quyết định thiết kế đối với mục tiêu kinh doanh.

| Tiêu chí So sánh | Góc nhìn Chiến thuật (Tactical Perspective) | Góc nhìn Chiến lược (Strategic Perspective) |
| :--- | :--- | :--- |
| **Trọng tâm câu hỏi** | *"Làm thế nào để hiện thực hóa tính năng này nhanh nhất?"* | *"Tại sao cấu trúc này phù hợp hơn cấu trúc khác đối với bài toán kinh doanh?"* |
| **Phạm vi tác động** | Class, function, module nội bộ, thuật toán cục bộ | Ranh giới hệ thống, luồng dữ liệu liên service, mô hình tích hợp |
| **Mục tiêu ưu tiên** | Hoàn thành đúng hạn, chạy đúng logic, tối ưu hiệu năng vi mô | Bảo đảm các đặc tính kiến trúc (*-ilities*), kiểm soát nợ kỹ thuật và chi phí bảo trì dài hạn |
| **Thước đo thành công** | Mã nguồn sạch, vượt qua kiểm thử đơn vị, đáp ứng user story | Hệ thống ổn định, dễ mở rộng, đáp ứng mục tiêu kinh doanh và dễ thích ứng với thay đổi |

---

## Quang phổ giữa Kiến trúc và Thiết kế

Ranh giới giữa Kiến trúc (*Architecture*) và Thiết kế (*Design*) không phải là sự phân chia nhị phân tuyệt đối, mà tồn tại dưới dạng một **quang phổ liên tục** (*spectrum*).

Có thể hình dung qua sự tương đồng với kiến trúc xây dựng:

- **Kiến trúc (Architecture)**: Quyết định hình thái tổng thể như số tầng, kết cấu chịu lực, khả năng chống động đất hoặc loại mái. Quyết định này tương ứng với việc lựa chọn giữa Microservices, Event-Driven hay Modular Monolith.
- **Thiết kế (Design)**: Xác định cách bố trí phòng ốc, chất liệu lát sàn, màu sơn tường hoặc nội thất. Quyết định này tương ứng với thiết kế class diagram, mẫu thiết kế nội bộ (*Design Patterns*) hay lựa chọn thư viện UI.

Ba tiêu chí cốt lõi để phân định vị trí của một quyết định trên quang phổ:

| Tiêu chí Đánh giá | Quyết định Kiến trúc (Architecture) | Quyết định Thiết kế (Design) |
| :--- | :--- | :--- |
| **Tầm nhìn & Định hướng** | Mang tính chiến lược (*Strategic*), định hình tương lai dài hạn và đòi hỏi sự đồng thuận của nhiều bên liên quan. | Mang tính chiến thuật (*Tactical*), phạm vi ảnh hưởng cục bộ và xử lý bài toán triển khai cụ thể. |
| **Mức độ nỗ lực thay đổi** | Đòi hỏi chi phí và nỗ lực khổng lồ để tái cấu trúc (*high cost of change*) nếu quyết định sai lệch ban đầu. | Chi phí sửa đổi thấp, có thể tái cấu trúc linh hoạt trong các chu kỳ phát triển (*sprint*). |
| **Ý nghĩa của sự Đánh đổi** | Chứa đựng những đánh đổi kỹ thuật và kinh tế sâu sắc trên toàn hệ thống (*significant trade-offs*). | Tác động đánh đổi giới hạn trong phạm vi một thành phần hoặc module riêng lẻ. |

---

## Bề rộng Tri thức và Bề sâu Kỹ thuật

Một trong những thách thức lớn nhất khi bước vào vai trò kiến trúc sư là sự thay đổi trong cơ cấu tri thức: **Bề rộng tri thức (Technical Breadth)** trở nên quan trọng hơn **Bề sâu kỹ thuật (Technical Depth)**.

Khi làm việc ở góc độ kỹ thuật chi tiết, giá trị chuyên môn được xây dựng dựa trên việc đào sâu vào một ngôn ngữ hoặc framework cụ thể. 

Tuy nhiên, ở góc nhìn kiến trúc chiến lược, nhiệm vụ chính là kết nối các khối công nghệ khác nhau để tạo nên giải pháp tối ưu cho bài toán nghiệp vụ.

Biết rõ ưu và nhược điểm của 5 giải pháp lưu trữ dữ liệu khác nhau đem lại giá trị kiến trúc cao hơn nhiều so với việc chỉ là chuyên gia sâu về một hệ quản trị cơ sở dữ liệu duy nhất nhưng thiếu hiểu biết về các giải pháp thay thế.

```
       GÓC NHÌN CHIẾN THUẬT                  GÓC NHÌN CHIẾN LƯỢC
    ┌──────────────────────┐             ┌──────────────────────┐
    │   Technical Breadth  │             │                      │
    │      (Biết vừa)      │             │  Technical Breadth   │
    ├──────────────────────┤             │   (Rất rộng - Biết   │
    │                      │             │   nhiều giải pháp)   │
    │   Technical Depth    │             │                      │
    │  (Rất sâu - Chuyên   │             ├──────────────────────┤
    │  gia 1-2 công nghệ)  │             │   Technical Depth    │
    │                      │             │ (Duy trì mức đủ dùng)│
    └──────────────────────┘             └──────────────────────┘
```

> [!TIP]
> Kiến trúc sư cần chấp nhận chuyển dịch một phần thời gian từ việc đào sâu chi tiết sang việc duy trì và mở rộng *Technology Radar* cá nhân. Tránh rơi vào bẫy **Frozen Caveman Antipattern** – tức giữ nguyên bộ công cụ và tư duy công nghệ của quá khứ để áp đặt cho các bài toán hiện đại.

---

## Nghệ thuật Phân tích Đánh đổi

Trong kiến trúc phần mềm, không tồn tại giải pháp hoàn hảo tuyệt đối mà chỉ tồn tại tập hợp các sự đánh đổi (*advantages & disadvantages*). 

Câu trả lời tiêu chuẩn cho mọi câu hỏi kiến trúc luôn là: **"It depends"** (*Nó tùy thuộc vào bối cảnh*).

Mỗi quyết định kiến trúc nhằm gia tăng một đặc tính chất lượng đều kéo theo sự suy giảm của một hoặc nhiều đặc tính khác:

| Kiến trúc Lựa chọn | Ưu điểm Đạt được | Đánh đổi Chấp nhận (Trade-offs) |
| :--- | :--- | :--- |
| **Microservices Style** | Khả năng mở rộng độc lập (*Scalability*), tính linh hoạt trong phát hành (*Agility*), cô lập lỗi tốt. | Độ phức tạp vận hành tăng vọt, tính nhất quán dữ liệu suy giảm (*Eventual Consistency*), độ trễ mạng phát sinh. |
| **Monolithic Style** | Đơn giản trong phát triển ban đầu, nhất quán dữ liệu tuyệt đối qua ACID transaction, độ trễ giao tiếp thấp. | Khó mở rộng từng phần, rủi ro lỗi toàn cục (*Single Point of Failure*), thời gian build/test tăng theo quy mô mã nguồn. |
| **Event-Driven Style** | Khả năng tách rời (*Decoupling*) cao độ, chịu tải đỉnh xuất sắc, phản hồi bất đồng bộ mượt mà. | Khó theo dõi luồng thực thi (*Observability*), độ phức tạp trong xử lý lỗi và bù trừ giao dịch (*Saga Pattern*). |

Mục tiêu của kiến trúc sư không phải là tìm kiếm một "kiến trúc hoàn hảo" – nỗ lực này thường dẫn đến tình trạng thiết kế quá mức (*over-engineering*). 

Mục tiêu thực tế và chuẩn mực nhất là xác định được **"The least worst architecture"** (*Kiến trúc ít tệ nhất*) – giải pháp cân bằng hài hòa nhất giữa các lực lượng mâu thuẫn trong bối cảnh cụ thể của dự án.

---

## Chuyển dịch Động lực Kinh doanh thành Đặc tính Kỹ thuật

Kiến trúc sư đóng vai trò là cầu nối chuyển ngữ (*translator*) giữa mong muốn thương mại của các bên liên quan (*stakeholders*) thành các đặc tính kiến trúc đo lường được (*architectural characteristics*).

Một hệ thống cố gắng hỗ trợ tất cả các đặc tính kiến trúc sẽ nhanh chóng trở nên cồng kềnh, đắt đỏ và không thể duy trì. Do đó, việc ưu tiên từ 3 đến 5 đặc tính sống còn là nhiệm vụ chiến lược hàng đầu.

| Mong muốn từ Stakeholders | Yêu cầu Kỹ thuật Cốt lõi | Đặc tính Kiến trúc Tương ứng (-ilities) |
| :--- | :--- | :--- |
| *"Hệ thống phải ra mắt tính năng mới nhanh hơn đối thủ."* | Tối ưu hóa chu kỳ phát hành, kiểm thử tự động và tách biệt module độc lập. | **Agility**, **Deployability**, **Testability**, **Modularity** |
| *"Dịch vụ không được gián đoạn ngay cả khi lượng truy cập tăng đột biến."* | Khả năng co giãn tài nguyên theo tải và tự phục hồi khi có sự cố hạ tầng. | **Scalability**, **Elasticity**, **Availability**, **Fault Tolerance** |
| *"Hệ thống phải tuân thủ nghiêm ngặt quy định bảo mật tài chính."* | Mã hóa dữ liệu end-to-end, kiểm soát truy cập và ghi vết kiểm toán toàn diện. | **Security**, **Auditability**, **Data Integrity** |

---

## Hai Định luật Cốt lõi của Kiến trúc Phần mềm

Mọi quyết định kiến trúc chuyên nghiệp đều được dẫn đường bởi hai định luật bất biến:

### Định luật 1: Mọi thứ trong kiến trúc phần mềm đều là sự đánh đổi

> **"Everything in software architecture is a trade-off."**

Không có "viên đạn bạc" (*silver bullet*) nào có thể giải quyết mọi vấn đề mà không kéo theo chi phí hoặc sự phức tạp phát sinh. Một giải pháp kiến trúc chỉ có giá trị khi các ưu điểm nó đem lại vượt trội hơn những đánh đổi mà hệ thống buộc phải chấp nhận.

### Định luật 2: "Tại sao" quan trọng hơn "Làm thế nào"

> **"Why is more important than how."**

Khi quan sát một sơ đồ kỹ thuật, việc phân tích cách hệ thống hoạt động (*How*) là tương đối trực quan. 

Tuy nhiên, yếu tố giá trị nhất và dễ bị thất lạc nhất theo thời gian là lý do **Tại sao (*Why*)** quyết định đó lại được đưa ra: bối cảnh lịch sử là gì, những lựa chọn thay thế nào đã bị loại bỏ và các sự đánh đổi nào đã được chấp nhận tại thời điểm đó.

> [!IMPORTANT]
> Để bảo toàn tri thức kiến trúc, việc lưu trữ quyết định dưới dạng **Architectural Decision Records (ADR)** là bắt buộc. Một bản ADR chuẩn mực gồm 4 phần chính:
> 1. **Title & Status**: Tên quyết định và trạng thái (*Proposed, Accepted, Superseded*).
> 2. **Context**: Bối cảnh nghiệp vụ, các ràng buộc kỹ thuật và vấn đề cần giải quyết.
> 3. **Decision**: Quyết định được lựa chọn và quy tắc thực thi cụ thể.
> 4. **Consequences / Trade-offs**: Các hệ quả tích cực, tiêu cực và các điểm đánh đổi chấp nhận.

---

## Thiết lập Ranh giới và Nguyên tắc Giữ Lựa chọn Mở

Bảo vệ tính linh hoạt của phần mềm đòi hỏi việc thiết lập ranh giới cách ly nghiêm ngặt và quản lý thời điểm ra quyết định có tính chiến lược.

### 1. Ranh giới Kiến trúc (Architectural Boundaries)

Ranh giới kiến trúc được tạo ra nhằm cô lập các quy tắc nghiệp vụ cốt lõi (*Core Business Policies*) khỏi các chi tiết công nghệ biến động bên ngoài (*Details* như Cơ sở dữ liệu, Giao diện người dùng, Web Framework).

Nguyên tắc Đảo ngược Phụ thuộc (*Dependency Inversion Principle*) bảo đảm chiều phụ thuộc của mã nguồn luôn hướng từ chi tiết công nghệ vào vùng nghiệp vụ cốt lõi:

| Thành phần | Vai trò trong Hệ thống | Đặc điểm Phụ thuộc |
| :--- | :--- | :--- |
| **Core Business Rules** | Chứa các quy tắc nghiệp vụ bất biến, entities và domain logic. | Độc lập hoàn toàn, không phụ thuộc vào bất kỳ framework hay database cụ thể nào. |
| **Interface Adapters** | Chuyển đổi dữ liệu giữa định dạng tiện lợi cho domain và định dạng của thiết bị ngoại vi. | Phụ thuộc vào Core Business Rules thông qua các abstractions/interfaces. |
| **External Details (UI, DB, Web)** | Công cụ hạ tầng, driver cơ sở dữ liệu, giao diện web, message brokers. | Đóng vai trò là các "plugin" ngoại vi, dễ dàng thay thế mà không làm thay đổi core logic. |

### 2. Nguyên tắc Giữ Lựa chọn Mở (Keeping Options Open)

> **"A good architect maximizes the number of decisions not made."**
> *(Một kiến trúc sư giỏi là người tối đa hóa số lượng quyết định chưa cần phải đưa ra.)*

Ở giai đoạn khởi đầu của một dự án, lượng thông tin thu thập được luôn ở mức thấp nhất. Việc đưa ra các quyết định công nghệ ràng buộc quá sớm (như chọn cơ sở dữ liệu cụ thể, framework cụ thể) làm gia tăng đáng kể rủi ro sai lệch.

Bằng cách thiết lập cấu trúc cổng và bộ điều hợp (*Ports and Adapters / Hexagonal Architecture*), kiến trúc sư có thể phát triển và kiểm thử toàn bộ logic nghiệp vụ cốt lõi một cách độc lập, cho phép trì hoãn quyết định công nghệ chi tiết đến **thời điểm chịu trách nhiệm cuối cùng** (*Last Responsible Moment*).

---

## Tránh Bẫy Kiến trúc sư Ngồi Ghế Bành

Một trong những nguy cơ phổ biến đối với kiến trúc sư là rơi vào cái bẫy **Kiến trúc sư Ngồi Ghế Bành (Armchair Architect)** – trạng thái đưa ra những bản vẽ lý thuyết hoàn hảo trên giấy tờ nhưng phi thực tế khi triển khai vì đã mất kết nối với thực tế phát triển phần mềm.

Để giữ cho các quyết định kiến trúc luôn bám sát thực tế, kiến trúc sư cần chủ động duy trì tương tác kỹ thuật thông qua các hoạt động trọng tâm:

| Hoạt động Trọng tâm | Phương thức Triển khai | Mục tiêu Kỹ thuật |
| :--- | :--- | :--- |
| **Xây dựng Proof-of-Concept (POC)** | Trực tiếp lập trình các bản mẫu kỹ thuật để kiểm chứng các giả định kiến trúc phức tạp. | Giảm thiểu rủi ro kỹ thuật trước khi áp dụng trên quy mô lớn. |
| **Xử lý Nợ kỹ thuật (Technical Debt)** | Trực tiếp tham gia giải quyết các điểm nghẽn hiệu năng hoặc tái cấu trúc các module lõi. | Nắm bắt rõ mức độ ma sát kỹ thuật mà đội ngũ đang đối mặt. |
| **Thiết lập Fitness Functions** | Viết các bài kiểm thử kiến trúc tự động (sử dụng công cụ như ArchUnit, jMolecules). | Tự động hóa việc bảo vệ ranh giới kiến trúc trong pipeline CI/CD. |
| **Code Review Chiến lược** | Tham gia rà soát mã nguồn ở các phần giao tiếp liên module và luồng tích hợp chính. | Đảm bảo các quyết định kiến trúc được tuân thủ đúng định hướng. |

> [!CAUTION]
> Kiến trúc sư cần tránh nhận các tác vụ nằm trên đường găng tiến độ (*Critical Path*) của nhóm phát triển. Việc bị cuốn vào các deadline tính năng gấp gáp cùng lúc với các cuộc họp chiến lược sẽ biến chính kiến trúc sư thành **nút thắt cổ chai (Bottleneck Trap)** của toàn bộ dự án.

---
[← Back to README](README.md)
