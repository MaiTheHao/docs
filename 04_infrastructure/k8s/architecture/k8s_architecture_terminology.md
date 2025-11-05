# Kiến trúc và Thuật ngữ cốt lõi của Kubernetes

Để làm việc hiệu quả với Kubernetes, trước tiên chúng ta cần nắm vững các thuật ngữ và thành phần kiến trúc cơ bản của nó. Bài viết này sẽ phân tích chi tiết cấu trúc của một cụm Kubernetes, từ các công cụ dòng lệnh đến các thành phần chạy trên máy chủ.

## Mục lục

-   [1. Các thuật ngữ cơ bản](#1-cac-thuat-ngu-co-ban)
-   [2. Kiến trúc tổng quan: Master và Worker Nodes](#2-kien-truc-tong-quan-master-va-worker-nodes)
-   [3. Bên trong Control Plane (Master Node)](#3-ben-trong-control-plane-master-node)
-   [4. Bên trong Worker Node](#4-ben-trong-worker-node)
-   [5. Sơ đồ kiến trúc](#5-so-do-kien-truc)

---

## 1. Các thuật ngữ cơ bản

-   **Kubernetes (K8s):** Là tên gọi cho toàn bộ hệ thống, bao gồm tất cả các thành phần phối hợp với nhau để chạy ứng dụng của bạn. `K8s` là cách viết tắt phổ biến, trong đó số `8` đại diện cho 8 ký tự nằm giữa 'K' và 's'.
-   **kubectl:** Là công cụ dòng lệnh (Command Line Tool) chính thức để bạn tương tác với **API** của Kubernetes. Mọi thao tác như triển khai ứng dụng, kiểm tra trạng thái, xem log... đều được thực hiện thông qua `kubectl`.
-   **Node:** Là một máy chủ (vật lý hoặc ảo) trong cụm Kubernetes. Tương tự như trong Docker Swarm, các node là nơi các container của bạn sẽ được chạy.
-   **Kubelet:** Là một agent nhỏ chạy trên **mỗi node**. Nhiệm vụ của nó là giao tiếp với **Control Plane** và đảm bảo các container được mô tả trong PodSpecs đang chạy và khỏe mạnh trên node đó. Nó chính là cầu nối giữa node và "bộ não" của cụm.

---

## 2. Kiến trúc tổng quan: Master và Worker Nodes

Một cụm Kubernetes được chia thành hai loại vai trò chính, rất giống với mô hình Manager/Worker trong Swarm.

### 2.1. Control Plane (hay Master Node)

-   **Control Plane** là "bộ não" của cụm, chịu trách nhiệm quản lý toàn bộ trạng thái, ra quyết định và điều phối hoạt động.
-   Trong Swarm, vai trò này tương đương với **Manager Node**.
-   Để đảm bảo tính sẵn sàng cao (High Availability), một cụm production thường có nhiều Master Node (thường là 3 hoặc 5) hoạt động theo cơ chế đồng thuận **Raft**, tương tự Swarm.
-   Control Plane không chỉ là một tiến trình đơn lẻ, mà là một tập hợp các container chuyên biệt, mỗi container thực hiện một nhiệm vụ duy nhất.

### 2.2. Worker Node

-   Đây là các máy chủ thực hiện công việc chính: chạy các container ứng dụng của bạn.
-   Trong Swarm, chúng được gọi là **Worker Node**. Trong Kubernetes, chúng thường được gọi đơn giản là **Node**.
-   Mặc dù Master Node cũng có thể chạy container ứng dụng, nhưng trong thực tế, người ta thường tách biệt vai trò: Control Plane để quản lý và Worker Node để chạy ứng dụng.

---

## 3. Bên trong Control Plane (Master Node)

Control Plane bao gồm nhiều thành phần hoạt động cùng nhau, mỗi thành phần là một container riêng biệt.

-   **etcd:**

    -   Là một cơ sở dữ liệu lưu trữ dạng key-value phân tán, đóng vai trò là "nguồn chân lý" (source of truth) cho toàn bộ cụm.
    -   Mọi thông tin về trạng thái của cụm (có bao nhiêu node, ứng dụng nào đang chạy, cấu hình mạng...) đều được lưu trong `etcd`.
    -   Nó sử dụng giao thức Raft, vì vậy các quy tắc về số lẻ (1, 3, 5...) để chịu lỗi cũng được áp dụng.

-   **API Server (kube-apiserver):**

    -   Là cổng giao tiếp chính của Control Plane.
    -   Tất cả các tương tác với cụm (từ `kubectl`, từ các thành phần khác) đều phải đi qua API Server. Nó xác thực yêu cầu, xử lý và lưu trạng thái vào `etcd`.

-   **Scheduler (kube-scheduler):**

    -   Chịu trách nhiệm quyết định xem một Pod (đơn vị ứng dụng) mới nên được chạy trên **Node** nào.
    -   Nó theo dõi tài nguyên còn trống trên các node và dựa vào các yêu cầu (CPU, RAM) và các ràng buộc khác để đưa ra quyết định tối ưu.

-   **Controller Manager (kube-controller-manager):**

    -   Là một vòng lặp liên tục quan sát trạng thái của cụm thông qua API Server.
    -   Nó so sánh **trạng thái mong muốn** (bạn yêu cầu chạy 3 bản sao của ứng dụng) với **trạng thái hiện tại** (chỉ có 2 bản đang chạy). Nếu có sự khác biệt, nó sẽ thực hiện các hành động cần thiết (ví dụ: yêu cầu Scheduler tạo thêm một Pod) để đưa hệ thống về trạng thái mong muốn.

-   **CoreDNS:**
    -   Cung cấp dịch vụ phân giải tên miền (DNS) bên trong cụm, cho phép các ứng dụng giao tiếp với nhau bằng tên thay vì địa chỉ IP.

---

## 4. Bên trong Worker Node

Mỗi Worker Node chạy ít nhất hai thành phần quan trọng:

-   **Kubelet:** Như đã đề cập, đây là agent chính giao tiếp với Control Plane và quản lý các container trên node.
-   **Kube-proxy:**
    -   Chịu trách nhiệm về các quy tắc mạng trên mỗi node.
    -   Nó duy trì các quy tắc `iptables` (hoặc các cơ chế khác) để cho phép giao tiếp mạng đến các Pod từ bên trong hoặc bên ngoài cụm.

---

## 5. Sơ đồ kiến trúc

Để dễ hình dung, hãy xem sơ đồ kiến trúc của một cụm Kubernetes đa node và so sánh với Swarm.

_(Sơ đồ mô tả một cụm có 3 Master Node và nhiều Worker Node. Mỗi Master Node chạy các container: etcd, API Server, Scheduler, Controller Manager. Mỗi Worker Node chạy Kubelet và Kube-proxy. Tất cả các node đều có một Container Runtime như Docker.)_

Kiến trúc này được thiết kế để giải quyết nhiều vấn đề theo nhiều cách khác nhau. Bạn có thể thấy mình sẽ cần thêm các thành phần khác vào Master hoặc Worker Node, chẳng hạn như các plugin mạng (CNI) hoặc lưu trữ (CSI), tùy thuộc vào nhu cầu của hệ thống.
