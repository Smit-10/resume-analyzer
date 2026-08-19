import Home from "./pages/Landing/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Login from "./pages/Auth/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import Signup from "./pages/Auth/Signup"
import { AuthProvider } from "./context/AuthContext"
import History from "./pages/History/History"
import AnalysisDetails from "./pages/History/AnalysisDetails"
import ResumeManagement from "./pages/Resume/ResumeManagement"
import AppLayout from "./components/layout/AppLayout"
import ProtectedRoute from "./components/auth/ProtectedRoute"

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


          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>

            {/* Dashboard */}
            <Route path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } 
            />

            {/* Analysis history */}
            <Route path="/history"
            element={
              <AppLayout>
                <History />
              </AppLayout>
            }
              />

            {/* Analysis Detail */}
            <Route path="/history/:analysisId"
            element={
              <AppLayout>
                <AnalysisDetails />
              </AppLayout>
            }
            />

            {/* Resume management */}
            <Route path="/management"
            element={
              <AppLayout>
                <ResumeManagement />
              </AppLayout>
            }  
            />
        </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App