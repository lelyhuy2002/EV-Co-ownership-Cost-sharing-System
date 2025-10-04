# API Integration Guide

## Tổng quan
Đã tích hợp thành công API login từ Backend (Spring Boot) với Frontend (Next.js).

## Cấu trúc API

### Backend API Endpoint
- **URL**: `http://localhost:8080/api/auth/login`
- **Method**: POST
- **Content-Type**: application/json

### Request Format
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Login successful",
  "userId": 1,
  "fullName": "John Doe",
  "email": "user@example.com",
  "role": "user"
}
```

## Các file đã tạo/cập nhật

### 1. API Service (`FE/src/lib/api.ts`)
- Tạo class `ApiService` để xử lý các request API
- Định nghĩa interfaces cho `LoginRequest` và `LoginResponse`
- Xử lý error handling

### 2. Auth Context (`FE/src/contexts/AuthContext.tsx`)
- Tạo React Context để quản lý trạng thái authentication
- Cung cấp các functions: `login`, `logout`
- Tự động redirect dựa trên role của user
- Lưu trữ user data trong localStorage

### 3. Login Page (`FE/src/login/page.tsx`)
- Cập nhật để sử dụng API thực từ backend
- Thêm error handling và loading states
- Hiển thị thông báo lỗi khi login thất bại

### 4. User Profile Component (`FE/src/components/UserProfile/`)
- Component hiển thị thông tin user
- Dropdown menu với thông tin chi tiết
- Nút logout

### 5. Header Component (`FE/src/components/Header/Header.tsx`)
- Cập nhật để hiển thị UserProfile khi đã đăng nhập
- Ẩn nút login/register khi user đã authenticated

### 6. Layout (`FE/src/app/layout.tsx`)
- Thêm `AuthProvider` để wrap toàn bộ app

## Cách sử dụng

### 1. Khởi động Backend
```bash
cd BE
./mvnw spring-boot:run
```

### 2. Khởi động Frontend
```bash
cd FE
npm run dev
```

### 3. Test Login
1. Truy cập `http://localhost:3000/login`
2. Nhập email và password
3. Click "Log In"
4. Nếu thành công, sẽ được redirect đến:
   - `/admin` nếu role là admin
   - `/dashboard` nếu role là user

## Tính năng

### ✅ Đã hoàn thành
- [x] Kết nối API login từ BE
- [x] Error handling và validation
- [x] Loading states
- [x] User context management
- [x] Auto redirect dựa trên role
- [x] User profile component
- [x] Logout functionality
- [x] Persistent login (localStorage)

### 🔄 Có thể mở rộng
- [ ] Remember me functionality
- [ ] Password reset
- [ ] Google OAuth integration
- [ ] JWT token refresh
- [ ] Role-based route protection

## Lưu ý
- API URL hiện tại được hardcode là `http://localhost:8080`
- Để thay đổi, cập nhật biến `API_BASE_URL` trong `FE/src/lib/api.ts`
- Backend cần chạy trên port 8080
- Frontend chạy trên port 3000

## Troubleshooting

### Lỗi "ApiError is not defined"
- **Nguyên nhân**: ApiError được định nghĩa như interface nhưng sử dụng như class
- **Giải pháp**: Đã sửa thành class extends Error với constructor
- **File**: `FE/src/lib/api.ts`

### Lỗi CORS
- Nếu gặp lỗi CORS, cần cấu hình CORS trong Spring Boot backend
- Thêm `@CrossOrigin(origins = "http://localhost:3000")` vào AuthController
- **Đã thêm**: CORS configuration vào AuthController

### Lỗi "Failed to fetch"
- **Nguyên nhân**: Backend server không chạy hoặc không thể kết nối
- **Giải pháp**: 
  1. Khởi động backend: `cd BE && ./mvnw spring-boot:run`
  2. Kiểm tra backend chạy trên port 8080
  3. Sử dụng component ApiTest để test kết nối
- **Đã cải thiện**: Error handling cho network errors với thông báo tiếng Việt
