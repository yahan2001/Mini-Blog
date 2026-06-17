# MiniBlog

MiniBlog là ứng dụng blog full-stack dùng React, Express và MongoDB. Dự án hỗ trợ đăng ký/đăng nhập, viết bài, quản lý bài viết, tìm kiếm bài viết, bình luận, thích bài viết, thông báo và upload ảnh thumbnail qua ImageKit.

## Tính Năng

- Xem danh sách bài viết đã xuất bản.
- Tìm kiếm bài viết theo tiêu đề, phụ đề, danh mục, mô tả và nội dung.
- Xem chi tiết bài viết bằng slug hoặc id.
- Đăng ký tài khoản tác giả với họ tên, username, email và mật khẩu.
- Đăng nhập bằng JWT.
- Tạo, sửa, xoá, publish/unpublish bài viết.
- Lưu nháp và xem bài viết của chính mình.
- Tạo nội dung bằng Gemini AI.
- Upload ảnh thumbnail lên ImageKit.
- Thích bài viết, bình luận và nhận thông báo.
- Cập nhật hồ sơ cá nhân.

## Công Nghệ

**Frontend**

- React
- Vite
- React Router
- Axios
- React Quill
- React Icons
- Tailwind CSS

**Backend**

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Multer
- ImageKit
- Google Gemini API

## Cấu Trúc Dự Án

```text
MiniBlog/
├─ client/
│  ├─ src/
│  │  ├─ assets/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ pages/
│  │  └─ utils/
│  ├─ package.json
│  └─ vite.config.js
├─ server/
│  ├─ configs/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ utils/
│  ├─ package.json
│  └─ server.js
└─ README.md
```

## Cài Đặt

### 1. Cài dependency

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Tạo file môi trường cho server

Tạo file `server/.env` dựa trên `server/.env.example`:

```env
JWT_SECRET=your_super_secret_key_here

ADMIN_EMAIL=admin@miniblog.com
ADMIN_PASSWORD=admin123

MONGODB_URI=mongodb://localhost:27017/miniblog

GEMINI_KEY=your_gemini_api_key_here

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

PORT=3000
```

### 3. Tạo file môi trường cho client

Tạo file `client/.env`:

```env
VITE_BASE_URL=http://localhost:3000
```

## Chạy Dự Án

Mở 2 terminal riêng.

Terminal 1: chạy backend

```bash
cd server
npm run dev
```

Terminal 2: chạy frontend

```bash
cd client
npm run dev
```

Sau đó mở địa chỉ Vite hiển thị trong terminal, thường là:

```text
http://localhost:5173
```

Backend chạy mặc định tại:

```text
http://localhost:3000
```

## Scripts

### Client

```bash
npm run dev      # Chạy Vite dev server
npm run build    # Build frontend
npm run preview  # Preview bản build
npm run lint     # Kiểm tra lint
```

### Server

```bash
npm run dev      # Chạy server bằng nodemon
npm run start    # Chạy server bằng node
```

## Ghi Chú

- File upload bài viết đang được lưu lên ImageKit trong folder `/blog`.
- Database chỉ lưu URL ảnh, không lưu trực tiếp file ảnh/video.
- Tài khoản admin được seed từ `ADMIN_EMAIL` và `ADMIN_PASSWORD` khi server khởi động.
- Nếu dùng MongoDB Atlas, thay `MONGODB_URI` trong `server/.env` bằng connection string của Atlas.
- Nếu không cấu hình `GEMINI_KEY`, chức năng tạo nội dung bằng AI sẽ không hoạt động.

## Kiểm Tra

Chạy lint frontend:

```bash
cd client
npm run lint
```
