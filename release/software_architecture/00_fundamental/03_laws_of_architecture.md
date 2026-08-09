# Các Quy Luật Trong Kiến Trúc Phần Mềm (Laws of Software Architecture)

## Table of Contents

- [Tổng quan về các Quy luật Kiến trúc](#tổng-quan-về-các-quy-luật-kiến-trúc)
- [Quy luật Thứ nhất: Mọi thứ đều là sự Đánh đổi](#quy-luật-thứ-nhất-mọi-thứ-đều-là-sự-đánh-đổi)
- [Hệ quả 1: Đánh đổi Ẩn giấu](#hệ-quả-1-đánh-đổi-ẩn-giấu)
- [Hệ quả 2: Phân tích Đánh đổi là Tiến trình Liên tục](#hệ-quả-2-phân-tích-đánh-đổi-là-tiến-trình-liên-tục)
- [Không có Lựa chọn Mặc định Tuyệt đối](#không-có-lựa-chọn-mặc-định-tuyệt-đối)
- [Quy luật Thứ hai: Tại sao Quan trọng hơn Như thế nào](#quy-luật-thứ-hai-tại-sao-quan-trọng-hơn-như-thế-nào)
- [Bảo tồn Lý do Ra Quyết định (Preserving the Why)](#bảo-tồn-lý-do-ra-quyết-định-preserving-the-why)
- [Quy trình Phân tích và Đóng gói Quyết định](#quy-trình-phân-tích-và-đóng-gói-quyết-định)
- [Tài liệu Tham khảo](#tài-liệu-tham-khảo)


---

## Tổng quan về các Quy luật Kiến trúc

Kiến trúc phần mềm phụ thuộc rất mạnh vào bối cảnh (context), ràng buộc (constraints) và sự đánh đổi (trade-offs). Do đó, có rất ít nguyên lý có thể xem là quy luật phổ quát. Tuy nhiên, hai quy luật dưới đây được đúc kết bởi Mark Richards và Neal Ford nhằm định hướng cho mọi tư duy kiến trúc:

1. **First Law:** Everything in software architecture is a trade-off. (Mọi thứ trong kiến trúc phần mềm đều là sự đánh đổi).
2. **Second Law:** Why is more important than how. (Tại sao lại quan trọng hơn Như thế nào).

---

## Quy luật Thứ nhất: Mọi thứ đều là sự Đánh đổi

> [!IMPORTANT]
> **First Law of Software Architecture:** Everything in software architecture is a trade-off.

Không có quyết định kiến trúc nào hoàn toàn tốt hoặc hoàn toàn xấu. Mỗi quyết định đều tối ưu hóa một số thuộc tính chất lượng nhưng đồng thời bắt buộc phải chấp nhận chi phí, rủi ro hoặc sự suy giảm ở các khía cạnh khác.

Sơ đồ phân tích thành tố của một quyết định kiến trúc:

```mermaid
graph TD
    accTitle: Các Thành tố Phân tích Đánh đổi Kiến trúc
    accDescr: Sơ đồ phân nhánh thể hiện Lợi ích, Chi phí, Ràng buộc và Rủi ro của một quyết định kiến trúc

    decNode["Architectural Decision"] --> benefitNode["Benefits<br/>(Lợi ích mang lại)"]
    decNode --> costNode["Costs<br/>(Chi phí & Phức tạp)"]
    decNode --> constraintNode["Constraints<br/>(Ràng buộc áp đặt)"]
    decNode --> riskNode["Risks & Consequences<br/>(Rủi ro & Hệ quả)"]
```

Ví dụ cụ thể khi đánh giá việc áp dụng Microservices:

```mermaid
graph TB
    accTitle: Phân tích Đánh đổi của Microservices
    accDescr: Sơ đồ so sánh hai mặt lợi ích và chi phí khi chuyển sang kiến trúc Microservices

    microNode["Microservices Architecture"]

    subgraph gains["Lợi ích đạt được (+)"]
        g1["Independent Deployment"]
        g2["Independent Scaling"]
        g3["Team Autonomy"]
    end

    subgraph costs["Chi phí phải trả (-)"]
        c1["Network Latency & Complexity"]
        c2["Distributed Data Consistency"]
        c3["Operational & Monitoring Overhead"]
    end

    microNode --> gains
    microNode --> costs
```

Do đó, câu hỏi chuẩn xác của kiến trúc sư không phải là *"Công nghệ X có tốt không?"*, mà là: **"Trong bối cảnh hiện tại, lợi ích của X có đủ lớn để bù đắp cho chi phí và rủi ro mà nó tạo ra hay không?"**

---

## Hệ quả 1: Đánh đổi Ẩn giấu

> [!WARNING]
> **Corollary 1:** If you think you've discovered something that isn't a trade-off, more likely you just haven't identified the trade-off yet.

Nếu một quyết định dường như chỉ mang lại lợi ích tuyệt đối mà không có điểm bất lợi, điều đó có nghĩa là các chi phí ẩn giấu chưa được phát hiện.

Xem xét ví dụ về việc triển khai Caching để tăng tốc độ truy vấn:

```mermaid
graph LR
    accTitle: Chi phí Ẩn giấu của Caching
    accDescr: Sơ đồ dòng chảy thể hiện lợi ích giảm latency dẫn đến các độ phức tạp ẩn giấu về cache invalidation và stale data

    cacheBenefit["Thêm Cache Layer<br/>(Giảm Latency, giảm DB Load)"] --> hiddenCosts["Chi phí Ẩn giấu"]

    hiddenCosts --> invalidation["Cache Invalidation Complexity"]
    hiddenCosts --> memoryCost["RAM Overhead & Infrastructure Cost"]
    hiddenCosts --> staleData["Rủi ro Stale Data & Consistency"]
```

---

## Hệ quả 2: Phân tích Đánh đổi là Tiến trình Liên tục

> [!NOTE]
> **Corollary 2:** You can't just do trade-off analysis once and be done with it.

Phân tích đánh đổi không phải là công việc làm một lần rồi kết thúc. Theo thời gian, bối cảnh kinh doanh, quy mô người dùng, hạ tầng và năng lực đội ngũ đều thay đổi, làm thay đổi cán cân đánh đổi.

```mermaid
graph TD
    accTitle: Tiến trình Đánh giá lại Đánh đổi theo Thời gian
    accDescr: Sơ đồ thể hiện sự dịch chuyển từ Modular Monolith sang Microservices theo sự phát triển quy mô qua các năm

    year1["Năm 1: Team 4 người, Tải thấp<br/>Architecture: Modular Monolith<br/>(Trade-off tối ưu)"] --> contextChange["Tăng trưởng Người dùng & Team"]
    contextChange --> year4["Năm 4: Team 50 người, Tải cao<br/>Architecture: Tách Microservices<br/>(Cân bằng Trade-off mới)"]
```

---

## Không có Lựa chọn Mặc định Tuyệt đối

Các tổ chức thường có xu hướng tạo ra các quy tắc áp đặt cứng nhắc như *"Luôn dùng Microservices"*, *"Luôn dùng Event-Driven"* hoặc *"Luôn dùng REST"*. Tuy nhiên, **Default không phải là Universal Law**.

Một pattern phù hợp trong bối cảnh A có thể gây ra thảm họa độ phức tạp trong bối cảnh B:

```mermaid
graph TD
    accTitle: Đánh giá Sự phù hợp theo Context
    accDescr: Sơ đồ phân nhánh cho thấy pattern Choreography chỉ phù hợp khi bối cảnh cho phép

    patternNode["Workflow Choreography"] --> contextA["Context A: Ít service, luồng tuyến tính<br/>→ Phù hợp"]
    patternNode --> contextB["Context B: 30+ services, luồng phức tạp<br/>→ Tăng mạnh độ phức tạp ẩn giấu"]
```

---

## Quy luật Thứ hai: Tại sao Quan trọng hơn Như thế nào

> [!IMPORTANT]
> **Second Law of Software Architecture:** Why is more important than how.

**Tại sao** hệ thống lại được thiết kế như vậy quan trọng hơn nhiều so với việc **nó được triển khai bằng công nghệ gì**.

So sánh hai cách ghi nhận thông tin kiến trúc:

| Cách tiếp cận | Nội dung Ghi nhận | Giá trị Kiến trúc |
| :--- | :--- | :--- |
| **Chỉ ghi nhận "HOW"** | *"Hệ thống dùng Kafka."* | Rất thấp. Khi công nghệ thay đổi, đội ngũ không hiểu lý do thiết kế tồn tại. |
| **Ghi nhận "WHY" & "HOW"** | *"Tách xử lý bất đồng bộ qua Message Queue để giảm latency phản hồi API cho người dùng và đảm bảo khả năng mở rộng độc lập."* | Rất cao. Bảo tồn được ý định kiến trúc (architectural intent) ngay cả khi thay thế Kafka bằng NATS hay RabbitMQ. |

---

## Bảo tồn Lý do Ra Quyết định (Preserving the Why)

Công nghệ sẽ lỗi thời theo thời gian, nhưng các ràng buộc và ý định kiến trúc cốt lõi thường tồn tại lâu dài hơn:

```mermaid
graph TD
    accTitle: Sự Tách biệt giữa Intent và Technology
    accDescr: Sơ đồ thể hiện Intent bất đồng bộ được giữ nguyên khi thay đổi nền tảng công nghệ

    intent["Architectural Intent:<br/>Asynchronous Processing & Decoupling"] --> techV1["Công nghệ 2020: Apache Kafka"]
    intent --> techV2["Công nghệ 2026: Cloud Pub/Sub"]

    noteNode["> [!TIP]<br/>Nếu chỉ lưu vết công nghệ, team tương lai sẽ mất dấu bối cảnh và lý do thiết kế ban đầu."]
```

---

## Quy trình Phân tích và Đóng gói Quyết định

Để áp dụng 2 quy luật kiến trúc vào thực tế, mọi quyết định kiến trúc nên được đóng gói theo cấu trúc Architecture Decision Record (ADR) tiêu chuẩn:

```mermaid
graph LR
    accTitle: Mẫu Quy trình Phân tích Quyết định Kiến trúc
    accDescr: Sơ đồ các bước từ Bối cảnh, Ràng buộc, Phương án đến Đánh đổi và Lý do chọn lựa

    ctxStep["Bối cảnh<br/>(Context)"] --> pbStep["Vấn đề<br/>(Problem)"]
    pbStep --> optStep["Các Lựa chọn<br/>(Options)"]
    optStep --> tradeStep["Phân tích Đánh đổi<br/>(Trade-offs)"]
    tradeStep --> decStep["Quyết định & Lý do<br/>(Decision & Why)"]
    decStep --> consStep["Hệ quả<br/>(Consequences)"]
```

### Nguyên tắc Kết luận

Một quyết định kiến trúc tốt không phải là một quyết định không có nhược điểm. Một quyết định kiến trúc tốt là quyết định mà:

> **Các đánh đổi đã được nhận diện và chấp nhận một cách có chủ đích dựa trên bối cảnh thực tế.**

---

## Tài liệu Tham khảo

- 📘 **[Fundamentals of Software Architecture (2nd Edition)](../../../library/fundamentals_of_software_architecture_2nd.epub)** – Mark Richards & Neal Ford *(Chapter 2: Architectural Laws & Trade-off Analysis)*.
- 📕 **[Clean Architecture: A Craftsman's Guide to Software Structure and Design](../../../library/clean_architecture_a_acraftsman_guide.pdf)** – Robert C. Martin *(Part III: Design Principles - SOLID & Boundary Trade-offs)*.

---
[← Back to README](README.md)

