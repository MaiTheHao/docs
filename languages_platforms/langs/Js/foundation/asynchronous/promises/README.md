# Promise functions

1. **Giới thiệu về Promise**

Trong JavaScript, khi thực hiện các tác vụ bất đồng bộ (_asynchronous tasks_), như việc gọi API, đọc file, hoặc xử lý sự kiện mạng, chương trình thường sẽ không chờ đợi các tác vụ này hoàn thành trước khi tiếp tục thực thi các câu lệnh tiếp theo. Điều này có thể gây ra vấn đề khó theo dõi khi làm việc với nhiều tác vụ bất đồng bộ lồng nhau. Chính vì vậy, Promise ra đời để giải quyết vấn đề này, giúp việc xử lý các tác vụ bất đồng bộ trở nên dễ dàng và trực quan hơn.

_Promise_ là một đối tượng đại diện cho kết quả của một tác vụ bất đồng bộ sẽ có trong tương lai. Nó có thể ở một trong ba trạng thái:

-   **Pending** (_Đang chờ_): Trạng thái ban đầu, khi Promise chưa được giải quyết.
-   **Fulfilled** (_Hoàn thành_): Trạng thái khi Promise hoàn thành thành công.
-   **Rejected** (_Từ chối_): Trạng thái khi có lỗi xảy ra trong quá trình thực thi.
    Khi một Promise đã được giải quyết (fulfilled hoặc rejected), bạn có thể sử dụng các phương thức như then(), catch() để xử lý kết quả hoặc lỗi.

2. _Cấu trúc của Promise_
   Một Promise được tạo ra thông qua cú pháp:

```Javascript
let promise = new Promise(function(resolve, reject) {
  // Mô phỏng việc fetch dữ liệu từ database
  setTimeout(() => {
    const status = Math.random() > 0.5;  // Mô phỏng tác vụ với xác suất thành công 50%

    if (status) {
      resolve("Dữ liệu lấy thành công!");  // Gọi resolve khi thành công
    } else {
      reject("Có lỗi xảy ra khi lấy dữ liệu!");  // Gọi reject khi có lỗi
    }
  }, 2000);  // Giả lập tác vụ tốn 2 giây
});
```

-   **resolve:** Hàm này được gọi khi tác vụ bất đồng bộ hoàn thành thành công và trả về kết quả.
-   **reject:** Hàm này được gọi khi có lỗi xảy ra trong quá trình thực thi.

---

# Các phương thức cơ bản của Promise

#### 1. **then()**

Phương thức `then()` được sử dụng để chỉ định hàm callback sẽ được gọi khi Promise hoàn thành thành công (_fulfilled_). Nó nhận hai tham số:

-   Tham số 1 (_resolve_Handler_): Hàm sẽ được gọi khi Promise được giải quyết thành công.
-   Tham số 2 (_reject_Handler_): Hàm sẽ được gọi khi Promise bị lỗi (tuy nhiên, tham số này là tùy chọn).

```Javascript
promise.then(resolveHandler, rejectHandler);
```

Ví dụ sử dụng `then()`:

```Javascript
let promise = new Promise(function(resolve, reject) {
  let success = true;
  if(success) {
    resolve("Tác vụ thành công!");
  } else {
    reject("Có lỗi xảy ra!");
  }
});

promise.then(function(result) {
  console.log(result);  // In ra "Tác vụ thành công!"
}).catch(function(error) {
  console.log(error);  // Nếu có lỗi xảy ra, in ra lỗi
});
```

Trong ví dụ trên:

-   `then()` được gọi khi Promise thành công, và kết quả được hiển thị qua `console.log()`.
-   Nếu có lỗi xảy ra, phương thức `catch()` sẽ được gọi.

#### 2. **catch()**

Phương thức `catch()` được sử dụng để bắt lỗi khi Promise bị từ chối (rejected). Nó nhận một tham số là hàm callback, sẽ được gọi khi có lỗi xảy ra trong quá trình thực thi.

```Javascript
promise.catch((error) => {
  console.log("Lỗi:", error);
});
```

#### 3. **finally()**

Phương thức `finally()` được gọi khi một Promise hoàn thành, dù cho kết quả là thành công hay lỗi. Nó thường được sử dụng để thực hiện các tác vụ dọn dẹp hoặc kết thúc, chẳng hạn như đóng kết nối hoặc ẩn các thông báo tải.

```Javascript
new Promise((resolve, reject) => {
  setTimeout(() => {
    const status = Math.random() > 0.5;
    if (status) {
      resolve("Tác vụ hoàn thành!");
    } else {
      reject("Có lỗi xảy ra!");
    }
  }, 2000);
}).then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
}).finally(() => {
  console.log("Kết thúc tác vụ!");
});
```

#### 4. **Promise.all()**

`Promise.all()` là một phương thức đặc biệt cho phép bạn xử lý nhiều Promise đồng thời. Nó nhận vào một mảng các Promise và trả về một Promise mới, khi tất cả các Promise trong mảng đều hoàn thành thành công, hoặc khi bất kỳ một Promise nào bị từ chối.

```Javascript
Promise.all([promise1, promise2, promise3])
  .then(function(results) {
    console.log("Tất cả các tác vụ đều thành công:", results);
  })
  .catch(function(error) {
    console.log("Có lỗi xảy ra:", error);
  });
```

**Lưu ý:** Nếu một Promise trong mảng bị từ chối, `catch()` sẽ được gọi ngay lập tức.

```javascript
let promise1 = new Promise((resolve) => setTimeout(resolve, 1000, 'Tác vụ 1 hoàn thành'));
let promise2 = new Promise((resolve) => setTimeout(resolve, 2000, 'Tác vụ 2 hoàn thành'));

Promise.all([promise1, promise2]).then((results) => {
	console.log(results); // ["Tác vụ 1 hoàn thành", "Tác vụ 2 hoàn thành"]
});
```

#### 5. _Promise.race()_

`Promise.race()` là một phương thức xử lý nhiều Promise song song, với đặc điểm:

-   Trả về một Promise mới chứa kết quả của Promise **đầu tiên** hoàn thành
-   "Hoàn thành" ở đây có thể là thành công (_fulfilled_) hoặc thất bại (_rejected_)
-   Không quan tâm đến kết quả của các Promise còn lại
-   Tên "race" (đua) phản ánh việc các Promise "đua" nhau để về đích đầu tiên

```javascript
Promise.race([promise1, promise2])
	.then(function (result) {
		console.log('Promise đầu tiên hoàn thành tốt đẹp:', result);
	})
	.catch(function (error) {
		console.log('Lỗi nè:', error);
	});
```

---

## Sử dụng async/await với Promise

Cú pháp async/await là một phần mở rộng của Promise, giúp xử lý các tác vụ bất đồng bộ một cách dễ dàng và dễ đọc hơn.

#### 1. **async/await**

-   **async:** Biến một hàm trở thành bất đồng bộ, cho phép sử dụng await bên trong hàm đó.
-   **await:** Dừng lại và chờ Promise hoàn thành trước khi tiếp tục thực thi.

Ví dụ sử dụng `async/await`:

```javascript
async function fetchData() {
	let promise = new Promise(function (resolve, reject) {
		setTimeout(() => resolve('Dữ liệu lấy thành công mỹ mãn!'), 2000);
	});

	let result = await promise; // Chờ Promise hoàn thành
	console.log(result); // In ra "Dữ liệu lấy thành công mỹ mãn!"
}

fetchData();
```

Trong ví dụ trên: `await` giúp chờ đợi kết quả của Promise mà không làm gián đoạn chương trình, giúp mã trở nên dễ đọc hơn.

---

## Lợi ích và nhược điểm của Promise

#### **Lợi ích:**

-   **Xử lý bất đồng bộ dễ dàng:** Promise cung cấp một cách rõ ràng để xử lý kết quả của các tác vụ bất đồng bộ mà không làm gián đoạn luồng chương trình.
-   **Tránh callback hell:** So với việc sử dụng callback lồng nhau, Promise giúp mã trở nên dễ đọc và dễ bảo trì hơn.
-   **Quản lý lỗi dễ dàng:** Promise có phương thức `catch()` giúp dễ dàng xử lý lỗi mà không phải sử dụng nhiều tầng callback.

#### **Nhược điểm:**

-   **Chưa được hỗ trợ ở một số môi trường cũ:** Các môi trường JavaScript cũ có thể không hỗ trợ đầy đủ Promise, đặc biệt là những phiên bản trước ES6.
-   **Khó quản lý khi có nhiều Promise:** Mặc dù `Promise.all()` giúp xử lý nhiều Promise, nhưng khi cần kết hợp nhiều Promise với điều kiện phức tạp, mã vẫn có thể trở nên khó hiểu và dễ mắc lỗi.
