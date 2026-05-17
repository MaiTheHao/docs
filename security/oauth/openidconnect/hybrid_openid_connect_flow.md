[Về root](../README.md)

# Mục lục

-   [Giới thiệu về Hybrid Flows trong OpenID Connect](#giới-thiệu-về-hybrid-flows-trong-openid-connect)
-   [Các loại response_type trong OAuth và OpenID Connect](#các-loại-response_type-trong-oauth-và-openid-connect)
-   [Các chế độ hybrid trong OpenID Connect](#các-chế-độ-hybrid-trong-openid-connect)
-   [Lý do không nên sử dụng response_type chứa "token"](#lý-do-không-nên-sử-dụng-response_type-chứa-token)
-   [Phân tích response_type=code+id_token](#phân-tích-response_typecodeid_token)
-   [Vai trò của c_hash claim](#vai-trò-của-c_hash-claim)
-   [Lý do sử dụng response_type=code+id_token](#lý-do-sử-dụng-response_typecodeid_token)
-   [Bảo vệ chống tấn công authorization code injection](#bảo-vệ-chống-tấn-công-authorization-code-injection)
-   [Khuyến nghị sử dụng PKCE](#khuyến-nghị-sử-dụng-pkce)

---

# Giới thiệu về Hybrid Flows trong OpenID Connect

Trong bài học này, chúng ta sẽ nói về một số hybrid flows trong OpenID Connect.

Bạn sẽ thường thấy các tham chiếu đến hybrid flows, tức là sử dụng các kết hợp của response types.

# Các loại response_type trong OAuth và OpenID Connect

Trong OAuth thông thường, bạn sẽ sử dụng `response_type=code`, nghĩa là bạn chỉ muốn nhận authorization code trong response và sau đó sẽ lấy access token bằng authorization code đó. Ta cũng đã thấy việc sử dụng `response_type=id_token`, tức là bạn chỉ muốn nhận ID Token trong response và không cần access token.

# Các chế độ hybrid trong OpenID Connect

OpenID Connect cũng định nghĩa một số chế độ hybrid, về cơ bản là các kết hợp của response types. Ví dụ như `response_type=code+id_token` nghĩa là bạn muốn nhận ID Token qua front channel và authorization code để lấy access token qua back channel. Ngoài ra còn có các response types bao gồm `token`, sử dụng implicit flow của OAuth cũ.

# Lý do không nên sử dụng response_type chứa "token"

Mặc dù OpenID Connect cung cấp các công cụ để ngăn chặn tấn công access token injection, nhưng vẫn có nguy cơ rò rỉ access token qua front channel. Vì vậy, thông thường không khuyến nghị sử dụng bất kỳ response type nào chứa "token". Điều này cũng được đề cập trong các khuyến nghị bảo mật mới nhất của OAuth.

Nếu bỏ qua tất cả các combination response type có chứa token (vì chúng trả về access token qua front channel, điều này không an toàn), thì về cơ bản chỉ còn lại `response_type=code+id_token`.

# Phân tích response_type=code+id_token

Với response_type này, bạn sẽ nhận được ID Token và access token ở các bước khác nhau trong flow.

Nếu chỉ sử dụng `response_type=code` và vẫn yêu cầu ID token bằng scope "openid", bạn sẽ nhận được cả ID Token và access token khi trao đổi authorization code. Điều này thuận tiện vì bạn nhận được cả hai token trong cùng một bước và không cần lo lắng về việc xác thực JSON Web Token vì token đã được nhận qua kết nối tin cậy.

Còn với `response_type=code+id_token`, bạn sẽ nhận được cả ID Token và authorization code trong response. Trong redirect, bạn sẽ nhận được authorization code như trước, đồng thời nhận được ID Token.

Tuy nhiên, ID Token này được trả về qua front channel nên chưa được tin cậy. Do đó, bạn cần xác thực JSON Web Token và kiểm tra tất cả các claims.

# Vai trò của c_hash claim

Khi sử dụng `response_type=code_id_token`, ID Token sẽ bao gồm thêm một claim gọi là `c_hash`. Đây là hash của authorization code, dùng để xác thực rằng code không bị thay đổi trong response. Sau đó, bạn có thể dùng code này để đổi lấy access token.

# Lý do sử dụng response_type=code+id_token

Lý do sử dụng flow này là bạn có thể nhận được dữ liệu ID Token sớm hơn access token. Nếu vì lý do hiệu năng hoặc lý do khác mà bạn cần truy cập thông tin định danh người dùng trước khi lấy access token, đây là một lựa chọn. Tuy nhiên, bạn cần thực hiện nhiều bước xác thực ID Token hơn để đảm bảo an toàn.

# Bảo vệ chống tấn công authorization code injection

Một điểm quan trọng là ứng dụng có thể tự phát hiện tấn công authorization code injection nhờ claim `c_hash`. Nó cho phép client tự bảo vệ mình khỏi các tấn công này. Tuy nhiên, authorization server không thể đảm bảo rằng client đã thực hiện các kiểm tra này.

Nếu bạn xây dựng cả hai phía (server và client) và kiểm soát được toàn bộ code, bạn có thể chấp nhận điều này. Nhưng nếu server và client do các nhóm khác nhau phát triển, bạn nên có thêm xác nhận rằng client không bị tấn công code injection.

# Khuyến nghị sử dụng PKCE

Để tăng cường bảo vệ, PKCE cung cấp cơ chế chống tấn công authorization code injection từ phía OAuth server. Server sẽ chắc chắn rằng authorization code không bị chèn vì request sẽ bị từ chối nếu có vấn đề.

Khuyến nghị hiện nay là sử dụng PKCE ngay cả với OpenID Connect, lấy cả ID Token và access token bằng authorization code flow được bảo vệ bởi PKCE.

Điều này áp dụng cho cả confidential và public clients, dù có client secret hay không. Đây là cách đơn giản nhất cho client và cũng an toàn nhất. Lời khuyên chung là sử dụng PKCE với authorization code flow để lấy cả ID Token và access token.

Đây là lựa chọn an toàn nhất và ít tốn công sức nhất cho lập trình viên ứng dụng, đồng thời đảm bảo bảo mật ở phía authorization server thay vì phụ thuộc vào từng lập trình viên ứng dụng.
