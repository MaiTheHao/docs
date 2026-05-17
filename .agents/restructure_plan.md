# Kế hoạch Tái cấu trúc Thư mục (Directory Restructuring Plan)

> [!NOTE]
> Tài liệu này ghi nhận quyết định kiến trúc và kế hoạch thực thi chi tiết cho việc tái cấu trúc cấu trúc thư mục của kho tài liệu cá nhân `doc`.

---

## 1. Tóm tắt Hiểu biết (Understanding Summary)

*   **Mục tiêu:** Tinh giản và hệ thống hóa thư mục gốc (root) của kho tài liệu cá nhân bằng cách gom 11 thư mục rời rạc hiện tại vào 5 nhóm chuyên môn chính (Domains).
*   **Lý do:** Giúp giao diện thư mục gốc gọn gàng hơn, dễ bao quát kiến thức và tạo luồng mở rộng chuyên nghiệp hơn khi thêm tài liệu mới trong tương lai.
*   **Đối tượng:** Phục vụ trực tiếp cho việc tra cứu, nghiên cứu và học tập cá nhân của lập trình viên (MaiTheHao).
*   **Ràng buộc:** 
    *   Giữ nguyên nội dung và tên các thư mục con bên trong khi di chuyển.
    *   Cập nhật chính xác mục lục ở `README.md` chính để tránh liên kết hỏng.
*   **Mục tiêu loại trừ (Non-goals):** Không tự động sửa các liên kết chéo bên trong các file tài liệu con vì chúng hầu như độc lập hoàn toàn.

---

## 2. Các Giả định (Assumptions)

1.  **Tính toàn vẹn (Integrity):** Sử dụng các công cụ của Git để đảm bảo giữ nguyên lịch sử commit (Git history) của các tài liệu.
2.  **Độ ổn định:** Các thư mục hệ thống như `.git/`, `.gitignore`, và cấu hình của agent `.agents/` sẽ được giữ nguyên hoàn toàn ở thư mục gốc.

---

## 3. Nhật ký Quyết định (Decision Log)

| Quyết định | Các phương án xem xét | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Gom nhóm ở thư mục gốc** | A. Theo Domain lớn<br>B. Theo Công nghệ/Ecosystem<br>C. Giữ nguyên gốc và tinh giản con | **Chọn A**: Đem lại cấu trúc tối giản và mạch lạc nhất cho thư mục gốc (giảm từ 11 xuống 5 thư mục chính). |
| **Phân chia thư mục Domain** | 1. 5 Domains chuyên sâu<br>2. 4 Domains gộp chung ngôn ngữ/backend | **Chọn 1**: Phân định rõ ràng giữa `programming_languages/` và `backend_development/`, phản ánh đúng tính chất kiến thức. |
| **Độ bao phủ sửa liên kết** | A. Quét tự động toàn bộ<br>B. Chỉ sửa `README.md` chính<br>C. Không sửa liên kết nào | **Chọn B**: Thực tế các tài liệu bên trong cô lập và ít liên kết chéo phức tạp, sửa `README.md` là tối ưu và an toàn nhất. |
| **Đặt tên thư mục Mạng máy tính**| A. `computer_networking/`<br>B. `networks/` | **Chọn A**: Tên chuyên nghiệp, chuẩn hóa tiếng Anh và mô tả đúng bản chất kiến thức. |
| **Phương thức di chuyển file** | 1. Sử dụng `git mv` (Khuyên dùng)<br>2. Sử dụng lệnh `mv` thông thường | **Chọn 1**: Giữ lại toàn bộ lịch sử commit trước đây của file tài liệu, giúp việc truy vết thay đổi dễ dàng. |

---

## 4. Thiết kế Chi tiết (Final Design)

### Sơ đồ Cấu trúc mới (New Directory Map)

```text
/home/maithehao/Workspace/projects/doc/
├── README.md                          # Mục lục chính (cập nhật liên kết)
├── .gitignore                         # Giữ nguyên
├── .agents/                           # Giữ nguyên
│
├── programming_languages/             # Domain 1: Ngôn ngữ lập trình
│   ├── java/                          
│   └── javascript/                    
│
├── backend_development/               # Domain 2: Phát triển Backend & Database
│   ├── java_servlet/                  
│   ├── spring_boot/                   
│   ├── hibernate_jpa/                 
│   └── n_plus_one_problem/            
│
├── security/                          # Domain 3: Bảo mật & Xác thực
│   ├── jwt/                           
│   └── oauth/                         
│
├── architecture/                      # Domain 4: Kiến trúc phần mềm
│   ├── design_patterns/               
│   └── project-structure-patterns/    
│
└── computer_networking/               # Domain 5: Mạng máy tính (đã đổi tên)
```

---

## 5. Kịch bản các bước thực thi (Execution Script)

### Bước 1: Khởi tạo các thư mục Domain cha
```bash
mkdir -p programming_languages backend_development security architecture
```

### Bước 2: Di chuyển các thư mục con bằng `git mv`
```bash
git mv java programming_languages/
git mv javascript programming_languages/
git mv java_servlet backend_development/
git mv spring_boot backend_development/
git mv hibernate_jpa backend_development/
git mv n_plus_one_problem backend_development/
git mv jwt security/
git mv oauth security/
git mv design_patterns architecture/
git mv project-structure-patterns architecture/
git mv networking computer_networking
```

### Bước 3: Cập nhật liên kết mục lục tại `README.md`
Cập nhật toàn bộ các mục liên kết chéo tại [README.md](file:///home/maithehao/Workspace/projects/doc/README.md) để tương thích với cấu trúc thư mục mới.
