import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const location = useLocation();
  const { isLoggedIn, handleLogOut, currentUser } = useAuth(); // Lấy từ Context

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/speaking", label: "Speaking" },
    { path: "/history", label: "History" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                AESP
            </span>
        </Link>

        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname.toLowerCase() === link.path.toLowerCase();
            if ((link.path === "/speaking" || link.path === "/history") && !isLoggedIn) return null;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm font-medium transition-colors ${isActive ? "text-indigo-400" : "text-zinc-400 hover:text-white"}`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400 hidden sm:block">
                Hi, <span className="text-white font-medium">{currentUser?.firstName || 'User'}</span>
              </span>
              <button 
                onClick={handleLogOut}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-300 transition-all border border-transparent hover:border-red-500/50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="text-sm font-medium px-4 py-2 text-zinc-300 hover:text-white transition-colors">Log in</Link>
              <Link to="/register" className="text-sm font-medium px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all active:scale-95">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;