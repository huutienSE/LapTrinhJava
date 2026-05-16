# AI-Friendly Backend Documentation

## 1. Mục đích
Tài liệu này mô tả các thành phần chính trong backend của dự án EnglishApp để AI hoặc người mới có thể đọc và hiểu nhanh cấu trúc, luồng dữ liệu và chức năng.

## 2. Tổng quan dự án
- Framework: Spring Boot
- Ngôn ngữ: Java 26
- Database: MySQL
- ORM: JPA/Hibernate
- Security: Spring Security, JWT, BCrypt password encoding
- Kiến trúc: Layered Architecture (Controller -> Service -> Repository -> Entity)

## 3. Cấu trúc package chính
- `com.englishapp.controller`: REST controllers xử lý HTTP request và trả response.
- `com.englishapp.service`: Định nghĩa interface của business logic.
- `com.englishapp.service.impl`: Triển khai cụ thể service.
- `com.englishapp.repositoty`: JpaRepository interfaces truy xuất dữ liệu DB.
- `com.englishapp.entity`: Entity ánh xạ tới bảng database.
- `com.englishapp.dto`: Data Transfer Objects trao đổi dữ liệu giữa client và server.
- `com.englishapp.security`: Cấu hình bảo mật JWT, filter, và lớp người dùng.
- `com.englishapp.config`: Cấu hình bảo mật bổ sung và password encoder.
- `com.englishapp.exception`: Xử lý lỗi và exception tùy chỉnh.
- `com.englishapp.common`: Các lớp chung dùng cho response chuẩn.

## 4. Luồng xử lý chính
1. Client gửi HTTP request đến endpoint.
2. Controller nhận request và ánh xạ JSON vào DTO.
3. Controller gọi Service để xử lý business logic.
4. Service gọi Repository để truy vấn hoặc lưu dữ liệu.
5. Repository tương tác với database thông qua JPA.
6. Kết quả trả về Controller.
7. Controller trả response JSON cho client.

## 5. Các lớp quan trọng
### 5.1 `BackendApplication`
- Điểm khởi chạy ứng dụng Spring Boot.
- Chứa `SpringApplication.run(BackendApplication.class, args);`.

### 5.2 Controllers
Các controllers chính:
- `AuthController`: Xử lý đăng ký, đăng nhập, xác thực.
- `ProfileController`: Quản lý thông tin hồ sơ người dùng.
- `PracticeController`: Quản lý buổi luyện tập, câu trả lời thực hành.
- `TopicController`: Lấy danh sách chủ đề.
- `AssessmentController`, `TestController`: Quản lý bài đánh giá và bài kiểm tra.

### 5.3 Service
- `AuthService` / `AuthServiceImpl`: Đăng ký người dùng, đăng nhập, quản lý role.
- `ProfileService` / `ProfileServiceImpl`: Lấy và cập nhật profile.
- `PracticeService` / `PracticeServiceImpl`: Tạo buổi luyện tập, lấy lịch sử, tính kết quả.
- `TopicService` / `TopicServiceImpl`: Lấy danh sách topic.
- `QuestionService` / `QuestionServiceImpl`: Lấy câu hỏi ngẫu nhiên theo chủ đề.

### 5.4 Repository
- `UserRepository`: Truy vấn `User` theo email, id.
- `RoleRepository`: Truy vấn `Role` theo `RoleName`.
- `UserRoleRepository`: Lưu quan hệ user-role.
- `TopicRepository`, `QuestionRepository`, `PracticeSessionRepository`, `PracticeAnswerRepository`, `ProfileRepository`: Các repository khác tương ứng với entity.

### 5.5 Entity
Các entity quan trọng:
- `User`: Thông tin người dùng.
- `Role`: Vai trò người dùng.
- `UserRole`: Quan hệ giữa user và role.
- `Topic`: Chủ đề luyện tập.
- `Question`: Câu hỏi.
- `PracticeSession`: Phiên luyện tập.
- `PracticeAnswer`: Câu trả lời trong phiên luyện tập.
- `Profile`: Hồ sơ học viên.
- `Subscription`, `Plan`, `Assessment`, `Feedback`, `AdminLog`: Các thực thể bổ sung.

### 5.6 DTO
DTO dùng để nhận request và trả response qua API:
- `LoginRequest`, `LoginResponse`
- `RegisterRequest`, `RegisterResponse`
- Các DTO khác theo module: profile, practice, assessment, topic, question.

### 5.7 Security
- `SecurityConfig`: Cấu hình Spring Security, JWT, CORS, password encoder.
- `JwtAuthFilter`: Lọc request JWT, xác thực và load user.
- `UserPrincipal`: Wrapper cho `User` trong security context.
- `PasswordConfig`: Cấu hình `PasswordEncoder` với BCrypt.

### 5.8 Exception
- Custom exceptions như `EmailAlreadyExistsException`, `ForbiddenException`, `RoleNotFoundException`.
- Global exception handler xử lý và trả lỗi chuẩn cho client.

## 6. Luồng đăng ký người dùng (`register`)
1. Client gửi `POST /api/auth/register`.
2. `AuthController.register()` nhận `RegisterRequest` từ body.
3. `AuthServiceImpl.register()`:
   - Chuẩn hóa và kiểm tra email.
   - Kiểm tra xem email đã tồn tại chưa.
   - Mã hóa mật khẩu bằng BCrypt.
   - Lưu `User` mới.
   - Lấy role `LEARNER` từ `RoleRepository`.
   - Tạo và lưu `UserRole`.
4. Trả `RegisterResponse` cho client.

## 7. Mối quan hệ entity chính
- `User` 1-n `UserRole`.
- `Role` 1-n `UserRole`.
- `UserRole` là bảng liên kết nhiều-nhiều.
- `Topic` 1-n `Question`.
- `PracticeSession` 1-n `PracticeAnswer`.
- `User` 1-n `PracticeSession`.
- `User` 1-1 `Profile`.

## 8. Cấu hình cơ bản
File cấu hình: `src/main/resources/application.properties`
- `spring.datasource.url`: `jdbc:mysql://localhost:3306/aesp_database`
- `spring.datasource.username`: `root`
- `spring.datasource.password`: `123456`
- `spring.jpa.hibernate.ddl-auto`: `update`
- `spring.jpa.show-sql`: `true`

## 9. Chú thích cho AI
- `Controller` đóng vai trò nhận API request và trả response.
- `Service` chứa logic nghiệp vụ, không làm trực tiếp truy vấn DB.
- `Repository` tương tác với DB, trả entity.
- `Entity` mô tả cấu trúc bảng database.
- `DTO` mô tả dữ liệu truyền qua API.
- `Security` đảm bảo xác thực và phân quyền.
- `Exception` dùng để báo lỗi rõ ràng khi dữ liệu không hợp lệ hoặc quyền bị từ chối.

## 10. Kết luận
Backend này là một ứng dụng Spring Boot chuẩn với layer rõ ràng và tách biệt. AI cần đọc theo thứ tự: controller -> service -> repository -> entity, đồng thời tham khảo DTO và security để hiểu cách dữ liệu được chuyển và bảo mật.
