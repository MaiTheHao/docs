```
/root
├── /src
│   ├── /main
│   │   ├── /java
│   │   │   └── /com/example/controller  -> (Chứa các Servlet)
│   │   │   └── /com/example/model       -> (Chứa các đối tượng model)
│   │   │   └── /com/example/dao         -> (Chứa logic truy cập dữ liệu)
│   │   │   └── /com/example/util        -> (Các lớp tiện ích)
│   │   │
│   │   ├── /webapp
│   │   │   ├── /WEB-INF
│   │   │   │   ├── /templates               -> (Nơi chứa các file HTML của Thymeleaf)
│   │   │   │   │   ├── /fragments           -> (Các layout tái sử dụng)
│   │   │   │   │   │   ├── header.html
│   │   │   │   │   │   ├── sidebar.html
│   │   │   │   │   │   └── footer.html
│   │   │   │   │   │
│   │   │   │   │   ├── dashboard.html       -> (Trang chính)
│   │   │   │   │   └── users.html           -> (Trang quản lý người dùng)
│   │   │   │   │
│   │   │   │   └── web.xml                  -> (File cấu hình triển khai)
│   │   │   │
│   │   │   └── /static
│   │
│   └── /test
│
└── pom.xml
```
