# Mạng máy tính (Computer Networking)

Kho tài liệu lưu trữ và hệ thống hóa các kiến thức cốt lõi về **Mạng máy tính**, từ nền tảng giao thức IP đến tối ưu hóa hiệu năng tầng giao vận và bảo mật tầng ứng dụng.

## Mục lục

*   [0. Nền tảng Lý thuyết & Mô hình Phân tầng (Theoretical Models)](#0-nền-tảng-lý-thuyết--mô-hình-phân-tầng-theoretical-models)
*   [1. Nền tảng Mạng (Network Foundations)](#1-nền-tảng-mạng-network-foundations)
*   [2. Giao thức Tầng Giao vận (Transport Layer)](#2-giao-thức-tầng-giao-vận-transport-layer)
*   [3. Tối ưu hóa Hiệu suất TCP (TCP Performance Tuning)](#3-tối-ưu-hóa-hiệu-suất-tcp-tcp-performance-tuning)
*   [4. Giao thức Tầng Ứng dụng & Bảo mật (Application Layer & Security)](#4-giao-thức-tầng-ứng-dụng-bảo-mật-application-layer-security)
*   [5. Kiến trúc Hệ thống Mạng (Network System Architecture)](#5-kiến-trúc-hệ-thống-mạng-network-system-architecture)

---

## 0. Nền tảng Lý thuyết & Mô hình Phân tầng (Theoretical Models)

Khung tham chiếu lý thuyết và kiến trúc phân tầng thực tiễn để định hình dòng chảy dữ liệu trên Internet.

*   [Mô hình Tham chiếu OSI – Tiêu chuẩn 7 tầng học thuật](./00_osi_model/osi_7_layers.md)
*   [Bộ Giao thức TCP/IP – So sánh đối chiếu với OSI](./00_osi_model/tcp_ip_vs_osi.md)

---

## 1. Nền tảng Mạng (Network Foundations)

Nền tảng về địa chỉ hóa, phân đoạn dữ liệu vật lý và các giao thức điều khiển điều hướng cốt lõi của Internet Protocol Suite.

*   [Địa chỉ IP, Subnet, và Default Gateway](./01_internet_protocol/the_ip_building_blocks.md)
*   [Cấu trúc Gói tin IP (IP Packet)](./01_internet_protocol/ip_packet.md)
*   [ICMP – Giao thức điều khiển và báo lỗi](./01_internet_protocol/icmp.md)
*   [So sánh IPv4 và IPv6](./01_internet_protocol/ipv4_ipv6.md)
*   [ARP – Giao thức phân giải địa chỉ](./02_routing/arp.md)
*   [NAT – Dịch địa chỉ mạng](./02_routing/nat.md)
*   [MSS, MTU, và Path MTU Discovery](./07_others/mss_mtu_path_mtu.md)

---

## 2. Giao thức Tầng Giao vận (Transport Layer)

Cơ chế truyền tải dữ liệu đầu-cuối (end-to-end) đáng tin cậy (TCP) hoặc phi trạng thái tốc độ cao (UDP).

### ⚡ User Datagram Protocol (UDP)
*   [UDP là gì? Đặc điểm và ứng dụng](./03_udp/what_is_udp.md)
*   [Cấu trúc của UDP Datagram](./03_udp/user_datagram_structure.md)
*   [Ưu và Nhược điểm của UDP](./03_udp/pros_cons.md)

### ⚙️ Transmission Control Protocol (TCP)
*   [TCP là gì? Đặc điểm và ứng dụng](./04_tcp/what_is_tcp.md)
*   [Cấu trúc của TCP Segment](./04_tcp/tcp_segment.md)
*   [Ưu và Nhược điểm của TCP](./04_tcp/pros_cons.md)

---

## 3. Tối ưu hóa Hiệu suất TCP (TCP Performance Tuning)

Các thuật toán và cơ chế tối ưu hóa độ trễ, băng thông đường truyền trong môi trường mạng thực tế.

*   [Thuật toán Nagle và ảnh hưởng đến hiệu suất](./07_others/nagle's_algorithm's_effect_on_performance.md)
*   [Delayed Acknowledgment và sự kết hợp "chết người" với Nagle](./07_others/delayed_acknowledgment_effect_on_performance.md)

---

## 4. Giao thức Tầng Ứng dụng & Bảo mật (Application Layer & Security)

Các tiêu chuẩn bảo mật hóa dòng dữ liệu web và cơ chế phân giải định danh tên miền trên môi trường Internet.

*   [Tổng quan về DNS, TLS, và HTTPS](./06_overview_of_popular_networking_protocols/introduce.md)
*   [DNS – Hệ thống tên miền](./06_overview_of_popular_networking_protocols/dns.md)
*   [TLS – Bảo mật tầng truyền tải](./06_overview_of_popular_networking_protocols/tls.md)
*   [Chứng chỉ số (Digital Certificates)](./06_overview_of_popular_networking_protocols/certificates.md)
*   [HTTPS – HTTP qua TLS](./06_overview_of_popular_networking_protocols/https.md)

---

## 5. Kiến trúc Hệ thống Mạng (Network System Architecture)

Quy hoạch hệ thống chịu tải, trung chuyển yêu cầu và định tuyến lưu lượng ở biên ứng dụng.

*   [Proxy và Reverse Proxy](./07_others/the_importance_of_proxy_and_reverse_proxies.md)
*   [Cân bằng tải Lớp 4 (L4) vs. Lớp 7 (L7)](./07_others/load_balancing_at_L4_vs_L7.md)

---
[← Quay lại trang chủ](../README.md)
