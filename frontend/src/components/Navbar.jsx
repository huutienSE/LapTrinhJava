import { Link } from "react-router-dom";

function Navbar() {
  

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
            A
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AESP</span>
        </Link>

        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Home</Link>
          <Link to="/speaking" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Speaking</Link>
          <Link to="/history" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">History</Link>
        </div>

        
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-2">
            Đăng nhập
          </Link>
          <Link to="/register" className="text-sm font-medium bg-zinc-100 text-zinc-950 hover:bg-white px-4 py-2 rounded-lg transition-all active:scale-95">
            Đăng ký
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;