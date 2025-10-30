# AdminLTE & Java Servlet & Thymeleaf

## Các Thư Viện Cần Thiết

Để triển khai, cần thêm các dependency sau vào file `pom.xml`:

-   `jakarta.servlet-api` _(hoặc `javax.servlet-api` tùy phiên bản Servlet)_
-   `thymeleaf`
-   `webjars-locator-core` _(Giúp Thymeleaf tìm đường dẫn chính xác đến tài nguyên trong WebJars)_
-   `admin-lte` _(WebJar của AdminLTE)_
-   `bootstrap` _(WebJar của Bootstrap)_
-   `jquery` _(WebJar của jQuery)_

> **WebJars** là cách đóng gói các thư viện frontend (như _AdminLTE_, _Bootstrap_, _jQuery_) thành các file `.jar`. Thay vì phải tải thủ công các file CSS/JS và đặt vào dự án, bạn chỉ cần khai báo chúng như một **dependency** trong file `pom.xml` của Maven.

---

## Quy Trình Tích Hợp

### **Bước 1: Cấu hình Thymeleaf trong Servlet**

Cần sử dụng **Servlet Context** để setup `ThymeleafEngine` tối ưu, sao cho đáp ứng flow:

-   Đọc các file HTML trong `/WEB-INF/templates/`
-   Xử lý cú pháp của Thymeleaf
-   Render ra HTML cuối cùng để trả về cho trình duyệt

---

### **Bước 2: Xây dựng Layout với Thymeleaf Fragments**

Mục tiêu của bước này là bóc tách các thành phần giao diện chung của AdminLTE (như menu trên cùng, thanh điều hướng bên trái, và chân trang) thành các file riêng biệt. Sau đó, chúng ta sẽ tạo một file "layout mẹ" để lắp ráp các mảnh này lại.

#### Tạo các file Fragment

Trong thư mục `/WEB-INF/templates/fragments/`, hãy tạo 3 file sau:

-   `fragments/header.html`: File này chứa toàn bộ phần <head> (meta, title, CSS) và phần <nav> (thanh menu ngang).

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
	<head th:fragment="header-css">
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>AdminLTE 3 | Dashboard</title>

		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback" />
		<link rel="stylesheet" th:href="@{/webjars/admin-lte/3.2.0/plugins/fontawesome-free/css/all.min.css}" />
		<link rel="stylesheet" th:href="@{/webjars/admin-lte/3.2.0/css/adminlte.min.css}" />
	</head>

	<body>
		<nav th:fragment="navbar" class="main-header navbar navbar-expand navbar-white navbar-light">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
				</li>
				<li class="nav-item d-none d-sm-inline-block">
					<a th:href="@{/}" class="nav-link">Home</a>
				</li>
			</ul>

			<ul class="navbar-nav ml-auto">
				<li class="nav-item">
					<a class="nav-link" data-widget="fullscreen" href="#" role="button">
						<i class="fas fa-expand-arrows-alt"></i>
					</a>
				</li>
			</ul>
		</nav>
	</body>
</html>
```

-   `fragments/sidebar.html`: File này chỉ chứa thẻ <aside> định nghĩa toàn bộ menu bên trái.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
	<body>
		<aside th:fragment="sidebar" class="main-sidebar sidebar-dark-primary elevation-4">
			<a href="#" class="brand-link">
				<img th:src="@{/webjars/admin-lte/3.2.0/img/AdminLTELogo.png}" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8" />
				<span class="brand-text font-weight-light">AdminLTE 3</span>
			</a>

			<div class="sidebar">
				<div class="user-panel mt-3 pb-3 mb-3 d-flex">
					<div class="image">
						<img th:src="@{/webjars/admin-lte/3.2.0/img/user2-160x160.jpg}" class="img-circle elevation-2" alt="User Image" />
					</div>
					<div class="info">
						<a href="#" class="d-block">Your Name</a>
					</div>
				</div>

				<nav class="mt-2">
					<ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
						<li class="nav-item">
							<a th:href="@{/dashboard}" class="nav-link">
								<i class="nav-icon fas fa-tachometer-alt"></i>
								<p>Dashboard</p>
							</a>
						</li>
						<li class="nav-item">
							<a th:href="@{/users}" class="nav-link">
								<i class="nav-icon fas fa-users"></i>
								<p>Quản lý Người dùng</p>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</aside>
	</body>
</html>
```

-   `fragments/footer.html`: File này chứa phần chân trang và quan trọng hơn là nơi nạp các thư viện JavaScript.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
	<body>
		<footer th:fragment="footer" class="main-footer">
			<strong>Copyright &copy; 2024-2025 <a href="#">MyCompany</a>.</strong>
			All rights reserved.
			<div class="float-right d-none d-sm-inline-block"><b>Version</b> 1.0.0</div>
		</footer>

		<div th:fragment="footer-scripts">
			<script th:src="@{/webjars/admin-lte/3.2.0/plugins/jquery/jquery.min.js}"></script>
			<script th:src="@{/webjars/admin-lte/3.2.0/plugins/bootstrap/js/bootstrap.bundle.min.js}"></script>
			<script th:src="@{/webjars/admin-lte/3.2.0/js/adminlte.min.js}"></script>
		</div>
	</body>
</html>
```

#### 2.2. Tạo file Layout chính (layout.html)

Đây là file "xương sống", chịu trách nhiệm lắp ráp các fragments đã tạo ở trên. Hãy tạo file layout.html trong thư mục /WEB-INF/templates/.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" th:fragment="layout(content)">
	<head th:replace="~{fragments/header :: header-css}"></head>

	<body class="hold-transition sidebar-mini layout-fixed">
		<div class="wrapper">
			<div th:replace="~{fragments/header :: navbar}"></div>

			<div th:replace="~{fragments/sidebar :: sidebar}"></div>

			<div class="content-wrapper">
				<section class="content">
					<div class="container-fluid">
						<div th:replace="${content}"></div>
					</div>
				</section>
			</div>

			<div th:replace="~{fragments/footer :: footer}"></div>
		</div>
		<div th:replace="~{fragments/footer :: footer-scripts}"></div>
	</body>
</html>
```

#### 2.3. Áp dụng Layout cho trang dashboard.html

Bây giờ, hãy chỉnh sửa file dashboard.html để nó "kế thừa" từ layout.html bạn vừa tạo.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" th:replace="~{layout :: layout(~{::section})}">
	<body>
		<section>
			<div class="content-header">
				<div class="container-fluid">
					<div class="row mb-2">
						<div class="col-sm-6">
							<h1 class="m-0">Dashboard</h1>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-3 col-6">
					<div class="small-box bg-info">
						<div class="inner">
							<h3>150</h3>
							<p>New Orders</p>
						</div>
						<div class="icon"><i class="ion ion-bag"></i></div>
						<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
					</div>
				</div>
			</div>
		</section>
	</body>
</html>
```
