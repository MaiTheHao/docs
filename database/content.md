TỔNG HỢP CHUYÊN SÂU: MVCC, INDEX
INTERNALS & BỐI CẢNH LỊCH SỬ CSDL
Tài liệu chuyên sâu phân tích chi tiết cơ chế MVCC, cấu trúc Index, Covering Index và Bối cảnh
lịch sử / Case study Uber Migration giữa PostgreSQL và MySQL (InnoDB).
1. TỔNG QUAN CHUYÊN SÂU VỀ MVCC
(MULTI-VERSION CONCURRENCY CONTROL)
1.1. Vấn đề của Concurrency Control truyền thống
Trong các hệ cơ sở dữ liệu truyền thống, cơ chế khóa (Lock-based Concurrency Control) sử
dụng Shared Lock (S-Lock) cho truy vấn Đọc và Exclusive Lock (X-Lock) cho truy vấn Ghi. Điều
này dẫn đến hiện tượng nghẽn cổ chai: "Reader blocks Writer, Writer blocks Reader".
MVCC ra đời để giải quyết triệt để vấn đề này bằng nguyên lý cốt lõi: "Readers never block
Writers, and Writers never block Readers".
1.2. Kiến trúc MVCC trong PostgreSQL (Append-Only / Heap Table)
PostgreSQL áp dụng mô hình Append-only trên bảng Heap. Dữ liệu cũ không bao giờ bị ghi
đè trực tiếp mà một phiên bản tuple mới (tuple version) sẽ được ghi thêm vào Heap Page.
Các cột ẩn hệ thống trong mỗi Tuple (Header Fields):
● xmin: Transaction ID (XID) của giao dịch đã tạo ra (INSERT/UPDATE) tuple này.
● xmax: Transaction ID (XID) của giao dịch đã xóa (DELETE) hoặc cập nhật (UPDATE)
tuple này. Nếu tuple chưa bị xóa, xmax = 0.
● cmin / cmax: Command Identifier (thứ tự câu lệnh bên trong cùng một Transaction).
● ctid: Con trỏ vị trí vật lý của tuple dưới dạng (Block_Number, Tuple_Index_In_Block).
Quy trình hoạt động của các thao tác DML:
● INSERT: Tạo tuple mới, ghi xmin = XID_hiện_tại, xmax = 0.
● DELETE: Không xóa vật lý. Đánh dấu xmax = XID_hiện_tại trên tuple bị xóa.
● UPDATE: Kết hợp DELETE + INSERT. Tuple cũ được gán xmax = XID_hiện_tại, đồng
thời tạo tuple mới với xmin = XID_hiện_tại. Con trỏ ctid của tuple cũ sẽ trỏ tới vị trí tuple
mới.
Tác động về hiệu năng & Hệ thống quản lý bộ nhớ:
● Table Bloat (Phình bảng): Khi ứng dụng thực hiện UPDATE/DELETE liên tục, các "Dead
Tuples" (tuple cũ không còn transaction nào nhìn thấy) tích tụ làm phình kích thước file

dữ liệu trên đĩa.
● Tiến trình AUTOVACUUM: Tiến trình chạy ngầm quét các Data Pages để dọn dẹp Dead
Tuples, cập nhật Free Space Map (FSM) để tái sử dụng không gian trống và Visibility
Map (VM) để phục vụ Index-Only Scan. Khi AUTOVACUUM chạy trên bảng lớn under
high-load, nó ngốn Disk I/O vô cùng lớn.
● Giải pháp HOT (Heap-Only Tuple): Nếu phiên bản tuple mới nằm vừa trong cùng một
Data Page với tuple cũ VÀ không có cột nào thuộc Secondary Index bị thay đổi, Postgres
sẽ không tạo entry mới trên Secondary Index mà chỉ nối con trỏ nội bộ trong Data Page.
Điều này giúp giảm đáng kể hiện tượng phình Index.
1.3. Kiến trúc MVCC trong MySQL InnoDB (Clustered Index + Undo
Log)
Khác hoàn toàn với Postgres, MySQL InnoDB lưu trữ dữ liệu theo cấu trúc Clustered Index
(B+Tree sắp xếp theo Primary Key). Dữ liệu được ghi đè tại chỗ (in-place) trên B+Tree, còn các
phiên bản dữ liệu cũ được đẩy vào vùng nhớ riêng gọi là Undo Log.
Các cột ẩn hệ thống trong mỗi Clustered Index Record:
● DB_TRX_ID (6 bytes): Transaction ID của giao dịch cuối cùng thay đổi dòng này.
● DB_ROLL_PTR (7 bytes): Con trỏ cuộn (Roll Pointer) trỏ tới bản ghi dữ liệu cũ tương ứng
nằm trong Undo Log Segment.
● DB_ROW_ID (6 bytes): Tự động sinh ra làm Primary Key ẩn nếu bảng không khai báo
Primary Key rõ ràng.
Cơ chế Read View & Undo Log Chain:
Khi một Transaction thực hiện câu lệnh SELECT, InnoDB tạo ra một Read View (chứa danh
sách các TRX_ID đang hoạt động). Nếu dòng hiện tại có DB_TRX_ID lớn hơn hoặc nằm trong
danh sách đang chạy, InnoDB sẽ theo con trỏ DB_ROLL_PTR lội ngược lại chuỗi Undo Log
(Undo Log Chain) để tái tạo lại phiên bản dữ liệu nhất quán tại thời điểm Transaction bắt đầu.
Dọn dẹp rác với Purge Threads:
Bảng chính của InnoDB luôn sạch sẽ vì dữ liệu mới luôn đè dữ liệu cũ. Khi các Transaction
hoàn tất, các Purge Threads ngầm sẽ giải phóng các Undo Log Segments cũ không còn ai
tham chiếu.
1.4. Bảng So Sánh Kiến Trúc MVCC
Tiêu chí PostgreSQL (Append-Only) MySQL InnoDB (In-place + Undo

Log)

Vị trí lưu tuple Nằm trực tiếp trong Heap Data Nằm ở vùng đệm riêng biệt (Undo

Tiêu chí PostgreSQL (Append-Only) MySQL InnoDB (In-place + Undo

Log)

cũ Page cùng tuple mới. Log Segment).
Cơ chế
UPDATE

Tạo Tuple mới hoàn toàn + Cập
nhật tất cả Secondary Indexes (trừ
khi đạt HOT).

Ghi đè in-place trên Clustered
Index + Đẩy bản cũ vào Undo Log.

Thao tác dọn
rác

AUTOVACUUM quét Data Page để
giải phóng Dead Tuples. Quá trình
này rất nặng I/O.

Purge Threads tự động xóa các
Undo Log Segment không còn
được dùng. Bảng chính không bị
bloat.

Secondary
Index Pointer

Lưu con trỏ vật lý ctid trỏ thẳng vào
Heap Page. Khi tuple đổi vị trí, con
trỏ hỏng.

Lưu giá trị Primary Key (Logical
Pointer). UPDATE cột không phải
PK không làm đổi Secondary Index.

Rollback
Transaction

Rất nhanh: Chỉ cần đổi trạng thái
Transaction thành ABORTED.
Tuple vẫn ở đó chờ VACUUM.

Lâu hơn: Phải đọc Undo Log để
khôi phục lại dữ liệu ban đầu trên
Clustered Index.

2. CHUYÊN SÂU VỀ INDEX INTERNALS & COVERING
INDEX
2.1. Cấu trúc dữ liệu B+Tree trong CSDL
Hầu hết các CSDL quan hệ sử dụng B+Tree làm cấu trúc chỉ mục tiêu chuẩn. Cấu trúc B+Tree
gồm 3 phần:
● Root Node (Nút gốc): Điểm điều hướng đầu tiên của truy vấn.
● Internal Nodes (Nút trung gian): Chỉ chứa Key và con trỏ điều hướng tới cấp tiếp theo.
Không chứa Data.
● Leaf Nodes (Nút lá): Chứa Key và dữ liệu thực tế (hoặc con trỏ tới dữ liệu). Các Leaf
Nodes được nối với nhau bằng danh sách liên kết đôi (Doubly Linked List), giúp việc truy
vấn khoảng (Range Scan) cực kỳ hiệu quả mà không cần duyệt lại từ Root.
2.2. Clustered Index vs Secondary Index (Non-Clustered)
Trong MySQL InnoDB:
● Clustered Index: Bảng chính CHÍNH LÀ Clustered Index. Leaf Node chứa toàn bộ dữ
liệu của tất cả các cột trong dòng.
● Secondary Index: Leaf Node của Secondary Index chỉ chứa (Index_Key,
Primary_Key_Value).
● Hành vi Lookup 2 lần (Bookmark Lookup / Secondary Index Search): Khi truy vấn
bằng Secondary Index, MySQL phải tìm trên Secondary Index để lấy `Primary_Key`, sau

đó dùng `Primary_Key` đó tra cứu lần 2 trên Clustered Index để lấy các cột còn lại.
Trong PostgreSQL:
● Dữ liệu nằm ở bảng Heap độc lập. Tất cả Index (chính hay phụ) đều có vai trò kỹ thuật
như nhau.
● Leaf Node của Index trong Postgres chứa (Index_Key, ctid). `ctid` chỉ thẳng tới vị trí Block
và Offset trong Heap Table.
2.3. Covering Index & Index-Only Scan
Covering Index là trạng thái tối ưu tuyệt đối của truy vấn, xảy ra khi CSDL lấy được toàn bộ dữ
liệu cần thiết ngay tại Leaf Node của Index mà không phải tốn chi phí Disk I/O để nhảy về bảng
chính (Heap Scan hoặc Clustered Index Lookup).
Công thức tổng quát để Trigger Covering Index:
SELECT_columns ∪ WHERE_columns ∪ ORDER_BY_columns ∪ GROUP_BY_columns
⊆ Index_columns
Kỹ thuật triển khai trên PostgreSQL (Từ khóa INCLUDE):
Từ Postgres 11, tính năng Covering Index với INCLUDE cho phép tách biệt rõ ràng giữa Key
dùng để tìm kiếm (B-Tree Key) và Payload mang theo:
CREATE INDEX idx_orders_user ON orders(user_id) INCLUDE (status, total_amount);
● user_id: Nằm ở các nút sắp xếp của B-Tree, dùng để định vị nhanh.
● status, total_amount: Chỉ nằm ở nút lá (Leaf Node) làm payload, không tốn tài nguyên so
sánh/sắp xếp B-Tree.
Điểm then chốt trong Postgres: Để kích hoạt Index-Only Scan, Postgres bắt buộc phải kiểm
tra Visibility Map (VM). Nếu Visibility Map xác nhận Data Page chứa tuple đó là ALL-VISIBLE
(tất cả tuple đã committed và không có dead tuple), Postgres mới bỏ qua việc đọc Heap Page.
Nếu Page chưa ALL-VISIBLE, Postgres vẫn bắt buộc phải đọc Heap Page để kiểm tra tính khả
kiến (`xmin`/`xmax`).
Kỹ thuật triển khai trên MySQL (Composite Index):
MySQL không có từ khóa `INCLUDE`, ta tạo Composite Index chứa tất cả các cột:
CREATE INDEX idx_orders_user_status_total ON orders(user_id, status, total_amount);
Khi chạy EXPLAIN, cột Extra xuất hiện từ khóa Using index. Điều này xác nhận MySQL đã loại
bỏ được bước Bookmark Lookup về Clustered Index.

3. BỐI CẢNH LỊCH SỬ & CÁC QUYẾT ĐỊNH KỸ THUẬT
KINH ĐIỂN
3.1. MySQL: Triết lý "Nhanh trước, Chuẩn sau" & Cuộc chiến thương
mại
● Bối cảnh ra đời (1995): Michael "Monty" Widenius phát triển MySQL nhằm phục vụ các
ứng dụng web sơ khai (Web 2.0). Bối cảnh phần cứng thời kỳ đó có CPU và RAM vô
cùng đắt đỏ, các website cần một CSDL đọc cực nhanh cho các câu lệnh `SELECT`.
● Thiết kế MyISAM: Ban đầu MySQL dùng MyISAM — không có Transaction, không
Foreign Key, không MVCC, dùng Table-level Locking. Điểm mạnh duy nhất: Đọc cực kỳ
nhanh và cực ít tốn RAM.
● Cú hích InnoDB: Khi các ứng dụng tài chính và TMĐT yêu cầu tính toàn vẹn dữ liệu
(ACID), Heikki Tuuri (người Phần Lan) đã tạo ra Storage Engine InnoDB (thuộc Innobase
Oy). Khác với MyISAM, InnoDB thiết kế chuẩn chỉnh với Row-level Locking, Clustered
Index và Undo Log MVCC. Năm 2005, Oracle mua lại Innobase Oy, và năm 2010 Oracle
thâu tóm nốt Sun Microsystems (đơn vị sở hữu MySQL).
● Sự ra đời của MariaDB: Do lo ngại Oracle sẽ độc quyền hoặc thu phí MySQL, Monty
Widenius đã tách (fork) mã nguồn MySQL tạo ra MariaDB. Tên gọi `My` là con gái đầu,
`Maria` là con gái thứ hai của ông.
3.2. PostgreSQL: Di sản học thuật Berkeley & Triết lý "Never
Overwrite"
● Bối cảnh ra đời (1986): Dự án POSTGRES (Post-Ingres) do Giáo sư Michael
Stonebraker khởi xướng tại Đại học California, Berkeley. Stonebraker sau này nhận giải
thưởng Turing (Nobel ngành Tin học).
● Triết lý "Never Overwrite": Stonebraker tin rằng bộ nhớ máy tính trong tương lai sẽ đủ
lớn và không bao giờ nên ghi đè lên dữ liệu cũ. Việc giữ lại phiên bản cũ ngay trong Heap
Table sẽ giúp CSDL hỗ trợ các truy vấn phân tích lịch sử (Time-travel queries) và giúp
phục hồi sự cố (Crash Recovery) tức thì mà không cần đọc lại log phức tạp.
● Hệ quả: Mô hình Append-Only của Postgres là một kiệt tác về mặt lý thuyết học thuật và
khả năng mở rộng kiểu dữ liệu (Extensibility), nhưng lại gánh chịu điểm yếu tự nhiên về
phình bảng (Bloat) khi đối mặt với các bài toán cập nhật dữ liệu với tần suất cao trong
thời đại Internet hiện đại.
3.3. Case Study Kinh Điển: Uber Migration từ Postgres sang MySQL
(2016)
Năm 2016, nhóm kỹ sư Uber đăng tải bài viết gây rúng động cộng đồng công nghệ: "Why Uber
Engineering Switched from Postgres to MySQL". Đây là ví dụ điển hình nhất về việc bối cảnh
nghiệp vụ va chạm với kiến trúc cốt lõi của CSDL.
Bài toán nghiệp vụ của Uber:

Dịch vụ Uber xử lý vị trí GPS của hàng triệu tài xế và hành khách. Vị trí di chuyển được cập
nhật liên tục từng giây. Bài toán mang đặc tính Write-Heavy / Update-Heavy cực độ.
4 Lý do chính Uber từ bỏ PostgreSQL để sang MySQL InnoDB:
1. Write Amplification (Khuếch đại ghi) trên Secondary Index:
Bảng dữ liệu của Uber có hàng chục Secondary Indexes để phục vụ tìm kiếm. Trong
Postgres, khi tọa độ tài xế thay đổi, một tuple mới được ghi vào Heap Page làm vị trí
`ctid` thay đổi. Postgres bắt buộc phải cập nhật địa chỉ `ctid` mới này lên TẤT CẢ các
Secondary Index của bảng đó! Thao tác này gây ra hiện tượng khuếch đại ghi gấp hàng
chục lần, đè bẹp hệ thống Disk I/O.
Trong MySQL InnoDB: Tọa độ UPDATE in-place trên Clustered Index. Vì Primary Key
không đổi, nên các Secondary Index hoàn toàn không bị ảnh hưởng hay phải ghi lại!
2. Table Bloat & AUTOVACUUM Nghẽn I/O:
Tần suất UPDATE khủng khiếp tạo ra hàng triệu Dead Tuples mỗi phút. Tiến trình
`AUTOVACUUM` của Postgres phải hoạt động liên tục để quét Data Pages. Điều này tạo
ra một vòng lặp tử thần: UPDATE làm nghẽn đĩa $\rightarrow$ AUTOVACUUM nhảy vào
dọn rác làm đĩa nghẽn hơn $\rightarrow$ Latency tăng vọt.
3. Kiến trúc Replication & Connection Model:
Postgres thời điểm đó sử dụng Physical Replication (ghi nhận sự thay đổi ở cấp độ Byte
trên WAL file). Khi xảy ra Bloat trên Master, toàn bộ dữ liệu phình đó bị đẩy qua mạng
sang các Slave Node, gây Replication Lag nghiêm trọng. Ngược lại, MySQL dùng Logical
Row-Based Replication gọn nhẹ hơn nhiều.
4. Giới hạn nâng cấp phiên bản (In-place Upgrade):
Nâng cấp phiên bản lớn (Major Version Upgrade) trên Postgres rất phức tạp do cấu trúc
dữ liệu trên đĩa thay đổi, đòi hỏi downtime dài hoặc tốn nhiều tài nguyên chuyển đổi,
trong khi MySQL hỗ trợ nâng cấp mượt mà hơn cho các cụm CSDL phân tán cỡ lớn.
TỔNG HỢP CHUYÊN SÂU:
TRANSACTION STATES (SINGLE-STATE
VS MVCC), MVCC INTERNALS, INDEX &
BỐI CẢNH LỊCH SỬ
Tài liệu phân tích toàn diện quá trình tiến hóa từ cơ chế khóa đơn Single-State / Single-Version
sang mô hình Multi-Version (MVCC), trạng thái Transaction (Transaction States) trong MySQL &
PostgreSQL, cấu trúc B+Tree Index và Case Study Uber Migration.
1. TIẾN HÓA CÁC TRẠNG THÁI TRANSACTION
(TRANSACTION STATES)
1.1. Kỷ nguyên Single-Version / Single-State (Trước khi có MVCC)
Trong các hệ CSDL sơ khai hoặc các Storage Engine đơn giản (như MySQL MyISAM hay cơ
chế Lock-based Concurrency Control chuẩn Strict 2PL - Two-Phase Locking), dữ liệu chỉ tồn tại
ở duy nhất 1 phiên bản vật lý (Single Version) trên đĩa.
Cơ chế hoạt động & Khóa (2PL):
● Mọi câu lệnh Đọc (READ) phải xin khóa chia sẻ (Shared Lock / S-Lock).
● Mọi câu lệnh Ghi (WRITE) phải xin khóa độc quyền (Exclusive Lock / X-Lock).
● Thao tác WRITE sẽ chặn tất cả READ/WRITE khác trên dòng/bảng đó (Reader blocks
Writer, Writer blocks Reader).
Các Transaction State trong mô hình Single-State:
Trạng thái (State) Mô tả chi tiết & Hành vi hệ thống
Active (Hoạt động) Trạng thái ban đầu khi giao dịch vừa bắt đầu thi hành các câu lệnh
(READ/WRITE). Giao dịch liên tục xin các Shared Lock hoặc
Exclusive Lock trên dữ liệu.

Partially Committed Xảy ra khi câu lệnh cuối cùng trong giao dịch đã thực thi xong, nhưng
các thay đổi vẫn nằm trên bộ nhớ đệm (Buffer Pool) và chưa được
ghi hoàn toàn xuống đĩa (Disk/WAL/Redo Log). Giao dịch vẫn đang
giữ toàn bộ Locks.

Committed (Thành Dữ liệu đè trực tiếp (in-place write) lên bản ghi duy nhất trên đĩa/log.

Trạng thái (State) Mô tả chi tiết & Hành vi hệ thống
công) Giao dịch chính thức hoàn tất và giải phóng toàn bộ Locks. Lúc

này các giao dịch khác mới có thể truy cập dữ liệu.

Failed (Thất bại) Xảy ra lỗi hệ thống, đụng độ khóa (Deadlock) hoặc vi phạm ràng
buộc dữ liệu khi đang ở trạng thái Active hoặc Partially Committed.

Aborted (Hủy bỏ /
Rollback)

Giao dịch bị khôi phục về trạng thái ban đầu bằng cách đọc Undo
Log hoặc khôi phục snapshot cũ, sau đó giải phóng tất cả Locks. Bề
mặt dữ liệu trở lại trạng thái duy nhất như trước khi transaction chạy.

1.2. Kỷ nguyên Multi-State / Multi-Version (Kỷ nguyên MVCC)
Khi MVCC ra đời, CSDL hỗ trợ nhiều phiên bản dữ liệu song song tồn tại. Khái niệm "Trạng thái
của dữ liệu đối với một Transaction" không còn dựa vào Locks nữa mà dựa vào Visibility State
(Trạng thái khả kiến) thông qua Transaction Snapshot / Read View.
A. Transaction Isolation States (Các cấp độ cô lập sinh ra từ MVCC):
● Read Uncommitted: Nhìn thấy cả dữ liệu của các Transaction đang ở trạng thái Active
(chưa Commit). Gây ra Dirty Read.
● Read Committed: Chỉ nhìn thấy dữ liệu của các Transaction đã ở trạng thái Committed
tại thời điểm câu lệnh 실행 (Statement level Snapshot).
● Repeatable Read: Nhìn thấy dữ liệu nhất quán của các Transaction đã Committed tại
thời điểm Transaction bắt đầu (Transaction level Snapshot). Loại bỏ Non-repeatable
Read.
● Serializable: Cấp độ mạnh nhất. Trong Postgres sử dụng SSI (Serializable Snapshot
Isolation) để theo dõi các phụ thuộc đọc/ghi (SIREAD locks) nhằm phát hiện Write Skew.
B. Các Trạng thái Tuple / Version State cụ thể trong PostgreSQL:
Trong Postgres, mỗi Tuple version chuyển qua các trạng thái khả kiến dựa trên cờ `xmin` và
`xmax`:
● In-Progress (Active): Tuple được tạo bởi một `xmin` đang chạy (In-progress). Chỉ chính
Transaction đó mới nhìn thấy tuple này; các Transaction khác hoàn toàn không thấy.
● Committed & Visible: `xmin` đã Committed, `xmax = 0` (chưa bị xóa/update) hoặc
`xmax` thuộc về một Transaction bị Aborted. Tuple này khả kiến với các Transaction sinh
ra sau thời điểm `xmin` committed.
● Dead / Garbage Tuple: Tuple có `xmax` đã Committed VÀ `xmax` này nhỏ hơn
Transaction ID cũ nhất đang chạy (Oldest Active Transaction). Không còn bất kỳ
Transaction nào trong hệ thống có thể nhìn thấy Tuple này nữa $\rightarrow$ Chờ
AUTOVACUUM dọn dẹp.
C. Các Trạng thái Record & Undo Chain State trong MySQL InnoDB:
● Latest Committed Record (On Clustered Index): Bản ghi mới nhất nằm ngay trên

B+Tree Clustered Index, chứa `DB_TRX_ID` của Transaction vừa ghi đè nó.
● Active / Uncommitted Undo Version: Bản ghi cũ nằm trong Undo Log Segment, được
liên kết qua `DB_ROLL_PTR`. Nếu Transaction đang sửa đổi bị Rollback, InnoDB dùng
Undo Version này để hồi phục lại Clustered Index.
● Purgeable Undo Version: Bản ghi trong Undo Log mà `DB_TRX_ID` của nó cũ hơn
Read View của Transaction lâu nhất đang chạy. Nhóm Purge Threads sẽ chuyển nó sang
trạng thái giải phóng (Freed).
2. CHUYÊN SÂU VỀ MVCC: POSTGRESQL VS MYSQL
INNODB
2.1. PostgreSQL (Append-Only / Heap Table)
● Các cột ẩn Header: xmin (XID tạo), xmax (XID xóa/update), cmin/cmax (Command ID),
ctid (con trỏ vật lý Block/Offset).
● Cơ chế UPDATE: Kết hợp DELETE (gán `xmax = XID_hiện_tại`) + INSERT (tạo Tuple
mới với `xmin = XID_hiện_tại`).
● Bảo trì & Dọn rác: AUTOVACUUM quét Heap Pages để xóa Dead Tuples, cập nhật Free
Space Map (FSM) và Visibility Map (VM).
● Tối ưu Heap-Only Tuple (HOT): Giảm phình Secondary Index nếu Tuple mới nằm cùng
Data Page và không sửa đổi cột Index.
2.2. MySQL InnoDB (Clustered Index + Undo Log)
● Các cột ẩn: DB_TRX_ID (Transaction ID cuối), DB_ROLL_PTR (con trỏ cuộn Undo Log),
DB_ROW_ID (PK ẩn).
● Cơ chế UPDATE: Ghi đè in-place trên Clustered Index, đẩy bản ghi cũ vào Undo Log
Segment.
● Read View & Purge: Dựa vào `Read View` để duyệt ngược `Undo Log Chain`. Các
`Purge Threads` giải phóng Undo Log khi không còn Read View nào tham chiếu.
3. INDEX INTERNALS & COVERING INDEX
3.1. Cấu trúc B+Tree & Clustered Index
● B+Tree: Root Node $\rightarrow$ Internal Nodes (chỉ chứa Key điều hướng)
$\rightarrow$ Leaf Nodes (chứa Key + Data/Con trỏ, nối với nhau bằng Doubly Linked
List).
● MySQL InnoDB: Primary Key là Clustered Index. Leaf Node chứa full dòng dữ liệu.
Secondary Index chứa (Index_Key, Primary_Key) $\rightarrow$ Gây ra Bookmark Lookup
2 lần.
● PostgreSQL: Bảng Heap riêng biệt. Leaf Node của Index chứa (Index_Key, ctid).
3.2. Covering Index (Index-Only Scan)
● Công thức Trigger: SELECT ∪ WHERE ∪ ORDER BY ∪ GROUP BY ⊆ Index

Columns.
● Postgres Implementation: Dùng từ khóa INCLUDE (ví dụ: CREATE INDEX idx ON
orders(user_id) INCLUDE (total)). Bắt buộc kiểm tra Visibility Map (ALL-VISIBLE) trước
khi bỏ qua Heap Scan.
● MySQL Implementation: Tạo Composite Index. Kiểm tra lệnh EXPLAIN thấy cờ Using
index.
4. BỐI CẢNH LỊCH SỬ & CASE STUDY UBER
MIGRATION
4.1. Lịch sử MySQL & PostgreSQL
● MySQL: Triết lý "Nhanh trước, Chuẩn sau" của Michael "Monty" Widenius thời Web 2.0.
Ban đầu dùng MyISAM (không ACID, đọc siêu nhanh). Sau tích hợp InnoDB (Heikki
Tuuri). Khi Sun/Oracle thâu tóm, Monty fork thành MariaDB.
● PostgreSQL: Dự án POSTGRES (1986) của GS Michael Stonebraker (UC Berkeley) với
triết lý "Never Overwrite", chấp nhận thiết kế Heap Append-Only để hướng tới khả năng
phục hồi dữ liệu và mở rộng tối đa.
4.2. Case Study Uber Migration (2016)
Uber đổi từ Postgres sang MySQL do bài toán Update-heavy (cập nhật GPS từng giây):
1. Write Amplification trên Secondary Index: Postgres đổi `ctid` bắt buộc ghi lại tất cả
Secondary Index. MySQL UPDATE in-place trên Clustered Index nên Secondary Index
không đổi.
2. Table Bloat & AUTOVACUUM: Hàng triệu Dead Tuples khiến AUTOVACUUM chạy liên
tục gây nghẽn đĩa I/O.
3. Replication Lag: Physical WAL Replication của Postgres bị phình dung lượng lớn khi
truyền qua mạng sang Slave Nodes.