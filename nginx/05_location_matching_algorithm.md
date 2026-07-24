# Chương 5. Giải thuật Khớp Location & Định tuyến URI

Chương này giải mã giải thuật khớp khối `location` trong NGINX, độ phức tạp thuật toán cấp cấu trúc dữ liệu nội bộ (Red-Black Tree vs Linked List), sự khác biệt giữa `root` và `alias`, cùng với cơ chế chuyển hướng bằng `return` và `rewrite`.

## Mục lục

- [5.1 Các loại Modifier trong Khối Location](#51-các-loại-modifier-trong-khối-location)
- [5.2 Giải thuật Khớp Location 5 bước](#52-giải-thuật-khớp-location-5-bước)
- [5.3 Cấu trúc Dữ liệu Nội bộ: Red-Black Tree vs Linked List](#53-cấu-trúc-dữ-liệu-nội-bộ-red-black-tree-vs-linked-list)
- [5.4 Phân biệt Chỉ thị root và alias](#54-phân-biệt-chỉ-thị-root-và-alias)
- [5.5 Điều hướng Luồng: return vs rewrite](#55-điều-hướng-luồng-return-vs-rewrite)

---

## 5.1 Các loại Modifier trong Khối Location

Khối `location` quyết định cách thức NGINX xử lý một URI yêu cầu. Việc lựa chọn modifier phù hợp quyết định trực tiếp tới tính chính xác và hiệu năng định tuyến.

| Thứ tự ưu tiên | Modifier | Loại Khớp nối | Mô tả & Cơ chế dừng tìm kiếm |
| :---: | :---: | :--- | :--- |
| **1** | `=` | Khớp chính xác (Exact Match) | Trùng khớp từng ký tự URI. Dừng tìm kiếm ngay lập tức khi tìm thấy. |
| **2** | `^~` | Tiền tố ưu tiên (Preferential Prefix) | Nếu tiền tố này dài nhất, dừng tìm kiếm và **bỏ qua toàn bộ Regex**. |
| **3** | `~` | Biểu thức chính quy (Case-sensitive Regex) | Regex có phân biệt chữ hoa/thường. Chọn Regex đầu tiên trùng khớp. |
| **4** | `~*` | Biểu thức chính quy (Case-insensitive Regex) | Regex không phân biệt chữ hoa/thường. Chọn Regex đầu tiên trùng khớp. |
| **5** | *(Trống)* | Tiền tố thông thường (Standard Prefix) | Tìm tiền tố dài nhất, tạm lưu lại và tiếp tục quét danh sách Regex. |

---

## 5.2 Giải thuật Khớp Location 5 bước

Khi một yêu cầu URI đến, NGINX thực hiện tìm kiếm qua một quy trình tuần tự nghiêm ngặt:

```mermaid
flowchart TD
    Start["URI Request Đến"] --> Step1{"1. Kiểm tra Exact Match (=)?"}
    
    Step1 -- Có --> UseExact["Sử dụng khối =<br/>(Dừng tìm kiếm ngay)"]
    Step1 -- Không --> Step2["2. Tìm Prefix Match dài nhất<br/>(Tiền tố thông thường & ^~)"]
    
    Step2 --> Step3{"3. Prefix dài nhất có modifier ^~ ?"}
    
    Step3 -- Có --> UsePreferential["Sử dụng khối ^~<br/>(Bỏ qua toàn bộ Regex, dừng)"]
    Step3 -- Không --> Step4["Tạm lưu Prefix dài nhất.<br/>4. Quét danh sách Regex (~ và ~*) từ trên xuống"]
    
    Step4 --> Step5{"Có Regex nào khớp không?"}
    
    Step5 -- Có --> UseRegex["Sử dụng Regex khớp ĐẦU TIÊN<br/>(Dừng tìm kiếm)"]
    Step5 -- Không --> UseSavedPrefix["Sử dụng Prefix dài nhất đã tạm lưu"]
```

Sơ đồ trên minh họa thuật toán chọn `location` của NGINX. 

> [!IMPORTANT]
> **Quy tắc vàng:** 
> 1. Modifier `^~` KHÔNG ĐẢM BẢO sẽ được chọn nếu URI không khớp với tiền tố đó. Nhưng nếu nó khớp và là tiền tố dài nhất, nó sẽ **vô hiệu hóa** toàn bộ các khối Regex!
> 2. Các khối Regex được quét theo **thứ tự xuất hiện từ trên xuống dưới** trong file cấu hình. Khối Regex nào nằm trên khớp trước sẽ được sử dụng ngay.

---

## 5.3 Cấu trúc Dữ liệu Nội bộ: Red-Black Tree vs Linked List

Hiệu năng định tuyến URI của NGINX cực kỳ cao nhờ sự tối ưu hóa cấu trúc dữ liệu ở cấp nhân hệ thống tại thời điểm khởi động:

```mermaid
graph TD
    subgraph "Prefix Tree (Cây Đỏ-Đen / Red-Black Tree)"
        Root["/"] --> Static["/static/"]
        Root --> API["/api/"]
        API --> APIv1["/api/v1/"]
        API --> APIv2["/api/v2/"]
    end

    subgraph "Regex List (Danh sách Liên kết Phẳng / Linked List)"
        R1["1. ~ \.(jpg|png|gif)$"] --> R2["2. ~* \.(pdf|docx)$"]
        R2 --> R3["3. ~ /user/\d+"]
    end
```

- **Các khối Prefix (`=`, `^~`, Trống)** được NGINX biên dịch và sắp xếp vào một **Cây Đỏ-Đen cân bằng (Red-Black Tree)**. Độ phức tạp thời gian tìm kiếm tiền tố dài nhất chỉ là $O(\log N)$ và **hoàn toàn không phụ thuộc** vào vị trí bạn viết dòng lệnh trong tệp cấu hình.
- **Các khối Regex (`~`, `~*`)** được lưu trữ trong một **Danh sách liên kết phẳng (Linked List)**. NGINX buộc phải duyệt tuần tự qua từng phần tử với độ phức tạp $O(N)$.

> [!TIP]
> **Kinh nghiệm tối ưu:** Hạn chế tối đa việc lạm dụng khối Regex. Nên thay thế các Regex prefix bằng modifier `^~` để đẩy phép tìm kiếm sang Cây Đỏ-Đen $O(\log N)$, giúp tối ưu tốc độ xử lý URI.

---

## 5.4 Phân biệt Chỉ thị root và alias

Hai chỉ thị `root` và `alias` được sử dụng để ánh xạ URI vào đường dẫn đĩa vật lý, nhưng có cơ chế ghép nối hoàn toàn khác nhau:

### Chỉ thị `root`
NGINX cộng dồn giá trị của `root` với **toàn bộ chuỗi URI** yêu cầu:
$$\text{Đường dẫn vật lý} = \text{root} + \text{URI}$$

```nginx
location /images/ {
    root /var/www/media;
}
# Request:  GET /images/logo.png
# Kết quả:  /var/www/media/images/logo.png
```

### Chỉ thị `alias`
NGINX **thay thế** phần URI trùng khớp trong khối `location` bằng đường dẫn khai báo trong `alias`:
$$\text{Đường dẫn vật lý} = \text{alias} + (\text{URI} - \text{Location\_Prefix})$$

```nginx
location /images/ {
    alias /var/www/media/photos/;
}
# Request:  GET /images/logo.png
# Kết quả:  /var/www/media/photos/logo.png
```

> [!CAUTION]
> **Lỗ hổng Path Traversal nguy hiểm với `alias`:**
> Nếu khối location không kết thúc bằng dấu gạch chéo `/` mà alias lại khai báo dấu `/` (hoặc ngược lại):
> ```nginx
> location /files { # Không có dấu / ở cuối
>     alias /var/www/data/;
> }
> ```
> Kẻ tấn công có thể gửi request `GET /files../etc/passwd` để đọc trộm các file hệ thống nhạy cảm do phép cộng chuỗi sai lệch. Hãy luôn đảm bảo tính đồng nhất về dấu `/` giữa `location` và `alias`!

---

## 5.5 Điều hướng Luồng: return vs rewrite

Khi cần điều hướng lưu lượng hoặc thay đổi URI nội bộ, NGINX cung cấp hai chỉ thị chính:

### 1. Chỉ thị `return`
Thực hiện phản hồi ở tầng giao thức ngay lập tức mà không cần khởi chạy bộ máy Regex. Tối ưu CPU tối đa.

Ví dụ chuyển hướng HTTPS bằng `return`:
```nginx
# Phản hồi mã HTTP 301 chuyển hướng vĩnh viễn
return 301 https://$host$request_uri;

# Phản hồi trực tiếp dữ liệu văn bản
return 200 "OK - Service Healthy";
```

### 2. Chỉ thị `rewrite`
Sử dụng biểu thức chính quy để thay đổi URI nội bộ trước khi tiếp tục định tuyến.

Cú pháp: `rewrite regex replacement [flag];`

| Cờ (Flag) | Cơ chế hoạt động |
| :--- | :--- |
| **`last`** | Dừng các lệnh `rewrite` hiện tại. NGINX khởi chạy lại quy trình tìm kiếm khối `location` mới với URI vừa được thay đổi. |
| **`break`** | Dừng các lệnh `rewrite` hiện tại. NGINX giữ nguyên khối `location` hiện tại và tiếp tục xử lý các lệnh bên dưới. |
| **`redirect`** | Trả về mã phản hồi tạm thời **HTTP 302** cho trình duyệt client. |
| **`permanent`** | Trả về mã phản hồi vĩnh viễn **HTTP 301** cho trình duyệt client. |

### Chỉ thị `internal`
Đánh dấu một khối `location` chỉ được phép truy cập từ các yêu cầu nội bộ của NGINX (như lệnh `rewrite`, `error_page`, hoặc `subrequest`), chặn đứng mọi nỗ lực truy cập trực tiếp từ bên ngoài.

```nginx
error_page 404 /custom_404.html;

location = /custom_404.html {
    root /var/www/errors;
    internal; # Chặn client truy cập trực tiếp example.com/custom_404.html
}
```

---
[← Quay lại mục lục](README.md)
