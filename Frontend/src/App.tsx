
import { Routes,Route } from 'react-router-dom'
import './App.css'
import UserRoutes from './routes/UserRoutes'
import AdminRoutes from './routes/AdminRoutes'
import HostRoutes from './routes/HostRoutes'


function App() {
 
  // console.log("secret",import.meta.env.VITE_GOOGLE_API_KEY)
  return(
  //   <>
  //  <Outlet />
  //   </>
  <Routes>
    <Route path="/*" element={<UserRoutes/>} />
    <Route path='/admin/*' element={<AdminRoutes />} />
    <Route path='/host/*' element={<HostRoutes />} />
    
  </Routes>
  )
}

export default App
