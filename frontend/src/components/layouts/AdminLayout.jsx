import { Link, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ActionButton from "../common/ActionButton";
const AdminLayout = () => {
    const location = useLocation();

    const navigate = useNavigate();

    const {handleLogOut} = useAuth();

    const menus = [
        {
            path: "/admin",
            label: "Dashboard",
        },
        {
            path: "/admin/topics",
            label: "Topics",
        },
        {
            path: "/admin/questions",
            label: "Questions",
        },
        {
            path: "/admin/users",
            label: "Users",
        },
    ];

    const handleAdminLogOut = () => {
        handleLogOut();
        navigate("/login");
    }

    return (
        <div className="flex min-h-screen bg-zinc-950 text-white">

            {/* Sidebar */}
            <aside className="flex flex-col fixed top-0 lèt-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 p-6">

                <div>
                    <h1 className="text-2xl font-bold text-indigo-400 mb-10">
                        Admin Panel
                    </h1>

                    <nav className="flex flex-col gap-2">
                        {menus.map((menu) => {
                            const isActive = location.pathname === menu.path;

                            return (
                                <Link
                                    key={menu.path}
                                    to={menu.path}
                                    className={`px-4 py-3 rounded-xl transition ${
                                        isActive
                                            ? "bg-indigo-500 text-white"
                                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                    }`}
                                >
                                    {menu.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-auto">
                    <ActionButton
                        variant="logout"
                        onClick={() =>
                            handleAdminLogOut()
                        }
                    >
                        Log Out
                    </ActionButton>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 h-screen ml-64 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;