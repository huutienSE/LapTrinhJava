import { useState } from "react";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRoute";



function App () {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {setIsLoggedIn(true)}
  
  const handleLogOut = () => {setIsLoggedIn(false)}
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30">
      <Navbar/>
      <main className="container mx-auto px-4 py-8">
        <AppRouter isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogOut={handleLogOut}/>
      </main>
    </div>
  )
}

export default App