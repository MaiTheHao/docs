# Hướng Dẫn Triển Khai Web Notifications

Tài liệu này cung cấp mã nguồn triển khai thực tế trên Frontend, Service Worker và tổng hợp các cạm bẫy kỹ thuật thường gặp trong quá trình vận hành hệ thống Web Notifications.

## Mục lục

*   [1. Đăng ký nhận thông báo ở Frontend](#1-đăng-ký-nhận-thông-báo-ở-frontend)
*   [2. Xử lý hiển thị thông báo ngầm ở Service Worker](#2-xử-lý-hiển-thị-thông-báo-ngầm-ở-service-worker)
*   [3. Các cạm bẫy thường gặp (Gotchas & Pitfalls)](#3-các-cạm-bẫy-thường-gặp-gotchas--pitfalls)
    *   [3.1 Xử lý Token hết hạn (Stale Tokens)](#31-xử-lý-token-hết-hạn-stale-tokens)
    *   [3.2 Giới hạn giao thức bảo mật HTTPS](#32-giới-hạn-giao-thức-bảo-mật-https)
    *   [3.3 Quy định khắt khe của Safari trên iOS](#33-quy-định-khắt-khe-của-safari-trên-ios)
    *   [3.4 Giới hạn kích thước Payload](#34-giới-hạn-kích-thước-payload)
    *   [3.5 Các chế độ tối ưu hóa năng lượng của Hệ điều hành](#35-các-chế-độ-tối-ưu-hóa-năng-lượng-của-hệ-điều-hành)

---

## 1. Đăng ký nhận thông báo ở Frontend

Quy trình đăng ký ở Frontend bao gồm:
1.  **Xin quyền (Permission):** Sử dụng `Notification.requestPermission()` để xin quyền hiển thị cảnh báo.
2.  **Lấy Token (Get Token):** Sử dụng FCM SDK để kết nối với Google Cloud và lấy Registration Token bằng Public VAPID Key.
3.  **Đồng bộ với Backend:** Gửi Token thu được lên máy chủ Backend để lưu vào cơ sở dữ liệu.

```javascript
import { getMessaging, getToken } from "firebase/messaging";

const messaging = getMessaging();

async function registerNotification() {
  try {
    // 1. Xin quyền hiển thị thông báo từ người dùng
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Quyền thông báo đã được cấp.');
      
      // 2. Lấy Token từ FCM dùng cặp khóa VAPID của dự án
      const token = await getToken(messaging, { 
        vapidKey: 'YOUR_PUBLIC_VAPID_KEY' 
      });
      console.log('FCM Token nhận được:', token);
      
      // 3. Gửi token lên Backend của bạn để lưu lại vào cơ sở dữ liệu
      await sendTokenToBackend(token);
    } else {
      console.warn('Người dùng từ chối cấp quyền thông báo.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy FCM Token:', error);
  }
}

async function sendTokenToBackend(token) {
  const response = await fetch('/api/fcm/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: token })
  });
  
  if (!response.ok) {
    throw new Error('Không thể đồng bộ Token với Backend.');
  }
}
```

---

## 2. Xử lý hiển thị thông báo ngầm ở Service Worker

Service Worker (`firebase-messaging-sw.js`) hoạt động trong một tiến trình nền độc lập với tab giao diện chính. Khi nhận được sự kiện push từ hệ điều hành trình duyệt, Service Worker sẽ được đánh thức để hiển thị thông báo:

```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Khởi tạo Firebase cấu hình cho Service Worker
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
});

const messaging = firebase.messaging();

// Lắng nghe sự kiện đẩy tin nhắn ngầm (Background Message)
messaging.onBackgroundMessage((payload) => {
  console.log('Nhận tin nhắn ngầm thành công:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
    data: payload.data // Dữ liệu định tuyến đi kèm khi click
  };

  // Hiển thị thông báo trên khay hệ thống của thiết bị
  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

---

## 3. Các cạm bẫy thường gặp (Gotchas & Pitfalls)

### 3.1 Xử lý Token hết hạn (Stale Tokens)
*   **Vấn đề:** Token có thể bị vô hiệu hóa khi người dùng gỡ cài đặt ứng dụng, xóa bộ nhớ cache trình duyệt hoặc thu hồi quyền thông báo thủ công.
*   **Hậu quả:** Gửi thông báo đến Token lỗi sẽ làm lãng phí băng thông backend và gây nghẽn hàng đợi gửi tin.
*   **Giải pháp:** Backend khi gọi API của Push Provider nhận về mã lỗi HTTP `410 Gone` (hoặc chuỗi lỗi `UNREGISTERED` / `BadDeviceToken`) phải lập tức kích hoạt hàm xóa hoặc đánh dấu vô hiệu hóa bản ghi Token đó trong cơ sở dữ liệu `UserDevices`.

---

### 3.2 Giới hạn giao thức bảo mật HTTPS
*   **Vấn đề:** Các API trình duyệt liên quan đến `ServiceWorker` và `PushManager` đều được xếp vào nhóm "Secure Contexts".
*   **Giải pháp:** Mọi ứng dụng triển khai Web Push bắt buộc phải chạy trên môi trường mã hóa **HTTPS**. Ngoại lệ duy nhất được cho phép là địa chỉ cục bộ `localhost` phục vụ quá trình phát triển (development).

---

### 3.3 Quy định khắt khe của Safari trên iOS
*   **Vấn đề:** Hệ điều hành iOS áp đặt chính sách khắt khe đối với trình duyệt Safari để tối ưu trải nghiệm và thời lượng pin.
*   **Giải pháp:** Để một Web App nhận được Push Notification trên iPhone/iPad, trang web đó phải hỗ trợ đầy đủ các chuẩn **PWA** (Progressive Web App). Người dùng bắt buộc phải mở Safari, chọn tùy chọn **"Thêm vào màn hình chính"** (*Add to Home Screen*) và mở ứng dụng từ màn hình chính thì hệ thống iOS mới kích hoạt quyền đăng ký Push.

---

### 3.4 Giới hạn kích thước Payload
*   **Vấn đề:** Chuẩn IETF và các nhà cung cấp dịch vụ giới hạn khắt khe dung lượng gói tin đẩy.
*   **Giải pháp:** Kích thước tối đa của một payload Web Push/FCM là **4KB**. Tuyệt đối không gửi thông tin nhạy cảm (mật khẩu, OTP, số dư tài khoản chi tiết) trực tiếp trong Payload của FCM vì nó đi qua máy chủ bên thứ ba (Google/Apple). Hãy gửi một payload rỗng hoặc payload định danh đơn giản để đánh thức Service Worker, sau đó để Service Worker tự gọi API an toàn về backend để đồng bộ dữ liệu.

---

### 3.5 Các chế độ tối ưu hóa năng lượng của Hệ điều hành
*   **Android Doze Mode & App Standby:** Khi thiết bị ở trạng thái đứng yên tắt màn hình, Android sẽ đóng băng kết nối mạng. Tin nhắn gửi với cờ `Priority = Normal` sẽ bị giữ lại ở hàng đợi và chỉ được chuyển đi trong cửa sổ bảo trì kế tiếp. Với tin nhắn `Priority = High` (như cuộc gọi VoIP), hệ thống sẽ mở băng thông tạm thời để đánh thức ứng dụng. Tuy nhiên, nếu lạm dụng `High Priority` mà không hiển thị UI thông báo cho người dùng, Google sẽ giáng cấp độ ưu tiên của ứng dụng đó.
*   **iOS Silent Push Rate Limits:** APNs kiểm soát chặt chẽ các thông báo ngầm (*Silent Push* có cờ `content-available: 1`). Apple giới hạn chỉ cho phép chuyển tải khoảng **2 đến 3 thông báo ngầm mỗi giờ** cho một thiết bị khách. Nếu pin yếu, iOS sẽ phớt lờ và bỏ hoàn toàn các thông báo ngầm này.

---
[← Quay lại mục lục](README.md)
