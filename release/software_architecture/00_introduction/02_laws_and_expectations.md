# Quy Luật Kiến Trúc & Kỳ Vọng Năng Lực

## Table of Contents

- [Ba Quy Luật Kiến Trúc Bất Biến](#ba-quy-luật-kiến-trúc-bất-biến)
- [Quang Phổ Quyết Định Kiến Trúc](#quang-phổ-quyết-định-kiến-trúc)
- [Tám Kỳ Vọng Năng Lực Cốt Lõi](#tám-kỳ-vọng-năng-lực-cốt-lõi)
- [Kiểm Soát Xói Mòn Bằng Fitness Functions](#kiểm-soát-xói-mòn-bằng-fitness-functions)

---

## Ba Quy Luật Kiến Trúc Bất Biến

Hệ thống phần mềm phức tạp hiếm khi sụp đổ vì lập trình viên thiếu kỹ năng viết mã. Phần lớn sự cố bắt nguồn từ những quyết định kiến trúc mang tính giáo điều, coi một giải pháp kỹ thuật là **"Silver Bullet"** và áp dụng bất chấp bối cảnh vận hành.

Trong tác phẩm kinh điển *Fundamentals of Software Architecture*, hai tác giả Mark Richards và Neal Ford đã đúc kết ba quy luật nền tảng chi phối toàn bộ tiến trình thiết kế hệ thống:

| Quy Luật | Trọng Tâm Thiết Kế | Hệ Quả Thực Chiến & Sai Lầm Thường Gặp |
| :--- | :--- | :--- |
| **First Law** | Đánh giá đa chiều mọi hệ quả kỹ thuật | Lầm tưởng tồn tại giải pháp hoàn hảo; bỏ qua chi phí ẩn về hạ tầng và độ phức tạp vận hành. |
| **Second Law** | Bảo toàn lý do và bối cảnh ra quyết định | Chỉ ghi chép công nghệ triển khai (`How`) mà quên lưu trữ lý do (`Why`), khiến đội ngũ kế thừa không dám tái cấu trúc. |
| **Third Law** | Định vị điểm cân bằng trên dải quang phổ | Lầm tưởng rằng có kết quả tuyệt đối đúng hoặc sai; áp đặt mô hình phức tạp khi bối cảnh thực tế chưa đòi hỏi. |

### 1. First Law: **"Everything in software architecture is a trade-off."**

Kỹ nghệ phần mềm không tồn tại giải pháp tối ưu tuyệt đối trên mọi phương diện. Mọi cải tiến ở một thuộc tính kiến trúc đều phải trả giá bằng sự suy giảm hoặc ràng buộc ở những thuộc tính khác:

- **Microservices**: Mang lại khả năng mở rộng độc lập và tốc độ phát hành theo từng nhóm domain, nhưng đánh đổi bằng việc gia tăng độ trễ mạng (ví dụ: `p99 latency` từ 2ms khi gọi hàm in-memory tăng lên 35ms qua mạng), chi phí tài nguyên và rủi ro bất đồng bộ dữ liệu phân tán.
- **Tái sử dụng mã nguồn**: Tiết kiệm thời gian lập trình ban đầu nhưng dễ tạo ra mức độ **Coupling** nguy hiểm. Chia sẻ thư viện dùng chung rất hiệu quả cho các tiện ích hạ tầng ổn định (logging, metrics), nhưng trở thành cái bẫy nếu áp dụng cho domain logic có tần suất thay đổi cao giữa các phòng ban.

> [!IMPORTANT]
> Mục tiêu thực tế của kiến trúc sư không phải là tìm kiếm thiết kế hoàn hảo, mà là xác định phương án **Least Worst Architecture**—giải pháp dung hòa tối ưu nhất giữa các ràng buộc kỹ thuật, ngân sách và thời hạn bàn giao.

### 2. Second Law: **"Why is more important than how."**

Chi tiết kỹ thuật triển khai (`How`) biến đổi liên tục theo sự đào thải của công nghệ. Ngược lại, lý do kiến trúc và bối cảnh kinh doanh (`Why`) hình thành nên quyết định mới là tri thức cốt lõi cần lưu trữ dài hạn:

- **Thiếu bối cảnh Why**: Một ghi chép ghi nhận *"Hệ thống sử dụng `Apache Kafka`"* chỉ mô tả công cụ. Khi quy mô thay đổi hoặc chi phí duy trì cụm cluster tăng cao, đội ngũ tiếp quản không có căn cứ để đánh giá việc thay thế.
- **Bảo toàn bối cảnh Why**: Ghi chép nêu rõ *"Sử dụng message broker phân tán bất đồng bộ để đệm tải cho cổng thanh toán, duy trì `p99 latency` dưới 150ms và thông lượng 12.000 req/s khi chiến dịch khuyến mại đạt đỉnh"* giúp đội ngũ tự tin cân nhắc các giải pháp thay thế như `RabbitMQ`, `NATS` hoặc `Cloud Pub/Sub` mà không sợ phá vỡ cam kết SLO.

Công cụ chuẩn mực để lưu trữ bối cảnh này là tài liệu **ADR** (**Architecture Decision Record**), bao gồm: Bối cảnh, Quyết định, Các phương án thay thế bị loại trừ và Hệ quả đánh đổi được chấp thuận.

### 3. Third Law: **"Most architecture decisions exist on a spectrum between extremes."**

Trong đời sống thực tế cũng như kỹ nghệ phần mềm, mọi quyết định hiếm khi rạch ròi giữa hai thái cực trắng đen:

- **Không có kết quả nào là đúng hoặc sai**: Tranh cãi xem **Monolith** là sai hay **Microservices** mới là đúng hoàn toàn không mang lại giá trị kỹ thuật. Trong kiến trúc, không có quyết định nào là đúng hoặc sai tuyệt đối; một giải pháp chỉ có thể được xem là phù hợp hay không phù hợp với từng bài toán cụ thể.
- **Tư duy dải quang phổ**: Mọi giải pháp kiến trúc đều phân bổ trên một dải quang phổ giữa hai thái cực đối nghịch. Lựa chọn hợp lý không phải là cố gắng tìm kiếm một phương án "đúng" duy nhất, mà là xác định điểm cân bằng tối ưu (**Sweet Spot**) tương thích nhất với quy mô đội ngũ, khối lượng tải và nguồn lực tại thời điểm hiện tại.

---

## Quang Phổ Quyết Định Kiến Trúc

Thay vì tranh cãi mô hình nào "đúng" hay "sai", kiến trúc sư giỏi sẽ nhìn mọi thứ như một dải quang phổ để chọn giải pháp vừa vặn nhất với túi tiền, quy mô đội ngũ và bài toán thực tế:

| Vấn Đề Quyết Định | Thái Cực A (Tập Trung) | Điểm Cân Bằng (Vừa Vặn Nhất) | Thái Cực B (Phân Tán) |
| :--- | :--- | :--- | :--- |
| **Chia nhỏ hệ thống** | **Gộp chung một nhà (Monolith)**:<br/>Tất cả chung một khối. Làm nhanh, ít tốn kém, nhưng đông người sẽ dẫm chân lên nhau. | **Chia phòng riêng (Modular Monolith)**:<br/>Chung nhà nhưng ngăn vách rõ ràng. Gọn gàng, chạy nhanh và dễ bảo trì. | **Mỗi người một nhà (Microservices)**:<br/>Tách riêng từng căn hộ. Tự do mở rộng, nhưng tốn kém tiền bạc và khó quản lý. |
| **Phối hợp công việc** | **Một người chỉ huy (Orchestration)**:<br/>Một đầu mối điều phối tất cả. Dễ theo dõi, nhưng người chỉ huy quá tải thì cả đội phải đứng chờ. | **Phối hợp linh hoạt (Hybrid)**:<br/>Việc lớn thì thông báo chung, việc nhỏ các nhóm tự bảo nhau làm. | **Tự nhìn nhau làm (Choreography)**:<br/>Không ai chỉ huy, tự thấy việc thì làm. Rất tự do, nhưng khi có lỗi thì khó tìm ai chịu trách nhiệm. |
| **Cách thức quản lý** | **Soi xét từng li (Kiểm soát vi mô)**:<br/>Bắt tuân thủ cứng nhắc từng chi tiết. An toàn nhưng làm thui chột tính chủ động của kỹ sư. | **Đặt khung an toàn (Guardrails)**:<br/>Đưa ra luật chơi và ranh giới rõ ràng; bên trong ranh giới để anh em tự do quyết định. | **Thả nổi hoàn toàn (Tháp ngà)**:<br/>Chỉ nói lý thuyết suông, không ai giám sát khiến hệ thống nhanh chóng rối loạn. |

> [!TIP]
> Không có kiến trúc xịn nhất, chỉ có kiến trúc vừa vặn nhất. Doanh nghiệp mới bắt đầu nên ở "Thái cực A" để tiết kiệm và đi nhanh; khi người dùng đông lên và nguồn lực dồi dào hơn mới dịch chuyển dần sang "Thái cực B".

---

## Tám Kỳ Vọng Năng Lực Cốt Lõi

Năng lực của một kiến trúc sư không thể hiện qua việc thuộc lòng các mẫu thiết kế, mà thông qua khả năng hoàn thành **8 kỳ vọng cốt lõi** được chuẩn hóa từ *Fundamentals of Software Architecture*:

| Nhóm Năng Lực | Kỳ Vọng Trọng Tâm | Nguyên Tắc & Hành Động Kỹ Thuật Cốt Lõi |
| :--- | :--- | :--- |
| **Ra Quyết Định & Phân Tích** | **1. Make Architecture Decisions** | Ưu tiên **Guide thay vì Specify**: Thiết lập ranh giới định hướng bao quát, chỉ chỉ định công nghệ cụ thể khi liên quan trực tiếp đến thuộc tính sống còn như **Scalability** hoặc **Security**. |
| | **2. Continually Analyze Architecture** | Giám sát liên tục chỉ số **Architecture Vitality** và ngăn chặn suy thoái cấu trúc xuyên suốt chu kỳ phát triển hệ thống. |
| **Tri Thức & Xu Hướng** | **3. Keep Current with Trends** | Dành tối thiểu 20 phút mỗi ngày theo dõi biến động công nghệ; xây dựng **Personal Tech Radar** với 4 vòng đánh giá: **Adopt**, **Trial**, **Assess**, **Hold**. |
| | **4. Understand Diverse Technologies** | Ưu tiên **Technical Breadth** hơn **Technical Depth**: Nắm vững trade-off và bối cảnh ứng dụng của nhiều giải pháp thay vì chỉ đào sâu duy nhất một công nghệ sở trường. |
| **Nghiệp Vụ & Lãnh Đạo** | **5. Know the Business Domain** | Sử dụng chung ngôn ngữ với stakeholder; chuyển dịch mục tiêu kinh doanh thành các thuộc tính kỹ thuật tương ứng: **Deployability**, **Maintainability**, **Testability**. |
| | **6. Possess Interpersonal Skills** | Thực hành mô hình **Elastic Leadership**; xóa bỏ tư duy xa rời thực tế của **Armchair Architect** và phong cách can thiệp độc đoán của **Control-Freak Architect**. |
| **Quản Trị & Thực Thi** | **7. Ensure Compliance** | Triệt tiêu độ lệch giữa thiết kế lý thuyết (**As-designed**) và mã nguồn thực tế (**As-built**) bằng các công cụ kiểm tra tự động trong pipeline phát triển. |
| | **8. Navigate Organizational Politics** | Thực thi nguyên lý **"Demonstration Defeats Discussion"**: Dùng Proof-of-Concept (POC) và số liệu đo lường định lượng thay cho tranh luận cảm tính; vận dụng nguyên tắc 4C (**Communication**, **Collaboration**, **Clear**, **Concise**). |

---

## Kiểm Soát Xói Mòn Bằng Fitness Functions

Trong quá trình phát triển lâu dài, áp lực bàn giao tính năng cùng sự biến động nhân sự rất dễ khiến cấu trúc hệ thống bị xói mòn âm thầm (**Architectural Drift**). **Fitness Functions** ra đời như một công cụ đo lường tự động, giúp đội ngũ xác định khách quan liệu mã nguồn thực tế có còn tuân thủ các quy tắc và ranh giới kiến trúc ban đầu hay không.

Thay vì dựa vào hoạt động rà soát thủ công vốn dễ bỏ sót, các nguyên tắc kiến trúc được chuyển hóa thành các bài kiểm thử tự động chạy liên tục trong chu trình tích hợp `CI/CD`. Khi có bất kỳ thay đổi nào làm suy giảm thuộc tính chất lượng hoặc xâm phạm ranh giới hệ thống, quy trình sẽ tự động phát hiện và cảnh báo ngay lập tức.

Mục tiêu cốt lõi của **Fitness Functions** là bảo vệ sức sống của hệ thống (**Architecture Vitality**), thu hẹp tối đa khoảng cách giữa thiết kế lý thuyết (**As-designed**) và triển khai thực tế (**As-built**), giúp kiến trúc luôn bền vững trước áp lực vận hành theo thời gian.

---

[← Back to README](README.md)
