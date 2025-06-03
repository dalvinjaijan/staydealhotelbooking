import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HostLogin from '../componenets/pages/host/HostLogin'
import HostSignup from '../componenets/pages/host/HostSignup'
import VerifyOtp from '../componenets/pages/host/VerifyOtp'
import HostHome from '../componenets/pages/host/HostHome'
import ProtectedRoutes from '../componenets/pages/host/ProtectedRoutes'
import AddHotel from '../componenets/pages/host/AddHotel'
import AddRoom from '../componenets/pages/host/AddRoom'
import AddHotelPolicy from '../componenets/pages/host/AddHotelPolicy'
import ManageHotelRequest from '../componenets/pages/admin/ManageHotelRequest'
import HotelDetailedPage from '../componenets/pages/host/HotelDetailedPage'
import HostProfile from '../componenets/pages/host/HostProfile'
import WalletTransaction from '../componenets/pages/commonComponents/WalletTransactions'
import HostHeader from '../componenets/pages/host/HostHeader'
import HostDashboard from '../componenets/pages/host/HostDashBoard'
import Reservations from '../componenets/pages/host/Reservations'
import HostChatComponnent from '../componenets/pages/host/Chat'

const HostRoutes:React.FC = () => {
  return (
    <Routes >
      

        <Route path='/login' element={<HostLogin/>}/>
        <Route path='/signup' element={<HostSignup />} />
        <Route path='/verifyOtp' element={<VerifyOtp />} />
        <Route element={<ProtectedRoutes role={'host'}/>}>

        <Route path='/home' element={<HostHome />} />
      <Route path='/addHotel' element={<AddHotel />} />
      <Route path='/addRoom' element={<AddRoom />} />
      <Route path='/addHotelPolicy' element={<AddHotelPolicy />} />
      <Route path='/hotelDetails' element={<HotelDetailedPage />}/>
      <Route path='/viewProfile' element={<HostProfile />}/>
      <Route path='/walletTransactions' element={<WalletTransaction role={'host'}/>} />
      <Route path='/dashboard' element={<HostDashboard />}/>
      <Route path='/reservations' element={<Reservations />}/>
      <Route path='/chat/:chatid/:userid' element={<HostChatComponnent />} />
        


      
      


    </Route>
    </Routes>
  )
}

export default HostRoutes
