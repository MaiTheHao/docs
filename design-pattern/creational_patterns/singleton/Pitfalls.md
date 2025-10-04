# Những Cạm Bẫy của Mẫu Thiết Kế Singleton

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Cạm bẫy về phụ thuộc](#cạm-bẫy-về-phụ-thuộc)
3. [Khó khăn khi kiểm thử đơn vị](#khó-khăn-khi-kiểm-thử-đơn-vị)
4. [Vấn đề với biến tĩnh và bộ nạp lớp](#vấn-đề-với-biến-tĩnh-và-bộ-nạp-lớp)
5. [Trạng thái toàn cục có thể thay đổi](#trạng-thái-toàn-cục-có-thể-thay-đổi)

---

## 1. Giới thiệu

Bây giờ, hãy cùng xem xét những cạm bẫy của mẫu thiết kế Singleton.

Có khá nhiều vấn đề liên quan đến mẫu này.

---

## 2. Cạm bẫy về phụ thuộc

Trước hết, mẫu Singleton có thể khiến bạn hiểu sai về các phụ thuộc thực sự trong mã nguồn.

Vì thể hiện Singleton có thể truy cập toàn cục thông qua phương thức lấy thể hiện, các phần khác nhau của mã có thể bắt đầu phụ thuộc vào thể hiện singleton này, và sự phụ thuộc này không rõ ràng.

---

## 3. Khó khăn khi kiểm thử đơn vị

Cạm bẫy thứ hai là Singleton rất khó để kiểm thử đơn vị vì chúng ta sử dụng phương thức tĩnh, và rất khó để giả lập (mock) thể hiện được trả về bởi phương thức đó.

---

## 4. Vấn đề với biến tĩnh và bộ nạp lớp

Một trong những cách phổ biến để triển khai Singleton là sử dụng biến tĩnh để giữ thể hiện singleton. Tuy nhiên, biến tĩnh được tạo ra cho mỗi bộ nạp lớp (class loader), không phải cho mỗi JVM.

Nếu bạn chạy trong một ứng dụng web hoặc container như Tomcat, Singleton của bạn có thể không còn là duy nhất trong cùng một JVM.

Nếu bạn có một lớp singleton được sử dụng hoặc triển khai trong hai ứng dụng web riêng biệt chạy trên cùng một instance Tomcat, bạn sẽ có hai thể hiện singleton trong cùng một JVM.

Điều này thường không phải là vấn đề, nhưng nếu singleton của bạn liên kết với một tài nguyên bên ngoài duy nhất, bạn nên nhớ rằng biến tĩnh chỉ có một bản sao cho mỗi bộ nạp lớp, không phải cho mỗi JVM.

---

## 5. Trạng thái toàn cục có thể thay đổi

Một singleton có nhiều trạng thái toàn cục có thể thay đổi là dấu hiệu cho thấy bạn đang sử dụng sai mẫu thiết kế Singleton.

Đây cũng là một trong những lý do chính khiến mẫu Singleton ngày nay thường bị tránh sử dụng, vì việc có trạng thái toàn cục có thể thay đổi được xem là một thực hành thiết kế không tốt.
