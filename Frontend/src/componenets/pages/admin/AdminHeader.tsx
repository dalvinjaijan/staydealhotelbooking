import React, { useState,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import AdminNavBar from './AdminNavBar'
import { logout } from '../../../utils/axios/AdminApi/AdminApi'

const AdminHeader = () => {

  const {adminInfo,message}=useSelector((state:RootState)=>state.admin)
  const dispatch:AppDispatch=useDispatch<AppDispatch>()
  const [toggleMenuBar,setToggleMenuBar]=useState<boolean>(false)
  useEffect(()=>{
    console.log("logout ->>",message)
    if(message==='Logout successfully'){
      navigate('/admin/login')
    }
  },[message])
  const handleLogout=()=>{
    console.log("handlelogout clicked")
    dispatch(logout())
  }
  const navigate=useNavigate()
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="h-14 bg-navbar-green flex items-center justify-center font-brawler fixed z-50 top-0 left-0 right-0 w-full">
        <div className="flex gap-10 items-center text-white w-full">
          <div className="size-20 flex items-center ml-6 h-full">
            <img src="/src/assets/Frame.svg" alt="Logo" />
          </div>
          {adminInfo?.accessToken ? (
            <div
              onClick={handleLogout}
              className="flex justify-center w-40 pr-12 cursor-pointer"
            >
              Logout
            </div>
          ) : (
            <div
              onClick={() => navigate('/admin/login')}
              className="flex justify-center w-40 pr-12 cursor-pointer"
            >
              Login
            </div>
          )}
        </div>
      </div>

      {/* Content Below Header */}
      <div className="flex flex-row mt-14 h-full">
        {/* Sidebar / AdminNavBar */}
        {adminInfo?.accessToken && (
          <div className="w-64 bg-navbar-green h-full fixed top-14 left-0">
            {/* AdminNavBar content here */}
            <AdminNavBar />
          </div>
        )}

        {/* Main Content */}
        <div className={adminInfo?.accessToken ? "flex-1 ml-64 p-4" : "flex-1  p-4"}>
          <Outlet />
        </div>
      </div>
     </div>
  );
};
export default AdminHeader
