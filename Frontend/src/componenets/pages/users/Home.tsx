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
import HotelSearchBar from './HotelSearchBar'




const Home = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const { message, error, nearByHotels, selectedLoc, lngLat, hotelSearchResult } = useSelector((state: RootState) => state.user)

  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedOtherFilters, setSelectedOtherFilters] = useState<string[]>([]);

  const navigate = useNavigate()

  const [loading, setLoading] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null)
  const inputRef = useRef<HTMLInputElement | null>(null);


 useEffect(()=>{
  setLoading(false)
 },[hotelSearchResult])

  const handleRoomTypeChange = (type: string) => {
    console.log("type", type)
    setSelectedRoomTypes((prevSelected: any) => {
      const updatedRoomTypes = prevSelected.includes(type)
        ? prevSelected.filter((roomType: any) => roomType !== type)
        : [...prevSelected, type];

      fetchFilteredData(updatedRoomTypes, selectedOtherFilters);
      return updatedRoomTypes;
    });
  };

    const sortByPrice = (event:any) => {
    const sortOrder = event.target.value;
    dispatch(sortHotelsByPrice({ sortOrder }));
  };

  const handleOtherFilterChange = (filter: any) => {
    setSelectedOtherFilters((prevSelected: any) => {
      const updatedFilters = prevSelected.includes(filter)
        ? prevSelected.filter((otherFilter: any) => otherFilter !== filter)  // filtering is done check whether it is already selected 
        : [...prevSelected, filter];                                         //if it is already selected then uncheck is done

      fetchFilteredData(selectedRoomTypes, updatedFilters);
      return updatedFilters;
    });
  };

  const fetchFilteredData = (roomTypes: any, otherFilters: any) => {

    const payload = {
      roomTypes,
      otherFilters,
      lngLat: lngLat,

    };
    console.log("selected filters", payload)

    dispatch(fetchFilteredHotels(payload)); // Dispatch action to make an API call
  };



  const handleInputChange = (e: any) => {
    const searchInput = e.target.value
    console.log("lngLat", lngLat)
    setSearchTerm(searchInput)
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

  useEffect(() => {
    if (message === "Login successfully") {
      toast.success(message)
      dispatch(resetStates())

    } else {
      toast.error(error)
      if (message !== "No hotels found")
        dispatch(resetStates())

    }
  }, [message, error, dispatch])

  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);




  const hotelDetail = (index: number) => {
    if (nearByHotels) {
      const selectedHotel: any = nearByHotels[index]
      console.log("details of hotel", selectedHotel)
      navigate(`/hotelDetails?hotelId=${selectedHotel.hotelId}`)
    }

  }

  const handleSelect = (hotelName: any) => {
    const selectedHotel: any = hotelSearchResult.find(
      (hotel: any) => hotel.hotelName + "," + hotel.address === hotelName
    );
    if (selectedHotel) {
      console.log("Details of hotel:", selectedHotel);
      setSearchTerm(hotelName)
    
    }
  };


  //date checkIn
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1)
  const [checkIn, setCheckIn] = useState<Date | null>(today);
  const [checkOut, setCheckOut] = useState<Date | null>(tomorrow);

  const handleCheckInChange = (date: Date | null) => {
    setCheckIn(date);
    if (checkOut && date && date >= checkOut) {
      setCheckOut(null); // Reset check-out if it conflicts with check-in
    }
  };

  const handleCheckOutChange = (date: Date | null) => {
    setCheckOut(date);
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
    dispatch(searchHotelforBooking({lngLat,numberOfRooms,totalGuests,checkIn,checkOut,searchTerm}))
    navigate('/hotelDetailedPage')
    
  }

 
  
  return (
    <>
      <Header />
      <div className="mt-14">
        {/* {nearByHotels && nearByHotels?.length > 0 ? ( */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Section */}
          <aside className="w-full lg:w-1/4 bg-white p-4 shadow-md rounded-md">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Room Types</h3>
              <div className="space-y-2">
                {["suite rooms", "deluxe rooms", "classic rooms",].map((type: string) => (

                  <label key={type} className="flex items-center gap-2 text-sm">

                    <input type="checkbox" className="rounded border-gray-300"

                      checked={selectedRoomTypes.includes(type.split(" ")[0])}
                      onChange={() => handleRoomTypeChange(type.split(" ")[0])} />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <input type="range" min="500" max="13000" className="w-full" />
              <div className="flex justify-between text-xs mt-1">
                <span>₹500</span>
                <span>₹13,000</span>
              </div>
            </div> */}

            <div>
              <h3 className="text-sm font-medium mb-2">Extra Filters</h3>
              <div className="space-y-2">
                {["couple friendly", "pets friendly"].map((filter) => (
                  <label key={filter} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300"
                      checked={selectedOtherFilters.includes(filter)}
                      onChange={() => handleOtherFilterChange(filter)} />
                    {filter}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Hotels Section */}
          <div className="flex-1" onClick={()=>{setPopupForRoom(false);}}>
                <HotelSearchBar />
              <div className="flex justify-between items-center mb-4">

              <div>
              {message === "No hotels found" ? <h3 className="text-xl font-semibold flex flex-col">Oops hotel not found</h3> :
                <h3 className="text-xl font-semibold flex flex-col">{`Hotels in ${selectedLoc}`}</h3>

              }

            </div>

              <div className="text-sm">
                <label htmlFor="sort" className="mr-2">Sort by:</label>
                <select id="sort" className="border rounded-md p-1" onChange={sortByPrice}>
                  <option value="high-to-low" >Price High to Low</option>
                  <option value="low-to-high">Price Low to High</option>
                </select>
              </div>    
           
           
            </div>

            <div className="grid grid-cols-1  gap-6">
              {nearByHotels && nearByHotels.map((hotel: any, index) => (
        

                <div key={index} className="relative bg-white rounded-lg overflow-hidden shadow-lg flex">

                  {/* Hotel Photo on the Left */}
                  <div
                    className="w-1/2 h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${hotel.hotelPhoto[0]})` }}

                  ></div>

                  {/* Hotel Details on the Right */}
                  <div className="w-1/2 p-6 flex flex-col justify-between">

                    {/* Hotel Name and Reviews */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{hotel.hotelName}</h3>
                        <div className="flex items-center gap-1 text-green-500">
                          <span>4★</span>
                          <span className="text-xs text-gray-500">(14 reviews)</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{hotel.address}</p>
                      <p className="text-sm text-gray-600">
                        Amenities: {hotel.amenities.join(", ")}
                      </p>
                    </div>

                    {/* Price and Booking Section */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">₹{hotel.roomCategories[0].roomPrice}</p>
                        <p className="text-sm text-gray-500 line-through">₹{hotel.roomCategories[0].roomPrice * 1.25}</p>
                        <span className="text-sm text-green-500">45% off</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md"
                          onClick={() => hotelDetail(index)}>
                          View Details
                        </button>
                        {/* <button className="bg-indigo-500 text-white px-4 py-2 rounded-md">
                          Book Now
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>


        {/* ) : (
          <img
            src="/src/assets/greenBuild.jpg"
            alt="Green Building"
            className="w-full h-screen object-cover"
          />
       )} */}
      </div>
    </>
  );
};
export default Home
