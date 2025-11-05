# Các đối tượng trừu tượng trong Kubernetes

Nếu bạn đã học qua Docker, Compose và Swarm, bạn đã có một nền tảng vững chắc để tiếp cận Kubernetes. Tuy nhiên, Kubernetes giới thiệu một số thuật ngữ và khái niệm mới có thể gây nhầm lẫn ban đầu.

Bài viết này sẽ giải thích các đối tượng (objects) trừu tượng cơ bản mà bạn sẽ sử dụng để định nghĩa và quản lý ứng dụng của mình trong Kubernetes.

## Mục lục

-   [1. Pod: Đơn vị triển khai cơ bản](#1-pod-don-vi-trien-khai-co-ban)
-   [2. Controller: Bộ điều khiển Pod](#2-controller-bo-dieu-khien-pod)
-   [3. Service: Endpoint mạng ổn định](#3-service-endpoint-mang-on-dinh)
-   [4. Namespace: Không gian tên ảo](#4-namespace-khong-gian-ten-ao)
-   [5. Các đối tượng khác](#5-cac-doi-tuong-khac)

---

## 1. Pod: Đơn vị triển khai cơ bản

Trong Kubernetes, chúng ta không trực tiếp triển khai container. Thay vào đó, đơn vị nhỏ nhất và cơ bản nhất có thể được tạo và quản lý là **Pod**.

> **Định nghĩa:**
> Một **Pod** là một nhóm gồm một hoặc nhiều container được triển khai cùng nhau trên cùng một Node. Các container trong một Pod chia sẻ chung không gian mạng (cùng địa chỉ IP), bộ nhớ (volumes), và có thể giao tiếp với nhau qua `localhost`.

Thông thường, một Pod chỉ chứa một container chính. Tuy nhiên, trong các trường hợp nâng cao, bạn có thể có thêm các container phụ (sidecar) để thực hiện các tác vụ bổ trợ như ghi log, giám sát, hoặc hoạt động như một proxy.

---

## 2. Controller: Bộ điều khiển Pod

Mặc dù bạn có thể tạo một Pod trực tiếp, nhưng trong thực tế, bạn hầu như không bao giờ làm vậy. Nếu Pod đó chết, nó sẽ biến mất vĩnh viễn.

Thay vào đó, chúng ta sử dụng các **Controller**. Controller là các đối tượng quản lý vòng đời của Pod, đảm bảo rằng số lượng Pod mong muốn luôn được duy trì. Chúng hoạt động như một "vòng lặp đối chiếu", liên tục so sánh trạng thái hiện tại với trạng thái mong muốn và tự động sửa chữa sai lệch.

Các loại Controller phổ biến bao gồm:

-   **Deployment:**

    -   Đây là controller phổ biến nhất, tương tự như `service` trong Docker Swarm.
    -   Nó quản lý một **ReplicaSet** (một controller cấp thấp hơn), đảm bảo một số lượng bản sao (replicas) của Pod luôn chạy.
    -   Deployment cung cấp các chiến lược cập nhật ứng dụng một cách an toàn, như **Rolling Update** (cập nhật từ từ) hoặc **Recreate** (xóa cũ tạo mới).

-   **StatefulSet:**

    -   Dùng cho các ứng dụng có trạng thái (stateful applications) như cơ sở dữ liệu.
    -   Nó cung cấp các định danh mạng ổn định và duy nhất cho mỗi Pod, cũng như cơ chế triển khai và mở rộng theo thứ tự.

-   **DaemonSet:**

    -   Đảm bảo rằng **mỗi Node** (hoặc một tập hợp các Node) trong cụm đều chạy một bản sao của Pod.
    -   Rất hữu ích cho việc triển khai các agent giám sát, ghi log hoặc các trình điều khiển lưu trữ trên toàn bộ cụm.

-   **Job** và **CronJob:**
    -   **Job:** Tạo một hoặc nhiều Pod và đảm bảo chúng chạy thành công đến khi hoàn thành. Dùng cho các tác vụ chạy một lần (batch tasks).
    -   **CronJob:** Chạy một Job theo một lịch trình định sẵn (ví dụ: mỗi đêm, mỗi giờ), tương tự như cron trên Linux.

---

## 3. Service: Endpoint mạng ổn định

Khái niệm **Service** trong Kubernetes khác với `service` trong Swarm.

> **Định nghĩa:**
> Trong Kubernetes, một **Service** là một đối tượng trừu tượng định nghĩa một tập hợp logic các Pod và một chính sách để truy cập chúng. Nó cung cấp một **endpoint ổn định** (tên DNS và địa chỉ IP ảo) cho một nhóm các Pod.

Pod là các thực thể tạm thời, chúng có thể bị phá hủy và tạo lại với địa chỉ IP mới. Service giải quyết vấn đề này bằng cách cung cấp một "mặt tiền" cố định. Các ứng dụng khác trong cụm có thể giao tiếp với nhóm Pod này thông qua tên DNS của Service mà không cần quan tâm đến địa chỉ IP của từng Pod riêng lẻ.

---

## 4. Namespace: Không gian tên ảo

**Namespace** là một cách để phân chia tài nguyên trong một cụm Kubernetes thành các nhóm ảo.

> **Lưu ý quan trọng:** Namespace trong Kubernetes **không phải** là một tính năng bảo mật. Nó chỉ đơn giản là một bộ lọc (filter) cho chế độ xem của bạn trên dòng lệnh hoặc trong giao diện người dùng.

Nó giúp các đội nhóm khác nhau làm việc trên cùng một cụm mà không ảnh hưởng lẫn nhau. Ví dụ, bạn có thể có namespace `development`, `staging`, và `production`, hoặc các namespace riêng cho `team-a` và `team-b`.

Khi bạn chạy lệnh `kubectl get pods`, nó sẽ chỉ hiển thị các Pod trong namespace mặc định (`default`). Để xem các Pod trong namespace khác, bạn cần chỉ định rõ, ví dụ: `kubectl get pods --namespace kube-system`.

---

## 5. Các đối tượng khác

Ngoài các đối tượng trên, Kubernetes còn có rất nhiều khái niệm khác mà chúng ta sẽ tìm hiểu dần:

-   **ConfigMap:** Dùng để lưu trữ dữ liệu cấu hình dưới dạng key-value và đưa vào container dưới dạng biến môi trường hoặc file.
-   **Secret:** Tương tự ConfigMap nhưng được thiết kế để lưu trữ thông tin nhạy cảm như mật khẩu, token, khóa API. Dữ liệu được lưu dưới dạng base64.
-   **Ingress:** Quản lý truy cập từ bên ngoài vào các Service trong cụm, thường là HTTP/HTTPS. Nó có thể cung cấp cân bằng tải, SSL termination và định tuyến dựa trên tên miền.
