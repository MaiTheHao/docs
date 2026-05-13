[Về root](../README.md)

# Mục lục

-   [Đăng ký OAuth client](#đăng-ký-oauth-client)
-   [Quy trình đăng ký ứng dụng](#quy-trình-đăng-ký-ứng-dụng)
-   [Thông tin cần thiết khi đăng ký](#thông-tin-cần-thiết-khi-đăng-ký)
-   [Redirect URI và bảo mật](#redirect-uri-và-bảo-mật)
-   [Client ID và Client Secret](#client-id-và-client-secret)
-   [Lưu ý khi sử dụng Client Secret](#lưu-ý-khi-sử-dụng-client-secret)

---

# Đăng ký OAuth client

Nếu bạn đã sẵn sàng xây dựng một OAuth client, trước khi bắt đầu một Auth flow, bạn cần đăng ký client tại OAuth server.

Việc đăng ký client là bước đăng ký danh tính của ứng dụng tại server, điều này thực hiện một số việc rất quan trọng.

# Quy trình đăng ký ứng dụng

Thông thường, bạn sẽ truy cập vào website dành cho developer của dịch vụ mà bạn đang viết ứng dụng, đăng ký làm developer, sau đó tạo ứng dụng. Đây là cách hoạt động với các API công khai như Twitter, Google, GitHub và các dịch vụ có public API khác.

Bạn đăng ký làm developer, sau đó có thể tạo ứng dụng trong nền tảng của họ. Việc đăng ký ứng dụng sẽ cung cấp cho bạn các thông tin xác thực để sử dụng với OAuth flow. Nếu bạn sử dụng OAuth server của công ty hoặc doanh nghiệp, bước đăng ký có thể không tự phục vụ như vậy.

Bạn sẽ cần quản trị viên đăng ký ứng dụng cho bạn.

# Thông tin cần thiết khi đăng ký

Dù bằng cách nào, việc đăng ký ứng dụng sẽ yêu cầu nhập một số thông tin về ứng dụng, sau đó bạn sẽ nhận được một định danh cho ứng dụng, gọi là client ID, và có thể nhận được client secret, tức là mật khẩu. Khi đăng ký ứng dụng, server sẽ yêu cầu một số thông tin về ứng dụng của bạn. Mỗi server sẽ có cách làm khác nhau, nhưng thường bạn sẽ thấy ít nhất là nơi nhập tên ứng dụng và một hoặc nhiều redirect URL cho ứng dụng. Tên ứng dụng có thể được hiển thị cho người dùng nếu họ được hỏi quyền trước khi tiếp tục.

Một số server cũng có thể yêu cầu mô tả hoặc logo của ứng dụng.

Nếu là public API, có thể có nơi để liên kết tới điều khoản dịch vụ hoặc chính sách bảo mật của ứng dụng.

Tất cả những thông tin này là thuộc tính của ứng dụng, có thể cần thiết vì sẽ được hiển thị cho người dùng hoặc xuất hiện trong log.

Một biến thể khác mà bạn có thể gặp, tùy vào OAuth server bạn sử dụng, là server có thể hỏi bạn đang xây dựng loại ứng dụng nào.

Tùy vào lựa chọn, server có thể áp dụng các chính sách khác nhau về việc cấp refresh token hoặc bật CORS header cho JavaScript app, chẳng hạn.

# Redirect URI và bảo mật

Việc nhập redirect URI là một trong những bước quan trọng nhất khi đăng ký. Một số server cho phép bạn đăng ký nhiều hơn một URI, nhưng luôn cần đăng ký ít nhất một.

Việc liệt kê rõ ràng các redirect URL liên kết với ứng dụng giúp đảm bảo rằng kẻ tấn công không thể sử dụng client ID của ứng dụng bạn để chuyển hướng người dùng về website của kẻ tấn công.

Các OAuth server hỗ trợ khuyến nghị mới nhất cũng sẽ không cho phép đăng ký redirect URL có wildcard, vì đó là một lỗ hổng mà kẻ tấn công có thể lợi dụng để lừa người dùng chuyển hướng về website của họ.

Việc sử dụng wildcard hoặc so khớp một phần redirect URL là cách dễ dàng để mở ra nguy cơ bị open redirect attack. Đây là kiểu tấn công không chỉ riêng OAuth, nhưng thường được kết hợp với các lỗ hổng khác để thực hiện các hành động không mong muốn.

Như đã đề cập trước đó với public client, redirect URL thực sự là hy vọng duy nhất để authorization đảm bảo rằng kẻ tấn công không giả mạo OAuth client thật.

# Client ID và Client Secret

Sau khi nhập đầy đủ thông tin, ứng dụng của bạn đã được đăng ký và sẵn sàng bắt đầu OAuth flow. Client ID được xem là thông tin công khai, dùng để xác định ứng dụng trong suốt OAuth flow, và có thể đưa vào source code hoặc các nơi tương tự. Ví dụ, khi bắt đầu flow, bạn sẽ đưa client ID của ứng dụng vào URL. Nhờ đó, server biết ứng dụng nào sẽ hiển thị trên consent screen, cũng như biết chính sách thời gian sống của token nào sẽ áp dụng cho access token cấp cho ứng dụng. Client secret ngược lại là mật khẩu của ứng dụng, dùng để xác thực với token endpoint để lấy access token.

# Lưu ý khi sử dụng Client Secret

Nếu bước đăng ký hỏi loại ứng dụng bạn xây dựng và bạn chọn mobile app, native app hoặc JavaScript app, thì thường bạn chỉ nhận được client ID mà không có client secret.

Vì mobile app và JavaScript app không thể bảo vệ client secret, nên không cần tạo client secret. Đây là cách giúp developer làm đúng.

Nếu bạn nhận được client secret và đang xây dựng mobile app hoặc JavaScript app, thì không nên đưa client secret vào ứng dụng vì nó sẽ không còn là bí mật nữa, ai cũng có thể lấy được.

Hãy nhớ rằng client secret là mật khẩu, nên phải được bảo vệ như mật khẩu. Không chia sẻ với ai và luôn giữ an toàn.

Chỉ những ứng dụng có thể triển khai client secret và đảm bảo nó luôn bí mật mới nên sử dụng client secret.

Nếu bạn xây dựng server side app, bạn hoàn toàn có thể lưu secret trong biến môi trường hoặc file cấu hình vì người dùng ứng dụng sẽ không truy cập được.

Với client ID và client secret, nếu bạn xây dựng server side app, bạn đã sẵn sàng bắt đầu OAuth flow.

Hẹn gặp bạn ở bài tiếp theo, nơi chúng ta sẽ đi từng bước thực hiện authorization code flow cho server side app.
