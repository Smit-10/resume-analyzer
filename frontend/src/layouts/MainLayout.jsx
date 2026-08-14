import Navbar from "../pages/Landing/Navbar";

function MainLayout({children}) {
  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main>
            {children}
        </main>
    </div>
  )
}

export default MainLayout