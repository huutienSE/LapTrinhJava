import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import History from '../pages/History'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Speaking from '../pages/Speaking'
import Home from '../pages/Home'

const AppRouter = (props) => {
    return (
        <Routes>
            <Route path="/History" element={props.isLoggedIn ? <History/> : <Navigate to="/Login"/>} />
            <Route path="/Login" element={<Login isLoggedIn={props.isLoggedIn} handleLogOut={props.handleLogOut} handleLogin={props.handleLogin} />}/>
            <Route path="/Register" element={<Register/>}/>
            <Route path="/Speaking" element={props.isLoggedIn ? <Speaking/> : <Navigate to="/Login"/>} />
            <Route path="/" element={<Home/>}/>
            <Route path="#" element={<Home/>}/>
        </Routes>
    )
}

export default AppRouter