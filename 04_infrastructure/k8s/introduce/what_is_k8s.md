# Giới thiệu về Kubernetes

Chào mừng bạn đến với phần tìm hiểu về **Kubernetes**, một trong những hệ thống điều phối container (container orchestrator) mạnh mẽ và phổ biến nhất hiện nay. Sau khi đã làm quen với Docker Swarm, việc học Kubernetes là bước tiếp theo hợp lý để mở rộng kiến thức của bạn.

Trong bài viết này, chúng ta sẽ khám phá những khái niệm cơ bản: Kubernetes là gì, lịch sử ra đời, mối quan hệ của nó với Docker, và cách lựa chọn một nền tảng điều phối phù hợp.

## Mục lục

-   [1. Kubernetes là gì?](#1-kubernetes-la-gi)
-   [2. Kubernetes và Docker](#2-kubernetes-va-docker)
-   [3. Các "Phiên bản" của Kubernetes](#3-cac-phien-ban-cua-kubernetes)

---

## 1. Kubernetes là gì?

**Kubernetes** (thường được viết tắt là **K8s**) là một hệ thống điều phối container mã nguồn mở, ban đầu được phát triển bởi Google và ra mắt vào năm 2015. Hiện nay, nó được duy trì bởi một cộng đồng toàn cầu dưới sự bảo trợ của **Cloud Native Computing Foundation (CNCF)**.

Về cơ bản, một hệ thống điều phối sẽ nhận các container bạn yêu cầu chạy, sau đó tự động phân bổ và quản lý chúng trên một cụm các máy chủ (được gọi là **nodes**). Nó đảm bảo các ứng dụng của bạn luôn hoạt động ổn định, có khả năng mở rộng và tự phục hồi khi có lỗi.

Kubernetes cung cấp một bộ **API** mạnh mẽ và các công cụ dòng lệnh để bạn có thể triển khai và duy trì hạ tầng một cách nhất quán, tương tự như những gì bạn đã làm với Swarm.

---

## 2. Kubernetes và Docker

Một câu hỏi thường gặp là Kubernetes có thay thế Docker không. Câu trả lời là không. Kubernetes và Docker hoạt động cùng nhau.

-   **Docker** (hoặc một container runtime khác như `containerd`) là công cụ chịu trách nhiệm xây dựng và chạy các container trên một máy chủ đơn lẻ.
-   **Kubernetes** là một lớp quản lý nằm "bên trên", điều phối các container này trên nhiều máy chủ khác nhau. Nó không loại bỏ container runtime mà sử dụng nó để thực thi các tác vụ.

Nói cách khác, Kubernetes sẽ ra lệnh cho Docker (hoặc runtime tương đương) trên mỗi node để khởi động, dừng hoặc quản lý container theo yêu cầu của bạn.

Công cụ dòng lệnh chính bạn sẽ sử dụng để tương tác với API của Kubernetes là `kubectl` (phát âm là "kube control").

> **Ghi nhớ:** Mặc dù có nhiều cách phát âm khác nhau như "kube-cuddle" hay "kube-C-T-L", `kubectl` là tên gọi chính thức được công nhận trong tài liệu của dự án.

---

## 3. Các "Phiên bản" của Kubernetes

Khi bạn quyết định sử dụng Kubernetes, bạn sẽ không chỉ tải về một phần mềm duy nhất. Thay vào đó, bạn sẽ chọn một "phiên bản" hoặc một nền tảng cung cấp Kubernetes. Có hai loại chính:

### 3.1. Kubernetes dưới dạng Dịch vụ (Kubernetes-as-a-Service)

Đây là các dịch vụ được quản lý bởi các nhà cung cấp đám mây lớn (Cloud Vendors). Họ sẽ lo toàn bộ việc cài đặt, cấu hình và bảo trì cụm Kubernetes. Bạn chỉ cần tập trung vào việc triển khai ứng dụng của mình.

-   **Ví dụ:** Google Kubernetes Engine (GKE), Amazon Elastic Kubernetes Service (EKS), Azure Kubernetes Service (AKS).

### 3.2. Các Bản phân phối Kubernetes (Kubernetes Distributions)

Tương tự như các bản phân phối Linux (Ubuntu, CentOS), các nhà cung cấp hạ tầng (Infrastructure Vendors) sẽ đóng gói phiên bản Kubernetes "thuần" (upstream) và bổ sung thêm các công cụ, tính năng riêng của họ để tạo ra một giải pháp hoàn chỉnh.

Các bản phân phối này có thể được cài đặt trên hạ tầng của riêng bạn (on-premise) hoặc trên bất kỳ đám mây nào.

-   **Ví dụ:** Red Hat OpenShift, Rancher, Docker Enterprise.

Lựa chọn một bản phân phối thường phụ thuộc vào yêu cầu kỹ thuật, hệ điều hành, hoặc các hợp đồng hiện có với nhà cung cấp. Tuy nhiên, tất cả chúng đều dựa trên cùng một lõi Kubernetes mã nguồn mở, đảm bảo tính tương thích cơ bản.
