import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLogin from '../componenets/pages/users/UserLogin'
import Home from '../componenets/pages/users/Home'
import VerifyOtp from '../componenets/pages/users/VerifyOtp'
import UserProfile from '../componenets/pages/users/UserProfile'
import PrivateRoutes from '../componenets/pages/users/PrivateRoutes'
import HotelDetails from '../componenets/pages/users/hotelDetails'

const UserRoutes = () => {
  return (
    <Routes>
        
        <Route path='/' element={<Home />}/>

        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/verifyOtp' element={<VerifyOtp />}/>
        {/* <Route path='/profile' element={<UserProfile />} /> */}
        <Route path='/hotelDetails' element={<HotelDetails />}/>
        

        <Route element={<PrivateRoutes/>}>
        <Route path='/userProfile' element={<UserProfile />} />
           
        </Route>
      

    </Routes>

  )
}

export default UserRoutes
