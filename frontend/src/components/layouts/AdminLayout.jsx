import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
    const location = useLocation();

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

    return (
        <div className="flex min-h-screen bg-zinc-950 text-white">

            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">

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
            </aside>

            {/* Content */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;