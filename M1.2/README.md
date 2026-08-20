# Edupress E-Learning Platform (Module 1.2)

Dự án nền tảng học trực tuyến **Edupress** được xây dựng theo mô hình kiến trúc **Client - Server**, áp dụng mẫu thiết kế **MVC (Model - View - Controller)** ở phía Server, sử dụng ngôn ngữ **TypeScript** toàn bộ hệ thống và quản lý chạy đồng thời cả 2 môi trường bằng **`concurrently`**.

---

## 🏗️ 1. Cấu Trúc Thư Mục Dự Án (Project Structure)

```
M1.2/
├── package.json              # Root package.json quản lý scripts concurrently
├── YeuCau_Edupress.md        # Tài liệu phân tích yêu cầu từ PDF Module 1
├── README.md                 # Hướng dẫn chạy và cấu trúc hệ thống
│
├── server/                   # 🖥️ BACKEND SERVER (Node.js, Express, TypeScript, MVC)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── types/            # Type definitions (IUser, ICourse, ILesson, IPromotion...)
│       ├── models/           # M - Model (Data store & mock operations)
│       │   ├── user.model.ts
│       │   ├── course.model.ts
│       │   ├── lesson.model.ts
│       │   ├── review.model.ts
│       │   ├── enrollment.model.ts
│       │   └── other.models.ts  (Discount, Promotion, Gift, Payment, Notification)
│       ├── controllers/      # C - Controller (Business logic & API handlers)
│       │   ├── auth.controller.ts      (Đăng ký, đăng nhập, quên mật khẩu)
│       │   ├── user.controller.ts      (Hồ sơ, thông báo, đăng ký NCC, khóa học đã mua)
│       │   ├── course.controller.ts    (Danh sách, chi tiết, mua khóa học, đánh giá)
│       │   ├── provider.controller.ts  (Quản lý khóa học, bài giảng, mã giảm giá, ưu đãi, quà tặng, doanh thu)
│       │   └── admin.controller.ts     (Kiểm duyệt NCC & khóa học, quản lý học viên, thanh toán, tài chính)
│       ├── routes/           # RESTful API Endpoints
│       │   ├── auth.routes.ts
│       │   ├── user.routes.ts
│       │   ├── course.routes.ts
│       │   ├── provider.routes.ts
│       │   ├── admin.routes.ts
│       │   └── index.ts
│       ├── middleware/       # Middleware (JWT Auth, Role Guard, Error Handler)
│       │   ├── auth.middleware.ts
│       │   └── role.middleware.ts
│       ├── app.ts            # Khởi tạo Express app & CORS
│       └── server.ts         # Khởi chạy server trên cổng 3001
│
└── client/                   # 🌐 FRONTEND CLIENT (React 18, Vite, TypeScript, React Router)
    ├── package.json
    ├── vite.config.ts        # Proxy /api sang http://localhost:3001
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── types/
        ├── context/          # AuthContext (quản lý login & Switcher chuyển vai trò nhanh)
        ├── services/         # api.ts (REST API client)
        ├── components/
        │   ├── layout/       # Navbar, Footer, RoleSwitcher banner
        │   └── ui/           # CourseCard, v.v.
        ├── pages/
        │   ├── Home.tsx                  (Trang chủ giới thiệu khóa học, ưu đãi)
        │   ├── auth/                     (Đăng nhập, đăng ký, quên mật khẩu)
        │   ├── customer/                 (Học viên: Khóa học của tôi, Xem video bài học, Hồ sơ, Đánh giá, Đăng ký NCC)
        │   ├── provider/                 (NCC: Quản lý khóa học, bài giảng, voucher, khuyến mãi, quà tặng, doanh thu)
        │   └── admin/                    (Admin: Duyệt khóa học, duyệt NCC, quản lý học viên, thanh toán, tài chính, thông báo)
        ├── App.tsx           # React Router DOM định tuyến toàn bộ màn hình
        └── index.css         # Hệ thống CSS Design System hiện đại, responsive
```

---

## 🚀 2. Hướng Dẫn Cài Đặt & Khởi Chạy (Quick Start)

### Yêu cầu môi trường:
- Node.js >= 18.x
- npm >= 9.x

### Bước 1: Cài đặt dependencies toàn bộ (Root, Server, Client)
Tại thư mục gốc `M1.2`:
```bash
npm run install:all
```
*(Hoặc `npm install` tại thư mục gốc, sau đó `npm install` trong `server` và `client`)*

### Bước 2: Khởi chạy cả Client và Server cùng lúc
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API Server**: `http://localhost:3001/api`
- **Health Check API**: `http://localhost:3001/api/health`

---

## 🎯 3. Tính Năng & Chế Độ Test Nhanh (Role Switcher)

Để tiện cho việc chấm bài và kiểm thử toàn bộ màn hình theo yêu cầu PDF mà không cần đăng nhập lại nhiều lần, trên đầu trang có **Thanh Switcher (Chế độ Test Nhanh Vai Trò)**:
1. **1. Khách Hàng (Học viên)**: Trải nghiệm mua khóa học, học bài trực tuyến, viết đánh giá, nộp hồ sơ NCC.
2. **2. Nhà Cung Cấp (NCC)**: Quản lý khóa học, thêm bài giảng, tạo mã giảm giá voucher, tạo ưu đãi mùa lễ, quà tặng đính kèm, xem biểu đồ doanh thu.
3. **3. Quản Trị Viên (Admin)**: Duyệt khóa học mới, phê duyệt NCC đối tác, khóa/mở tài khoản người dùng, giám sát dòng tiền và tài chính hệ thống.
4. **Khách Vãng Lai**: Chưa đăng nhập.

---

## 📋 4. Bảng Đối Chiếu Yêu Cầu (Requirements Coverage)

| Mã Yêu Cầu | Tên Chức Năng | API & Controller | Màn Hình Client (Giao Diện) |
|---|---|---|---|
| **CT-QLTT01** | Đăng ký tài khoản | `POST /api/auth/register` | `/register` |
| **CT-QLTT02** | Đăng nhập hệ thống | `POST /api/auth/login` | `/login` |
| **CT-QLTT03** | Quên mật khẩu | `POST /api/auth/forgot-password` | `/forgot-password` |
| **CT-QLTT04/05**| Xem & Sửa thông tin cá nhân | `GET/PUT /api/users/profile` | `/profile` |
| **CT-QLTT06** | Yêu cầu xóa tài khoản | `POST /api/users/delete-request` | `/delete-account` |
| **CT-QLTT07** | Nhận thông báo | `GET /api/users/notifications` | `/notifications` |
| **CT-CLTT08** | Đăng ký làm NCC | `POST /api/users/register-provider`| `/register-provider` |
| **CT-QLTTKH05**| Danh sách khóa học (Tìm kiếm) | `GET /api/courses` | `/courses`, `/` |
| **CT-QLTTKH02**| Chi tiết khóa học | `GET /api/courses/:id` | `/courses/:id` |
| **CT-QLTTKH06**| Mua/Đăng ký khóa học | `POST /api/courses/:id/enroll` | `/courses/:id` |
| **CT-QLTTKH01**| Khóa học của tôi | `GET /api/users/enrolled-courses`| `/my-courses` |
| **CT-QLTTKH03**| Xem bài giảng & Video | `GET /api/courses/:id/lessons` | `/learn/:courseId` |
| **CT-QLTTKH04**| Đánh giá khóa học | `POST /api/courses/:id/reviews` | `/courses/:id/review` |
| **IN-KH01-03** | CRUD Khóa học NCC | `/api/provider/courses` | `/provider/courses` |
| **IN-KH04**   | CRUD Bài giảng & Video | `/api/provider/courses/:id/lessons` | `/provider/courses/:id/lessons` |
| **IN-UĐ01-03** | Quản lý Mã giảm giá | `/api/provider/discounts` | `/provider/discounts` |
| **IN-UĐ04-06** | Chương trình ưu đãi | `/api/provider/promotions` | `/provider/promotions` |
| **IN-UĐ07**   | Quản lý Quà tặng kèm | `/api/provider/gifts` | `/provider/gifts` |
| **N-DS01/02**  | Báo cáo doanh thu NCC | `GET /api/provider/revenue` | `/provider/revenue` |
| **AD-NCC01/02**| Duyệt & Quản lý NCC | `/api/admin/providers` | `/admin/providers` |
| **AD-NCC03**  | Thống kê đánh giá NCC | `GET /api/admin/ncc-reviews` | `/admin/providers` |
| **AD-KH01-03** | Duyệt & Kiểm tra khóa học | `/api/admin/courses` | `/admin/courses` |
| **AD-CT01**   | Quản lý khách hàng | `GET/PUT /api/admin/customers` | `/admin/customers` |
| **AD-CT02**   | Quản lý thanh toán | `GET /api/admin/payments` | `/admin/payments` |
| **AD-HT01**   | Báo cáo tổng quan Admin | `GET /api/admin/overview` | `/admin/overview` |
| **AD-HT02**   | Gửi thông báo hệ thống | `POST /api/admin/broadcast` | `/admin/notifications` |
| **AD-HT03**   | Báo cáo tài chính Admin | `GET /api/admin/financials` | `/admin/financials` |
| **AD-HT06**   | Phân quyền truy cập | `GET /api/admin/access-control`| `/admin/access-control` |
