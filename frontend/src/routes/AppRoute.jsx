import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import History from '../pages/History';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Speaking from '../pages/Speaking.jsx';
import Home from '../pages/Home';

const AppRouter = () => {
    const { isLoggedIn } = useAuth(); // Lấy từ Context

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            {/* Private Routes */}
            <Route path="/History" element={isLoggedIn ? <History /> : <Navigate to="/Login" />} />
            <Route path="/Speaking" element={isLoggedIn ? <Speaking /> : <Navigate to="/Login" />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRouter;