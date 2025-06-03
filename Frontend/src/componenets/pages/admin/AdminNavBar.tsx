import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminNavBar = () => {
  const [selectedToggle,setSelectedToggle]=useState<string>('dashboard')


  const navigate=useNavigate()
  return (
    <div className="bg-navbar-green text-white h-full flex flex-col p-4 shadow-lg">
      <ul className="space-y-6">
      <li className={`hover:bg-white ${selectedToggle==="dashboard" ?  "bg-white text-navbar-green" :""} hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all`}
      onClick={()=>{
          setSelectedToggle('dashboard')
          navigate('/admin/dashboard')
      }}
         > Dashboard</li>
        <li className={`hover:bg-white ${selectedToggle==="user" ?  "bg-white text-navbar-green" :""} hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all`}
        onClick={()=>{
          setSelectedToggle('user')
          navigate('/admin/users')
        }}>Users</li>
   {/* <li className={`hover:bg-white ${selectedToggle==="hotelOwners" ?  "bg-white text-navbar-green" :""} hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all`}
         onClick={()=>{
          setSelectedToggle('hotelOwners')
      }}
        >Hotel Owners</li> */}
      <li className={`hover:bg-white ${selectedToggle==="hotels" ?  "bg-white text-navbar-green" :""} hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all`}
        onClick={()=>{
          setSelectedToggle('hotels')
          navigate('/admin/hotels')
        }}>Hotels</li>

<li className={`hover:bg-white ${selectedToggle==="wallet" ?  "bg-white text-navbar-green" :""} hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all`}
        onClick={()=>{
          setSelectedToggle('wallet')
          navigate('/admin/wallet')
        }}>Wallet</li>

<li className={`hover:bg-white ${selectedToggle==="complaint" ?  "bg-white text-navbar-green" :""} hover:text-navbar-green cursor-pointer px-4 py-2 rounded-md transition-all`}
        onClick={()=>{
          setSelectedToggle('complaint')
          navigate('/admin/complaints')
        }}>Complaints</li>
      </ul>
    </div>
  )
}

export default AdminNavBar
