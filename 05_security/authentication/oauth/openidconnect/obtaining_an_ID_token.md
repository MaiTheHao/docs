[Về root](../README.md)

# Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Lấy ID token cùng với access token](#lấy-id-token-cùng-với-access-token)
-   [Sử dụng scope "openid"](#sử-dụng-scope-openid)
-   [Nhận ID token qua back channel](#nhận-id-token-qua-back-channel)
-   [Nhận ID token qua front channel (Implicit flow)](#nhận-id-token-qua-front-channel-implicit-flow)
-   [Các scope bổ sung để lấy thông tin người dùng](#các-scope-bổ-sung-để-lấy-thông-tin-người-dùng)
-   [Lưu ý về bảo mật khi sử dụng front channel](#lưu-ý-về-bảo-mật-khi-sử-dụng-front-channel)

---

## Giới thiệu

Trong bài học này, chúng ta sẽ tìm hiểu cách một ứng dụng có thể lấy một ID token.

Ứng dụng thường muốn lấy cả access token và ID token.

Ứng dụng sẽ sử dụng access token để thực hiện các yêu cầu API và ID token để xác định người dùng.

## Lấy ID token cùng với access token

Nếu ứng dụng đã lấy access token bằng authorization code flow, cách dễ nhất để lấy thêm ID token là thêm scope "openid" vào request, và bạn sẽ nhận được cả ID token và access token.

## Sử dụng scope "openid"

Bạn chỉ cần thêm scope "openid" vào danh sách scope trong authorization request sử dụng authorization code flow (bao gồm response_type=code và các scope cần thiết để lấy access token).

Việc này sẽ thông báo cho OAuth server rằng bạn cũng muốn lấy ID token.

## Nhận ID token qua back channel

Người dùng đăng nhập như bình thường, ứng dụng nhận được authorization code tạm thời.

Khi ứng dụng trao đổi code này để lấy access token, nó cũng sẽ nhận được ID token trong cùng một response.

Response sẽ chứa các thuộc tính như access_token, expires_in và một thuộc tính mới là id_token.

Cách này rất đơn giản để lấy ID token cùng với access token. Một điểm mạnh của cách này là vì bạn lấy ID token qua back channel bằng cách trao đổi authorization code, bạn có thể bỏ qua việc xác thực chữ ký của ID token, vì bạn đã biết nguồn gốc của nó.

Bạn không cần xác thực chữ ký hoặc kiểm tra thời hạn, chỉ cần trích xuất dữ liệu cần thiết và sử dụng trực tiếp. Đây là cách đơn giản nhất và thậm chí không cần dùng thư viện JSON Web Token.

ID token là dữ liệu JSON được mã hóa Base64 và được ký.

Chữ ký chỉ quan trọng nếu bạn lấy ID token từ nguồn không tin cậy. Nếu lấy qua kết nối tin cậy (back channel, HTTPS), bạn không cần kiểm tra chữ ký vì không thể bị thay đổi.

## Nhận ID token qua front channel (Implicit flow)

Có một cách khác để lấy ID token là sử dụng flow khác.

Nếu thay vì response_type=code, bạn dùng response_type=id_token, điều này báo cho authorization server rằng bạn không muốn access token mà chỉ muốn ID token.

Ở chế độ này, response_type=id_token sẽ trả về ID token trong redirect thay vì authorization code.

Cách này giống với Implicit flow trong OAuth, trả về token mà không qua bước trung gian authorization code.

Tuy nhiên, các rủi ro của implicit flow trong OAuth vẫn tồn tại với OpenID Connect, nhưng OpenID Connect cung cấp công cụ để giải quyết.

Vấn đề của implicit flow là access token không có định dạng xác định, nên ứng dụng không thể xác thực access token nhận được qua front channel có thực sự dành cho nó không.

Với OpenID Connect, vì ID token luôn là JSON Web Token và có chữ ký, bạn có thể xác thực nguồn gốc của nó. Nếu dùng response_type=id_token và nhận ID token qua front channel, việc xác thực là cực kỳ quan trọng.

Chi tiết về xác thực sẽ được trình bày sau.

## Các scope bổ sung để lấy thông tin người dùng

Nếu chỉ thêm scope "openid" vào request, ID token nhận được sẽ chỉ chứa thông tin cơ bản như metadata về token (ngày hết hạn), subject hoặc user ID.

Nếu muốn lấy thêm thông tin như tên hoặc email người dùng, bạn cần thêm các scope mới vào request.

OpenID Connect định nghĩa nhiều scope về các phần khác nhau của profile người dùng mà ứng dụng có thể yêu cầu.

Ví dụ, muốn biết tên và ảnh đại diện người dùng, bạn có thể yêu cầu scope "profile".

Muốn biết email, dùng scope "email".

Các scope này sẽ thêm thông tin vào ID token.

Lưu ý, không phải tất cả OpenID Connect server đều đưa thông tin này vào ID token. Đôi khi, thông tin profile cần được lấy từ userinfo endpoint bằng access token. Điều này tùy thuộc vào server, nên hãy tham khảo tài liệu của server bạn sử dụng.

Các scope trong request là nhất quán và được định nghĩa trong spec.

## Lưu ý về bảo mật khi sử dụng front channel

Khi dùng implicit flow với OpenID Connect (response_type=id_token), dù có thể xác thực ID token bằng chữ ký và các claim, đó chỉ là một phần của vấn đề.

Phía authorization server, khi phát hành ID token, không có xác nhận nào rằng ứng dụng đã nhận được thành công. Server không thể kiểm tra việc này.

Tuy điều này không ảnh hưởng nhiều như với access token, vì ID token chỉ là thông tin về người dùng, nhưng nếu ID token chứa thông tin nhạy cảm hoặc cá nhân (ví dụ email), bạn không nên để ứng dụng nhận qua front channel, nơi không đảm bảo an toàn.

Trong trường hợp này, an toàn hơn là lấy thông tin qua back channel bằng authorization code flow.
