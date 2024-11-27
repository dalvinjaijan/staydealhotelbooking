import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Optional: For managing coupon code input
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../utils/redux/store';
import { FaEdit } from "react-icons/fa"

import HostHeader from './HostHeader';
import EditHotelModal from './EditHotelModal';
import { editHotelDetails } from '../../../utils/axios/HostApi/HostApi';
import { toast } from 'react-toastify';
import { resetStates } from '../../../utils/redux/slices/adminSlice';

const HotelDetailedPage = () => {
  const location = useLocation();
  const {hotels,hostInfo,message}=useSelector((state:RootState)=>state.host)
  const queryParams = new URLSearchParams(location.search);
  const hotelId = queryParams.get('hotelId'); // Get the hotel ID from the URL
  console.log("hotelId",hotelId)
  const dispatch:AppDispatch=useDispatch<AppDispatch>()


  // Find the selected hotel from the data
  const hotel:any = hotels?.find((hotel:any) => hotel._id === hotelId);
  console.log("hotel",hotel)

  if (!hotel) return <p>Hotel not found!</p>;
  useEffect(()=>{
    if(message==='Requested for editing hotel'){
      toast.success(message)
    dispatch(resetStates())
    }

  },[message])

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hotelData, setHotelData] = useState(hotel);
  const hostId=hostInfo?.hostId

  const showPopUp = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = (editedData:any) => {
    setHotelData(editedData);
    console.log("hotelUpdatedData",editedData)
    if(hostId)
    dispatch(editHotelDetails({editedData,hostId}))
    // Optionally, make an API call to save changes to the server
  };

  return (
    <>
    <HostHeader />
    <div className="mt-14 max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Left Section: Hotel Images and Information */}
  <div className="md:col-span-3 h-80 flex overflow-hidden gap-1">
    <div className="w-3/4">
      <img
        src={hotel.hotelPhoto[0]}
        alt={hotel.hotelName}
        className="w-full h-80 object-cover rounded-lg"
      />
    </div>
    <div className="w-1/4 flex flex-col gap-1 relative">
      <div className='h-1/2'>
        <img
          src={hotel.hotelPhoto[1]}
          alt={hotel.hotelName}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className='h-1/2'>
        <img
          src={hotel.hotelPhoto[1]}
          alt={hotel.hotelName}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-md">
        2 more photos
      </div>
    </div>
  </div>

  {/* Left Content Section */}
  <div className="space-y-6 md:col-span-2">
    <div className=' border rounded-lg border-navbar-green flex justify-between'>
        <div className='space-y-4 px-6 py-4 sm:col-span-2'>
        <h1 className="text-3xl font-bold">{hotel.hotelName}</h1>
    <p className="text-gray-600">{hotel.address}</p>

    <h1 className="text-xl font-semibold">Amenities</h1>
    <div className="mt-2 flex items-center gap-2 flex-wrap">
      {hotel.amenities.map((amenity: string, index: number) => (
        <span
          key={index}
          className="flex items-center gap-1 text-sm text-gray-700"
        >
          <span>✅</span> {amenity}
        </span>
      ))}
    </div>
    <div className='flex'>
    <label htmlFor="">Total no of rooms</label>
    <p className='font-medium ml-20'>{hotel.totalNoOfRooms}</p>
    </div>
    

        </div>
        <div className="mt-4 mr-10 flex h-10 ">
  <button
    className={`flex items-center space-x-2 px-3 py-1 text-sm font-medium text-white rounded-md transition-colors duration-200 focus:outline-none ${
      hotel?.editedData ? 'bg-gray-400 cursor-not-allowed' : 'bg-heading-green hover:bg-light-green'
    }`}
    onClick={showPopUp}
    disabled={hotel?.editedData}
  >
    <FaEdit className="text-white" />
    <span>{hotel?.editedData? 'Edit Requested' : 'Edit'}</span>
  </button>
</div>
  
    </div>
    {isModalOpen && <EditHotelModal 
     isOpen={isModalOpen}
     onClose={closeModal}
     hotelData={hotelData}
     onSave={handleSave}/>}
    

    {/* <h1 className="text-xl font-semibold">About</h1>
    <p className="mt-4 text-gray-600">
      The hotel is located in Kochi and is close to popular attractions
      such as Wonderla Amusement Park and Subhash Bose Park Ernakulam.
    </p> */}

    
    <div className="space-y-6">
    <h2 className="text-2xl font-bold">Room Categories</h2>

    {Array.isArray(hotel.roomCategories) &&
      hotel.roomCategories.map((category: any, index: number) => (
        <div
          key={index}
          className="flex border p-4 rounded-lg items-center gap-6"
        >
          <img
            src={hotel.hotelPhoto[0]}
            alt={category.roomType}
            className="w-32 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className='flex'>
            <label htmlFor="">room Type</label>
            <h3 className="text-xl font-semibold ml-14">{category.roomType}</h3>
            </div>
            <div className='flex'>
            <label htmlFor="">room Size</label>

            <p className="text-sm text-gray-600 ml-16">{category.roomSize} sqft</p>
            </div>
            <div className='flex'>
            <label className='mt-2' htmlFor="">room amenities </label>
            <div className="mt-2 ml-6 flex gap-4">
              {Array.isArray(category.roomAmenities) &&
                category.roomAmenities.map((item: string, i: number) => (
                  <span key={i} className="text-sm text-gray-700">
                    {item}
                  </span>
                ))}
            </div>
            </div>
            <div className='flex'>
            <label className='mt-2' htmlFor="">room price </label>
            <p className="text-lg font-bold mt-2 ml-14">₹ {category.roomPrice}</p>
            </div>
          </div>
        </div>
      ))}
      
      
    
    </div>
  </div>

  {/* Right Section:Hotel Policies */}
  <div className="space-y-6 md:col-span-1">
    <div className="space-y-2 mt-6">
        <h2 className="text-2xl font-bold">Hotel Policies</h2>
        <div className="flex justify-between">
          <span>Check-in: {hotel.roomPolicies.checkIn}</span>
          <span>Check-out: {hotel.roomPolicies.checkOut}</span>
        </div>
        <ul className="list-disc pl-6 mt-2">
        {hotel.hotelRules.map((rule: string, index: number) => (
    <li key={index}>{rule}</li>
  ))}
         
        </ul>
      </div>
   
  </div>
</div>
    

 
    
    </>
    
  );
};

export default HotelDetailedPage;
