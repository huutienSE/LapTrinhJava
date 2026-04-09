import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import { authService } from "../services/api";

const Login = ({isLoggedIn, handleLogin, handleLogOut}) =>{

    const navigate = useNavigate();

    const initialData = {
        email: "",
        password: "",
    }
    
    const [formData, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const {value, name, type} = e.target

        if (type === "email") {
            setData({
                ...formData,
                [name]: value,
            })
        } 
        else if (type === "password") {
            setData({
                ...formData,
                [name]: value,
            })
        }
        if (error) setError("")
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)
        
        // TODO: gọi API backend
        setIsLoading(true);

        try {
            const response = await authService.login(formData)
            alert(response.message);
            handleLogin();
            
            navigate("/")
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }

        
    }

    const {
        email,
        password,
    } = formData

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-200 font-sans">
            <div className="bg-zinc-900/50 p-10 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-md mx-4">
                
                {!isLoggedIn ? (
                    <>
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-semibold tracking-tight text-white">Chào mừng trở lại</h2>
                            <p className="text-zinc-500 mt-2 text-sm">Vui lòng nhập thông tin để đăng nhập</p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-6">
                            {error && <div>{error}</div>}

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-zinc-400 ml-1">email</label>
                                <input 
                                id="email"
                                type="email"
                                name="email"
                                placeholder="email"
                                value={email}
                                onChange={onChange} 
                                className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 placeholder:text-zinc-600"/>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-zinc-400">password</label>
                                <input 
                                id="password"
                                type="password"
                                name="password"
                                placeholder="password"
                                value={password}
                                onChange={onChange}
                                className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 placeholder:text-zinc-600"
                                required
                                />
                            </div>

                            <button disabled={isLoading} className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3 rounded-xl transition-all duration-200 active:scale-[0.98] mt-4">submit</button>
                            {isLoading ? "Đang xử lý..." : ""}
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-zinc-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign up</Link>
                            </p>
                        </div>
                    </>
                ) : 
                (
                    <div className="text-center space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-semibold tracking-tight text-white">Bạn đã đăng nhập</h2>
                            <p className="text-zinc-500 text-sm">Chào mừng bạn đã quay lại với hệ thống AESP</p>
                        </div>
                        
                        <div className="py-8">
                            {/* Một icon minh họa cho "User" */}
                            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto border border-indigo-500/50">
                                <span className="text-3xl">👤</span>
                            </div>
                        </div>

                        <button 
                        onClick={() => {
                            handleLogOut();
                            navigate("/");
                        }}
                        className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold py-3 rounded-xl transition-all duration-200 border border-red-500/50"
                        >
                        Đăng xuất ngay
                        </button>
                        
                        <p className="text-xs text-zinc-600">Bạn muốn tiếp tục luyện tập? Hãy vào trang Speaking.</p>
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default Login 