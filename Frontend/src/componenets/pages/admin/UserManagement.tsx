import React, { useEffect, useState } from 'react'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { blockUser, fetchUsers, unBlockUser } from '../../../utils/axios/AdminApi/AdminApi'
import { toast } from 'react-toastify'
import { MessagePort } from 'worker_threads'

const UserManagement = () => {

    const dispatch:AppDispatch=useDispatch<AppDispatch>()
    const {users,message}=useSelector((state:RootState)=>state.admin)
    const handleClick=(userId:string,index:number)=>{
        const user = users? users[index] :[];
        if(user.isBlocked===false){
            dispatch(blockUser({userId}))
            if(message==="user blocked"){
                toast.error(message)
                return
            }
        }else if(user.isBlocked===true){
            console.log("yo")
            dispatch(unBlockUser({userId}))
            if(message==="user unBlocked"){
                toast.success(message)
                return
            }
        }
    }
    
  

    useEffect(()=>{
        dispatch(fetchUsers())
    },[message])
  return (
    <div>
      <h3 className='text-xl ml-8 mt-3 font-semibold mb-4'>Users</h3>

      <div>
      <table className="w-full border">
        <thead className="bg- ">
            <tr>
            <th className="text-start p-2 border">S No</th>
            <th className="text-start p-2 border">Username</th>
            <th className="text-start p-2 border">Email</th>
            <th className="text-start p-2 border">Phone</th>
            <th className="text-start p-2 border">Actions</th>
            </tr>
        </thead>
        <tbody>
            {
                users && users.map((user,index)=>{
                    return(
                        <tr className="hover:bg-gray-100">
                            <td className="p-2 border">{index+1}</td>
                    <td className="p-2 border">{user?.firstName && user?.lastName ?  user?.firstName+" "+user?.lastName : 'N/A'}</td>
                    <td className="p-2 border">{user?.email}</td>
                    <td className="p-2 border">{user?.phone ?  user?.phone : 'N/A'}</td>
                    
                    <td className="p-2 border">
      <button
        className={`${
          user.isBlocked ? 'bg-green-600' : 'bg-red-600'
        } text-white p-1 rounded-sm w-[6rem]`}
        onClick={() => handleClick(user?._id,index)}
      >
        {user.isBlocked ? 'Unblock' : 'Block'}
      </button>
    </td>
                        </tr>
                    )
                })
            }
           

            {/* Additional rows as needed */}
        </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement
