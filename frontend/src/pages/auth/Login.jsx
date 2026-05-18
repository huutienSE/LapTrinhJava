import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { fieldErrorClass, getApiErrorMessage, parseApiError } from "../../utils/apiError.js";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, currentUser, handleLogin } = useAuth();

    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!isLoggedIn) return;
        const user = currentUser ?? JSON.parse(localStorage.getItem("user") || "null");
        navigate(user?.role === "ADMIN" ? "/admin" : "/", { replace: true });
    }, [isLoggedIn, currentUser, navigate]);

    useEffect(() => {
        if (location.state?.registered) {
            setSuccessMessage("Đăng ký thành công. Vui lòng đăng nhập.");
            navigate("/login", { replace: true, state: null });
        }
    }, [location.state, navigate]);

    const [formData, setFormData] = useState({ email: "", password: "" });

    const {email, password} = formData; 
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
        if (successMessage) setSuccessMessage("");
        if (fieldErrors[e.target.name]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[e.target.name];
                return next;
            });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setFieldErrors({});
        try {
            const response = await handleLogin(formData);
            const user = response.data || JSON.parse(localStorage.getItem("user"));
            if (user?.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            const { formError, fieldErrors: errors } = parseApiError(err);
            setFieldErrors(errors || {});
            setError(formError || (errors ? "" : getApiErrorMessage(err, "Đăng nhập thất bại")));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-200 font-sans">
            <div className="bg-zinc-900/50 p-10 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-md mx-4">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-semibold tracking-tight text-white">Chào mừng trở lại</h2>
                    <p className="text-zinc-500 mt-2 text-sm">Vui lòng nhập thông tin để đăng nhập</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-xl text-sm">
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-zinc-400 ml-1">email</label>
                        <input 
                        id="email"
                        type="email"
                        name="email"
                        placeholder="email"
                        value={email}
                        onChange={onChange} 
                        className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 placeholder:text-zinc-600"
                        required
                        />
                        {fieldErrors.email && (
                            <p className={fieldErrorClass}>{fieldErrors.email}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-zinc-400">password</label>
                        <input 
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={onChange}
                        className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 placeholder:text-zinc-600"
                        required
                        />
                        {fieldErrors.password && (
                            <p className={fieldErrorClass}>{fieldErrors.password}</p>
                        )}
                    </div>

                    <button disabled={isLoading}
                    className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3 rounded-xl transition-all duration-200 active:scale-[0.98] mt-4">Đăng nhập</button>
                    {isLoading ? "Đang xử lý..." : ""}
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-zinc-500">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;