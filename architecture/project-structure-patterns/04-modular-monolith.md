# Modular Monolith: Sự Cân Bằng Giữa Hỗn Loạn Và Phân Tán

## Mục lục

-   [1. Bối cảnh ra đời](#1-bối-cảnh-ra-đời)
-   [2. Triết lý thiết kế](#2-triết-lý-thiết-kế)
-   [3. Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
-   [4. Lợi ích của Modular Monolith](#4-lợi-ích-của-modular-monolith)

---

## 1. Bối cảnh ra đời

Trong thập kỷ qua, ngành công nghiệp phần mềm đã chứng kiến sự bùng nổ của **Microservices** như một giải pháp cho khả năng mở rộng. Tuy nhiên, thực tế triển khai đã chứng minh rằng Microservices đem lại sự phức tạp khủng khiếp về vận hành và mạng lưới.

Từ đó, **Modular Monolith** nổi lên như một xu hướng chủ đạo hiện nay, đại diện cho sự trưởng thành trong tư duy kiến trúc: **Module hóa logic thay vì phân tán vật lý**.

---

## 2. Triết lý thiết kế

Modular Monolith chia hệ thống theo các **khối chức năng nghiệp vụ (Vertical Slices)** thay vì các lớp kỹ thuật. Mỗi module (ví dụ: Order, Payment, Inventory) hoạt động như một hệ thống con độc lập, có thể chứa đầy đủ các thành phần từ API đến Database của riêng nó.

> **Công thức:** > **Modular Monolith = Microservices without the network calls**
> (Microservices không cần gọi qua mạng)

---

## 3. Cấu trúc thư mục

Cấu trúc thư mục của Modular Monolith thể hiện sự phân quyền rõ rệt:

```
src/
├── modules/
│   ├── order/              # Module Order độc lập
│   │   ├── api/            # Public Contract
│   │   ├── core/           # Domain logic (Private)
│   │   └── infrastructure/ # Database adapter (Private)
│   ├── payment/            # Module Payment độc lập
│   └── inventory/          # Module Inventory độc lập
├── shared/                 # Kernel dùng chung (hạn chế tối đa)
└── app.module.ts           # Nơi lắp ráp các module
```

---

## 4. Lợi ích của Modular Monolith

1. **Tính đóng gói (Encapsulation) cao**: Mỗi module có một ranh giới rõ ràng (Boundary) và chỉ giao tiếp với nhau thông qua API công khai.

2. **Phát triển song song**: Cho phép các team phát triển làm việc song song trên các module khác nhau mà không dẫm chân lên nhau.

3. **Đơn giản trong triển khai**: Giữ lại sự đơn giản trong việc triển khai (Deployment) của một khối Monolith duy nhất.

4. **Dễ dàng tách service**: Nếu một module trở nên quá lớn hoặc cần scale độc lập, nó có thể dễ dàng được tách ra thành một Microservice riêng biệt vì ranh giới đã được định hình sẵn.
