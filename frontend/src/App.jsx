import { useState } from "react";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRoute";



function App () {

  const [registerData, setRegister] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    email: "",
    password: "",
  })

  const [currentUSer, setCurrentUSer] = useState(null) 

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    // thêm khi cần thêm tính năng thêm role, rule
    setCurrentUSer(userData)
  }
  
  const handleLogOut = () => {
    setIsLoggedIn(false)
    // thêm khi cần thêm tính năng thêm role, rule
    setCurrentUSer(null)
  }
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30">
      <Navbar/>
      <main className="container mx-auto px-4 py-8">
        <AppRouter isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogOut={handleLogOut} registerData={registerData}  setRegister={setRegister}/>
      </main>
    </div>
  )
}

export default App