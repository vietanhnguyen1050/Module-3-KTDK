# Tài Liệu Đặc Tả Yêu Cầu Hệ Thống Dashstack (Module 3.2 - Kiểm Tra Cuối Kỳ)

## 1. Mục Tiêu Hệ Thống
**Dashstack** là một hệ thống quản lý bảng điều khiển (Dashboard Management System), cho phép người dùng tạo, tùy chỉnh và quản lý các bảng điều khiển để theo dõi dữ liệu và hiệu suất. Hệ thống cung cấp các công cụ để tích hợp dữ liệu từ nhiều nguồn khác nhau, hiển thị thông tin qua các biểu đồ và báo cáo, và giúp người dùng đưa ra các quyết định dựa trên dữ liệu một cách hiệu quả.

## 2. Phạm Vi Hệ Thống
Dashstack bao gồm các tính năng quản lý bảng điều khiển, tích hợp dữ liệu, phân tích và báo cáo. Hệ thống cho phép người dùng tạo và tùy chỉnh các bảng điều khiển, thêm và chỉnh sửa các widget (tiện ích), tích hợp với các nguồn dữ liệu bên ngoài và xem các báo cáo phân tích chi tiết. Hệ thống có thể được sử dụng bởi các nhà quản lý, nhà phân tích dữ liệu và các nhóm làm việc để theo dõi hiệu suất và đưa ra quyết định dựa trên dữ liệu.

## 3. Đối Tượng Sử Dụng (Actors)
1. **Admin (Quản trị viên)**: Quản lý và kiểm soát toàn bộ hệ thống, bao gồm người dùng, phân quyền, cấu hình hệ thống, bảo mật, API, nhật ký, sao lưu và gói dịch vụ.
2. **User (Người dùng / Quản lý / Phân tích)**: Tạo và quản lý các bảng điều khiển cá nhân hoặc nhóm, tùy chỉnh widget, tích hợp nguồn dữ liệu, xem biểu đồ nâng cao, cài đặt cảnh báo, xuất báo cáo và chia sẻ dashboard.

---

## 4. Danh Sách Chức Năng Chính (Functional Requirements)

### 4.1. Dành Cho Quản Trị Viên (Admin)

| Mã Chức Năng | Tên Chức Năng | Mô Tả Chi Tiết | Điều Kiện |
|---|---|---|---|
| `AD-ADM01` | **Quản lý người dùng** | Xem, thêm mới, chỉnh sửa và khóa/xóa thông tin người dùng trong hệ thống. | Admin đã đăng nhập |
| `AD-ADM02` | **Quản lý quyền truy cập** | Thiết lập và quản lý quyền truy cập theo vai trò cho người dùng và các nhóm làm việc. | Admin đã đăng nhập |
| `AD-ADM03` | **Quản lý tích hợp dữ liệu** | Quản lý và cấu hình các nguồn dữ liệu được kết nối vào hệ thống (PostgreSQL, MySQL, REST API, Firebase, MongoDB...). | Admin đã đăng nhập |
| `AD-ADM04` | **Quản lý bảng điều khiển** | Xem danh sách, giám sát và quản lý tất cả các bảng điều khiển (Dashboards) trên hệ thống. | Admin đã đăng nhập |
| `AD-ADM05` | **Quản lý thông báo** | Tạo và phát đi thông báo hệ thống đến người dùng toàn sàn hoặc theo nhóm. | Admin đã đăng nhập |
| `AD-ADM06` | **Quản lý hỗ trợ** | Tiếp nhận, xử lý và phản hồi các yêu cầu hỗ trợ kỹ thuật từ người dùng. | Admin đã đăng nhập |
| `AD-ADM07` | **Quản lý báo cáo** | Xem và xuất các báo cáo tổng quan về hoạt động hệ thống (số lượng dashboard, user active, tài nguyên sử dụng). | Admin đã đăng nhập |
| `AD-ADM08` | **Quản lý bảo mật** | Thiết lập và kiểm soát các biện pháp bảo mật hệ thống (2FA, IP Whitelist, chính sách mật khẩu, giới hạn session). | Admin đã đăng nhập |
| `AD-ADM09` | **Quản lý API** | Quản lý API keys, endpoint rate limits và cấp quyền tích hợp API cho lập trình viên. | Admin đã đăng nhập |
| `AD-ADM10` | **Quản lý nhật ký hệ thống** | Theo dõi và quản lý log hoạt động, lỗi hệ thống (System Logs). | Admin đã đăng nhập |
| `AD-ADM11` | **Quản lý tài khoản thanh toán** | Quản lý và cấu hình các tài khoản/cổng thanh toán (Stripe, Momo, VNPay, Paypal...). | Admin đã đăng nhập |
| `AD-ADM12` | **Quản lý gói dịch vụ** | Thiết lập và quản lý các gói cước dịch vụ (Free, Pro, Enterprise) cho người dùng. | Admin đã đăng nhập |
| `AD-ADM13` | **Quản lý đăng nhập** | Giám sát các phiên đăng nhập (Active Sessions), phát hiện đăng nhập bất thường và buộc đăng xuất khi cần. | Admin đã đăng nhập |
| `AD-ADM14` | **Quản lý log sự kiện** | Theo dõi và ghi lại chi tiết các sự kiện quan trọng trên hệ thống (Audit / Event Logs). | Admin đã đăng nhập |
| `AD-ADM15` | **Quản lý backup dữ liệu** | Thiết lập lịch trình và quản lý các bản sao lưu (Backup & Restore) dữ liệu. | Admin đã đăng nhập |

---

### 4.2. Dành Cho Người Dùng (User)

| Mã Chức Năng | Tên Chức Năng | Mô Tả Chi Tiết | Điều Kiện |
|---|---|---|---|
| `USR-REG01` | **Đăng ký tài khoản** | Đăng ký tài khoản mới với các trường thông tin: Tên, Email, Mật khẩu, Xác nhận mật khẩu. | Khách vãng lai |
| `USR-LOG01` | **Đăng nhập** | Đăng nhập vào hệ thống bằng Email và Mật khẩu. | Đã có tài khoản |
| `USR-DBD01` | **Tạo bảng điều khiển** | Tạo mới bảng điều khiển tùy chỉnh, chọn layout, thêm widget và cấu hình nguồn dữ liệu. | Đã đăng nhập |
| `USR-DBD02` | **Quản lý bảng điều khiển** | Xem danh sách, xem chi tiết, chỉnh sửa thông tin và xóa các bảng điều khiển đã tạo. | Đã đăng nhập |
| `USR-DBD03` | **Tích hợp dữ liệu** | Thêm và quản lý các nguồn dữ liệu kết nối vào bảng điều khiển (File Upload, REST API, Database...). | Đã đăng nhập |
| `USR-DBD04` | **Xem báo cáo** | Xem và phân tích các báo cáo số liệu được tổng hợp tự động từ bảng điều khiển. | Đã đăng nhập |
| `USR-ALRT01`| **Cài đặt cảnh báo** | Cài đặt ngưỡng cảnh báo tự động khi số liệu vượt ngưỡng (ví dụ: Doanh thu < X, CPU > 90%). | Đã đăng nhập |
| `USR-DBD05` | **Chia sẻ bảng điều khiển** | Chia sẻ quyền xem / sửa bảng điều khiển với người dùng khác qua email hoặc link công khai. | Đã đăng nhập |
| `USR-SPT01` | **Yêu cầu hỗ trợ** | Gửi ticket yêu cầu hỗ trợ kỹ thuật hoặc thắc mắc tới ban quản trị. | Đã đăng nhập |
| `USR-ACC01` | **Quản lý tài khoản** | Xem, cập nhật thông tin cá nhân, avatar, đổi mật khẩu và xem gói dịch vụ hiện tại. | Đã đăng nhập |
| `USR-DBD06` | **Quản lý widget** | Thêm mới, chỉnh sửa cấu hình (loại biểu đồ, nguồn dữ liệu) và xóa widget trên dashboard. | Đã đăng nhập |
| `USR-DBD07` | **Tùy chỉnh giao diện** | Tùy chỉnh theme màu sắc, bố cục lưới kéo thả, chế độ Dark/Light mode cho dashboard. | Đã đăng nhập |
| `USR-DBD08` | **Xem lịch sử thay đổi** | Xem timeline lịch sử thay đổi và cập nhật của bảng điều khiển. | Đã đăng nhập |
| `USR-DBD09` | **Xuất dữ liệu** | Xuất dữ liệu biểu đồ và số liệu ra các định dạng phổ biến: CSV, Excel, JSON, PDF. | Đã đăng nhập |
| `USR-DBD10` | **Tạo báo cáo tự động** | Lên lịch tự động tạo và gửi báo cáo định kỳ (Hàng ngày, Hàng tuần, Hàng tháng) qua Email. | Đã đăng nhập |
| `USR-DBD11` | **Tích hợp ứng dụng bên thứ 3** | Kết nối bảng điều khiển với các dịch vụ bên ngoài như Slack, Google Drive, Webhooks, Zapier. | Đã đăng nhập |
| `USR-DBD12` | **Xem biểu đồ nâng cao** | Trực quan hóa dữ liệu với nhiều dạng biểu đồ hiện đại (Line, Bar, Donut, Area, Heatmap, Metric Cards). | Đã đăng nhập |
| `USR-DBD13` | **Quản lý quyền truy cập dashboard** | Thiết lập quyền xem (Viewer) hoặc chỉnh sửa (Editor) cho từng thành viên trong nhóm. | Đã đăng nhập |

---

## 5. Kiến Trúc Kỹ Thuật (Technical Architecture)
- **Root**: Quản lý script khởi chạy đồng thời cả client và server bằng `concurrently`.
- **Server**:
  - Node.js + Express + TypeScript
  - Kiến trúc **MVC**:
    - `models/`: Chứa các model quản trị và in-memory data store mô phỏng đầy đủ dữ liệu (Users, Dashboards, Widgets, DataSources, Alerts, Reports, Logs, Backups, Payments, Packages, Tickets, ApiKeys).
    - `controllers/`: Chứa logic xử lý nghiệp vụ cho từng phân hệ (Auth, User Dashboard, Data Integration, Reports, Admin Control).
    - `routes/`: Định tuyến RESTful API chuẩn REST.
    - `middleware/`: Xác thực JWT, Role Guard và xử lý lỗi tập trung.
- **Client**:
  - React 18 + TypeScript + Vite + React Router DOM + Lucide React Icons
  - Giao diện Dashboard hiện đại phong cách Dashstack (Sleek UI, Chart visualizations, Responsive layout, Quick Role Switcher để test nhanh giữa User & Admin).
