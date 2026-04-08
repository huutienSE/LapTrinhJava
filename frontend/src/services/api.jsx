// Giả lập một database nhỏ trong bộ nhớ
const MOCK_USER = {
  email: "admin@gmail.com",
  password: "123"
};

export const authService = {
  // Giả lập API Đăng nhập
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      console.log("Calling API Login với dữ liệu:", credentials);
      
      setTimeout(() => {
        if (credentials.email === MOCK_USER.email && credentials.password === MOCK_USER.password) {
          resolve({ success: true, message: "Đăng nhập thành công!", user: { name: "Admin" } });
        } else {
          reject({ success: false, message: "Email hoặc mật khẩu không đúng!" });
        }
      }, 1000);
    });
  },

  // Giả lập API Đăng ký
  register: async (userData) => {
    return new Promise((resolve) => {
      console.log("Calling API Register với dữ liệu:", userData);
      
      setTimeout(() => {
        // Luôn trả về thành công trong bản giả lập
        resolve({ success: true, message: "Đăng ký tài khoản thành công!" });
      }, 1500);
    });
  }
};