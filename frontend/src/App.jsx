import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;