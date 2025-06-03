import React, { useEffect, useState } from "react";
import { api } from "../../../utils/axios/axiosconfig";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import Header from "./Header";
import { toast } from 'react-toastify'
import Swal from "sweetalert2"
import RatingAndReview from "./RatingAndReview";
import ReportHotel from "./ReportHotel";
import { useNavigate } from "react-router-dom";

interface Rating {
    _id: string,
    rating: number;
    review: string;
    bookingId: string,
    userId: string,
    hotelId: string,
}

interface Booking {
  _id: string;
  bookingStatus:string
  hotelId: {_id:string,hostId:{_id:string,email: string, firstName: string, lastName: string, phone: number},hotelName:string,hotelPhoto:[string],roomPolicies:{checkIn:string,checkOut:string}};
  roomId:{roomType: string};
  checkIn: string;
  checkOut: string;
  noOfGuests: number;
  image: string;
  noOfRooms: number;
 
}
 

const MyBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ratings,setRatings]=useState<Rating[]>([])
  const [loading, setLoading] = useState(true);
  const [hotelId, setHotelId] = useState<string>('');
    const navigate = useNavigate()
  

  const [bookingId, setBookingId] = useState<string>('');

  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { userInfo } = useSelector((state: RootState) => state.user);
  const userId = userInfo?.userId;
  console.log("bookings",bookings)

  const [ratingPopup,setRatingPopup]=useState<boolean>(false)
  const [reportPopup,setReportPopup]=useState<boolean>(false)


  const fetchBookings = async (type: "upcoming" | "past") => {
    setLoading(true);
    try {
      const response = await api.get("/myBooking", {
        params: { type, userId }, // Send type and userId as query parameters
      });
      console.log("response.data",response.data)
      if(type==="past"){
        console.log("response.data",response.data.ratings)

        setBookings(response.data.completedBookings)
        setRatings(response.data.ratings)
      }
 
      else
      setBookings(response.data);
    console.log("bookings",bookings)
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch upcoming bookings by default when the component mounts
    fetchBookings("upcoming");

  }, []);

  const handleTabClick = (type: "upcoming" | "past") => {
    setActiveTab(type);
    fetchBookings(type); // Fetch bookings based on the selected tab
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  
      const chatCreation = async(hostid: string, userId: string) => {
  
        const response = await api.get(`/getChatId/${hostid}/${userId}`);
  
        if(response){
          navigate(`/chat/${response.data.id}/${hostid}`);
        }
       
    };


  const cancelBooking=async(bookingId:string,roomPolicies:{checkIn:string,checkOut:string},checkInDate:string,checkOutDate:string)=>{
    Swal.fire({
      title: "Cancel Booking",
      text: `Are you sure you want to cancel this booking?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Unblock: Blue, Block: Red
      cancelButtonColor: "#aaa",
      confirmButtonText:  "Yes, Cancel",
    }).then(async(result) => {
      if (result.isConfirmed) {
        console.log("confirm",bookingId)
        const response=await api.patch('/cancelBooking',{bookingId,roomPolicies,checkInDate,checkOutDate},{
          headers: { 'Content-Type': 'application/json' }})
        console.log("response",response)
        if(response.data==="booking cancelled"){
          Swal.fire("Booking Cancelled", "", "success");

        }

      }
    });
  }

  const handleRating=async(bookingId:string,hotelId:string)=>{
    setRatingPopup(true)
    setBookingId(bookingId)
    setHotelId(hotelId)
  }
  const submitRating =async (rating: number, review: string) => {
    console.log("Submitting Rating:", { rating, review });
    const response=await api.post('/rating',{rating,review,bookingId,userId,hotelId})
    if(response){
      toast.success(response.data.message)
    }

  
  };

  const reportHotel=async(bookingId:string,hotelId:string)=>{
    setReportPopup(true)
    setBookingId(bookingId)
    setHotelId(hotelId)
  } 

  const submitReport =async (complaint: string) => {
    console.log("Submitting Reporting:", { complaint });
    const response=await api.post('/reportHotel',{complaint,bookingId,userId,hotelId})
    if(response){
      toast.success(response.data.message)
    }

  
  };


  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-24">
        
        <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 text-base font-medium ${
              activeTab === "upcoming"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
            onClick={() => handleTabClick("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 text-base font-medium ${
              activeTab === "past"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
            onClick={() => handleTabClick("past")}
          >
            Past
          </button>
        </div>
        <hr className="mb-6" />
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const hasRating = ratings.some((rating) => rating.bookingId === booking._id);
            return(
            <div
              className="flex items-start gap-4 mb-6 p-4 border rounded-md shadow-sm"
              key={booking._id}
            >
              <img
                src={booking.hotelId.hotelPhoto[0]}
                alt={booking.hotelId.hotelName}
                className="w-24 h-24 object-cover rounded-md"
              />
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{booking.hotelId.hotelName}</h2>
                <p className="text-sm text-gray-600">
                  {booking.roomId.roomType} &times; {booking.noOfRooms}
                </p>
                <p className="text-sm text-gray-600">
                  Check In: {new Date(booking.checkIn).toISOString().slice(0, 10)}
                </p>
                <p className="text-sm text-gray-600">
                  Check Out: {new Date(booking.checkOut).toISOString().slice(0, 10)}
                </p>
                <p className="text-sm text-gray-600">Guests: {booking.noOfGuests}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="text-blue-500 border border-blue-500 px-3 py-1 rounded-md hover:bg-blue-500 hover:text-white transition">
                  View Booking
                </button>
                {activeTab === "upcoming" && booking.bookingStatus==="booked" ?(
                  <div>
     <button className="text-red-500 border border-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition"
                  onClick={()=>cancelBooking(booking._id,booking.hotelId.roomPolicies,booking.checkIn,booking.checkOut)}
                  >
                    Cancel Booking
                  </button>
                           <img src="/src/assets/message.png" className='w-10' alt="chat" onClick={() => {
                            if (userInfo) {
                                chatCreation(booking.hotelId.hostId._id, userInfo?.userId);
                            }
                        }}
    />
                  </div>
             
                ):activeTab === "upcoming" && booking.bookingStatus==="cancelled" ? <span className="text-red-600">cancelled</span>:
                 activeTab === "past" && !hasRating ? (
                  <>
                     <button className="border border-green-600 text-green-500" onClick={() => handleRating(booking._id, booking.hotelId._id)}>
                    Rate the stay
                  </button>
                  <button className="border border-red-600 text-red-600" onClick={() => reportHotel(booking._id, booking.hotelId._id)}>
                  Report hotel
                  </button>
                  </>
               
                ) : (
                  <></>)}
              </div>
            </div>
          )})
        ) : (
          <p className="text-gray-500">No bookings found.</p>
        )}
         <RatingAndReview
        isOpen={ratingPopup}
        onClose={() => setRatingPopup(false)}
        onSubmit={submitRating}
      />

       <ReportHotel
        isOpen={reportPopup}
        onClose={() => setReportPopup(false)}
        onSubmit={submitReport}
      />
        
      </div>

     
        

    </>
  );
};

export default MyBooking;
