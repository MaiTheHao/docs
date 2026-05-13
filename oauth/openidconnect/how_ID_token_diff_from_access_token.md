[Về root](../README.md)

# Mục lục

-   [Sự khác biệt giữa ID token và access token](#sự-khác-biệt-giữa-id-token-và-access-token)
    -   [Access token là gì?](#access-token-là-gì)
    -   [ID token là gì?](#id-token-là-gì)
    -   [Audience của các token](#audience-của-các-token)
    -   [Lưu ý về định dạng token](#lưu-ý-về-định-dạng-token)
    -   [Bài học tiếp theo](#bài-học-tiếp-theo)

# Sự khác biệt giữa ID token và access token

Trong bài học này, chúng ta sẽ nói về sự khác biệt giữa access token và ID token. Trước hết, ở mức độ tổng quan, đây là hai khái niệm hoàn toàn khác nhau.

Điều gây nhầm lẫn là nhiều server sử dụng cùng một định dạng cho cả ID token và access token, đó là JSON Web Token.

Vì vậy, khi bạn so sánh hai token này cạnh nhau, chúng sẽ trông rất giống nhau. Tuy nhiên, hãy nhớ rằng chúng hoàn toàn không giống nhau và phục vụ các mục đích rất khác nhau.

## Access token là gì?

Access token là thứ mà ứng dụng nhận được để có thể thực hiện các yêu cầu API tới một API. Ứng dụng sẽ lấy access token từ authorization server và sau đó gửi nó tới API để sử dụng khi gọi API.

Khi làm điều này, ứng dụng không cần (và KHÔNG ĐƯỢC) hiểu ý nghĩa của access token. Đây là một nguyên tắc thiết kế của OAuth: access token là opaque đối với ứng dụng. Nghĩa là ứng dụng không thể (và không nên) nhìn vào bên trong access token.

**Giải thích:**  
Từ "opaque" ở đây nghĩa là access token giống như một "hộp đen" đối với ứng dụng. Ứng dụng chỉ cần chuyển access token cho API mà không cần (và không nên) giải mã, phân tích hay sử dụng thông tin bên trong token đó. Việc xác thực và xử lý access token là trách nhiệm của API hoặc resource server, không phải của ứng dụng.

Hãy liên tưởng đến ví dụ về thẻ khóa khách sạn: khi bạn nhận thẻ từ quầy lễ tân, bạn không quan tâm bên trong thẻ có gì, chỉ cần nó mở được cửa là đủ.

## ID token là gì?

ID token lại hoàn toàn khác. ID token được thiết kế để ứng dụng đọc và xử lý. Nó giống như việc ứng dụng kiểm tra hộ chiếu của người dùng.

Ứng dụng sẽ kiểm tra chữ ký, xác thực các claims và lấy thông tin về người dùng từ ID token.

Dù đôi khi hai loại token này có cùng định dạng (JSON Web Token), ứng dụng không cần quan tâm access token có định dạng gì, chỉ nên coi nó là một chuỗi opaque.

## Audience của các token

Ứng dụng sẽ nhận access token từ authorization server, giữ nó và sử dụng khi gọi API.

Ứng dụng cũng sẽ nhận ID token từ authorization server, giải mã và lấy thông tin người dùng.

Hai loại token này có audience khác nhau. Nếu bạn kiểm tra bên trong JSON Web Token, sẽ thấy thuộc tính audience. Audience của ID token là ứng dụng (bên nhận và xử lý ID token). Audience của access token là API hoặc resource server (bên nhận và xử lý access token).

## Lưu ý về định dạng token

Không phải mọi OAuth server đều sử dụng JSON Web Token cho access token. Access token có thể ở định dạng hoàn toàn khác. Vì vậy, ứng dụng không nên giả định về định dạng của access token. Tuy nhiên, ID token luôn là JSON Web Token và ứng dụng cần biết cách xác thực nó để sử dụng.

## Bài học tiếp theo

Trong bài học tiếp theo, chúng ta sẽ tìm hiểu cách ứng dụng có thể yêu cầu ID token từ OAuth server.
