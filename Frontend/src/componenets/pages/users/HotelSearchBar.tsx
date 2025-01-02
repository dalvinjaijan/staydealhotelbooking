import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from './Header'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../utils/redux/store'
import { toast } from 'react-toastify'
import { resetHotelSearchs, resetStates, setLocation, sortHotelsByPrice } from '../../../utils/redux/slices/userSlice'
import PlacesAutoComplete from '../host/PlacesAutoComplete'
import { PlacesContext } from '../../../context/placesContext'
import { fetchFilteredHotels, searchHotel, searchHotelforBooking, selectCity } from '../../../utils/axios/api'
import { useNavigate } from 'react-router-dom'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './style.css'
import { IoSearch } from "react-icons/io5";

const HotelSearchBar=()=>{
      const dispatch: AppDispatch = useDispatch<AppDispatch>()
      const [loading, setLoading] = useState<boolean>(false);
      const { lngLat,bookingDetails, hotelSearchResult,} = useSelector((state: RootState) => state.user)
      const navigate = useNavigate()
      const [debounceTimeout, setDebounceTimeout] = useState(null)
      const [selectedHotel,setSelectedHotels]=useState(null)
        
      

  const [searchTerm, setSearchTerm] = useState('');

  const [error, setError] = useState("");

  //validation
  const validateInputs = () => {
    if (!searchTerm) {
      setError("Please enter a location to search for hotels.");
      return false;
    }
    if (!checkIn) {
      setError("Please select a check-in date.");
      return false;
    }
    if (!checkOut) {
      setError("Please select a check-out date.");
      return false;
    }
    if (totalGuests < 1) {
      setError("Please specify the number of guests.");
      return false;
    }
    return true;
  };



const handleInputChange = (e: any) => {
    const searchInput = e.target.value
    console.log("lngLat", lngLat)
    setSearchTerm(searchInput)
    setError("");
    console.log("searchInpiut", searchInput, "searchTerm", searchTerm)
    setLoading(true)

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
  
    
    const newTimeout: any = setTimeout(() => {
      console.log("function triggered",searchInput,lngLat)
      if(searchInput){
        dispatch(searchHotel({ lngLat, searchInput }))
      }else{
        dispatch(resetHotelSearchs())
      }
    }, 300)

    setDebounceTimeout(newTimeout)

  }

const handleSelect = (hotelName: any) => {
   let  selectedHotel:any = hotelSearchResult.find(
      (hotel: any) => hotel.hotelName + "," + hotel.address === hotelName
    );
    if (selectedHotel) {
      setSelectedHotels(selectedHotel)
      console.log("Details of hotel:", selectedHotel);
      setSearchTerm(hotelName)
    
    }
    console.log("searchTerm",searchTerm)
  };


  //date checkIn


  let today
  if(bookingDetails?.checkIn){
    today=new Date(bookingDetails?.checkIn)
  }else
  today=new Date()

  let tomorrow
  if(bookingDetails?.checkOut){
    tomorrow=new Date(bookingDetails?.checkOut)
  }else{
    tomorrow=new Date()
    tomorrow.setDate(today.getDate() + 1)
  }


  // const today = new Date(bookingDetails?.checkIn ?? new Date()) ?? new Date();
  // const tomorrow =new Date(bookingDetails?.checkOut ?? new Date()) ?? new Date();
  console.log("tomorroew",tomorrow)

  const [checkIn, setCheckIn] = useState<Date | null>(today);
  const [checkOut, setCheckOut] = useState<Date | null>(tomorrow);
  console.log("checkOut",checkOut)

  const handleCheckInChange = (date: Date | null) => {
    setCheckIn(date);
    if (checkOut && date && date >= checkOut) {
      setCheckOut(null); // Reset check-out if it conflicts with check-in
    }
    setError("");
  };

  const handleCheckOutChange = (date: Date | null) => {
    setCheckOut(date);
    setError("");
  };


  const getMaxDate = () => {
    const baseDate = checkIn || today; // Use checkIn if available; otherwise, use today
    const maxDate = new Date(baseDate);
    maxDate.setMonth(maxDate.getMonth() + 6); // Add 6 months to the base date
    return maxDate;
  };
  //Room and guest number changes
  const [popupForRoom,setPopupForRoom]=useState<boolean>(false)
  const [guestNumber,setGuestNumber]=useState<number[]>([1])
  const [numberOfRooms,setNumberOfRooms]=useState<number>(1)
  const handleRoomNumbers=()=>{
  setPopupForRoom(true)
  }

  const incrementGuest=(index:number)=>{
    
   
      setGuestNumber((prev)=>
        prev.map((guest,i)=>i===index && guest<=2 ? guest +1:guest)
       )
    
    
  }

  const decrementGuest=(index:number)=>{
    setGuestNumber((prev)=>
    prev.map((guest,i)=>i===index && guest > 1 ? guest-1:guest)
  )}
  const addRoom=()=>{
    if (numberOfRooms < 6) { // Max 6 rooms allowed
      setNumberOfRooms((prev) => prev + 1);
      setGuestNumber((prev) => [...prev, 1]); // Add default 1 guest for the new room
    }

  }
  const deleteRoom=()=>{
    if (numberOfRooms > 1) { // Minimum 1 room required
      setNumberOfRooms((prev) => prev - 1);
      setGuestNumber((prev) => prev.slice(0, -1)); // Remove the last room's guest count
    }
  }

  const totalGuests=guestNumber.reduce((sum,noOfGuest)=>sum+noOfGuest,0)

  //search hotel for booking

  const searchHotelForBooking=(numberOfRooms:number,totalGuests:number,checkIn:Date,checkOut:Date,searchTerm:string)=>{
    console.log("searchTerm",searchTerm,totalGuests)
    if (!validateInputs()) return; // Stop execution if validation fails
    console.log("sea",searchTerm,selectedHotel)
    const stringArray=searchTerm.split(',')
    const hotelName=stringArray[0]
    if(selectedHotel?.hotelName!==hotelName) 
      return 
    setError("");
    console.log("working")
    dispatch(searchHotelforBooking({lngLat,numberOfRooms,totalGuests,checkIn,checkOut,searchTerm}))
    navigate('/hotelDetailedPage')
    
  }

return (
    <div>
        <div className="flex relative mt-6 items-center border border-blue-400 rounded-full px-4 py-1 shadow-lg w-full max-w-5xl">
{/* Search Input */}
<div className="flex items-center flex-1">
      
    
         
          <Combobox onSelect={handleSelect}>

            <ComboboxInput
           
              value={searchTerm}
              onChange={handleInputChange}
              // disabled={!ready}
              placeholder="Search for hotels"
              className=" px-3 py-1 rounded-xl shadow-sm w-80  text-black "
            />
           
            <ComboboxPopover className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
              {hotelSearchResult && hotelSearchResult.length > 0 ? (
                <ComboboxList className="max-h-48 overflow-y-auto">

                  {hotelSearchResult.map((hotel: any) => (
                    <ComboboxOption  key={hotel.id} value={hotel.hotelName + "," + hotel.address}
                      className="p-2 border-b border-gray-100 last:border-none cursor-pointer hover:bg-gray-100"
                    />
                  ))}
                </ComboboxList>
              ) : loading ? <p>Loading...</p> :(<p>
                No hotels found
              </p>)}

            </ComboboxPopover>

          </Combobox>
          </div>



{/* Date Pickers */}
<div className="flex items-center px-3 border-l border-gray-300">
<div className="text-center">
<label className="block text-sm">Check-In</label>
<DatePicker
selected={checkIn}
onChange={handleCheckInChange}
selectsStart
startDate={checkIn  || today}
endDate={checkOut  || tomorrow}
minDate={today}
className="w-24 text-center"
placeholderText="Add Date"
/>
</div>
</div>

<div className="flex items-center px-3 border-l border-gray-300">
<div className="text-center">
<label className="block text-sm">Check-Out</label>
<DatePicker
selected={checkOut}
onChange={handleCheckOutChange}
selectsEnd
startDate={checkIn || today}
endDate={checkOut || tomorrow}
minDate={checkIn || today}
maxDate={getMaxDate()}
className="w-24 text-center"
placeholderText="Add Date"
/>
</div>
</div>

{/* Guests */}
<div className="flex items-center px-3 border-l border-gray-300 cursor-pointer" onClick={(e) => e.stopPropagation()}>
<div className="text-center">
<label className="block text-sm">Guests</label>
<div onClick={handleRoomNumbers}>
{ numberOfRooms>1 ?` ${numberOfRooms} Rooms, ${totalGuests}Guests`:numberOfRooms===1 && guestNumber[0] > 1 ? ` ${numberOfRooms} Room, ${totalGuests}Guests`:` ${numberOfRooms} Room, ${totalGuests}Guest`}
</div>
</div>
</div>




{/* Search Button */}
<button className="flex items-center px-6 py-3 text-heading-green ">
<IoSearch onClick={()=>{if(checkIn && checkOut)
searchHotelForBooking(numberOfRooms,totalGuests,checkIn,checkOut,searchTerm)}} className="text-2xl" />
{/* <span className="material-icons">search</span> */}
</button>
{error && <p className="text-red-500 text-sm">{error}</p>}
</div>

{
  popupForRoom &&
  <div className="absolute flex flex-col right-20 z-20 w-48 bg-white border border-gray-300 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
     <div className='w-full'>
     <button
        className="absolute top-2 right-2  text-gray-500 hover:text-gray-700 transition"
        onClick={() => setPopupForRoom(false)} // Add a function to close the popup
      >
        &times;
      </button>
     </div>
    
    <div className='flex border-b px-4 py-2 justify-between font-bold text-stone-800 text-sm'>
      <h1>Rooms</h1>
      <h1>Guests</h1>
    </div>
  
    <div className='flex flex-col gap-2'>
    { Array.from({ length: numberOfRooms }).map((_, index) => (
      <div key={index} className='flex justify-between py-3 px-4 border-b text-sm'>
        <div><h1>Room {index+1}</h1></div>
        <div className='flex gap-3'>
          <button className={guestNumber[index]<=1 ? 'text-gray-400 border px-2 ':'text-black border px-2'}   disabled={guestNumber[index]<=1} onClick={()=>decrementGuest(index)}>-</button>
          <h1>{guestNumber[index]}</h1>
          <button className={guestNumber[index]>=3 ? 'text-gray-400 border px-2 ':'text-black border px-2'}   disabled={guestNumber[index]>=3}  onClick={()=>incrementGuest(index)}>+</button>
        </div>
      </div>
    ))}
    </div>
    <div className='px-2 py-3 flex text-xs justify-between'>
      <button className={numberOfRooms>=6 ? 'text-gray-400 ':'text-black '}   disabled={numberOfRooms >= 6} onClick={addRoom}>Add Room</button>

      <button className={numberOfRooms<=1 ? 'text-gray-400 ':'text-black'}   disabled={numberOfRooms <= 1} onClick={deleteRoom}>Remove Room</button>
    </div>
  </div>
}
    </div>




)
      
}

export default HotelSearchBar