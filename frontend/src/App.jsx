import Home from "./pages/Landing/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Login from "./pages/Auth/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import Signup from "./pages/Auth/Signup"
import { AuthProvider } from "./context/AuthContext"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route
          path="/" 
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
          />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Signup Page */}
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
