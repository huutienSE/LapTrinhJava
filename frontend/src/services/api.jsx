// Giả lập một database nhỏ trong bộ nhớ
// const MOCK_USER = {
//   email: "admin@gmail.com",
//   password: "123"
// };
import mockData from "./mockData"

export const authService = {
  // Giả lập API Đăng nhập
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      console.log("Calling API Login với dữ liệu:", credentials);
      
      setTimeout(() => {

        const user = mockData.find((u) => 
          {return u.email === credentials.email && u.password === credentials.password}
        )

        console.log(user)
        if (user) {
          resolve({ success: true, message: "Đăng nhập thành công!", user: user});
        } else {
          reject({ success: false, message: "Email hoặc mật khẩu không đúng!" });
        }
      }, 1000);
    });
  },

  // Giả lập API Đăng ký
  register: async (userData) => {
    return new Promise((resolve, reject) => {
      console.log("Calling API Register với dữ liệu:", userData);
      
      setTimeout(() => {
        // Luôn trả về thành công trong bản giả lập
        const newUser = mockData.find((u) => 
           u.email === userData.email
        )

        if (!newUser) {
          resolve({ success: true, message: "Đăng ký tài khoản thành công!" });
          mockData.push(userData)
          console.log(mockData)
        } else {
          reject({success: false, message:"Email đã được sử dụng!"})
        }
        
      }, 1500);
    });
  }
};