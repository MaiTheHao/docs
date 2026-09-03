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

- **Microservices**: Mang lại khả năng mở rộng độc lập và tốc độ phát hành theo từng domain, nhưng đánh đổi bằng việc gia tăng `latency` mạng, ví dụ `p99 latency` từ 2ms khi gọi hàm in-memory tăng lên 35ms qua mạng, cùng chi phí tài nguyên và rủi ro bất đồng bộ dữ liệu phân tán.
- **Tái sử dụng mã nguồn**: Tiết kiệm thời gian lập trình ban đầu nhưng dễ tạo ra mức độ **Coupling** nguy hiểm. Chia sẻ thư viện dùng chung rất hiệu quả cho các tiện ích hạ tầng ổn định (logging, metrics), nhưng trở thành cái bẫy nếu áp dụng cho domain logic có tần suất thay đổi cao giữa các phòng ban.

> [!IMPORTANT]
> Mục tiêu thực tế của kiến trúc sư không phải là tìm kiếm thiết kế hoàn hảo, mà là xác định phương án **Least Worst Architecture**—giải pháp dung hòa tối ưu nhất giữa các ràng buộc kỹ thuật, ngân sách và thời hạn bàn giao.

### 2. Second Law: **"Why is more important than how."**

Chi tiết kỹ thuật triển khai (`How`) biến đổi liên tục theo sự đào thải của công nghệ. Ngược lại, lý do kiến trúc và bối cảnh kinh doanh (`Why`) hình thành nên quyết định mới là tri thức cốt lõi cần lưu trữ dài hạn:

- **Thiếu bối cảnh Why**: Một ghi chép ghi nhận *"Hệ thống sử dụng `Apache Kafka`"* chỉ mô tả công cụ. Khi quy mô thay đổi hoặc chi phí duy trì cụm cluster tăng cao, đội ngũ tiếp quản không có căn cứ để đánh giá việc thay thế.
- **Bảo toàn bối cảnh Why**: Ghi chép nêu rõ *"Sử dụng message broker phân tán bất đồng bộ để đệm tải cho cổng thanh toán, duy trì `p99 latency` dưới 150ms và thông lượng 12.000 req/s khi chiến dịch khuyến mại đạt đỉnh"* giúp đội ngũ tự tin cân nhắc các giải pháp thay thế như `RabbitMQ`, `NATS` hoặc `Cloud Pub/Sub` mà không sợ phá vỡ cam kết SLO.

Công cụ chuẩn mực để lưu trữ bối cảnh này là tài liệu **ADR**, bao gồm: Bối cảnh, Quyết định, Các phương án thay thế bị loại trừ và Hệ quả đánh đổi được chấp thuận.

### 3. Third Law: **"Most architecture decisions exist on a spectrum between extremes."**

Trong đời sống thực tế cũng như kỹ nghệ phần mềm, mọi quyết định hiếm khi rạch ròi giữa hai thái cực trắng đen:

- **Không có kết quả nào là đúng hoặc sai**: Tranh cãi xem **Monolith** là sai hay **Microservices** mới là đúng hoàn toàn không mang lại giá trị kỹ thuật. Trong kiến trúc, không có quyết định nào là đúng hoặc sai tuyệt đối; một giải pháp chỉ có thể được xem là phù hợp hay không phù hợp với từng bài toán cụ thể.
- **Tư duy dải quang phổ**: Mọi giải pháp kiến trúc đều phân bổ trên một dải quang phổ giữa hai thái cực đối nghịch. Lựa chọn hợp lý không phải là cố gắng tìm kiếm một phương án "đúng" duy nhất, mà là xác định điểm cân bằng **Sweet Spot** tương thích nhất với quy mô đội ngũ, khối lượng tải và nguồn lực tại thời điểm hiện tại.

---

## Quang Phổ Quyết Định Kiến Trúc

Thay vì tranh cãi mô hình nào "đúng" hay "sai", kiến trúc sư giỏi sẽ nhìn mọi thứ như một dải quang phổ để chọn giải pháp vừa vặn nhất với túi tiền, quy mô đội ngũ và bài toán thực tế:

| Vấn Đề Quyết Định | Thái Cực A (Tập Trung) | Điểm Cân Bằng (Sweet Spot) | Thái Cực B (Phân Tán) |
| :--- | :--- | :--- | :--- |
| **Chia nhỏ hệ thống** | **Monolith**:<br/>Tất cả chung một khối. Làm nhanh, ít tốn kém, nhưng đông người sẽ dẫm chân lên nhau. | **Modular Monolith**:<br/>Chung tiến trình nhưng chia module rõ ràng. Gọn gàng, độ trễ thấp và dễ bảo trì. | **Microservices**:<br/>Tách riêng từng service độc lập qua mạng. Mở rộng tự do, nhưng tốn kém hạ tầng và phức tạp vận hành. |
| **Phối hợp công việc** | **Orchestration**:<br/>Một đầu mối trung tâm điều phối tất cả. Dễ theo dõi luồng, nhưng dễ thành điểm nghẽn đơn lẻ khi quá tải. | **Hybrid Mediation**:<br/>Dùng event bất đồng bộ giữa các domain lớn và giữ điều phối tập trung nội bộ trong từng domain. | **Choreography**:<br/>Từng service tự lắng nghe event để xử lý. Tự do tối đa, nhưng rất khó truy vết lỗi khi gián đoạn. |
| **Cách thức quản lý** | **Kiểm soát vi mô**:<br/>Bắt tuân thủ cứng nhắc từng chi tiết cú pháp code. Kiểm soát chặt nhưng triệt tiêu tính chủ động của kỹ sư. | **Guardrails**:<br/>Đưa ra luật chơi và ranh giới tự động; bên trong ranh giới để đội ngũ tự do chọn giải pháp. | **Tháp ngà lý thuyết**:<br/>Chỉ đưa lời khuyên trừu tượng, không kiểm chứng thực tế khiến kiến trúc nhanh chóng suy thoái. |

> [!TIP]
> Không có kiến trúc xịn nhất, chỉ có kiến trúc vừa vặn nhất. Doanh nghiệp mới bắt đầu nên ở "Thái cực A" để tiết kiệm và đi nhanh; khi người dùng đông lên và nguồn lực dồi dào hơn mới dịch chuyển dần sang "Thái cực B".

---

## Tám Kỳ Vọng Năng Lực Cốt Lõi

Vai trò của một kiến trúc sư phần mềm không chỉ giới hạn trong việc phát triển các chức năng kỹ thuật cụ thể mà còn mở rộng đến việc định hình hướng đi chiến lược công nghệ cho toàn bộ tổ chức. Để thực hiện thành công vai trò đa diện và phức tạp này, bất kể chức danh hay mô tả công việc cụ thể ra sao, kiến trúc sư phần mềm bắt buộc phải thấu hiểu và đáp ứng **8 Kỳ vọng Năng lực Cốt lõi**:

### 1. Make Architecture Decisions

Nhiệm vụ cốt lõi của kiến trúc sư là định hình các quyết định kiến trúc và nguyên lý thiết kế nhằm **Guide** thay vì áp đặt trực tiếp các lựa chọn công nghệ của đội ngũ phát triển. Từ khóa then chốt ở đây là dẫn dắt: ví dụ, thay vì chỉ định cứng nhắc việc sử dụng `React`, kiến trúc sư nên định hướng nhóm sử dụng một reactive-based framework, trừ những tình huống đặc thù cần bảo vệ nghiêm ngặt các thuộc tính phi chức năng sống còn như **Scalability** hay **Availability**.

### 2. Continually Analyze Architecture

Đo lường chỉ số **Architecture Vitality** để xác định xem một kiến trúc được định nghĩa từ nhiều năm trước có còn hiệu quả ở thời điểm hiện tại hay không trước những biến động về nghiệp vụ lẫn công nghệ. Nếu thiếu đi hoạt động phân tích liên tục, hệ thống sẽ rơi vào tình trạng **Structural Decay** do các thay đổi vô tình làm phá vỡ các đặc tính cốt lõi. Quá trình đánh giá này đòi hỏi cái nhìn toàn diện từ khâu viết mã nguồn, môi trường kiểm thử cho đến chu trình phát hành sản phẩm.

### 3. Keep Current with Trends

Các quyết định kiến trúc luôn có tầm ảnh hưởng dài hạn và rất khó thay đổi sau khi đã triển khai, do đó việc nắm bắt kịp thời các xu hướng công nghệ là điều kiện tiên quyết giúp kiến trúc sư đưa ra những lựa chọn bền vững. Điển hình như việc học hỏi và thích nghi nhanh chóng với sự xuất hiện của Cloud Computing hay Generative AI để giữ cho hệ sinh thái công nghệ của tổ chức luôn đi đúng hướng.

### 4. Ensure Compliance

Liên tục kiểm chứng xem đội ngũ phát triển có tuân thủ các ranh giới kiến trúc đã được thiết lập hay không. Ví dụ: quy định tầng Presentation không được truy cập trực tiếp vào Database mà phải đi qua tầng Business; nếu lập trình viên cố tình vi phạm để tối ưu hiệu năng cục bộ, điều này sẽ làm xói mòn cấu trúc và phá hoại lợi ích lâu dài của hệ thống. Để quản trị hiệu quả, kiến trúc sư áp dụng các công cụ tự động hóa như **Fitness Functions**.

### 5. Understand Diverse Technologies

Trong các hệ thống heterogeneous hiện đại, kiến trúc sư không cần phải là chuyên gia lập trình sâu sắc nhất của mọi ngôn ngữ, nhưng bắt buộc phải có **Technical Breadth** để biết cách tích hợp đa hệ thống. Việc am hiểu rõ ưu và nhược điểm của 10 sản phẩm caching khác nhau mang lại giá trị kiến trúc cao hơn nhiều so với việc chỉ trở thành chuyên gia duy nhất của một sản phẩm.

### 6. Know the Business Domain

Kiến trúc kỹ thuật không thể hiệu quả nếu tách rời bài toán kinh doanh, mục tiêu và yêu cầu cốt lõi của khách hàng. Nắm vững ngôn ngữ nghiệp vụ giúp kiến trúc sư dễ dàng trao đổi trực tiếp với C-level và các bên liên quan, từ đó tạo dựng lòng tin và sự tự tin rằng giải pháp kiến trúc được đưa ra là hoàn toàn chuẩn xác.

### 7. Possess Interpersonal Skills

Thực tế kỹ nghệ phần mềm "luôn luôn là vấn đề về con người". Năng lực lãnh đạo và định hướng đội ngũ chiếm tới một nửa sự thành công của kiến trúc sư, đòi hỏi khả năng dẫn dắt lập trình viên thực thi kiến trúc, làm công tác coaching, mentoring và truyền đạt các quyết định một cách thuyết phục.

### 8. Navigate Organizational Politics

Kỹ năng đàm phán và giải quyết xung đột là vũ khí tối quan trọng, bởi hầu như mọi quyết định kiến trúc lớn nhỏ đều phải đối mặt với sự hoài nghi hoặc phản đối từ lập trình viên, các kiến trúc sư khác hay các bên liên quan về ngân sách và thời gian. Kiến trúc sư xuất sắc cần thấu hiểu môi trường chính trị của doanh nghiệp, biết cách thương lượng khéo léo để đạt được sự đồng thuận cao nhất mà không làm tổn hại đến chất lượng cấu trúc hệ thống.

> [!NOTE]
> Trở thành một kiến trúc sư thực thụ không đơn thuần là vẽ ra những mô hình cấu trúc hoàn mỹ trên giấy, mà là một nghệ thuật cân bằng giữa **Technical Breadth**, bài toán kinh doanh và năng lực điều phối con người trong một môi trường đầy rẫy những **Trade-off** phức tạp.

---

## Kiểm Soát Xói Mòn Bằng Fitness Functions

Trong quá trình phát triển lâu dài, áp lực bàn giao tính năng cùng sự biến động nhân sự rất dễ dẫn đến hiện tượng **Architectural Drift** âm thầm. **Fitness Functions** ra đời như một công cụ đo lường tự động, giúp đội ngũ xác định khách quan liệu mã nguồn thực tế có còn tuân thủ các quy tắc và ranh giới kiến trúc ban đầu hay không.

Thay vì dựa vào hoạt động rà soát thủ công vốn dễ bỏ sót, các nguyên tắc kiến trúc được chuyển hóa thành các bài kiểm thử tự động chạy liên tục trong chu trình tích hợp `CI/CD`. Khi có bất kỳ thay đổi nào làm suy giảm thuộc tính chất lượng hoặc xâm phạm ranh giới hệ thống, quy trình sẽ tự động phát hiện và cảnh báo ngay lập tức.

Mục tiêu cốt lõi của **Fitness Functions** là bảo vệ **Architecture Vitality**, thu hẹp tối đa khoảng cách giữa **As-designed** và **As-built**, giúp kiến trúc luôn bền vững trước áp lực vận hành theo thời gian.

---

[← Back to README](README.md)
