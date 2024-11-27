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

const HostRoutes:React.FC = () => {
  return (
    <Routes >
      

        <Route path='/login' element={<HostLogin/>}/>
        <Route path='/signup' element={<HostSignup />} />
        <Route path='/verifyOtp' element={<VerifyOtp />} />
        <Route element={<ProtectedRoutes/>}>

        <Route path='/home' element={<HostHome />} />
      <Route path='/addHotel' element={<AddHotel />} />
      <Route path='/addRoom' element={<AddRoom />} />
      <Route path='/addHotelPolicy' element={<AddHotelPolicy />} />
      <Route path='/hotelDetails' element={<HotelDetailedPage />}/>


    </Route>
    </Routes>
  )
}

export default HostRoutes
