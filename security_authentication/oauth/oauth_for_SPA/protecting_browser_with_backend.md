[Về root](../README.md)

# Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Rủi ro khi lưu trữ token trong JavaScript app](#rủi-ro-khi-lưu-trữ-token-trong-javascript-app)
-   [Giải pháp: Di chuyển OAuth flow và lưu trữ token về backend](#giải-pháp-di-chuyển-oauth-flow-và-lưu-trữ-token-về-backend)
-   [Quy trình hoạt động](#quy-trình-hoạt-động)
-   [Ưu điểm của mô hình này](#ưu-điểm-của-mô-hình-này)
-   [Kết luận](#kết-luận)

---

## Giới thiệu

Bài học trước, chúng ta đã xem xét các lựa chọn khác nhau mà JavaScript app có thể sử dụng để lưu trữ token. Trong bài học này, chúng ta sẽ tìm hiểu cách giữ token hoàn toàn ngoài JavaScript app, nhằm xây dựng một ứng dụng an toàn hơn.

## Rủi ro khi lưu trữ token trong JavaScript app

Như đã thấy trước đó, bất kỳ dữ liệu nào mà JavaScript app có thể truy cập đều có nguy cơ bị đánh cắp do tấn công cross-site scripting.

Nếu JavaScript app không bao giờ truy cập được access token, thì token đó sẽ không bị đánh cắp. Ý tưởng ở đây là di chuyển OAuth flow cũng như lưu trữ token vào một backend server động.

## Giải pháp: Di chuyển OAuth flow và lưu trữ token về backend

Đối với một số người, đây có thể không phải là lựa chọn khả thi. Ví dụ, nếu bạn chỉ triển khai single page app trên môi trường static hosting như Amazon S3 và để JavaScript app tương tác trực tiếp với API, thì giải pháp này sẽ không phù hợp.

Tuy nhiên, nếu bạn sử dụng framework single page app và phục vụ nó từ một ứng dụng .NET hoặc Java (một mô hình khá phổ biến), thì ý tưởng là sử dụng backend để thực hiện OAuth flow và proxy tất cả các request API thông qua backend đó.

Backend này có thể sử dụng HTTPOnly session cookie cho trình duyệt, nhờ đó session cookie cũng không thể bị đánh cắp từ JavaScript.

## Quy trình hoạt động

-   Trình duyệt truy cập website của app, tải về single page app vào trình duyệt.
-   Khi OAuth flow bắt đầu, trình duyệt được chuyển hướng sang authorization server.
-   Người dùng đăng nhập tại đó, authorization server chuyển hướng họ trở lại website của app. Đây là bước authorization.
-   JavaScript app sau đó chuyển authorization code đến backend app server.
-   Cho đến lúc này, dữ liệu được truyền giữa authorization server và app server thông qua address bar của trình duyệt (front channel).
-   App server sẽ trao đổi authorization code lấy access token qua back channel an toàn, giữ access token trên server và chỉ thiết lập session cookie với trình duyệt.
-   Khi trình duyệt muốn gửi request API, nó sẽ gửi request đến app server kèm theo cookie, app server sẽ tra cứu access token cho session đó và thực hiện request API.

## Ưu điểm của mô hình này

Trong mô hình này, phần duy nhất của OAuth flow tiếp xúc với trình duyệt là bước authorization và việc trình duyệt chuyển authorization code tạm thời.

Access token và refresh token được giữ hoàn toàn ngoài trình duyệt, chỉ được truyền qua back channel trực tiếp vào backend server. Nhờ vậy, backend app server được xem là confidential client và có thể sử dụng client secret để tăng cường bảo mật.

Mô hình này được mô tả trong OAuth for Browser-Based App spec mới như một trong những lựa chọn được khuyến nghị.

## Kết luận

Nếu bạn có backend app server động cho single page application, đây là lựa chọn an toàn hơn nhiều so với việc xử lý access token trực tiếp trong JavaScript.
