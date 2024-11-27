import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminNavBar = () => {
  const navigate=useNavigate()
  return (
    <div className="bg-navbar-green text-white h-full flex flex-col p-4 shadow-lg">
      <ul className="space-y-6">
        <li className="hover:bg-white hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all">Dashboard</li>
        <li className="hover:bg-white hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all"
        onClick={()=>{
          navigate('/admin/users')
        }}>Users</li>
        <li className="hover:bg-white hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all">Hotel Owners</li>
        <li className="hover:bg-white hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all" 
        onClick={()=>{
          navigate('/admin/hotels')
        }}>Hotels</li>
      </ul>
    </div>
  )
}

export default AdminNavBar
