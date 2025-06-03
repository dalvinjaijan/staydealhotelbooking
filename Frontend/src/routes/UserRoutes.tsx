import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLogin from '../componenets/pages/users/UserLogin'
import VerifyOtp from '../componenets/pages/users/VerifyOtp'
import UserProfile from '../componenets/pages/users/UserProfile'
import PrivateRoutes from '../componenets/pages/users/PrivateRoutes'
import HotelDetails from '../componenets/pages/users/hotelDetails'
import HotelBooking from '../componenets/pages/users/HotelBooking'
import HotelSearchBar from '../componenets/pages/users/HotelSearchBar'
import AddGuestDetails from '../componenets/pages/users/AddGuestDetails'
import PaymentMethod from '../componenets/pages/users/PaymentMethod'
import PaymentSuccess from '../componenets/pages/users/SuccessPage'
import BookingSuccessPage from '../componenets/pages/users/BookingSuccessPage'
import OrderDetailPage from '../componenets/pages/users/orderDetailPage'
import MyBooking from '../componenets/pages/users/MyBooking'
import WalletTransaction from '../componenets/pages/commonComponents/WalletTransactions'
import { ChatComponenet } from '../componenets/pages/ChatComponent'
import UserNotification from '../componenets/pages/users/notification'
import HotelsIn from '../componenets/pages/users/HotelsIn'
import Home from '../componenets/pages/users/Home'

const UserRoutes = () => {
  return (
    <Routes>
        
        <Route path='/hotelsIn' element={<HotelsIn />}/>
        <Route path='/' element={<Home />}/>


        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/verifyOtp' element={<VerifyOtp />}/>
        {/* <Route path='/profile' element={<UserProfile />} /> */}
        <Route path='/hotelDetails' element={<HotelDetails />}/>
        <Route path='/hotelDetailedPage' element={<HotelBooking />}/>
        <Route path='/sample' element={<HotelSearchBar />}/>


        

        <Route element={<PrivateRoutes role={"user"}/>}>
        <Route path='/userProfile' element={<UserProfile />} />
        <Route path='/addGuestDetails' element={<AddGuestDetails />} />
        <Route path='/paymentMethod' element={<PaymentMethod />} />
        <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/confirmation' element={<BookingSuccessPage />} />
        <Route path='/orderDetailPage' element={<OrderDetailPage />} />
        <Route path='/myBooking' element={<MyBooking />} />
        <Route path='/walletTransactions' element={<WalletTransaction role={'user'}/>} />
        <Route path='/chat/:chatid/:hostid' element={<ChatComponenet />} />
        <Route path='/notification' element={<UserNotification />} />


          
        </Route>
      

    </Routes>

  )
}

export default UserRoutes
