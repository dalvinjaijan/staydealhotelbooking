import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { blockHotelRequest, getApprovedHotels } from '../../../utils/axios/AdminApi/AdminApi'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import Swal from "sweetalert2"
import { toast } from 'react-toastify'


const AdminHotels = () => {
  const navigate=useNavigate()
  const {message,hotelDetails}=useSelector((state:RootState)=>state.admin)

  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  useEffect(()=>{
    dispatch(getApprovedHotels())
  },[message])

  const handleBlock=(hostId:string,hotelId:string,hotelName:string)=>{
    Swal.fire({
      title: `Block ${hotelName}?`,
      text: `Are you sure you want to block this hotel?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Unblock: Blue, Block: Red
      cancelButtonColor: "#aaa",
      confirmButtonText:  "Yes, Block",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(blockHotelRequest({hostId,hotelId}))
          
          if (message === "hotel blocked") {
            toast.error(message);
          }
        
      }
    });
  }
  return (
    <div>
 <div  className="flex justify-between">
      <h3 className="text-xl ml-8 mt-3 font-semibold mb-4">Hotels</h3>
      <div>
      <button className='bg-heading-green mr-10 text-white px-2 py-2 rounded-lg'
    onClick={()=>navigate('/admin/manageHotelRequest')}>
    manage requests
    </button>
    <button className='bg-heading-green mr-10 text-white px-2 py-2 rounded-lg'
    onClick={()=>navigate('/admin/hotelEditRequest')}>
     hotel edit requests
    </button>
      </div>
    </div>
    <table className='min-w-full'>
      <thead>
        <th className="border">
          Si no
        </th>
        <th className="p-2 border">
          Listed Hotels
        </th>
      </thead>
      <tbody>
        {hotelDetails && hotelDetails.map((hotel:any, index) => (
          <tr key={index}>
            <td className="pl-6 border">{index+1}</td>
            <td className="p-2 border">
      <div className="grid grid-cols-1 gap-4">
      <div
             
              className="flex items-center justify-between border-b pb-4"
            >
               <div className="flex items-center space-x-4">
                {/* Display hotel image */}
                <img
                  src={`${hotel.hotelPhoto[0]}`} // Assuming the hotelPhoto array has at least one image
                  alt={hotel.hotelName || "Hotel Image"}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-bold">
                    {hotel.hotelName || "Unnamed Hotel"}
                  </h2>
                  <p>{hotel.hotelAddress || "No locality provided"}</p>
                  <p className="text-gray-600">
                    Hotel Owner: {hotel.ownerFirstName} {hotel.ownerLastName}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="border px-4 py-2 rounded-md text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white">
                  View Details
                </button>
             
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={
                  
                 ()=> handleBlock(hotel.hostId,hotel.hotelId,hotel.hotelName)
                   
                 }>
                  Block
                </button>
              </div>
              </div>

      </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
   
  )
}

export default AdminHotels
