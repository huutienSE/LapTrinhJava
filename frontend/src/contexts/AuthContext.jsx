import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api"; // Đảm bảo đường dẫn import đúng

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mẹo: Kiểm tra token khi F5 (Refresh) trang để giữ trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Nếu có token, bạn có thể gọi thêm 1 API lấy profile user ở đây
    if (token) {
        setIsLoggedIn(true);
        // Tạm thời set true, nếu token hết hạn apiClient sẽ tự đá văng ra login

        // nếu muốn có thể lưu user vào localStorage luôn
        const user = localStorage.getItem("user");

        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }
  }, []);

  const handleLogin = async (formData) => {
    try {
      const response = await authService.login(formData); 
      
      // response backend:
          // response.data.token
      const userData = response.data;

      if (userData && userData.token) {

          // lưu token
          localStorage.setItem("token", userData.token);

          // lưu user
          localStorage.setItem("user", JSON.stringify(userData));

          setCurrentUser(userData);
          setIsLoggedIn(true);
      }

      return response;
        
    } catch (error) {
        console.error("Lỗi đăng nhập", error);
        throw error; // Ném lỗi ra để component Login hiển thị thông báo
    }
  };

  const handleLogOut = () => {
    // Phải xóa token để cắt đứt quyền truy cập
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, handleLogin, handleLogOut }}>
      {children}
    </AuthContext.Provider>
  );
};