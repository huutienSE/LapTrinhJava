import { createContext, useContext, useState, useEffect } from "react";
import { authService, profileService } from "../services";
import { clearStoredProfile, saveStoredProfile } from "../utils/learnerProfileStorage";

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoggedIn(true);
        // Tạm thời set true, nếu token hết hạn apiClient sẽ tự đá văng ra login

        // nếu muốn có thể lưu user vào localStorage luôn
        const user = localStorage.getItem("user");

        if (user) {
            const parsed = JSON.parse(user);
            setCurrentUser(parsed);

            if (parsed.role === "LEARNER") {
                profileService.getMe().then(res => {
                    if (res.success && res.data) {
                        saveStoredProfile(res.data);
                    }
                }).catch(() => {
                    clearStoredProfile();
                });
            }
        }
    }
  }, []);

  const handleLogin = async (formData) => {
    try {
      const response = await authService.login(formData); 
      
      // response backend:
          // response.data.token
      const userData = response.data;
      console.log(userData)

      if (userData && userData.token) {

          // lưu token
          localStorage.setItem("token", userData.token);

          // lưu user
          localStorage.setItem("user", JSON.stringify(userData));

          setCurrentUser(userData);
          setIsLoggedIn(true);

          if (userData.role === "LEARNER") {
              try {
                  const profileRes = await profileService.getMe();
                  if (profileRes.success && profileRes.data) {
                      saveStoredProfile(profileRes.data);
                  }
              } catch {
                  clearStoredProfile();
              }
          }
      }

      return response;
        
    } catch (error) {
        console.error("Lỗi đăng nhập", error);
        throw error; // Ném lỗi ra để component Login hiển thị thông báo
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearStoredProfile();

    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, handleLogin, handleLogOut }}>
      {children}
    </AuthContext.Provider>
  );
};