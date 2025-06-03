import React, { useEffect, useState } from "react";
import { api, hostApi } from "../../../utils/axios/axiosconfig";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";

import { toast } from 'react-toastify'
import Swal from "sweetalert2"


import { useNavigate } from "react-router-dom";
import HostHeader from "./HostHeader";



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
  userId:string
 
}
 

const Reservations = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotelId, setHotelId] = useState<string>('');
    const navigate = useNavigate()
  

  const [bookingId, setBookingId] = useState<string>('');

  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { hostInfo } = useSelector((state: RootState) => state.host);
  const hostId = hostInfo?.hostId;
  console.log("bookings",bookings)



  const fetchBookings = async (type: "upcoming" | "past") => {
    setLoading(true);
    try {
      const response = await hostApi.get("/reservations", {
        params: { type, hostId }, // Send type and hostId as query parameters
      });
      console.log("response.data",response.data)
      if(type==="past"){
        console.log("response.data",response.data.ratings)

        setBookings(response.data.completedBookings)
       
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

  
      const chatCreation = async(hostId: string,userid: string) => {
  
        const response = await hostApi.get(`/getChatId/${hostId}/${userid}`);
  
        if(response){
          navigate(`/host/chat/${response.data.id}/${userid}`);
        }
       
    };




  return (
    <>
      <HostHeader />
      <div className="max-w-4xl mx-auto mt-24">
        
        <h1 className="text-2xl font-semibold mb-4">Reservations</h1>
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
              <div className="flex flex-row gap-2 items-center">
                <button className="text-blue-500 border border-blue-500 px-3 py-1 rounded-md hover:bg-blue-500 hover:text-white transition">
                  View Booking
                </button>

                {activeTab === "upcoming" && booking.bookingStatus==="booked" &&(
                <img src="/src/assets/message.png" className='w-10' alt="chat" onClick={() => {
                            if (hostId) {
                                chatCreation(hostId,booking.userId);
                            }
                        }}
    />
)}

               </div>
               </div>)})
        ) : (
          <p className="text-gray-500">No bookings found.</p>
        )}
  
        
      </div>

     
        

    </>
  );
};

export default Reservations;
