# Chương 6. Reverse Proxy & Cân bằng tải Upstream

Chương này trình bày nguyên lý hoạt động của NGINX dưới vai trò Reverse Proxy, quy tắc chuyển tiếp URI với `proxy_pass`, cơ chế bảo toàn thông tin client, xử lý giao thức WebSocket, các thuật toán cân bằng tải Upstream và cơ chế kiểm tra sức khỏe máy chủ (Health Check).

## Mục lục

- [6.1 Cơ chế Reverse Proxy & Chỉ thị proxy_pass](#61-cơ-chế-reverse-proxy--chỉ-thị-proxy_pass)
- [6.2 Bảo toàn Thông tin Client](#62-bảo-toàn-thông-tin-client)
- [6.3 WebSocket Proxying & Protocol Upgrading](#63-websocket-proxying--protocol-upgrading)
- [6.4 Khối Cấu hình Upstream & Thuật toán Cân bằng tải](#64-khối-cấu-hình-upstream--thuật-toán-cân-bằng-tải)
- [6.5 Cơ chế Passive Health Checks](#65-cơ-chế-passive-health-checks)

---

## 6.1 Cơ chế Reverse Proxy & Chỉ thị proxy_pass

Chỉ thị `proxy_pass` được sử dụng trong ngữ cảnh `location` để chuyển tiếp yêu cầu HTTP từ NGINX tới các máy chủ backend (Node.js, Java, Go, Python).

### Cạm bẫy Dấu gạch chéo `/` trong `proxy_pass`

Cách thức NGINX biến đổi URI khi gửi tới backend phụ thuộc vào việc địa chỉ trong `proxy_pass` có chứa URI path (trailing slash) hay không:

#### Trường hợp 1: `proxy_pass` CÓ URI Path (Có dấu `/` ở cuối)
NGINX sẽ **thay thế** phần URI trùng khớp với khối `location` bằng URI path khai báo trong `proxy_pass`.

```nginx
location /api/ {
    proxy_pass http://backend_server/; # Có dấu / ở cuối URL
}
# Request từ Client:  GET /api/v1/users
# Gửi tới Backend:    GET /v1/users (Chuỗi "/api/" bị loại bỏ)
```

#### Trường hợp 2: `proxy_pass` KHÔNG CÓ URI Path (Không có dấu `/` ở cuối)
NGINX sẽ **chuyển tiếp nguyên vẹn** chuỗi URI ban đầu của client tới backend.

```nginx
location /api/ {
    proxy_pass http://backend_server; # Không có dấu / ở cuối URL
}
# Request từ Client:  GET /api/v1/users
# Gửi tới Backend:    GET /api/v1/users (Chuỗi URI được giữ nguyên)
```

---

## 6.2 Bảo toàn Thông tin Client

Khi đứng sau một Reverse Proxy, máy chủ backend mặc định chỉ nhìn thấy địa chỉ IP của NGINX chứ không nhìn thấy IP thực sự của người dùng. Để khắc phục, NGINX cần thiết lập các Header HTTP chuyên dụng trước khi chuyển tiếp yêu cầu:

```nginx
location / {
    proxy_pass http://app_upstream;

    # Bảo toàn tên miền Host gốc của client gửi lên
    proxy_set_header Host $host;

    # Gửi địa chỉ IP thực tế của client
    proxy_set_header X-Real-IP $remote_addr;

    # Chuỗi danh sách các địa chỉ IP đi qua các proxy trung gian
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    # Bảo toàn giao thức gốc (http hoặc https)
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

| Header HTTP | Ý nghĩa & Mục đích sử dụng |
| :--- | :--- |
| **`Host`** | Giúp backend biết tên miền chính xác mà client đang truy cập (cần cho Virtual Hosting backend). |
| **`X-Real-IP`** | Giúp backend biết IP người dùng thực tế để ghi log, xử lý địa lý (GeoIP) hoặc chặn IP độc hại. |
| **`X-Forwarded-For`** | Lưu danh sách chuỗi IP `client, proxy1, proxy2` phục vụ cho mục đích kiểm toán (audit). |
| **`X-Forwarded-Proto`** | Giúp backend biết client đang nối qua `https` hay `http` để tạo các liên kết redirect phù hợp. |

---

## 6.3 WebSocket Proxying & Protocol Upgrading

Giao thức WebSocket bắt đầu bằng một yêu cầu HTTP thông thường kèm Header `Upgrade`. Do WebSocket là kết nối hai chiều duy trì lâu dài (Long-lived bidirectional connection), NGINX cần cấu hình đặc biệt để nâng cấp kết nối:

```nginx
# Cấu hình map Header Upgrade trong khối http
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;

    location /ws/ {
        proxy_pass http://websocket_backend;

        # Yêu cầu bắt buộc HTTP/1.1 cho WebSocket
        proxy_http_version 1.1;

        # Thiết lập các Header nâng cấp giao thức
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        # Tăng thời gian chờ read/send cho kết nối lâu dài (mặc định 60s)
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

---

## 6.4 Khối Cấu hình Upstream & Thuật toán Cân bằng tải

Khối `upstream` được khai báo trong ngữ cảnh `http` để định nghĩa một nhóm các máy chủ backend và chiến lược phân phối tải:

```mermaid
graph TD
    ClientReq["Client Requests"] --> NGINXProxy["NGINX Proxy"]
    
    subgraph Upstream Pool "backend_cluster"
        NGINXProxy -->|Round Robin / Weight| S1["Backend 1: 192.168.1.10:8080 (Weight 3)"]
        NGINXProxy -->|Round Robin / Weight| S2["Backend 2: 192.168.1.11:8080 (Weight 1)"]
        NGINXProxy -->|Backup Server| S3["Backend 3: 192.168.1.12:8080 (Backup)"]
    end
```

### Các thuật toán Cân bằng tải phổ biến:

```nginx
upstream backend_cluster {
    # 1. Round Robin (Mặc định): Phân phối luân phiên đều đặn
    # 2. Weighted Round Robin: Ưu tiên máy chủ có weight cao hơn
    server 192.168.1.10:8080 weight=3;
    server 192.168.1.11:8080 weight=1;
    server 192.168.1.12:8080 backup; # Chỉ nhận tải khi các server khác sập
}

upstream least_conn_cluster {
    # 3. Least Connections: Gửi request tới server đang xử lý ít kết nối nhất
    least_conn;
    server 10.0.0.1:8080;
    server 10.0.0.2:8080;
}

upstream ip_hash_cluster {
    # 4. IP Hash: Cố định một Client IP về duy nhất một Backend (Session Affinity)
    ip_hash;
    server 10.0.0.1:8080;
    server 10.0.0.2:8080;
}

upstream hash_cluster {
    # 5. Generic Hash: Hash dựa trên một khóa tùy chỉnh (ví dụ $request_uri)
    hash $request_uri consistent;
    server 10.0.0.1:8080;
    server 10.0.0.2:8080;
}
```

> [!TIP]
> **Tối ưu HTTP Keep-Alive tới Upstream:**
> Mặc định NGINX mở và đóng kết nối TCP tới backend trên từng request. Khai báo directive `keepalive 32;` trong khối `upstream` giúp duy trì một pool kết nối mở sẵn tới backend, giảm thời gian trễ bắt tay TCP lên đến 50%.

---

## 6.5 Cơ chế Passive Health Checks

Phiên bản NGINX Open Source sử dụng cơ chế **Kiểm tra sức khỏe thụ động (Passive Health Check)**. NGINX giám sát sự thất bại của các request thực tế khi kết nối tới backend để đánh giá trạng thái máy chủ.

```nginx
upstream backend_health {
    # Nếu 1 server bị lỗi 3 lần trong vòng 30 giây, 
    # NGINX sẽ đánh dấu server đó bị sập (DOWN) trong 30 giây tiếp theo.
    server 10.0.0.10:8080 max_fails=3 fail_timeout=30s;
    server 10.0.0.11:8080 max_fails=3 fail_timeout=30s;
    server 10.0.0.12:8080 down; # Đánh dấu máy chủ bảo trì thủ công
}
```

| Tham số / Chỉ thị | Ý nghĩa & Mô tả |
| :--- | :--- |
| **`max_fails`** | Số lần giao tiếp thất bại tối đa được phép xảy ra trong khoảng thời gian `fail_timeout`. |
| **`fail_timeout`** | Khoảng thời gian theo dõi lỗi và cũng là thời gian tạm ngắt kết nối tới server bị coi là sập. |
| **`backup`** | Máy chủ dự phòng, chỉ nhận lưu lượng khi toàn bộ các máy chủ chính đều không khả dụng. |
| **`down`** | Đánh dấu thủ công máy chủ tạm dừng hoạt động (bảo trì) mà không cần xóa dòng khỏi cấu hình. |

---
[← Quay lại mục lục](README.md)
