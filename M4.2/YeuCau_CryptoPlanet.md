# Tài Liệu Đặc Tả Yêu Cầu Hệ Thống Crypto Planet - Trading (Module 4.2 - Kiểm Tra Cuối Kỳ)

## 1. Mục Tiêu Hệ Thống
**Crypto Planet** là một sàn giao dịch tiền điện tử trực tuyến (Crypto Exchange Platform), nơi người dùng có thể mua, bán và trao đổi các loại tiền điện tử khác nhau (BTC, ETH, SOL, BNB, USDT...). Hệ thống cung cấp các công cụ giao dịch chuyên nghiệp, quản lý tài sản số (Crypto Wallet), theo dõi thị trường theo thời gian thực (Order Book, Biểu đồ nến Candlestick), phân tích kỹ thuật và dịch vụ hỗ trợ khách hàng. Quản trị viên (Admin) kiểm soát toàn bộ hoạt động của sàn, bảo mật hệ thống, tài chính và cấu hình phí.

## 2. Phạm Vi Hệ Thống
- Quản lý giao dịch (Spot Trading: Mua, Bán, Swap, Khớp lệnh, Hủy lệnh).
- Quản lý ví & tài sản số (Nạp, Rút, Số dư khả dụng/đóng băng).
- Theo dõi thị trường, bảng giá trực tiếp, biểu đồ phân tích kỹ thuật và thiết lập cảnh báo giá.
- Hệ thống bảo mật (Xác thực 2 lớp 2FA, Quản lý khóa API, Giám sát phiên đăng nhập).
- Phân hệ quản trị Admin: Kiểm duyệt giao dịch, Quản lý cặp tiền tệ, Cấu hình phí giao dịch, Quản lý tài chính, Báo cáo doanh thu và Quản lý khuyến mãi/Airdrop.

## 3. Đối Tượng Sử Dụng (Actors)
1. **Admin (Quản trị hệ thống)**: Kiểm soát người dùng, cặp tiền tệ, tài sản sàn, duyệt giao dịch, cấu hình phí và tài chính.
2. **Trader (Người giao dịch)**: Thực hiện giao dịch mua bán, nạp rút, xem biểu đồ, quản lý ví cá nhân và săn khuyến mãi.
3. **Viewer (Người xem)**: Theo dõi giá thị trường, biểu đồ phân tích, đặt cảnh báo giá nhưng không đặt lệnh giao dịch.

---

## 4. Danh Sách Chức Năng Chính

### 4.1. Phân Hệ Quản Trị Viên (Admin)

| Mã Chức Năng | Tên Chức Năng | Mô Tả Chi Tiết |
|---|---|---|
| `AD-ADM01` | **Quản lý người dùng** | Xem danh sách, thêm, chỉnh sửa thông tin và khóa/mở tài khoản trader/viewer. |
| `AD-ADM02` | **Quản lý giao dịch** | Xem lịch sử toàn bộ lệnh mua/bán, khớp lệnh và kiểm duyệt các giao dịch bất thường. |
| `AD-ADM03` | **Quản lý tài sản** | Quản lý tổng tài sản tiền điện tử lưu ký trên sàn (Liquidity & Reserves). |
| `AD-ADM04` | **Quản lý cặp giao dịch** | Thêm mới, kích hoạt, chỉnh sửa hoặc hủy niêm yết các cặp giao dịch (Trading Pairs: BTC/USDT, ETH/USDT...). |
| `AD-ADM05` | **Quản lý báo cáo** | Báo cáo tổng quan khối lượng giao dịch (24h Volume), doanh thu phí và lượng người dùng. |
| `AD-ADM06` | **Quản lý thông báo** | Gửi thông báo hệ thống, tin tức niêm yết coin mới đến người dùng. |
| `AD-ADM07` | **Quản lý hỗ trợ** | Tiếp nhận và xử lý các phiếu hỗ trợ (Support Tickets) từ người dùng. |
| `AD-ADM08` | **Quản lý bảo mật** | Cấu hình chính sách bảo mật, 2FA bắt buộc, IP Whitelist và kiểm soát rủi ro. |
| `AD-ADM09` | **Quản lý API** | Quản lý và cấp phát API Keys cho trader giao dịch bằng bot/thuật toán. |
| `AD-ADM10` | **Quản lý tài chính** | Thống kê dòng tiền, doanh thu từ phí giao dịch, chi phí vận hành và lợi nhuận sàn. |
| `AD-ADM11` | **Quản lý phí giao dịch** | Thiết lập biểu phí Maker / Taker fee cho từng cặp giao dịch và từng cấp bậc tài khoản (VIP tiers). |
| `AD-ADM12` | **Quản lý khuyến mãi** | Tạo và quản lý các sự kiện Airdrop, Voucher giảm phí giao dịch, Thưởng nạp tiền. |

---

### 4.2. Phân Hệ Trader (Người Giao Dịch)

| Mã Chức Năng | Tên Chức Năng | Mô Tả Chi Tiết |
|---|---|---|
| `TRD-REG01` | **Đăng ký tài khoản** | Đăng ký tài khoản Trader mới. |
| `TRD-LOG01` | **Đăng nhập** | Đăng nhập hệ thống bảo mật. |
| `TRD-TRD01` | **Mua tiền điện tử** | Đặt lệnh Mua (Limit Order, Market Order) bằng số dư USDT khả dụng. |
| `TRD-TRD02` | **Bán tiền điện tử** | Đặt lệnh Bán (Limit Order, Market Order) sang USDT. |
| `TRD-TRD03` | **Trao đổi tiền điện tử** | Chức năng Swap / Convert tức thì giữa 2 loại coin bất kỳ với tỷ giá realtime. |
| `TRD-TRD04` | **Hủy giao dịch** | Hủy các lệnh chờ khớp (Open Orders) và hoàn trả số dư đóng băng. |
| `TRD-TRD05` | **Xem lịch sử giao dịch** | Xem chi tiết các lệnh mở (Open Orders), lịch sử khớp lệnh (Order History) và dòng tiền. |
| `TRD-ASST01`| **Quản lý tài sản (Ví)** | Quản lý danh mục đầu tư (Portfolio Balance), giá trị quy đổi sang USDT/USD, Nạp & Rút tiền. |
| `TRD-ALRT01`| **Cài đặt cảnh báo giá** | Đặt cảnh báo giá chạm ngưỡng (Price Target Alerts) để nhận thông báo tức thời. |
| `TRD-CHRT01`| **Xem biểu đồ phân tích** | Biểu đồ nến Candlestick thời gian thực kèm Volume, MA và công cụ phân tích kỹ thuật. |
| `TRD-SPT01` | **Yêu cầu hỗ trợ** | Gửi ticket yêu cầu hỗ trợ kỹ thuật hoặc thắc mắc về nạp rút/giao dịch. |
| `TRD-ACC01` | **Quản lý tài khoản & 2FA** | Cập nhật hồ sơ cá nhân, bật xác thực 2 bước 2FA và đổi mật khẩu. |
| `TRD-FIN01` | **Quản lý thanh toán** | Lịch sử nạp tiền (Deposit) và rút tiền (Withdraw) an toàn. |
| `TRD-PRM01` | **Xem & Nhận khuyến mãi**| Xem danh sách chương trình ưu đãi, airdrop và claim quà tặng chào mừng. |

---

### 4.3. Phân Hệ Viewer (Người Xem Thị Trường)

| Mã Chức Năng | Tên Chức Năng | Mô Tả Chi Tiết |
|---|---|---|
| `VWR-REG01` / `VWR-LOG01` | **Đăng ký & Đăng nhập** | Đăng ký tài khoản Viewer để lưu danh sách theo dõi (Watchlist). |
| `VWR-VEW01` | **Thông tin thị trường** | Xem bảng giá trực tiếp các đồng coin hàng đầu, biến động 24h, Top Gainers/Losers. |
| `VWR-CHRT01`| **Biểu đồ phân tích** | Xem biểu đồ nến giá tiền điện tử chuyên sâu. |
| `VWR-ALRT01`| **Cài đặt cảnh báo giá** | Thiết lập cảnh báo giá coin biến động. |
| `VWR-SPT01` | **Yêu cầu hỗ trợ** | Gửi yêu cầu giải đáp thắc mắc. |

---

## 5. Kiến Trúc Kỹ Thuật (Client - Server & MVC)
- **Root**: `package.json` cài `concurrently` để chạy `npm run dev` đồng thời cả 2 phân hệ.
- **Server**:
  - Node.js + Express + TypeScript
  - Kiến trúc **MVC**:
    - `models/`: Dữ liệu mock & schema (Users, Coins, Pairs, Orders, Wallets, Transactions, Alerts, Promotions, Tickets, Financials, ApiKeys).
    - `controllers/`: Nghiệp vụ giao dịch khớp lệnh, chuyển đổi coin, nạp rút, quản trị hệ thống.
    - `routes/`: RESTful endpoints chuẩn (`/api/auth`, `/api/market`, `/api/trading`, `/api/wallet`, `/api/admin`, v.v.).
    - `middleware/`: JWT authentication + Role Guard (Admin / Trader / Viewer).
- **Client**:
  - React 18 + TypeScript + Vite + React Router DOM + Lucide Icons + TradingView Dark Crypto Aesthetics.
  - Tích hợp **Demo Role Switcher** ở đầu trang để chuyển nhanh giữa **Trader**, **Admin**, **Viewer** và **Guest**.
