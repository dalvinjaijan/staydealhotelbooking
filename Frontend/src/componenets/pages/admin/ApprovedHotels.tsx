import React, { useEffect } from 'react'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { blockHotelRequest, getApprovedHotels } from '../../../utils/axios/AdminApi/AdminApi'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2"


const ApprovedHotels = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { hotelDetails ,message} = useSelector((state: RootState) => state.admin);
  console.log("hotelDetails", hotelDetails);
  const navigate=useNavigate()


  useEffect(() => {
    dispatch(getApprovedHotels());
    if(message==='hotel blocked'){
      toast.error(message)
    }
  }, [dispatch,message]);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hotel Request</h1>
      <div className="flex space-x-4">
        <button
        onClick={()=>navigate('/admin/manageHotelRequest')}
        >New Request</button>
        <button className="underline"
        onClick={()=>navigate('/admin/approvedHotels')}
        >Approved</button>
        <button
        onClick={()=>navigate('/admin/getRejectedHotels')}
        
        >Rejected</button>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 gap-4">
        {hotelDetails && hotelDetails.length > 0 ? (
          hotelDetails.map((hotel:any) => (
            <div
              key={hotel?.hotelId} // Ensure hotelId exists in the backend data
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
          ))
        ) : (
          <p>No hotel requests found.</p> // Handle the case when hotelDetails is empty or not available
        )}
      </div>
    </div>
  );
};

export default ApprovedHotels;

