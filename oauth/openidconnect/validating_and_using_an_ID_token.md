[Về root](../README.md)

# Mục lục

-   [Giới thiệu](#giới-thiệu)
-   [Tại sao cần xác thực ID Token?](#tại-sao-cần-xác-thực-id-token)
-   [Các bước xác thực ID Token](#các-bước-xác-thực-id-token)
    -   [1. Xác thực chữ ký của JSON Web Token](#1-xác-thực-chữ-ký-của-json-web-token)
    -   [2. Kiểm tra các claims quan trọng](#2-kiểm-tra-các-claims-quan-trọng)
-   [Sử dụng các thông tin trong ID Token](#sử-dụng-các-thông-tin-trong-id-token)
-   [Lưu ý về các luồng xác thực khác nhau](#lưu-ý-về-các-luồng-xác-thực-khác-nhau)
-   [Khi nào cần xác thực lại ID Token?](#khi-nào-cần-xác-thực-lại-id-token)
-   [Kết luận](#kết-luận)

---

# Giới thiệu

Trong bài học này, chúng ta sẽ tìm hiểu cách xác thực và sử dụng một ID Token.

# Tại sao cần xác thực ID Token?

Khi bạn nhận được một ID Token từ OAuth server, việc xác thực nó là vô cùng quan trọng, đặc biệt nếu bạn nhận được ID Token qua front channel bằng implicit hoặc hybrid flows. Bất kỳ ai cũng có thể gửi một request giống hệt request hợp lệ nhưng chứa một ID Token giả mạo. Nếu ứng dụng của bạn có endpoint trên Internet, ai đó có thể gửi một ID Token vào ứng dụng và cố gắng đăng nhập với một ID Token không hợp lệ. Vì vậy, khi nhận được một request với ID Token mà bạn nghĩ là do mình khởi tạo, bạn cần xác thực request đó.

# Các bước xác thực ID Token

Có một số bước cần thực hiện để xác thực ID Token:

## 1. Xác thực chữ ký của JSON Web Token

-   Đầu tiên, bạn cần xác thực chữ ký của JSON Web Token để đảm bảo nội dung bên trong không bị thay đổi.
-   Để xác thực chữ ký, bạn phải biết key nào được sử dụng. Một số OpenID Connect server sẽ cung cấp key trong tài liệu hoặc bạn có thể lấy trước đó bằng cách khác.
-   Nếu server hỗ trợ nhiều key hoặc key luân phiên, header của ID Token sẽ chứa identifier của key đã ký token.
-   Thông thường, bạn sẽ sử dụng thư viện JSON Web Token để xác thực chữ ký vì đây là công việc liên quan đến mã hóa và bạn không nên tự viết code mã hóa.
-   Bạn cần kiểm tra thuật toán ký có đúng như mong đợi không, sau đó dùng thư viện để xác thực chữ ký.

## 2. Kiểm tra các claims quan trọng

Sau khi xác thực chữ ký, bạn cần kiểm tra các claims bên trong ID Token:

-   **Issuer**: Đảm bảo ID Token đến từ server mà bạn mong đợi.
-   **Audience**: Phải khớp với client ID của ứng dụng bạn. Điều này đảm bảo ứng dụng không nhận ID Token cấp cho ứng dụng khác.
-   **Issued at** và **Expires at**: Kiểm tra thời gian hiện tại nằm trong khoảng này để tránh nhận ID Token đã hết hạn.
-   **Nonce**: Đảm bảo giá trị nonce khớp với nonce bạn đã gửi trong request. Điều này giúp chống lại tấn công injection bằng cách xác nhận ID Token gắn với request gốc.

# Sử dụng các thông tin trong ID Token

Sau khi xác thực xong, bạn có thể tin tưởng các thông tin bên trong ID Token:

-   Sử dụng subject để lấy user ID.
-   Nếu có email hoặc tên user, bạn có thể sử dụng các thông tin này.
-   Có thể có các claims khác như **amr** (Authentication Method Reference) cho biết user đăng nhập bằng phương thức nào (mật khẩu, xác thực hai yếu tố, v.v).
-   Nếu ứng dụng yêu cầu user phải xác thực hai yếu tố, bạn có thể kiểm tra giá trị amr.
-   Có thể có claim về thời điểm user đăng nhập lần cuối vào authorization server. Nếu cần đảm bảo user vừa xác thực gần đây, bạn có thể kiểm tra timestamp này.

Việc xác thực các thông tin này tùy thuộc vào yêu cầu bảo mật của ứng dụng bạn, nhưng xác thực chữ ký và các claims cơ bản là bắt buộc.

# Lưu ý về các luồng xác thực khác nhau

Nếu bạn nhận ID Token qua back channel bằng authorization code flow, các bước xác thực này đã được thực hiện ở các phần khác của flow:

-   Bạn biết mình đã gửi request lấy ID Token vào thời điểm đó (POST request), nên không cần kiểm tra timestamps.
-   Không cần kiểm tra audience vì bạn đã gửi request với credentials của ứng dụng.
-   Không cần kiểm tra issuer vì bạn biết server mình đang giao tiếp.
-   Không cần kiểm tra chữ ký vì request được thực hiện qua HTTPS, đảm bảo ID Token không bị thay đổi.

Authorization code flow giúp đơn giản hóa các bước xác thực này.

# Khi nào cần xác thực lại ID Token?

Nếu bạn chỉ sử dụng ID Token một lần rồi loại bỏ, bạn không cần xác thực lại. Tuy nhiên, nếu ứng dụng lưu ID Token (ví dụ, trong cookie phía client) hoặc chuyển ID Token sang phần khác của ứng dụng (frontend/backend), bạn cần xác thực lại chữ ký và các claims mỗi lần sử dụng.

Bất cứ khi nào ứng dụng nhận ID Token từ bên ngoài, cần xác thực bằng thư viện JSON Web Token và kiểm tra tất cả claims. Nếu ID Token đến từ nguồn tin cậy (authorization server), bạn không cần xác thực lại.

# Kết luận

Việc xác thực ID Token là rất quan trọng để đảm bảo an toàn cho ứng dụng. Nếu bạn chỉ cần biết ai đăng nhập, lấy email hoặc tên user, bạn có thể sử dụng authorization code flow để nhận ID Token qua back channel một cách đơn giản và an toàn hơn.
