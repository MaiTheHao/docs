[Về root](../README.md)

# Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Giới hạn của môi trường trình duyệt với OAuth cho SPA](#giới-hạn-của-môi-trường-trình-duyệt-với-oauth-cho-spa)
-   [Vấn đề với việc bảo mật khóa bí mật](#vấn-đề-với-việc-bảo-mật-khóa-bí-mật)
-   [Các tấn công phổ biến trong trình duyệt](#các-tấn-công-phổ-biến-trong-trình-duyệt)
-   [Rủi ro từ mã JavaScript bên thứ ba](#rủi-ro-từ-mã-javascript-bên-thứ-ba)
-   [Ảnh hưởng của extension trình duyệt](#ảnh-hưởng-của-extension-trình-duyệt)
-   [Giới hạn về lưu trữ an toàn trên trình duyệt](#giới-hạn-về-lưu-trữ-an-toàn-trên-trình-duyệt)
-   [Chính sách OAuth dành riêng cho SPA](#chính-sách-oauth-dành-riêng-cho-spa)
-   [Kết luận](#kết-luận)

---

## Giới thiệu

Trong bài học này, chúng ta sẽ xem xét một số thách thức đặc biệt mà môi trường trình duyệt đặt ra khi làm việc với OAuth cho single-page app.

Single-page app là một mô hình phổ biến để xây dựng ứng dụng web hiện nay. Có nhiều biến thể của kiến trúc này, nhưng tất cả đều có điểm chung: trình duyệt.

## Giới hạn của môi trường trình duyệt với OAuth cho SPA

Ứng dụng SPA của bạn có thể được triển khai trên các dịch vụ lưu trữ tĩnh như S3, hoặc sử dụng framework SPA được phục vụ từ máy chủ động như .Net hoặc Java. Một trong những giới hạn rõ ràng của ứng dụng JavaScript là không thể nhúng bất kỳ loại thông tin xác thực nào vào app.

## Vấn đề với việc bảo mật khóa bí mật

Điều này có nghĩa là các ứng dụng JavaScript được xem là public client trong thuật ngữ OAuth.

Nếu bạn thử nhúng API key vào ứng dụng JavaScript, bất kỳ ai sử dụng app đều có thể dễ dàng nhấn View Source trên trình duyệt và tìm ra key đó.

Không có cách nào để ẩn nó. Mọi nỗ lực che giấu key đều có thể bị reverse engineer.

Nếu bạn có backend động phục vụ SPA, phần backend đó có thể là confidential client. Nhưng chúng ta sẽ nói kỹ hơn về điều này ở phần sau.

Hãy nhớ rằng không thể nhúng API key hoặc client secret vào phần JavaScript của app nếu muốn giữ bí mật.

Vì vậy, không có client secret, chúng ta phải thực hiện OAuth flow không yêu cầu secret, và PKCE extension chính là giải pháp cho vấn đề này.

## Các tấn công phổ biến trong trình duyệt

Một thách thức khác của môi trường trình duyệt là số lượng lớn các kiểu tấn công mà trình duyệt dễ bị tổn thương.

Một trong những tấn công nguy hiểm nhất là cross-site scripting (XSS).

Nếu attacker thực hiện thành công XSS trên ứng dụng của bạn, họ có thể chạy mã trong app giống như mã hợp lệ.

Lỗ hổng XSS cực kỳ nguy hiểm vì attacker có thể truy cập dữ liệu mà app lưu trữ, như dữ liệu người dùng hoặc access token, và thậm chí có thể thực hiện API request bằng access token, dù không nhìn thấy token.

## Rủi ro từ mã JavaScript bên thứ ba

Một trong những cách tốt nhất để bảo vệ khỏi XSS là sử dụng Content Security Policy mạnh mẽ, chỉ định rõ những domain nào được phép load JavaScript.

Tuy nhiên, việc xây dựng Content Security Policy đủ mạnh mà vẫn cho phép các dịch vụ như analytics hoặc ad network hoạt động là một thách thức.

Nhiều developer hiện nay phụ thuộc vào mã JavaScript bên thứ ba, như quảng cáo, analytics, báo cáo lỗi, hoặc thậm chí là CSS framework cần JavaScript để tạo hiệu ứng động. Tất cả các script bên thứ ba này đều là điểm tấn công tiềm ẩn.

Bạn có thể hotlink các JavaScript này từ domain khác hoặc tích hợp vào quá trình build để đóng gói thành một file duy nhất. Dù bằng cách nào, mã bên thứ ba vẫn có thể bị tấn công và làm ảnh hưởng đến ứng dụng của bạn.

Điều này không có nghĩa là bạn không nên dùng mã JavaScript bên thứ ba, chỉ cần lưu ý các rủi ro tiềm ẩn.

## Ảnh hưởng của extension trình duyệt

Liên quan đến XSS là việc người dùng có thể cài đặt nhiều extension trình duyệt, và các extension này cũng có quyền truy cập vào trang web.

Đây là vấn đề khó xử lý vì bạn không thể chắc chắn hoàn toàn mã nào đang chạy trong ứng dụng của mình.

Ngay cả khi bạn có Content Security Policy chặt chẽ và không load JavaScript bên ngoài, người dùng vẫn có thể tự ý thêm mã bằng extension.

Điều này có nghĩa là bất kỳ extension nào mà người dùng cài đặt cũng có thể truy cập dữ liệu của ứng dụng.

## Giới hạn về lưu trữ an toàn trên trình duyệt

Một hạn chế nghiêm trọng khác của trình duyệt là không có API lưu trữ an toàn thực sự.

Chúng ta đã biết không thể nhúng client secret vào app trình duyệt, nhưng ngay cả khi có, cũng không có nơi nào an toàn để lưu trữ.

Đây cũng là vấn đề khi lưu access token hoặc refresh token. Bất cứ nơi nào JavaScript có thể truy cập, nếu có lỗ hổng XSS, attacker cũng có thể truy cập.

JavaScript app chỉ có thể lưu trữ ở cookie, LocalStorage hoặc SessionStorage. Nếu JavaScript đọc được, attacker cũng có thể đọc được.

## Chính sách OAuth dành riêng cho SPA

Mặc dù có nhiều rủi ro về bảo mật, điều này không có nghĩa là bạn không nên phát triển SPA.

Tuy nhiên, bạn cần nhận thức rõ các rủi ro này để đưa ra quyết định phù hợp khi xây dựng ứng dụng.

Vì các rủi ro cố hữu của môi trường trình duyệt, các OAuth server thường có chính sách khác biệt cho SPA so với các loại app khác. Ví dụ, refresh token có thể bị vô hiệu hóa hoàn toàn hoặc chỉ dùng một lần.

Thời gian sống của token cũng có thể ngắn hơn để giảm rủi ro khi token bị lộ. Đây là các công cụ mà server sử dụng để giảm thiểu rủi ro khi app chạy trên trình duyệt.

## Kết luận

Trong các bài học tiếp theo, chúng ta sẽ tìm hiểu cách thực hiện OAuth flow từ JavaScript, cũng như các công cụ để bảo vệ token trong trình duyệt.

Chúng ta cũng sẽ thảo luận về lựa chọn giữ access token ngoài trình duyệt hoàn toàn.
