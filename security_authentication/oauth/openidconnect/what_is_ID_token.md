[Về root](../README.md)

# Mục lục

-   [Giới thiệu về OpenID Connect](#giới-thiệu-về-openid-connect)
-   [ID Token là gì?](#id-token-là-gì)
-   [Cấu trúc của ID Token](#cấu-trúc-của-id-token)
-   [Các thuộc tính phổ biến trong payload](#các-thuộc-tính-phổ-biến-trong-payload)
-   [Tóm tắt về ID Token](#tóm-tắt-về-id-token)

---

## Giới thiệu về OpenID Connect

Trong phần này, chúng ta sẽ tìm hiểu một chút về OpenID Connect, đủ để bắt đầu. Mặc dù khóa học này chủ yếu nói về OAuth, nhưng OpenID Connect có khá nhiều điểm giao nhau vì chúng thường được sử dụng cùng nhau.

OpenID Connect là một phần mở rộng của OAuth, vì vậy chúng thực sự có nhiều điểm chung. Tuy nhiên, OpenID Connect bổ sung thêm một số yếu tố.

Như đã đề cập trong phần giới thiệu, mục tiêu chính của OpenID Connect là truyền đạt thông tin về người dùng cho các ứng dụng.

Trong khi OAuth luôn liên quan đến việc ứng dụng truy cập API, thì OpenID Connect lại giúp ứng dụng biết thông tin về người dùng.

## ID Token là gì?

Điểm chính mà OpenID Connect bổ sung là ID Token.

ID Token là cách mà authorization server truyền đạt thông tin về người dùng vừa đăng nhập cho ứng dụng.

Vậy chính xác ID Token là gì?

ID Token luôn là JSON Web Token.

JSON Web Token là một định dạng token được sử dụng cho ID Token và đôi khi các OAuth server cũng sử dụng định dạng này cho access token.

Đối với access token, access token không có định dạng cụ thể trong spec. Access token có thể là bất cứ thứ gì.

Chúng ta sẽ nói về các loại access token khác nhau và ưu nhược điểm của chúng ở phần tiếp theo. Nhưng ID Token trong OpenID Connect thì luôn là JSON Web Token. Đó là quy định trong tiêu chuẩn.

Lý do là vì nó định nghĩa cách ứng dụng biết thông tin về người dùng.

## Cấu trúc của ID Token

Tóm tắt nhanh về ID Token:

-   Đó là một JSON Web Token, nghĩa là nó được chia thành ba phần:

    -   Header
    -   Payload
    -   Signature

-   Header chứa thông tin về token.
-   Payload chứa dữ liệu mà bạn quan tâm.
-   Signature là cách để xác thực token.

Ba phần này đều được mã hóa base64.

Hai phần đầu là JSON được mã hóa base64.

Signature chỉ là chữ ký được mã hóa base64.

Nếu bạn giải mã hai phần đầu bằng base64 decoder, bạn sẽ thấy chúng chỉ là JSON thuần.

Header sẽ nói về ID Token, bao gồm thuật toán được sử dụng và định danh của key đã ký token.

Payload (phần giữa) là dữ liệu mà bạn quan tâm, bao gồm định danh người dùng cũng như thông tin profile như tên hoặc email.

## Các thuộc tính phổ biến trong payload

Có một số thuộc tính khác trong payload, thường được đặt tên ngắn ba ký tự, ví dụ:

-   `iss`: viết tắt của issuer, là định danh của server phát hành token.
-   `aud`: viết tắt của audience, xác định token này dành cho ai (thường là client ID của ứng dụng).
-   `iat`: viết tắt của issued at, là thời điểm token được phát hành.
-   `exp`: thời điểm token hết hạn, sau thời điểm này token không còn hợp lệ.

Tùy vào từng server OAuth mà payload có thể có nhiều hoặc ít thuộc tính hơn.

Thuộc tính quan trọng nhất là `sub` (subject), là định danh người dùng.

Định danh người dùng không được quy định theo định dạng cụ thể nào, mỗi server có thể quyết định chuỗi này là gì. Có thể là chuỗi ký tự ngẫu nhiên, username hoặc email.

Ứng dụng không nên giả định về định dạng của định danh này.

Tuy nhiên, định danh này được đảm bảo là duy nhất cho mỗi người dùng và không có người dùng nào trùng định danh.

Bạn có thể sử dụng định danh này để xác định người dùng, lưu trữ trong backend và liên kết thông tin về người dùng trong ứng dụng.

## Tóm tắt về ID Token

Đó là tóm tắt nhanh về ID Token.

Trong các bài học tiếp theo, chúng ta sẽ nói về cách lấy ID Token cũng như cách xác thực chúng.
