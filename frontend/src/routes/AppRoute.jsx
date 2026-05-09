import { Routes, Route, Navigate } from 'react-router-dom';
import History from '../pages/user/History.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import Speaking from '../pages/user/Speaking.jsx';
import Home from '../pages/user/Home.jsx';
import SessionDetail from '../pages/user/SessionDetail.jsx';

import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

import UserLayout from '../components/layouts/UserLayout';

import AdminLayout from "../components/layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import ManageTopics from "../pages/admin/ManageTopics";
import ManageQuestions from "../pages/admin/ManageQuestions";
import ManageUsers from "../pages/admin/ManageUsers";

const AppRouter = () => {
    return (
        <Routes>

            {/* USER LAYOUT */}
            <Route element={<UserLayout />}>

                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected */}
                <Route element={<PrivateRoute />}>
                    <Route path="/history" element={<History />} />
                    <Route path="/speaking" element={<Speaking />} />
                    <Route path="/history/:sessionId" element={<SessionDetail />} />
                </Route>

            </Route>

            {/* ADMIN */}
            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    {/* /admin */}
                    <Route index element={<Dashboard />} />
                    {/* /admin/topics */}
                    <Route
                        path="topics"
                        element={<ManageTopics />}
                    />
                    {/* /admin/questions */}
                    <Route
                        path="questions"
                        element={<ManageQuestions />}
                    />
                    {/* /admin/users */}
                    <Route
                        path="users"
                        element={<ManageUsers />}
                    />
                </Route>
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    );
};

export default AppRouter;