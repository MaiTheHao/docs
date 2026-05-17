# Giải Quyết N+1 Với MongoDB

---

## Mục lục

-   [Biểu hiện với tham chiếu](#biểu-hiện-với-tham-chiếu)
-   [Giải pháp: Nhúng dữ liệu](#giải-pháp-nhúng-dữ-liệu)
-   [Giải pháp: $lookup](#giải-pháp-lookup)
-   [Giải pháp: Batch với $in](#giải-pháp-batch-với-in)

---

## Biểu hiện với tham chiếu

Trong MongoDB, vấn đề phát sinh chủ yếu khi sử dụng mô hình _tham chiếu_ (referencing). Thay vì nhúng các tài liệu liên quan, một tài liệu lưu trữ một mảng các ObjectId tham chiếu đến các tài liệu trong một collection khác.

📌 **Ví dụ:**

```json
// collection 'orders'
{
  "_id": ObjectId("60c72b2f9b1d8e5a4d8b4567"),
  "customer": "John Doe",
  "product_ids": [
    ObjectId("60c72b2f9b1d8e5a4d8b4568"),
    ObjectId("60c72b2f9b1d8e5a4d8b4569")
  ]
}
```

> Luồng N+1:
>
> -   Truy vấn 1: Tìm nạp tài liệu đơn hàng: `db.orders.findOne({_id:...})`.
> -   Vòng lặp trong mã ứng dụng: Đối với mỗi product_id trong mảng product_ids...
> -   N truy vấn: Tìm nạp tài liệu sản phẩm tương ứng: `db.products.findOne({_id: [product_id]})`.

---

## Giải pháp: Nhúng dữ liệu

**Nhúng** (embedding) dữ liệu liên quan trực tiếp vào tài liệu cha giúp truy xuất tất cả thông tin cần thiết trong một hoạt động đọc duy nhất.

💡 **Khi nào nên nhúng:** Quan hệ "một-vài", dữ liệu con gắn liền với cha, không phát triển vô hạn.

```json
// collection 'orders' với sản phẩm được nhúng
{
  "_id": ObjectId("60c72b2f9b1d8e5a4d8b4567"),
  "customer": "John Doe",
  "products": [
    { "product_id": ObjectId("..."), "name": "Laptop", "price": 1200 },
    { "product_id": ObjectId("..."), "name": "Mouse", "price": 25 }
  ]
}
```

> Một lệnh `db.orders.findOne({_id:...})` duy nhất sẽ lấy tất cả mọi thứ.

📌 **Ghi nhớ:** Nhúng bị giới hạn bởi kích thước tài liệu tối đa 16MB và có thể dẫn đến trùng lặp dữ liệu.

---

## Giải pháp: $lookup

Aggregation Framework của MongoDB cung cấp toán tử `$lookup`, thực hiện một "left outer join" phía máy chủ.

```javascript
db.orders.aggregate([
	{ $match: { _id: ObjectId('60c72b2f9b1d8e5a4d8b4567') } },
	{
		$lookup: {
			from: 'products',
			localField: 'product_ids',
			foreignField: '_id',
			as: 'product_details',
		},
	},
]);
```

> Trả về tài liệu đơn hàng với trường mảng mới `product_details` chứa các tài liệu sản phẩm.

📌 **Ghi nhớ:** Hiệu năng của `$lookup` phụ thuộc vào việc lập chỉ mục cho trường ngoại.

---

## Giải pháp: Batch với $in

Batch loading bằng toán tử `$in` là cách tiếp cận hai truy vấn đơn giản và hiệu quả.

```javascript
// Truy vấn 1
const order = await db.collection('orders').findOne({_id: ...});
// Truy vấn 2
const products = await db.collection('products').find({_id: { $in: order.product_ids }}).toArray();
```

> Phương pháp này thường đơn giản hơn pipeline tổng hợp và có thể hiệu quả hơn `$lookup` trong một số trường hợp.

---

> **Tóm tắt:** Các giải pháp trong MongoDB ($lookup và $in) phản ánh gần như hoàn hảo các giải pháp quan hệ (JOIN và mệnh đề IN), cho thấy đây là các mô hình truy cập dữ liệu phổ quát.
