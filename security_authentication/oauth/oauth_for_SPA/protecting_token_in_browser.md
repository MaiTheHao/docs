# Bảo vệ token trong trình duyệt

#[Về root](../README.md)

# Mục lục

-   [Bảo vệ token trong trình duyệt](#bảo-vệ-token-trong-trình-duyệt)
    -   [Giới thiệu](#giới-thiệu)
    -   [Các lựa chọn lưu trữ token trong JavaScript](#các-lựa-chọn-lưu-trữ-token-trong-javascript)
        -   [LocalStorage](#localstorage)
        -   [SessionStorage](#sessionstorage)
        -   [Cookies](#cookies)
    -   [Rủi ro tấn công cross-site scripting (XSS)](#rủi-ro-tấn-công-cross-site-scripting-xss)
    -   [Các giải pháp thay thế lưu trữ token](#các-giải-pháp-thay-thế-lưu-trữ-token)
        -   [Lưu token trong bộ nhớ (in-memory)](#lưu-token-trong-bộ-nhớ-in-memory)
        -   [Lưu token trong Service Worker](#lưu-token-trong-service-worker)
        -   [Sử dụng WebCrypto API](#sử-dụng-webcrypto-api)
    -   [Kết luận](#kết-luận)

---

## Giới thiệu

Trong bài học này, chúng ta sẽ xem xét các lựa chọn mà single page app có để bảo vệ token mà chúng nhận được. Trước đó, chúng ta đã biết rằng cách an toàn nhất để hoàn thành một OAuth flow là sử dụng authorization code flow với PKCE.

PKCE cung cấp sự bảo vệ tuyệt vời cho chính flow, đảm bảo rằng chỉ ứng dụng bắt đầu flow mới có thể hoàn thành flow và nhận access token. Khi flow kết thúc và token đã được cấp, PKCE không còn tác dụng nữa, và lúc này chúng ta phải lưu trữ token đó một cách an toàn trong trình duyệt.

Thật không may, các lựa chọn ở đây khá hạn chế.

Trình duyệt vốn là một môi trường tiềm ẩn nhiều rủi ro.

Nó kém an toàn hơn nhiều so với code chạy trên server của bạn hoặc thậm chí là code chạy trên mobile app. Một trong những rủi ro lớn nhất trong môi trường trình duyệt là nguy cơ bị tấn công cross-site scripting (XSS). Nếu kẻ tấn công có thể chạy code trong app của bạn thông qua một lỗ hổng XSS, thì bất cứ nơi nào bạn lưu trữ token mà JavaScript của bạn có thể truy cập, kẻ tấn công cũng có thể truy cập được.

## Các lựa chọn lưu trữ token trong JavaScript

Hãy cùng xem ba nơi chính mà JavaScript app có thể lưu trữ dữ liệu: LocalStorage, SessionStorage và cookies.

### LocalStorage

LocalStorage là một API JavaScript cho phép bạn lưu trữ dữ liệu tồn tại qua nhiều phiên làm việc. Hãy coi nó như một nơi lưu trữ gần như vĩnh viễn cho JavaScript app.

Dữ liệu lưu trong LocalStorage sẽ tồn tại ngay cả khi trình duyệt bị đóng và cũng được chia sẻ giữa nhiều tab mở cùng một site.

Lưu trữ này bị giới hạn theo cùng origin, nghĩa là mỗi domain sẽ có một vùng lưu trữ riêng.

### SessionStorage

SessionStorage là một API tương tự, nhưng dữ liệu lưu ở đây chỉ tồn tại khi cửa sổ đó còn mở.

Nó lưu dữ liệu qua các lần chuyển trang và reload, nhưng nếu bạn đóng cửa sổ, dữ liệu SessionStorage sẽ bị xóa.

Dữ liệu SessionStorage cũng không được chia sẻ giữa các tab. Mỗi tab có vùng lưu trữ riêng.

### Cookies

Lựa chọn thứ ba, cũng là lựa chọn cũ hơn, là cookies.

API để lưu trữ dữ liệu trong cookies khó sử dụng hơn vì cookies không thực sự được thiết kế để lưu trữ dữ liệu ứng dụng.

Tuy nhiên, bạn vẫn có thể dùng cookies cho mục đích này nếu muốn.

Thông thường, cookies được dùng để trình duyệt tự động gửi cookie đó tới backend trong mỗi request.

## Rủi ro tấn công cross-site scripting (XSS)

Điều quan trọng là phải hiểu chính xác phần nào trong app của bạn có quyền truy cập vào các vùng lưu trữ này.

Mặc dù các API này phân vùng dữ liệu theo domain, nhưng JavaScript được host trên domain khác nhưng được nhúng vào app của bạn vẫn có thể truy cập vào vùng lưu trữ của domain chính. Điều này có thể gây nhầm lẫn.

Ví dụ, nếu bạn có JavaScript trên example-app.com, nó có thể lưu dữ liệu vào LocalStorage, và bạn có thể đọc dữ liệu đó từ các tab khác.

Tuy nhiên, nếu bạn nhúng JavaScript từ evil-app.com (ví dụ qua thẻ `<script>`), đoạn JavaScript đó sẽ chạy trong context của example-app.com và cũng có thể đọc LocalStorage của app.

Điều này có nghĩa là nếu website của bạn có lỗ hổng XSS và ai đó có thể inject JavaScript vào app, họ có thể đọc LocalStorage của app bạn.

Điều tương tự cũng đúng với SessionStorage và cookies.

Nói chung, bất cứ khi nào bạn ghi dữ liệu vào các API này từ JavaScript, bất kỳ JavaScript nào trên trang cũng có thể truy cập chúng.

Bạn luôn có nguy cơ bị tấn công XSS đánh cắp token mà bạn lưu trữ ở đó. Vì rủi ro này, bạn nên cân nhắc các giải pháp thay thế cho việc lưu trữ token trong JavaScript.

## Các giải pháp thay thế lưu trữ token

Tuy nhiên, các giải pháp thay thế cũng không hoàn hảo.

### Lưu token trong bộ nhớ (in-memory)

Một lựa chọn là không lưu trữ token, mà chỉ giữ chúng trong bộ nhớ (in-memory).

Cách này khiến kẻ tấn công khó lấy được token thông qua lỗ hổng XSS. Tuy nhiên, nhược điểm là bạn không thể chia sẻ token giữa các tab hoặc khi reload trang.

### Lưu token trong Service Worker

Một lựa chọn khác là lưu token trong Service Worker.

Đây là một giải pháp thú vị vì vùng lưu trữ của Service Worker hoàn toàn tách biệt với cửa sổ trình duyệt chính.

Do đó, lỗ hổng XSS sẽ không thể truy cập token mà Service Worker lưu trữ.

Nhược điểm là giải pháp này phức tạp hơn để xây dựng và không hoạt động trên IE11.

Cách này yêu cầu phần còn lại của app phải sử dụng Service Worker như một OAuth client biệt lập, nghĩa là JavaScript của bạn không thể tự gọi API nữa mà phải nhờ Service Worker thực hiện và nhận kết quả trả về.

Điều này an toàn hơn vì JavaScript chạy trong cửa sổ không bao giờ nhìn thấy access token.

Kẻ tấn công cũng không thể lấy access token, nhưng vẫn có thể yêu cầu Service Worker thực hiện request API.

### Sử dụng WebCrypto API

Một lựa chọn khác là sử dụng WebCrypto API.

API này không có trên IE hoặc Safari, nhưng đã là tiêu chuẩn và có trên Chrome, Edge, Firefox, Opera. Có thể sẽ được thêm vào Safari trong tương lai.

WebCrypto API không phải là API lưu trữ, mà cho phép JavaScript tạo và sử dụng private key mà không thể trích xuất private key đó.

Bạn có thể dùng nó để tạo private key và mã hóa dữ liệu muốn lưu trữ với key đó.

Cách này tốt hơn so với lưu token dạng plain text trong LocalStorage, nhưng vẫn chưa hoàn hảo.

Kẻ tấn công không thể lấy private key, nhưng vẫn có thể dùng key đó để giải mã dữ liệu, tuy nhiên đây là một kiểu tấn công có chủ đích, khác với việc chỉ đơn giản đọc LocalStorage.

## Kết luận

Thực tế, cách duy nhất để đảm bảo token không bị đánh cắp từ JavaScript là không đưa token cho JavaScript.

Và đó chính là nội dung chúng ta sẽ tìm hiểu trong bài học tiếp theo.

Hẹn gặp lại bạn ở bài sau.
