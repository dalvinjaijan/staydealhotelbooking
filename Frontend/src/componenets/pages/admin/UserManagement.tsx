import React, { useEffect, useState } from 'react'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { blockUser, fetchUsers, unBlockUser } from '../../../utils/axios/AdminApi/AdminApi'
import { toast } from 'react-toastify'
import Swal from "sweetalert2"

const UserManagement = () => {

    const dispatch:AppDispatch=useDispatch<AppDispatch>()
    const {users,message}=useSelector((state:RootState)=>state.admin)
    const [page,setPage]=useState<number>(1)
    const handleClick=(userId:string,index:number)=>{
        const user = users? users[index] :[];
        Swal.fire({
          title: user.isBlocked ? "Unblock User?" : "Block User?",
          text: `Are you sure you want to ${user.isBlocked ? "unblock" : "block"} this user?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: user.isBlocked ? "#3085d6" : "#d33", // Unblock: Blue, Block: Red
          cancelButtonColor: "#aaa",
          confirmButtonText: user.isBlocked ? "Yes, Unblock" : "Yes, Block",
        }).then((result) => {
          if (result.isConfirmed) {
            // Dispatch block/unblock actions based on current user state
            if (!user.isBlocked) {
              dispatch(blockUser({ userId }));
              if (message === "user blocked") {
                toast.error(message);
              }
            } else {
              dispatch(unBlockUser({ userId }));
              if (message === "user unBlocked") {
                toast.success(message);
              }
            }
          }
        });
    }
    
  

    useEffect(()=>{
        dispatch(fetchUsers(page))
    },[message,page])
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
                        <tr className="hover:bg-gray-100" key={index}>
                    <td className="p-2 border">{6*(page-1)+(index+1)}</td>
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
      <div className='flex mt-2 space-x-2 justify-center'>
        <button className='px-2 py-1 bg-blue-600 text-white'
        onClick={()=>setPage(prev=>prev-1)}
        disabled={page===1}>
          &lt;- prev
        </button>
         <button className='px-2 py-1 bg-blue-600 text-white'
         onClick={()=>setPage(prev=>prev+1)}
         disabled={!users||users.length<6}>
          next -&gt;
        </button>
      </div>
    </div>
  )
}

export default UserManagement
