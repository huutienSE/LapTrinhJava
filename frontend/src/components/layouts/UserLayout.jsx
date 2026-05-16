import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const UserLayout = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;