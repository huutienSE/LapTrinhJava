import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <AppRouter />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;