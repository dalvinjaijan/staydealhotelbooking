import React, { useEffect, useState } from 'react'
import HostHeader from './HostHeader'
import InputBox from '../InputBox'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { submitHotelDetails } from '../../../utils/axios/HostApi/HostApi'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AddHotelPolicy = () => {
  const navigate=useNavigate()
    const {newHotelDetails,hostInfo,newRoomCategories,message,loading}=useSelector((state:RootState)=>state.host)
    const dispatch:AppDispatch=useDispatch<AppDispatch>()
    const [checkIn, setCheckIn] = useState<number | null>(null);
    const [checkOut, setcheckOut] = useState<number | null>(null);
    const [hotelRules, setHotelRules] = useState<string[]>([
        'couple friendly',
        'pets friendly',
       
      ]);
      
      // State to handle input visibility and new amenity
      const [isAdding, setIsAdding] = useState(false);
      const [newRules, setNewRules] = useState('');
    const [cancellationPolicy, setCancellationPolicy] = useState<string | null>(null);
    const [checkInPeriod, setCheckInPeriod] = useState<'AM' | 'PM'>('AM');
    const [checkOutPeriod, setCheckOutPeriod] = useState<'AM' | 'PM'>('AM');
    const handleAddRules = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newRules.trim() !== '') {
            setHotelRules([...hotelRules, newRules]);
          setNewRules('');
          setIsAdding(false);
        }
      };

  const inputStyle ='px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-light-green sm:text-sm inline-block w-[14rem]';
      useEffect(()=>{
        if(message==="Request for adding hotel is sent"){
          navigate('/host/home')
        }
      },[message])

  const submit=()=>{
    const base64ToBlob = (base64Data: string, contentType: string = '') => {
      const byteCharacters = atob(base64Data.split(',')[1]); // Get the Base64 data after the comma
      const byteArrays = [];
    
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
    
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
    
      return new Blob(byteArrays, { type: contentType });
    };
    const formData = new FormData();

    // Add non-file fields to FormData
    formData.append('hotelName', newHotelDetails?.hotelName || '');
    formData.append('address', JSON.stringify(newHotelDetails?.address) || '');
    formData.append('latitude',newHotelDetails?.latitude?.toString()||'')
    formData.append('longitude',newHotelDetails?.longitude?.toString()||'')

    formData.append('totalNoOfRooms', newHotelDetails?.totalNoOfRooms?.toString() || '');
    formData.append('amenities', JSON.stringify(newHotelDetails?.amenities) || '');
    console.log("newRoomCatogeries",newRoomCategories )

    //  const newRoomCategoriesToAppend =newRoomCategories?.map((roomCategory,key)=>{

    //  })
     // [ 
    // //   { 
    // //     roomType: newRoomCategories?.roomType,
    // //     roomSize: newRoomCategories?.roomSize,
    // //     noOfRooms: newRoomCategories?.noOfRooms,
    // //     roomPrice: newRoomCategories?.roomPrice,
    // //     roomAmenities: newRoomCategories?.roomAmenities
    // //   }
    // // ];
    // formData.append('roomCategories', JSON.stringify(newRoomCategories));
    newRoomCategories?.forEach((room) => {
      // Append the room details as JSON (excluding photos for now)
      const { roomPhotos, ...roomDetails } = room;
      formData.append('roomCategories', JSON.stringify(roomDetails));
    
      // Process each photo if available
      if (roomPhotos && roomPhotos.length > 0) {
        roomPhotos.forEach((photo: string, index: number) => {
          // Convert Base64 string to Blob
          const blob = base64ToBlob(photo, 'image/jpeg'); // Adjust MIME type as necessary
    
          // Use roomType to create a unique key for each photo
          formData.append(`${room.roomType}_photo${index}.jpg`, blob);
        });
      }
    });
  
    // Add room policies
    formData.append('roomPolicies', JSON.stringify({
      checkIn: checkIn + checkInPeriod,
      checkOut: checkOut + checkOutPeriod
    }));
  
    // Add hotel rules and cancellation policy
    formData.append('hotelRules', JSON.stringify(hotelRules) || '');
    formData.append('cancellationPolicy', cancellationPolicy || '');

    // if(newRoomCategories?.roomPhotos){
    //   newRoomCategories.roomPhotos.forEach((photo: string, index: number) => {
    //     // If photo is a Base64 string, convert it to Blob
    //     const blob = base64ToBlob(photo, 'image/png'); // Replace 'image/png' with correct type if needed
    //     formData.append(`roomPhoto${index}.png`, blob); // Append each image Blob with a unique key
    //   }); 
    // }
  
    // Handle hotelPhoto (Base64 or File Blob)
    if (newHotelDetails?.hotelPhoto) {
      newHotelDetails.hotelPhoto.forEach((photo: string, index: number) => {
        // If photo is a Base64 string, convert it to Blob
        const blob = base64ToBlob(photo, 'image/png'); // Replace 'image/png' with correct type if needed
        formData.append(`hotelPhoto${index}.png`, blob); // Append each image Blob with a unique key
      });
    }
  
    const hostId=hostInfo?.hostId
    if(hostId)formData.append('hostid',hostId.toString())

    console.log("newHotelDetails from redux", formData);
    
  
    // Dispatch action with the formData
    dispatch(submitHotelDetails(formData));
  };
  return (
    <>
      <HostHeader />
      <main className="h-auto w-[70%] mx-auto mt-[4rem] border border-light-green p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Enter Hotel Policies</h3>

          <div className="mb-6">
  {/* Flex container for label and input */}
  <div className="flex items-center justify-between">
    {/* Label */}
    <label className="font-medium text-gray-700">Check-in:</label>

    {/* Input with AM/PM selector */}
    <div className="relative flex items-center w-2/3"> 
      {/* Input for Check-in Time */}
      <input
        type="number"
        placeholder="Enter check-in time"
        value={checkIn || ''}
        onChange={(e: any) => setCheckIn(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${inputStyle}`}
      />

      {/* AM/PM Selector (Inside the same box) */}
      <select
        value={checkInPeriod || 'AM'}
        onChange={(e:any) => setCheckInPeriod(e.target.value)}
        className="absolute right-0 px-2 py-1 border-l border-gray-300 bg-white rounded-r-md h-full"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  </div>
</div>
<div className="mb-6">
  {/* Flex container for label and input */}
  <div className="flex items-center justify-between">
    {/* Label */}
    <label className="font-medium text-gray-700">Check-out:</label>

    {/* Input with AM/PM selector */}
    <div className="relative flex items-center w-2/3"> 
      {/* Input for Check-in Time */}
      <input
        type="number"
        placeholder="Enter check-in time"
        value={checkOut || ''}
        onChange={(e: any) => setcheckOut(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${inputStyle}`}
      />

      {/* AM/PM Selector (Inside the same box) */}
      <select
        value={checkOutPeriod || 'AM'}
        onChange={(e:any) => setCheckOutPeriod(e.target.value)}
        className="absolute right-0 px-2 py-1 border-l border-gray-300 bg-white rounded-r-md h-full"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  </div>
</div>
<div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Hotel Rules</h3>
      <div className="flex flex-wrap gap-4">
        {/* Display the amenities as checkboxes */}
        {hotelRules.map((rules, index) => (
          <label key={index}>
            <input type="checkbox"  /> {rules}
          </label>
        ))}

        {/* If isAdding is true, show input for adding new amenity */}
        {isAdding && (
          <input
            type="text"
            value={newRules}
            onChange={(e) => setNewRules(e.target.value)}
            onKeyDown={handleAddRules}
            placeholder="Add amenity"
            className="px-3 py-2 border border-gray-300 rounded-md "
          />
        )}

        {/* "Add more" button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-light-blue underline"
          >
            + add more
          </button>
        )}
      </div>
    </div>

    <div className="mb-6">
            <InputBox label="Cancellation policy:" type="text" placeholder="Enter cancellation policyr" inputClassName={inputStyle}
             value={cancellationPolicy||''} // Convert number to string if null
             onChange={(e:any) => setCancellationPolicy(e.target.value)} />
          </div>

          <div className="flex justify-end">
            <button className={`px-6 py-2 bg-heading-green hover:bg-navbar-green text-white rounded-md
            ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-heading-green hover:bg-light-green'
            }`} onClick={submit}>{loading?'loading...':'submit'}</button>
          </div>
    </div>
    </main>
    </>
  )
}

export default AddHotelPolicy
