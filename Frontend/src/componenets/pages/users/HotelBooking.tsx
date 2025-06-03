import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import Header from './Header'
import { useEffect, useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaRegEdit } from 'react-icons/fa'
import DatePicker from 'react-datepicker'
import { changeBookingDetail } from '../../../utils/axios/api'
import { useNavigate } from 'react-router-dom'
import { resetStates, saveBookingDetails } from '../../../utils/redux/slices/userSlice'
import { ratings } from '../../../utils/interfaces'

const HotelBooking = () => {
  const dispatch = useDispatch<AppDispatch>()



  const {  hotelDetails, bookingDetails, lngLat, userInfo, message } = useSelector((state: RootState) => state.user)

  const navigate = useNavigate()
  // const availableRoomIndex = hotelDetails[0]?.roomCategories.findIndex((room) => room.isAvailable) || 0;

  const [roomCategoryIndex, setRoomCategoryIndex] = useState<number>(0)
  // console.log("availableRoom",availableRoomIndex,roomCategoryIndex)
  const [noOfDays, setNoOfDays] = useState<number>(bookingDetails ? bookingDetails.noOfDays : 1)
  useEffect(() => {
    if (bookingDetails)
      setNoOfDays(bookingDetails.noOfDays)
  }, [bookingDetails])
  console.log("numberOfDays", noOfDays)
  const [ratings, setRatings] = useState<ratings[]>(hotelDetails?.[0]?.ratings?.[0] ?? []);
  useEffect(()=>{
    setRatings(hotelDetails?.[0]?.ratings?.[0])
  },[hotelDetails])

  const [error, setError] = useState<string>("")
  const hotelId: string = hotelDetails[0]?.hotelId
  const initialRoomId = hotelDetails[0]?.roomCategories[0]?._id
  const [roomId, setRoomId] = useState<string | null>(initialRoomId || "")

  useEffect(() => {
    if (message === "Hotels data found successfully") {
      setRoomCategoryIndex(0)
    }
    resetStates()
    console.log("roomCategoryIndex", roomCategoryIndex)
  }, [message])

  


  const changeRoomType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Get the selected option
    const selectedOption = e.target.options[e.target.selectedIndex];
    console.log("selectedOption", selectedOption)

    // Access the data-room-id attribute
    const roomId = selectedOption.getAttribute('data-room-id');

    console.log("roomId", roomId);

    // Update state or perform any necessary actions
    setRoomCategoryIndex(e.target.selectedIndex);
    console.log("roomCategoryIndex", roomCategoryIndex);
    setRoomId(roomId)
  };

  const [reviewCount,setReviewCount]=useState<number>(0)


  const [popUpforDate, setPopUpforDate] = useState<boolean>(false)
  const [checkIn, setCheckIn] = useState<Date | null>(bookingDetails?.checkIn ?? null);
  const [checkOut, setCheckOut] = useState<Date | null>(bookingDetails?.checkOut ?? null);
  const [guestNumber, setGuestNumber] = useState<number>(bookingDetails?.totalGuests ?? 1)
  const [numberOfRooms, setNumberOfRooms] = useState<number>(bookingDetails?.numberOfRooms ?? 1)
  useEffect(() => {
    if (bookingDetails?.numberOfRooms && bookingDetails?.totalGuests) {
      console.log("inside useFffect", bookingDetails?.totalGuests)
      setNumberOfRooms(bookingDetails?.numberOfRooms)
      setGuestNumber(bookingDetails?.totalGuests)
    }
  }, [popUpforDate])


  const today = new Date();

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
    const baseDate: any = checkIn || (bookingDetails?.checkIn ?? null);
    const maxDate = new Date(baseDate);
    maxDate.setMonth(maxDate.getMonth() + 6); // Add 6 months to the base date
    return maxDate;
  };

  const changeBookingDetails = () => {
    if (numberOfRooms > guestNumber) {
      setError("each room should consist alteast 1 guest")
      return
    } else if (guestNumber > numberOfRooms * 3) {
      setError("each room should not consist more than 3 guests")
      return
    }
    console.log("changeBookingDetails fun clicked")
    let numberOfDays
    let checkInDate
    let checkOutDate
    console.log("checkIn", checkIn, checkOut)
    console.log("Type of checkIn:", checkIn)
    console.log("Type of checkOut:", checkOut instanceof Date)
    if (typeof checkIn === "string" && checkOut instanceof Date) {
      checkInDate = new Date(checkIn)

      if (checkInDate && checkOut && checkInDate < checkOut) {
        console.log("inside if ")
        console.log("checkInDate", checkInDate)

        // checkInDate.setHours(checkInDate.getHours() - 5); 
        // checkInDate.setMinutes(checkInDate.getMinutes() - 30)
        // console.log("checkInDate after setHours and setMinutes",checkInDate)
        console.log("checkOut", checkOut)




        numberOfDays = Math.ceil(
          (checkOut.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        ) - 1;
        console.log("Number of Days:", numberOfDays);
        setNoOfDays(numberOfDays)
      }
      if (checkInDate && checkOut && roomId) {
        if (numberOfDays) {
          console.log("dispatching")
          dispatch(changeBookingDetail({ lngLat, numberOfRooms, guestNumber, checkIn: checkInDate, checkOut, hotelId, roomId, noOfDays: numberOfDays }))

        }
      }
    } else if(typeof checkOut==="string" && checkIn instanceof Date){
      checkOutDate = new Date(checkOut)

      if (checkIn && checkOutDate && checkIn < checkOutDate) {
        console.log("inside if ")
        console.log("checkIn", checkIn)

       
        console.log("checkOutDate", checkOutDate)




        numberOfDays = Math.ceil(
          (checkOutDate.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        ) - 1;
        console.log("Number of Days:", numberOfDays);
        setNoOfDays(numberOfDays)
      }
      if (checkIn && checkOutDate && roomId) {
        if (numberOfDays) {
          console.log("dispatching")
          dispatch(changeBookingDetail({ lngLat, numberOfRooms, guestNumber, checkIn: checkIn, checkOut:checkOutDate, hotelId, roomId, noOfDays: numberOfDays }))

        }
      }
    }else{
     console.log("else is working")
      if (checkIn && checkOut && roomId) {
        console.log("type",typeof checkIn, typeof checkOut,"checkIn",checkIn,checkOut)
       let  checkInDate=new Date(checkIn)
       let  checkOutDate=new Date(checkOut)

        numberOfDays = Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        ) - 1;
        console.log("Number of Days:", numberOfDays);
        setNoOfDays(numberOfDays)
       
          console.log("dispatching")
          dispatch(changeBookingDetail({ lngLat, numberOfRooms, guestNumber, checkIn: checkIn, checkOut, hotelId, roomId, noOfDays:numberOfDays}))

        
      }
    }


    setPopUpforDate(false)

  }


  return (
    <>
      <Header />
      <div className='mt-12 flex justify-center '>
        {/* <HotelSearchBar /> */}

      </div>
      <div className="flex gap-8 p-8 mt-16" >
        {/* Left Section */}
        <div className="space-y-6 md:col-span-2">
          <h1 className="text-3xl font-bold">{hotelDetails[0]?.hotelName}</h1>
          <p className="text-gray-600">{hotelDetails[0]?.address}</p>

          <h1 className="text-xl font-semibold">Amenities</h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {hotelDetails[0]?.amenities.map((amenity: string, index: number) => (
              <span
                key={index}
                className="flex items-center gap-1 text-sm text-gray-700"
              >
                <span>✅</span> {amenity}
              </span>
            ))}
          </div>

          <h1 className="text-xl font-semibold">About</h1>
          <p className="mt-4 text-gray-600">
            The hotel is located in Kochi and is close to popular attractions
            such as Wonderla Amusement Park and Subhash Bose Park Ernakulam.
          </p>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Available rooms</h2>
            <div className="space-y-4">
              {hotelDetails && hotelDetails[0].roomCategories.map((room) => (
                <div
                  key={room._id}
                  className="border border-gray-300 rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-start sm:items-center"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={room.roomPhotos[0]}
                      alt={room.roomType}
                      className="w-full sm:w-40 h-32 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 sm:ml-4 mt-2 sm:mt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{room.roomType}</h3>
                        {room.isAvailable === false && (
                          <span className="text-red-500 font-medium text-sm bg-red-100 px-2 py-1 rounded">
                            Sold out
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-green-500 font-medium"></span>
                    </div>
                    <p className="text-sm text-gray-500">Room size: {room.roomSize} sqft</p>
                    <div className="flex gap-2 text-sm mt-2">
                      {room.roomAmenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-md"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="text-right font-bold text-lg mt-2">₹ {room.roomPrice}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating and Reviews Section */}
          <div className="space-y-6">
            

           {ratings.length>0 ? 
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Rating and Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl">
                3.7
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>5 ⭐</span>
                  <span>38%</span>
                </div>
                <div className="w-1/2 bg-gray-300 h-2 rounded-md">
                  <div
                    className="bg-green-500 h-2 rounded-md"
                    style={{ width: "38%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span>4 ⭐</span>
                  <span>21%</span>
                </div>
              </div>

            </div>
 <div className='flex justify-center'>
 <FaArrowLeft className={`${reviewCount >0 ? 'text-black cursor-pointer' : 'text-white'} mt-4 mr-10` }  onClick={()=>setReviewCount((prev)=>{
                    console.log("ratings",ratings)
                    if(prev===0){
                      console.log(prev)
                      return prev
                    }
 
                    return prev-1})}/>
                  <img className='w-16 h-14 rounded-3xl' src={ratings[reviewCount].user.profileImage} alt='profileImage'/> 
                  <div className='flex flex-col ml-8'>
                    <p className='text-lg font-bold'>{ratings[reviewCount].user.email}</p>
                    <p className=''>{ratings[reviewCount].review}</p> 
                  </div>
                  <p className= 'font-bold ml-10'>{ratings[reviewCount].rating} <span className='ml-2'>⭐</span></p>
                 
                  <FaArrowRight className={`ml-10 mt-3  ${reviewCount < ratings.length-1 ? 'text-black cursor-pointer' : 'text-white'}`} onClick={()=>setReviewCount((prev)=>{
                    console.log("prec",prev)
                    if(prev===ratings.length-1){
                      console.log(prev)
                      return prev
                    }
 
                    return prev+1})} />
                
                </div>
          </div> 
          :<p className='text-slate-500'>No reviews yet</p>
           }
              
                  
                
            
    
            
          

            {/* Hotel Policies */}
            <div className="space-y-2 mt-6">
              <h2 className="text-2xl font-bold">Hotel Policies</h2>
              <div className="flex justify-between">
                <span>Check-in: {hotelDetails[0]?.roomPolicies.checkIn}</span>
                <span>Check-out: {hotelDetails[0]?.roomPolicies.checkOut}</span>
              </div>
              <ul className="list-disc pl-6 mt-2">
                {hotelDetails[0]?.hotelRules.map((rule: string, index: number) => (
                  <li key={index}>{rule}</li>
                ))}

              </ul>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-96 border h-[28rem] border-gray-300 rounded-lg p-4 shadow-lg">
          {/* Room availability check */}
          {hotelDetails[0]?.roomCategories[roomCategoryIndex] ? (
            <h2 className="text-xl font-bold">
              ₹{' '}
              {hotelDetails[0]?.roomCategories[roomCategoryIndex].roomPrice *( bookingDetails ? bookingDetails?.numberOfRooms:1)*noOfDays}
            </h2>
          ) : (
            <p className="text-red-500">Rooms not available on these days</p>
          )}

          {popUpforDate ? (
            <div>
              <div className='flex'>
                <div className="flex items-center px-3 ">
                  <div className="text-center">
                    <label className="block text-sm">Check-In</label>
                    <DatePicker
                      selected={checkIn}
                      onChange={handleCheckInChange}
                      selectsStart
                      startDate={checkIn || today}
                      endDate={checkOut || bookingDetails?.checkOut}
                      minDate={today}
                      className="w-24 text-center"
                      placeholderText="Add Date"
                    />
                  </div>
                </div>

                <div className="flex items-center px-3 ">
                  <div className="text-center">
                    <label className="block text-sm">Check-Out</label>
                    <DatePicker
                      selected={checkOut}
                      onChange={handleCheckOutChange}
                      selectsEnd
                      startDate={checkIn || today}
                      endDate={checkOut || bookingDetails?.checkOut}
                      minDate={checkIn || today}
                      maxDate={getMaxDate()}
                      className="w-24 text-center"
                      placeholderText="Add Date"
                    />
                  </div>
                </div>
              </div>
              <div className='flex'>
                <label htmlFor="">rooms</label>
                <input className='w-1/2 mx-3' type="number" value={numberOfRooms} onChange={(e: any) => {
                  if (parseInt(e.target.value) <= 6 && parseInt(e.target.value) >= 1) {
                    setError("")
                    setNumberOfRooms(parseInt(e.target.value))
                  }

                  else if (parseInt(e.target.value) < 1) {
                    setNumberOfRooms(1)
                    setError(" Number of rooms can't be less than 1")
                  }
                  else if (parseInt(e.target.value) > 6) {
                    setNumberOfRooms(6)
                    setError("Only upto 6 room scan be selected")

                  }


                }} />
                <label htmlFor="">guests</label>

                <input className='w-1/2 mx-3' type="number" value={guestNumber} onChange={(e: any) => {
                  console.log("number", e.target.value)
                  if (parseInt(e.target.value) <= numberOfRooms * 3 && parseInt(e.target.value) >= numberOfRooms) {
                    console.log("object", e.target.value, numberOfRooms)
                    setGuestNumber(parseInt(e.target.value))
                    setError("")
                  }
                  else if (parseInt(e.target.value) > numberOfRooms * 3) {
                    setGuestNumber(numberOfRooms * 3)
                    setError("Maximum 3 guest can allowed in a room ")
                  }
                  else if (parseInt(e.target.value) < numberOfRooms) {
                    setGuestNumber(numberOfRooms)
                    setError("A room must consist a guest")
                  }

                }} />

              </div>
              {error && (<p className='text-red-500 my-4'>{error}</p>)}
              <div className='flex justify-end'>
                <button className='bg-heading-green text-white w-2/5 p-1 font-thin my-4 ' onClick={changeBookingDetails}> Apply changes</button>

              </div>

            </div>


          ) : (<div>
            <div className='flex justify-between'>
              <p className="text-sm text-gray-500">
                {bookingDetails?.checkIn
                  ? new Date(bookingDetails.checkIn).toLocaleDateString()
                  : "N/A"}{" "}
                -{" "}
                {bookingDetails?.checkOut
                  ? new Date(bookingDetails.checkOut).toLocaleDateString()
                  : "N/A"}
              </p>
              <FaRegEdit onClick={() => setPopUpforDate(true)} />

            </div>
            <p className="text-sm">
              {bookingDetails?.numberOfRooms} Room(s), {bookingDetails?.totalGuests} Guest(s)
            </p>
          </div>
          )}





          <h3 className="mt-4 font-semibold">Room Details</h3>
          <div className="mt-2">
            <label htmlFor="room-type" className="block text-sm">
              Room Type
            </label>
            <select
              id="room-type"
              className="w-full border rounded px-2 py-1 mt-1"
              onChange={(e) => changeRoomType(e)}
            >
              
              {hotelDetails[0].roomCategories.map((room, index) => (
                <option key={index} value={room.roomType} data-room-id={room._id}>
                  {room.roomType}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="mt-4">
          <label htmlFor="coupon-code" className="block text-sm">
            Enter Coupon Code
          </label>
          <input
            id="coupon-code"
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="Enter Coupon Code"
          />
          <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
            Apply
          </button>
        </div> */}
          {hotelDetails[0]?.roomCategories[roomCategoryIndex] &&

            (<div>
              <div className="flex justify-between mt-4 font-normal">
                <span>Price per night</span>
                <span>₹ {hotelDetails[0]?.roomCategories[roomCategoryIndex].roomPrice}</span>
              </div>
              <div className="flex justify-between mt-4 font-normal">
                <span>Number of rooms </span>
                <span>{bookingDetails ? bookingDetails.numberOfRooms : 1}</span>
              </div>
              <div className="flex justify-between mt-4 font-normal">
                <span>Number of days </span>
                <span>{noOfDays}</span>
              </div>
              <div className="flex justify-between mt-4 font-semibold">
                <span>Total Price:</span>
                <span>₹ {hotelDetails[0]?.roomCategories[roomCategoryIndex].roomPrice * (bookingDetails ? bookingDetails?.numberOfRooms : 1) * noOfDays}</span>
              </div>

              <button className="mt-4 bg-blue-600 text-white w-full py-2 rounded"
                onClick={(e) => {
                  e.preventDefault()
                  if (hotelDetails[0]?.roomCategories[roomCategoryIndex]) {
                    const room = hotelDetails[0].roomCategories[roomCategoryIndex];
                    const bookingDetail = {
                      roomType: room.roomType,
                      roomPrice: room.roomPrice,
                      noOfDays,
                      roomId: room._id,
                      hotelId: hotelDetails[0].hotelId,
                      totalAmount: room.roomPrice * (bookingDetails ? bookingDetails?.numberOfRooms : 1)*noOfDays,
                      hotelName: hotelDetails[0].hotelName,
                      hotelAddress: hotelDetails[0].address,
                      userId: userInfo?.userId
                    }
                    dispatch(saveBookingDetails(bookingDetail))
                    navigate('/addGuestDetails')
                  }
                }}>
                Continue Booking
              </button>
            </div>
            )}
        </div>


      </div>
    </>

  )
}

export default HotelBooking
