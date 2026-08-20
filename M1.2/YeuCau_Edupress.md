# Hệ thống Website Edupress - [Module 1] Kiểm tra cuối kỳ

> **Nguồn trích xuất:** `[Module 1] Kiểm tra cuối kỳ.pdf` (MindX Technology School - Sản phẩm Coding)

---

## 1. Mục tiêu
- Xây dựng hệ thống học online **Edupress** trên nền tảng Website, mục tiêu cung cấp những khóa học được đăng tải bởi những nhà tài trợ (Nhà cung cấp khoá học - NCC).
- Cung cấp các khóa học chia sẻ miễn phí, trả phí theo các chương trình giảm giá, ưu đãi hoặc qua những phiên tổ chức gameshow quay số may mắn cho khách hàng (người học).
- Nhà cung cấp khoá học sẽ đăng tải các khoá học lên nền tảng. Hệ thống/Quản trị viên đóng vai trò là bên thứ 3 nhằm tăng uy tín và phân phối sản phẩm khoá học online tới khách hàng.

---

## 2. Phạm vi
- Tất cả người dùng khi đã đăng ký thông tin trên hệ thống đều có thể tham gia đăng ký các khoá học.
- Khách hàng có thể đăng ký trở thành Nhà cung cấp khóa học (NCC) trên hệ thống.

---

## 3. Đối tượng sử dụng (Actors / Roles)

| STT | Role (Vai trò) | Description (Mô tả) |
|---|---|---|
| **1** | **Admin - Quản trị hệ thống** | Quản trị hệ thống, cung cấp và kiểm soát nền tảng cho Khách hàng & Nhà cung cấp khóa học để thực hiện các nghiệp vụ kinh doanh khóa học online trên nền tảng Edupress. |
| **2** | **Customer - Khách hàng** | Người sử dụng hệ thống thực hiện các nghiệp vụ liên quan đến mua, học khóa học; có thể đăng ký trở thành Nhà cung cấp khóa học. |
| **3** | **Course Provider - Nhà cung cấp khóa học (NCC)** | Thực hiện đăng tải những khoá học lên nền tảng cho Khách hàng có thể mua và học. |

---

## 4. Chức năng chính (Detailed Feature Requirements)

### 4.1. Tác nhân: Customer (Khách hàng)

| Mã | Chức năng | Mô tả | Điều kiện |
|---|---|---|---|
| **CT-QLTT01** | Đăng ký | Khách hàng có thể đăng ký thông tin trên hệ thống để tạo tài khoản. | Khi đăng ký, email phải chưa tồn tại trên hệ thống. |
| **CT-QLTT02** | Đăng nhập | Khách hàng sử dụng tài khoản, mật khẩu đã đăng ký để đăng nhập hệ thống. | Tài khoản đã tồn tại, email và mật khẩu cần trùng khớp với dữ liệu. |
| **CT-QLTT03** | Quên mật khẩu | Khách hàng thực hiện cấp lại mật khẩu khi quên. | Tài khoản đã tồn tại trên hệ thống. |
| **CT-QLTT04** | Xem thông tin cá nhân | Khách hàng có thể xem thông tin cá nhân của bản thân. | Khách hàng đã đăng nhập hệ thống. |
| **CT-QLTT05** | Cập nhật thông tin cá nhân | Khách hàng có thể cập nhật các thông tin cá nhân (trừ email), thay đổi mật khẩu tài khoản. | Khách hàng đã đăng nhập hệ thống. |
| **CT-QLTT06** | Yêu cầu xoá tài khoản | Khách hàng sử dụng chức năng xoá tài khoản để gỡ thông tin khỏi hệ thống. | Khách hàng đã đăng nhập hệ thống. |
| **CT-QLTT07** | Thông báo | Khách hàng nhận thông báo về các sự kiện, cập nhật từ hệ thống. | Khách hàng đã đăng ký nhận thông báo. |
| **CT-CLTT08** | Đăng ký NCC | Khách hàng đăng ký thông tin làm Nhà cung cấp khoá học. | Khách hàng đã đăng nhập hệ thống. |
| **CT-QLTTKH01** | Danh sách khoá học đã đăng ký | Khách hàng xem được danh sách các khoá học đã đăng ký. | Khách hàng đã đăng nhập hệ thống. |
| **CT-QLTTKH02** | Xem chi tiết khoá học đã đăng ký | Khách hàng xem chi tiết khoá học đã đăng ký. | Khách hàng đã đăng nhập hệ thống; Khoá học này khách hàng đã đăng ký. |
| **CT-QLTTKH03** | Xem bài học của khoá học | Khách hàng xem các video khoá học của khoá học đã đăng ký. | Khách hàng đã đăng nhập hệ thống; Khoá học này khách hàng đã đăng ký. |
| **CT-QLTTKH04** | Đánh giá khoá học | Khách hàng có thể đánh giá khoá học theo rating, comment. | Khách hàng đã đăng nhập hệ thống; Khoá học này khách hàng đã đăng ký. |
| **CT-QLTTKH05** | Xem danh sách khoá học | Khách hàng xem danh sách các khoá học hiện có trên trang chủ. | Không yêu cầu đăng nhập. |
| **CT-QLTTKH06** | Đăng ký khoá học | Khách hàng có thể đăng ký khoá học. | Khách hàng đã đăng nhập hệ thống; Khoá học này khách hàng chưa đăng ký. |

---

### 4.2. Tác nhân: Course Provider - Nhà cung cấp khoá học (NCC)

| Mã | Chức năng | Mô tả | Điều kiện |
|---|---|---|---|
| **IN-KH01** | Tạo khóa học | NCC tạo mới các khóa học với nội dung, mô tả và mục tiêu. | NCC đã đăng nhập hệ thống. |
| **IN-KH02** | Chỉnh sửa khóa học | NCC chỉnh sửa thông tin và nội dung khóa học hiện có. | NCC đã đăng nhập hệ thống. |
| **IN-KH03** | Xóa khóa học | NCC xóa các khóa học không còn cần thiết hoặc lỗi thời. | NCC đã đăng nhập hệ thống. |
| **IN-KH04** | Quản lý bài giảng | NCC tải lên và quản lý các bài giảng, tài liệu, video. | NCC đã đăng nhập hệ thống. |
| **IN-UĐ01** | Tạo mã giảm giá | Tạo các mã giảm giá cho khóa học của mình. | NCC đã đăng nhập hệ thống. |
| **IN-UĐ02** | Chỉnh sửa mã giảm giá | Chỉnh sửa thông tin và giá trị của mã giảm giá. | NCC đã đăng nhập hệ thống. |
| **IN-UĐ03** | Xóa mã giảm giá | Xóa các mã giảm giá không còn sử dụng. | NCC đã đăng nhập hệ thống. |
| **IN-UĐ04** | Tạo chương trình ưu đãi | Tạo và quản lý các chương trình ưu đãi khác (khuyến mãi theo thời gian, khuyến mãi theo số lượt đăng ký). | NCC đã đăng nhập hệ thống. |
| **IN-UĐ05** | Chỉnh sửa chương trình ưu đãi | Chỉnh sửa thông tin các chương trình ưu đãi hiện có. | NCC đã đăng nhập hệ thống. |
| **IN-UĐ06** | Xóa chương trình ưu đãi | Giảng viên/NCC xóa các chương trình ưu đãi không còn hiệu lực. | NCC đã đăng nhập hệ thống. |
| **IN-UĐ07** | Quản lý quà tặng | Tạo và quản lý các quà tặng đi kèm với khóa học. | NCC đã đăng nhập hệ thống. |
| **N-DS01** | Xem báo cáo doanh thu | Xem báo cáo tổng quan về doanh thu từ các khóa học. | NCC đã đăng nhập hệ thống. |
| **IN-DS02** | Xem chi tiết doanh thu | Xem chi tiết doanh thu từng khóa học. | NCC đã đăng nhập hệ thống. |

---

### 4.3. Tác nhân: Admin - Quản trị hệ thống

| Mã | Chức năng | Mô tả | Điều kiện |
|---|---|---|---|
| **AD-NCC01** | Duyệt NCC mới | Duyệt thông tin đăng ký làm NCC khoá học của khách hàng. | Admin đã đăng nhập hệ thống; Khách hàng đã gửi yêu cầu đăng ký làm NCC. |
| **AD-NCC02** | Quản lý thông tin NCC | Admin xem, chỉnh sửa hoặc vô hiệu hóa tài khoản NCC. | Admin đã đăng nhập hệ thống. |
| **AD-NCC03** | Quản lý đánh giá NCC | Admin xem, thống kê các đánh giá về NCC. | Admin đã đăng nhập hệ thống. |
| **AD-KH01** | Duyệt khóa học mới | Admin duyệt và phê duyệt các khóa học mới được tạo bởi NCC. | Khóa học đã được NCC tạo. |
| **AD-KH02** | Quản lý thông tin khóa học | Admin xem, chỉnh sửa hoặc vô hiệu hóa các khóa học. | Khóa học đã được NCC tạo. |
| **AD-KH03** | Quản lý nội dung khóa học | Admin kiểm tra và quản lý nội dung các bài giảng, tài liệu, video. | Khóa học đã được NCC tạo. |
| **AD-CT01** | Quản lý thông tin Khách hàng | Admin xem, chỉnh sửa hoặc vô hiệu hóa tài khoản Khách hàng. | Admin đã đăng nhập hệ thống. |
| **AD-CT02** | Quản lý thanh toán từ Khách hàng | Admin theo dõi và quản lý các giao dịch thanh toán. | Admin đã đăng nhập hệ thống. |
| **AD-HT01** | Quản lý báo cáo tổng quan | Admin xem và phân tích các báo cáo tổng quan về hoạt động của hệ thống (người dùng, khoá học, doanh thu,...). | Hệ thống đã hoạt động. |
| **AD-HT02** | Quản lý thông báo | Admin gửi thông báo đến giảng viên/NCC và học viên. | Hệ thống đã hoạt động. |
| **AD-HT03** | Quản lý tài chính | Admin theo dõi và quản lý tài chính của hệ thống, bao gồm doanh thu và chi phí. | Hệ thống đã hoạt động. |
| **AD-HT04** | Quản lý hỗ trợ | Admin quản lý và cung cấp hỗ trợ kỹ thuật cho giảng viên và học viên. | Hệ thống đã hoạt động. |
| **AD-HT05** | Quản lý nội dung | Admin kiểm tra và quản lý tất cả nội dung trên hệ thống để đảm bảo tuân thủ các quy định và chính sách. | Hệ thống đã hoạt động. |
| **AD-HT06** | Quản lý quyền truy cập | Admin quản lý và phân quyền truy cập cho các giảng viên, học viên và nhân viên hệ thống. | Hệ thống đã hoạt động. |

---

## 5. Danh sách các Giao diện cần có (UI / Screens)

### 5.1. Nhóm giao diện dành cho Khách hàng (Customer)

| Giao diện | Mô tả | Chức năng liên quan |
|---|---|---|
| **Trang chủ (Home Page)** | Hiển thị danh sách các khóa học nổi bật, khuyến mãi hiện có, và các thông tin cập nhật từ hệ thống. | `CT-QLTTKH05` |
| **Trang đăng ký (Registration Page)** | Form đăng ký tài khoản mới, bao gồm các trường thông tin cần thiết như tên, email, mật khẩu, và xác nhận mật khẩu. | `CT-QLTT01` |
| **Trang đăng nhập (Login Page)** | Form đăng nhập vào hệ thống bằng email và mật khẩu. | `CT-QLTT02` |
| **Trang quên mật khẩu (Forgot Password Page)** | Form để người dùng nhập email và nhận hướng dẫn đặt lại mật khẩu. | `CT-QLTT03` |
| **Trang hồ sơ cá nhân (Profile Page)** | Hiển thị và cho phép người dùng chỉnh sửa thông tin cá nhân (ngoại trừ email), bao gồm tên, mật khẩu, số điện thoại, địa chỉ, v.v. | `CT-QLTT04`, `CT-QLTT05` |
| **Trang danh sách khóa học đã đăng ký (Registered Courses Page)** | Hiển thị danh sách các khóa học mà người dùng đã đăng ký. | `CT-QLTTKH01` |
| **Trang chi tiết khóa học (Course Detail Page)** | Hiển thị thông tin chi tiết về khóa học, bao gồm mô tả khóa học, mục tiêu học tập, giáo viên, và các bài học. | `CT-QLTTKH02` |
| **Trang bài học (Lesson Page)** | Hiển thị video bài học và các tài liệu học tập liên quan. | `CT-QLTTKH03` |
| **Trang đánh giá khóa học (Course Review Page)** | Form để người dùng đánh giá và để lại nhận xét (rating, comment) về khóa học. | `CT-QLTTKH04` |
| **Trang danh sách khóa học (All Courses Page)** | Hiển thị danh sách tất cả các khóa học hiện có trên hệ thống, bao gồm chức năng tìm kiếm và lọc khóa học. | `CT-QLTTKH05` |
| **Trang đăng ký khóa học (Course Registration Page)** | Hiển thị thông tin chi tiết về khóa học và nút đăng ký khóa học. | `CT-QLTTKH06` |
| **Trang thông báo (Notifications Page)** | Hiển thị các thông báo về các sự kiện, cập nhật từ hệ thống. | `CT-QLTT07` |
| **Trang đăng ký nhà cung cấp khóa học (Course Provider Registration Page)** | Form để khách hàng đăng ký trở thành nhà cung cấp khóa học (tên, thông tin liên hệ, mô tả khóa học dự kiến cung cấp). | `CT-CLTT08` |
| **Trang yêu cầu xóa tài khoản (Account Deletion Request Page)** | Form để người dùng yêu cầu xóa tài khoản khỏi hệ thống, bao gồm lý do yêu cầu. | `CT-QLTT06` |

---

### 5.2. Nhóm giao diện dành cho Nhà cung cấp khóa học (Course Provider)

| Giao diện | Mô tả | Chức năng liên quan |
|---|---|---|
| **Trang quản lý khóa học (Course Management Page)** | Hiển thị danh sách các khóa học hiện có, với các nút tạo mới, chỉnh sửa, xóa khóa học. | `IN-KH01`, `IN-KH02`, `IN-KH03` |
| **Trang tạo/chỉnh sửa khóa học (Course Creation/Edit Page)** | Form để tạo mới hoặc chỉnh sửa thông tin khóa học (tên khóa học, mô tả, mục tiêu, v.v.). | `IN-KH01`, `IN-KH02` |
| **Trang quản lý bài giảng (Lesson Management Page)** | Hiển thị danh sách các bài giảng trong khóa học, với các nút tải lên, chỉnh sửa, và xóa bài giảng. | `IN-KH04` |
| **Trang tạo/chỉnh sửa bài giảng (Lesson Creation/Edit Page)** | Form để tải lên hoặc chỉnh sửa các bài giảng, tài liệu, video. | `IN-KH04` |
| **Trang quản lý mã giảm giá (Discount Code Management Page)** | Hiển thị danh sách các mã giảm giá, với các nút tạo mới, chỉnh sửa, và xóa mã giảm giá. | `IN-UĐ01`, `IN-UĐ02`, `IN-UĐ03` |
| **Trang tạo/chỉnh sửa mã giảm giá (Discount Code Creation/Edit Page)** | Form để tạo mới hoặc chỉnh sửa các mã giảm giá cho khóa học. | `IN-UĐ01`, `IN-UĐ02` |
| **Trang quản lý chương trình ưu đãi (Promotion Management Page)** | Hiển thị danh sách các chương trình ưu đãi, với các nút tạo mới, chỉnh sửa, và xóa chương trình ưu đãi. | `IN-UĐ04`, `IN-UĐ05`, `IN-UĐ06` |
| **Trang tạo/chỉnh sửa chương trình ưu đãi (Promotion Creation/Edit Page)** | Form để tạo mới hoặc chỉnh sửa các chương trình ưu đãi (khuyến mãi theo thời gian, số lượng đăng ký, v.v.). | `IN-UĐ04`, `IN-UĐ05` |
| **Trang quản lý quà tặng (Gift Management Page)** | Hiển thị danh sách các quà tặng đi kèm với khóa học, với các nút tạo mới, chỉnh sửa, và xóa quà tặng. | `IN-UĐ07` |
| **Trang tạo/chỉnh sửa quà tặng (Gift Creation/Edit Page)** | Form để tạo mới hoặc chỉnh sửa các quà tặng đi kèm với khóa học. | `IN-UĐ07` |
| **Trang báo cáo doanh thu (Revenue Report Page)** | Hiển thị báo cáo tổng quan về doanh thu từ các khóa học. | `IN-DS01` |
| **Trang chi tiết doanh thu (Revenue Detail Page)** | Hiển thị chi tiết doanh thu từng khóa học. | `IN-DS02` |

---

### 5.3. Nhóm giao diện dành cho Quản trị hệ thống (Admin)

| Giao diện | Mô tả | Chức năng liên quan |
|---|---|---|
| **Trang quản lý nhà cung cấp khóa học (NCC Management Page)** | Hiển thị danh sách các NCC, với các nút duyệt, chỉnh sửa, và vô hiệu hóa tài khoản NCC. | `AD-NCC01`, `AD-NCC02` |
| **Trang duyệt NCC mới (New NCC Approval Page)** | Hiển thị thông tin đăng ký của NCC mới và nút phê duyệt hoặc từ chối yêu cầu đăng ký. | `AD-NCC01` |
| **Trang quản lý đánh giá NCC (NCC Reviews Management Page)** | Hiển thị danh sách các đánh giá về NCC, với các chức năng thống kê và xem chi tiết đánh giá. | `AD-NCC03` |
| **Trang quản lý khóa học (Course Management Page)** | Hiển thị danh sách các khóa học, với các nút duyệt, chỉnh sửa, và vô hiệu hóa khóa học. | `AD-KH01`, `AD-KH02` |
| **Trang duyệt khóa học mới (New Course Approval Page)** | Hiển thị thông tin khóa học mới và nút phê duyệt hoặc từ chối yêu cầu tạo khóa học. | `AD-KH01` |
| **Trang quản lý nội dung khóa học (Course Content Management Page)** | Hiển thị danh sách các bài giảng, tài liệu, video, với các nút kiểm tra và quản lý nội dung. | `AD-KH03` |
| **Trang quản lý khách hàng (Customer Management Page)** | Hiển thị danh sách các khách hàng, với các nút chỉnh sửa và vô hiệu hóa tài khoản khách hàng. | `AD-CT01` |
| **Trang quản lý thanh toán từ khách hàng (Customer Payment Management Page)** | Hiển thị danh sách các giao dịch thanh toán từ khách hàng và trạng thái của các giao dịch này. | `AD-CT02` |
| **Trang báo cáo tổng quan (Overview Report Page)** | Hiển thị các báo cáo tổng quan về hoạt động của hệ thống (số lượng người dùng, khóa học, doanh thu, v.v.). | `AD-HT01` |
| **Trang quản lý thông báo (Notification Management Page)** | Cho phép Admin tạo và gửi thông báo đến giảng viên và học viên. | `AD-HT02` |
| **Trang quản lý tài chính (Financial Management Page)** | Hiển thị tổng quan về tình hình tài chính của hệ thống, bao gồm doanh thu, chi phí, và lợi nhuận. | `AD-HT03` |
| **Trang quản lý hỗ trợ (Support Management Page)** | Quản lý và cung cấp hỗ trợ kỹ thuật cho giảng viên và học viên. | `AD-HT04` |
| **Trang quản lý nội dung hệ thống (System Content Management Page)** | Kiểm tra và quản lý tất cả nội dung trên hệ thống để đảm bảo tuân thủ các quy định và chính sách. | `AD-HT05` |
| **Trang quản lý quyền truy cập (Access Management Page)** | Quản lý và phân quyền truy cập cho các giảng viên, học viên và nhân viên hệ thống. | `AD-HT06` |
