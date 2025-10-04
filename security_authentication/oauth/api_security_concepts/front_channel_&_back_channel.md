[Về root](../README.md)

# Mục lục

-   [Kênh trước (Front Channel) và kênh sau (Back Channel)](#kênh-trước-front-channel-và-kênh-sau-back-channel)
    -   [Kênh sau (Back Channel)](#kênh-sau-back-channel)
    -   [Kênh trước (Front Channel)](#kênh-trước-front-channel)
    -   [So sánh và ứng dụng trong OAuth](#so-sánh-và-ứng-dụng-trong-oauth)
    -   [Lưu ý về kênh sau trong ứng dụng JavaScript](#lưu-ý-về-kênh-sau-trong-ứng-dụng-javascript)
    -   [Kết luận](#kết-luận)

# Kênh trước (Front Channel) và kênh sau (Back Channel)

Trước khi đi sâu vào cách một luồng OAuth an toàn hoạt động, tôi muốn giới thiệu khái niệm về **kênh trước** (front channel) và **kênh sau** (back channel).

Các thuật ngữ này mô tả hai cách khác nhau mà dữ liệu di chuyển giữa các hệ thống.

## Kênh sau (Back Channel)

Kênh sau là cách "bình thường" hoặc cách an toàn.

Đây là kết nối client-to-server.

Có rất nhiều thuộc tính của một kết nối kênh sau mà chúng ta thường xem là hiển nhiên. Nó sử dụng HTTPS, vì vậy chúng ta biết server mà mình đang giao tiếp nhờ xác thực chứng chỉ. Khi kết nối được thiết lập, dữ liệu sẽ được mã hóa trong quá trình truyền, đảm bảo không ai có thể chỉnh sửa nó.

Điều này cũng có nghĩa là phản hồi bạn nhận được có thể tin tưởng, vì bạn biết nó đến từ đâu và không bị thay đổi.

Tôi thích ví điều này như việc tự tay giao một gói hàng.

Bạn có thể đến gặp ai đó và trao tận tay họ một gói hàng.

Bạn có thể nhìn thấy họ là ai. Họ cũng thấy bạn là ai.

Bạn có thể chắc chắn không ai lấy cắp gói hàng vì bạn đã trao trực tiếp.

Đây là một cơ chế giao nhận rất hữu ích và nên sử dụng bất cứ khi nào có thể.

## Kênh trước (Front Channel)

Cách khác để dữ liệu di chuyển trong OAuth là kênh trước.

Gửi dữ liệu qua kênh trước nghĩa là sử dụng thanh địa chỉ của trình duyệt người dùng để chuyển dữ liệu giữa hai hệ thống.

Tôi ví thanh địa chỉ trình duyệt như một dịch vụ giao hàng thay vì tự tay giao gói hàng.

Bạn đóng gói thông điệp, đưa cho công ty giao hàng và họ sẽ chuyển thông điệp cho bạn. Không có liên kết trực tiếp giữa người gửi và người nhận, giống như không có liên kết trực tiếp giữa ứng dụng và OAuth server khi dùng kênh trước.

Có một số vấn đề khá nghiêm trọng với việc sử dụng kênh trước, điều này dễ hiểu nếu nghĩ về ví dụ giao hàng.

Khi gửi một gói hàng, bạn thường tin tưởng dịch vụ giao hàng sẽ chuyển đến nơi vì đó là công việc của họ và bạn trả tiền cho họ.

Nhưng với tư cách người gửi, bạn không bao giờ thực sự biết gói hàng đã đến chưa.

Bạn có thể có thông tin theo dõi, nhưng tất cả chỉ là công ty giao hàng xác nhận đã giao.

Và ngay cả khi gói hàng đến nơi, bạn cũng không chắc nó không bị mở ra hoặc bị sao chép, đánh cắp nội dung.

Vì vậy, dù bạn muốn tin tưởng dịch vụ giao hàng (hay trong OAuth là trình duyệt), bạn không thể chắc chắn hoàn toàn.

Tương tự, phía nhận dữ liệu qua kênh trước cũng gặp vấn đề. Khi nhận một gói hàng, có thể có địa chỉ người gửi, nhưng bạn không thể chắc chắn nó thực sự từ người đó vì rất dễ làm giả nhãn địa chỉ.

Điều này có nghĩa là bạn cũng không thể chắc chắn thứ mình nhận là hợp lệ.

## So sánh và ứng dụng trong OAuth

Quay lại với OAuth.

Trong OAuth, mục tiêu cuối cùng là ứng dụng nhận được access token từ OAuth server. Cách an toàn nhất là gửi qua kênh sau.

Nhưng như đã nói ở bài trước, chúng ta cũng muốn đảm bảo người dùng đã cho phép cấp access token cho ứng dụng.

Dù password grant sử dụng kênh sau, chúng ta không thể dùng nó vì không xác nhận được người dùng thực sự đồng ý.

Đó là lý do phải dùng kênh trước.

Kênh trước cho phép chèn người dùng vào quá trình thương lượng giữa client và authorization server. Nhờ đó, authorization server biết người dùng thực sự có mặt và đã cho phép.

Đồng thời, đây cũng là cách dễ dàng thêm xác thực đa yếu tố, vì chỉ authorization server cần xử lý.

Giả sử xây dựng một luồng OAuth:

-   Ứng dụng cần thông báo cho authorization server biết mình muốn làm gì. Đây là bước đầu tiên, là gói hàng đầu tiên được gửi đi.
-   Yêu cầu này gồm các thông tin như định danh ứng dụng, scope yêu cầu, v.v.
-   Thường gửi qua kênh trước vì không có thông tin nhạy cảm.

Ứng dụng sẽ redirect người dùng đến authorization server với các thông tin này trong query string của URL.

Sau khi người dùng đăng nhập và chấp thuận, authorization server sẽ gửi access token về ứng dụng và đưa người dùng trở lại ứng dụng.

Nếu access token được gửi lại qua redirect, tức là gửi access token qua đường bưu điện.

Authorization server không thể đảm bảo access token thực sự được chuyển về ứng dụng.

Ứng dụng cũng không thể chắc chắn access token thực sự từ authorization server.

Đây rõ ràng không phải lựa chọn tốt.

Tuy nhiên, phương pháp này thực sự được mô tả trong OAuth spec gốc, nhưng hiện không còn được khuyến nghị vì thiếu bảo mật.

Đây gọi là **Implicit flow**.

Implicit flow sử dụng kênh trước cho cả yêu cầu của ứng dụng lẫn việc gửi access token.

Không có kênh sau trong luồng này.

Nếu luồng này không an toàn, tại sao lại có trong OAuth?

Lý do là trước đây trình duyệt không có lựa chọn nào khác.

Như sẽ thấy ở phần sau, giải pháp là gửi access token qua kênh sau. Nhưng kênh sau là một request HTTPS từ client đến server. Nếu là ứng dụng JavaScript thuần, JavaScript cần khả năng gửi POST request đến OAuth server.

Trước đây, cross-origin request không khả thi cho đến khi trình duyệt hỗ trợ CORS (Cross Origin Resource Sharing).

Hiện nay, CORS đã phổ biến, nên không còn vấn đề gì khi dùng luồng bảo mật hơn, giữ access token ngoài kênh trước.

## Lưu ý về kênh sau trong ứng dụng JavaScript

Một điều cần làm rõ về kênh sau, đặc biệt trong ứng dụng JavaScript.

Kênh sau không có nghĩa là backend server.

Nó là kết nối client-to-server.

Vì vậy, ứng dụng JavaScript hoàn toàn có thể dùng kênh sau.

Nghĩa là JavaScript sẽ gửi request từ mã JavaScript, như AJAX hoặc Fetch.

Gửi request kênh sau từ JavaScript có các thuộc tính bảo mật giống như gửi từ backend server.

Bởi vì khi gửi request kênh sau từ JavaScript, bạn vẫn có xác thực chứng chỉ và kết nối mã hóa.

Điều này rất khác với gửi dữ liệu qua kênh trước, tức là dùng thanh địa chỉ để chuyển dữ liệu, nơi có nhiều khả năng bị lỗi hoặc bị chặn.

## Kết luận

Hiện tại, không cần đi sâu vào chi tiết của Implicit flow ngoài việc lưu ý rằng nó hoạt động bằng cách gửi access token qua kênh trước. Hướng dẫn mới nhất từ nhóm làm việc OAuth là loại bỏ Implicit flow bằng cách đưa vào Security BCP (Best Current Practice) khuyến nghị không sử dụng Implicit flow.

Bản cập nhật tương lai của OAuth spec sẽ loại bỏ hoàn toàn luồng này.

Giờ bạn đã hiểu sự khác biệt giữa kênh trước và kênh sau, cũng như các vấn đề bảo mật khi sử dụng từng phương pháp, bạn sẽ đánh giá tốt hơn các thuộc tính bảo mật của các luồng OAuth khác nhau.
