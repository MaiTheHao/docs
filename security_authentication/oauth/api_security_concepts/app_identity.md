[Về root](../README.md)

# Mục lục

-   [Khái niệm về danh tính ứng dụng](#khái-niệm-về-danh-tính-ứng-dụng)
-   [Tóm tắt các bước của Authorization Code flow](#tóm-tắt-các-bước-của-authorization-code-flow)
-   [Giải pháp cho ứng dụng không có client secret: PKCE](#giải-pháp-cho-ứng-dụng-không-có-client-secret-pkce)
-   [Vai trò của redirect URI trong danh tính ứng dụng](#vai-trò-của-redirect-uri-trong-danh-tính-ứng-dụng)
-   [Kết luận](#kết-luận)

---

## Khái niệm về danh tính ứng dụng

Khái niệm cuối cùng tôi muốn giới thiệu trước khi đi sâu vào chi tiết của một OAuth flow là ý tưởng về danh tính ứng dụng.

Các ứng dụng -- hay trong thuật ngữ OAuth, cụ thể hơn là client -- là một thực thể riêng biệt. Bạn sẽ thấy điều này khi đăng nhập vào một app và được trình bày với màn hình ủy quyền nói rằng "ứng dụng này muốn truy cập vào tài khoản của bạn".

Ứng dụng nào? Chính là ứng dụng này.

Và quan trọng là, bạn có thể cấp quyền truy cập khác nhau cho từng ứng dụng. Mỗi ứng dụng có một định danh riêng gọi là client ID, và ứng dụng sử dụng nó để xác định chính mình trong suốt quá trình OAuth flow.

Điều này liên quan chặt chẽ đến phần trước về client công khai và client bảo mật. Trong bài học đó, chúng ta đã tìm hiểu loại app nào có thể sử dụng client secret, thực chất là mật khẩu của ứng dụng.

Nếu không có mật khẩu, hoặc không có client secret, thì không có gì đảm bảo rằng ứng dụng sử dụng client ID thực sự là ứng dụng đó.

## Tóm tắt các bước của Authorization Code flow

Hãy cùng điểm qua các bước của Authorization Code flow.

Như đã thấy, đây là một cải tiến so với Implicit flow vì access token sẽ được gửi qua back channel.

Flow này bắt đầu khi ứng dụng xây dựng một URL để chuyển hướng trình duyệt của người dùng đến authorization server.

Trong URL này sẽ có nhiều tham số mô tả yêu cầu mà app đưa ra, như scope của request, redirect URI để báo cho authorization server biết nơi gửi người dùng quay lại, và cả client ID để xác định app nào đang thực hiện request này. App tạo liên kết này và chuyển hướng trình duyệt người dùng đến đó, đưa họ đến authorization server.

Người dùng đăng nhập tại authorization server, phê duyệt yêu cầu của app, và authorization server cần chuyển hướng họ quay lại app.

Lưu ý, các bước chuyển hướng này là các request qua front channel, nghĩa là lý tưởng thì không quan trọng nếu ai đó có thể chặn hoặc sửa đổi request.

Mọi thứ vẫn sẽ hoạt động tốt và an toàn.

Nếu server trả về access token trong bước chuyển hướng đó, thì giống như gửi access token qua thư, dễ bị tấn công. Thay vào đó, server sẽ gửi lại một thứ giống như phiếu giảm giá dùng một lần với thời hạn ngắn.

Phiếu này có thể đổi lấy access token, nhưng chỉ một lần và chỉ trong thời gian ngắn. Để sử dụng phiếu này, ứng dụng phải sử dụng back channel để đổi nó. Chúng ta gọi phiếu này là authorization code và OAuth server sẽ trả về nó trong redirect về ứng dụng.

Tuy nhiên, authorization code này có thể bị đánh cắp hoặc sao chép, nghĩa là server không thể chắc chắn ai đang đổi code đó là ứng dụng thật.

Chúng ta cần một cách xác minh.

Đó là lý do cần client secret.

Nhớ rằng, client secret giống như mật khẩu của ứng dụng.

Nếu ứng dụng đổi authorization code và chứng minh nó là ứng dụng thật bằng cách xác thực với mật khẩu, thì authorization server biết code đang được đổi bởi ứng dụng thật và không bị đánh cắp.

Điều này hoạt động vì ứng dụng sử dụng client secret để xác minh danh tính tại authorization server khi yêu cầu access token.

## Giải pháp cho ứng dụng không có client secret: PKCE

Nhưng nếu app không thể chứng minh danh tính thì sao?

Đó là trường hợp của mobile app hoặc single page app, không thể triển khai với client secret vì các loại ứng dụng này không có client secret.

Nếu họ cố sử dụng authorization code flow, OAuth server về cơ bản sẽ cho phép bất kỳ ứng dụng nào đánh cắp code đều có thể lấy access token.

Chúng ta cần một giải pháp, đó là PKCE (Proof Key for Code Exchange).

Chúng ta sẽ tìm hiểu chi tiết cơ chế này ở các phần tiếp theo.

Tóm tắt ở mức cao: Trước khi app gửi request đầu tiên để bắt đầu flow, nó tạo ra một secret duy nhất cho mỗi request.

Nó sử dụng secret này để bắt đầu flow, và lại sử dụng khi đổi authorization code. Điều này giúp authorization server biết rằng đối tượng đổi code là cùng một đối tượng đã bắt đầu flow, ngăn code bị sử dụng nếu bị đánh cắp. Tuy nhiên, điều này không xác thực danh tính app.

Nó chỉ đảm bảo authorization code chỉ được sử dụng bởi app đã bắt đầu flow. Nhưng nó không ngăn kẻ tấn công giả mạo ứng dụng không có client secret. OAuth flow được thực hiện với thông tin hoàn toàn công khai.

Nếu ai đó muốn, họ có thể bắt đầu OAuth flow với public client của app khác. Nếu họ đánh cắp authorization code, họ cũng có thể lấy access token.

## Vai trò của redirect URI trong danh tính ứng dụng

Điều này dẫn đến khía cạnh cuối cùng của danh tính ứng dụng: redirect URI, là địa chỉ của client nơi authorization server sẽ gửi người dùng quay lại sau khi đăng nhập.

Đó là nơi authorization code sẽ được gửi qua front channel.

Với web app và single page app, nó sẽ là một URL như https://example-app.com.

Với native app, mobile app hoặc desktop, có thể là custom URL scheme như myapp://redirect.

Có một sự khác biệt quan trọng giữa hai loại này, liên quan đến danh tính ứng dụng.

Các URL được coi là duy nhất toàn cầu.

Nếu tôi vận hành website example-app.com, không ai khác có thể vận hành website tại địa chỉ đó. Vì tôi đã đăng ký domain và sở hữu DNS entry cho nó, nhưng không có đăng ký toàn cầu cho custom URL scheme, nghĩa là dù app của tôi dùng scheme myapp://, bạn cũng có thể phát hành app dùng scheme đó.

Các nền tảng di động xử lý khác nhau nếu có hai app cùng xử lý một scheme, nhưng custom URL scheme không thể dùng để xác định danh tính ứng dụng.

Gần đây, các nền tảng di động cũng cho phép native app tiếp quản xử lý URL pattern cho các URL.

Trong trường hợp này, developer phải chứng minh họ kiểm soát domain thật. Apple và Google sẽ không cho bạn phát hành app dùng domain của tôi. Chỉ tôi mới có thể làm điều đó. Vì vậy, redirect URL của app -- nếu là HTTPS redirect URL -- là một phần của danh tính app.

Với mobile app và single page app không có client secret, đây là phần duy nhất của danh tính app mà chúng ta có thể dựa vào.

Nhưng ngay cả vậy, nó cũng không đáng tin cậy như client secret để xác minh danh tính app. Nó tốt hơn không có gì, nhưng vẫn có thể gặp vấn đề.

Thật không may, hiện chưa có giải pháp hoàn chỉnh cho mobile app và single page app.

Đây là cách tốt nhất hiện nay.

Có thể trong tương lai, các nền tảng di động sẽ bổ sung API mới để xác thực app từ app store.

Nhưng hiện tại, đây là lựa chọn duy nhất.

Điều này có nghĩa là nếu bạn không có client secret, nếu bạn xây dựng public client, bạn cần lưu ý hạn chế này khi quyết định các chính sách như thời gian sống của token và có nên bỏ qua màn hình xác nhận nội dung hay không.

Việc redirect URL là dấu hiệu duy nhất xác nhận danh tính app khi không có client secret càng làm cho việc đăng ký redirect URL tại server trở nên quan trọng.

Điều này đảm bảo authorization server chỉ chuyển hướng đến các URL đã đăng ký cho một client ID nhất định.

Chúng ta sẽ nói thêm về đăng ký và cách hoạt động ở phần tiếp theo.

## Kết luận

Như vậy, đó là tổng quan về danh tính ứng dụng.

Ở các phần tiếp theo, chúng ta sẽ xem xét chi tiết cách OAuth flow hoạt động từng bước và tìm hiểu kỹ hơn về PKCE.
