import Navbar from "./components/Navbar"
import { Routes , Route ,Navigate} from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuthStore } from "./stores/useAuthStore.js"
import { useThemeStore } from "./stores/useThemeStore.js"
import { useEffect } from "react"
import {Loader} from "lucide-react"
import { Toaster } from "react-hot-toast"

function App() {

  const {authUser, checkAuth , isCheckingAuth} = useAuthStore();
  const{ theme } = useThemeStore();

  useEffect(() => {
   checkAuth();
   
  }, [checkAuth])

  if (!authUser && isCheckingAuth) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"></Loader>
    </div>

  );
  


  return (

    <div data-theme={theme}>"
    
    <Navbar></Navbar>

     <Routes>

      <Route path="/" element={authUser? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/signup" element={!authUser? <SignUpPage /> : <Navigate to="/" />  } />
      <Route path="/login" element={! authUser?<LoginPage /> : <Navigate to="/"/>} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to="/login" />} />
      
     </Routes>
    <Toaster></Toaster>
    </div>
  )
}

export default App