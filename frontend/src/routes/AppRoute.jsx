import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import History from '../pages/user/History.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import Speaking from '../pages/user/Speaking.jsx';
import Home from '../pages/user/Home.jsx';
import SessionDetail from '../pages/user/SessionDetail.jsx';
import Profile from '../pages/user/Profile.jsx';
import Assessment from '../pages/user/Assessment.jsx';

import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

import UserLayout from '../components/layouts/UserLayout';

import AdminLayout from "../components/layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import ManageTopics from "../pages/admin/ManageTopics";
import ManageQuestions from "../pages/admin/ManageQuestions";
import ManageUsers from "../pages/admin/ManageUsers";

const HomeRedirect = () => {
    const { currentUser, isLoggedIn } = useAuth();

    // Nếu đã login và là ADMIN -> vào dashboard
    if (isLoggedIn && currentUser?.role === "ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    // Ngược lại render Home bình thường
    return <Home />;
};

const AppRouter = () => {
    return (
        <Routes>

            {/* USER LAYOUT */}
            <Route element={<UserLayout />}>

                {/* Public */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected */}
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/assessment" element={<Assessment />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/speaking" element={<Speaking />} />
                    <Route path="/history/:sessionId" element={<SessionDetail />} />
                </Route>

            </Route>

            {/* ADMIN */}
            <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/topics" element={<ManageTopics />} />
                    <Route path="/admin/questions" element={<ManageQuestions />} />
                    <Route path="/admin/users" element={<ManageUsers />} />
                </Route>
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />


        </Routes>
    );
};

export default AppRouter;