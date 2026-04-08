import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav >
            <h2>Logo</h2>
            <div>
                <Link to="/Speaking">Speaking</Link>
                <Link to="/Login">Login</Link>
                <Link to="/Register">Register</Link>
                <Link to="/Speaking">Speaking</Link>
                <Link to="/History" >History</Link>
                <Link to="/" >Home</Link>
            </div>
        </nav>
    )
}

export default Navbar