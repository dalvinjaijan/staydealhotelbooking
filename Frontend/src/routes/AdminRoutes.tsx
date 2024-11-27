import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../componenets/pages/admin/AdminLogin'
import AdminHeader from '../componenets/pages/admin/AdminHeader'
import AdminDashboard from '../componenets/pages/admin/AdminDashboard'
import AdminProtectedRoutes from '../componenets/pages/admin/AdminProtectedRoutes'
import AdminHotels from '../componenets/pages/admin/AdminHotels'
import ManageHotelRequest from '../componenets/pages/admin/ManageHotelRequest'
import ApprovedHotels from '../componenets/pages/admin/ApprovedHotels'
import RejectedHotels from '../componenets/pages/admin/RejectedHotels'
import UserManagement from '../componenets/pages/admin/UserManagement'
import EditHotelRequests from '../componenets/pages/admin/EditHotelRequest'


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminHeader />}>
        <Route path='/login' element={<AdminLogin />} />
        <Route element={<AdminProtectedRoutes />}>
          <Route path='/dashBoard' element={<AdminDashboard />} />
          <Route path='/hotels' element={<AdminHotels />} />
      <Route path='/manageHotelRequest' element={<ManageHotelRequest />} />
      <Route path='/approvedHotels' element={<ApprovedHotels />} />
      <Route path='/getRejectedHotels' element={<RejectedHotels />} />
      <Route path='/users' element={<UserManagement />} />
      <Route path='/hotelEditRequest' element={<EditHotelRequests />} />
      </Route>
      </Route>
    </Routes>
  )
}

export default AdminRoutes
