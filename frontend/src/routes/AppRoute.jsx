import {BrowserRouter, Routes, Route} from 'react-router-dom'
import History from '../pages/History'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Speaking from '../pages/Speaking'
import Home from '../pages/Home'

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/History" element={<History/>}/>
            <Route path="/Login" element={<Login/>}/>
            <Route path="/Register" element={<Register/>}/>
            <Route path="/Speaking" element={<Speaking/>}/>
            <Route path="/" element={<Home/>}/>
        </Routes>
    )
}

export default AppRouter