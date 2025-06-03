
import React, { useEffect, useState } from 'react';

import { useDispatch,useSelector } from 'react-redux'
import { Outlet,useNavigate } from 'react-router-dom'
import {AppDispatch, RootState } from '../../../utils/redux/store'
import { CgProfile } from "react-icons/cg";
import { logout } from '../../../utils/axios/HostApi/HostApi';


const HostHeader = () => {
  const dispatch:AppDispatch = useDispatch<AppDispatch>();

  const {hostInfo,message}=useSelector((state:RootState)=>state.host)
  const [isDropdownOpen,setDropdown]=useState(false)
  useEffect(()=>{
    console.log("logout ->>",message)
    if(message==='Logout successfully'){
      navigate('/host/login')
    }
  },[message])
  const toggleDropdown=()=>{
    setDropdown(!isDropdownOpen)
  }
  const handleLogout=()=>{
    console.log("logout clicked");
    
    dispatch(logout())
  }
      
    const navigate=useNavigate()
  return (
    <>
      <div className='h-14 bg-navbar-green flex items-center justify-center font-brawler fixed z-50 top-0 left-0 right-0 w-full'>
        <div className="flex gap-10 items-center text-white w-full">
          <div className='size-20 flex items-center ml-6 h-full'>
            <img src="/src/assets/Frame.svg" alt="Logo" />
          </div>
             
           {hostInfo?.accessToken?(
            <div className='flex justify-between w-[90%]'>
            <div className='hidden sm:flex gap-28 w-full justify-center'>
            <ul className='tracking-wider' onClick={()=>navigate('/host/dashboard')} >Dashboard</ul>
            <ul className='tracking-wider' onClick={()=>navigate('/host/home')}>properties</ul>
            <ul className='tracking-wider' onClick={()=>navigate('/host/reservations')}>Reservations</ul>
            {/* <ul className='tracking-wider'>Contact us</ul> */}
            
           
          </div>
            <div className='relative'>
            <CgProfile className='flex justify-center w-40 size-6 text-black cursor-pointer'
            onClick={toggleDropdown} />
            {isDropdownOpen && (
              <div className="absolute right-4 mt-4 w-28 bg-white rounded-lg shadow-lg">
              <ul className="py-1">
              <li className="px-6 py-1 hover:bg-light-green cursor-pointer text-black hover:text-white"
                                onClick={()=>navigate('/host/viewProfile')}>Profile</li>
                 
                <li className="px-6 py-1 hover:bg-light-green cursor-pointer text-black hover:text-white"
                onClick={handleLogout}
                
                >Logout</li>
              </ul>
            </div>
            )}
            </div>
            </div>): 
            <div onClick={() => navigate('/host/login')} className='flex justify-center w-40 pr-12 cursor-pointer'>Login</div>
        }
            
         
            
         
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default HostHeader
