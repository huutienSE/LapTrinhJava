import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", tel: "", email: "", password: "",
  });

  const {firstName, lastName, tel, email, password} = formData;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await authService.register(formData);
        alert(response.message);
        navigate("/login"); // Đăng ký thành công thì đá sang Login
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    // Copy y hệt UI Register cũ của bạn vào đây
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-200 font-sans p-4">
      {/* Card Register - Rộng hơn Login một chút (max-w-xl) vì có nhiều field hơn */}
      <div className="bg-zinc-900/50 p-8 md:p-10 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-xl">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Tạo tài khoản</h2>
          <p className="text-zinc-500 mt-2 text-sm">Tham gia cùng chúng tôi ngay hôm nay</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
            {error && <div>{error}</div> }
          
          {/* Group: First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-zinc-400 ml-1">Họ</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Nguyễn"
                value={firstName}
                onChange={onChange}
                className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-zinc-400 ml-1">Tên</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Văn A"
                value={lastName}
                onChange={onChange}
                className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                required
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <label htmlFor="tel" className="text-sm font-medium text-zinc-400 ml-1">Số điện thoại</label>
            <input
              type="tel"
              id="tel"
              name="tel"
              placeholder="090 123 4567"
              value={tel}
              onChange={onChange}
              className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-400 ml-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={onChange}
              className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
              required
            />
          </div>

          {/* Mật khẩu */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-zinc-400 ml-1">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={onChange}
              className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
              required
            />
          </div>

          <button
          disabled={isLoading}
            type="submit"
            className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3 rounded-xl transition-all duration-200 active:scale-[0.98] mt-6"
          >
            Đăng ký tài khoản
          </button>
            {isLoading ? "Đanng khởi tạo..." : ""}    

        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;