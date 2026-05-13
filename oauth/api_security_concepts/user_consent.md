# Sự đồng ý của người dùng (User Consent) trong OAuth

Một trong những mục tiêu của OAuth là bảo vệ dữ liệu của người dùng và đảm bảo rằng dữ liệu chỉ được chia sẻ với các bên mà người dùng thực sự muốn.

Bạn có thể nhớ lần gần nhất khi nhấn nút “Đăng nhập với Twitter”, bạn sẽ thấy một màn hình hỏi bạn có chắc chắn muốn chia sẻ thông tin của mình không. Màn hình này được gọi là **consent screen** (màn hình xin phép), vì nó yêu cầu người dùng xác nhận quyền truy cập.

Trong bài này, chúng ta sẽ tìm hiểu vì sao màn hình này lại quan trọng trong luồng xác thực, giúp Authorization Server thực hiện đúng vai trò bảo vệ người dùng và lý do tại sao bước này lại cần thiết.

## Điều gì xảy ra nếu không có màn hình đồng ý?

Nếu bạn đọc qua đặc tả OAuth, bạn sẽ thấy đề cập đến **password grant** (hay còn gọi là resource owner password flow).

Với flow này, ứng dụng sẽ hiển thị một ô nhập mật khẩu ngay trong app, thu thập mật khẩu của người dùng rồi gửi lên Authorization Server để lấy access token. Yêu cầu này chỉ là một POST đơn giản chứa username, password, client và (nếu có) client secret.

Hãy dừng lại và suy nghĩ: Người dùng đang giao mật khẩu cho ứng dụng, và ứng dụng sẽ dùng nó để lấy access token từ Authorization Server.

Trước đây, nhiều ứng dụng bên thứ ba từng yêu cầu bạn nhập mật khẩu Gmail trực tiếp vào app của họ. Điều này rất nguy hiểm, vì người dùng đã giao mật khẩu cho một app do bên khác kiểm soát.

Đây là lý do đặc tả OAuth luôn khuyến cáo KHÔNG cho phép bên thứ ba dùng password grant.

Thậm chí, ngay cả với ứng dụng “chính chủ” (first party), password grant cũng có nhiều vấn đề. Từ góc nhìn của Authorization Server, khi nhận được password grant, server chỉ biết ứng dụng đang gửi thông tin đăng nhập, chứ không biết chắc người dùng có thực sự đang thao tác hay không, hoặc app có lưu lại mật khẩu để dùng lại sau này không.

Ngoài ra, Authorization Server cũng không thể chắc chắn người dùng đồng ý với phạm vi truy cập mà app yêu cầu. App có thể nói chỉ đọc ảnh, nhưng khi có mật khẩu, nó có thể xin token để sửa/xóa ảnh mà người dùng không biết.

Điều còn thiếu ở đây là xác nhận người dùng thực sự đang ở trước máy tính và đồng ý với yêu cầu truy cập vào thời điểm đó.

## Vai trò của Authorization Server và màn hình đồng ý

Đây chính là lý do Authorization Server được đưa vào luồng xác thực.

Ứng dụng sẽ chuyển hướng người dùng sang Authorization Server. Người dùng nhập mật khẩu trực tiếp tại đây, xem và xác nhận quyền truy cập trên màn hình đồng ý, rồi mới được chuyển về ứng dụng.

Như vậy, người dùng chỉ nhập mật khẩu vào Authorization Server, không phải vào app. Authorization Server biết chắc người dùng đang thực hiện thao tác và đồng ý với quyền truy cập. Ứng dụng không thể tự ý thực hiện hành động khi không có mặt người dùng.

Ngoài ra, ứng dụng có thể yêu cầu các quyền truy cập cụ thể, và Authorization Server sẽ hiển thị rõ cho người dùng xem trước khi đồng ý.

## Lợi ích về bảo mật và xác thực đa yếu tố (MFA)

Một vấn đề lớn khác của password grant là không hỗ trợ xác thực đa yếu tố (MFA). Flow này chỉ đơn giản là đổi mật khẩu lấy access token, không có chỗ để thêm bước xác thực bổ sung.

Nếu muốn thêm MFA vào password grant, bạn phải tự xây dựng cho từng ứng dụng, rất phức tạp và khó đồng bộ.

Ngược lại, khi dùng redirect flow (chuyển hướng người dùng sang Authorization Server), bạn có thể thêm bất kỳ phương thức MFA nào vào Authorization Server, và tất cả ứng dụng sử dụng server này sẽ tự động hỗ trợ MFA mà không cần sửa code.

Điều này cực kỳ hữu ích khi bạn quản lý nhiều ứng dụng hoặc đội nhóm khác nhau, vì chỉ cần cấu hình trên Authorization Server là đủ.

## Khi nào có thể bỏ qua bước đồng ý?

Thông thường, bước xin phép người dùng (consent) sẽ được bỏ qua với các ứng dụng **confidential client** thuộc sở hữu của chính bạn (first party). Ví dụ: người dùng đăng nhập vào web app chính thức của dịch vụ thì không cần hỏi lại quyền truy cập, vì không có rủi ro giả mạo.

Tuy nhiên, bước chuyển hướng sang Authorization Server vẫn rất quan trọng để đảm bảo bảo mật và hỗ trợ MFA. Bạn có thể cấu hình để tự động chuyển hướng về app mà không cần hiển thị màn hình đồng ý nếu muốn.

Nếu bạn phát triển mobile app hoặc SPA và lo ngại có thể bị giả mạo, bạn vẫn nên bật màn hình đồng ý cho cả ứng dụng của mình để tăng bảo mật, tránh việc người dùng bị lừa xác thực cho app giả mạo.

## Tóm tắt

-   Sử dụng redirect flow (chuyển hướng sang Authorization Server) an toàn và linh hoạt hơn nhiều so với password grant.
-   Cho phép dễ dàng bổ sung xác thực đa yếu tố (MFA) cho tất cả ứng dụng.
-   Đảm bảo người dùng thực sự đồng ý với quyền truy cập mà ứng dụng yêu cầu.
-   Có thể bỏ qua bước đồng ý với ứng dụng confidential client chính chủ, nhưng vẫn nên cân nhắc bật lại nếu lo ngại rủi ro giả mạo.
