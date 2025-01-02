import React, { useEffect, useState } from "react";
import { api } from "../../../utils/axios/axiosconfig";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import Header from "./Header";

interface Booking {
  id: string;
  hotelId: {hotelName:string,hotelPhoto:[string]};
  roomId:{roomType: string};
  checkIn: string;
  checkOut: string;
  noOfGuests: number;
  image: string;
  noOfRooms: number;
}

const MyBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { userInfo } = useSelector((state: RootState) => state.user);
  const userId = userInfo?.userId;

  const fetchBookings = async (type: "upcoming" | "past") => {
    setLoading(true);
    try {
      const response = await api.get("/myBooking", {
        params: { type, userId }, // Send type and userId as query parameters
      });
      console.log("response.data",response.data)
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch upcoming bookings by default when the component mounts
    fetchBookings("upcoming");
    console.log("fetch working")
  }, []);

  const handleTabClick = (type: "upcoming" | "past") => {
    setActiveTab(type);
    fetchBookings(type); // Fetch bookings based on the selected tab
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

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
          bookings.map((booking) => (
            <div
              className="flex items-start gap-4 mb-6 p-4 border rounded-md shadow-sm"
              key={booking.id}
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
              {/* <div className="flex flex-col gap-2">
                <button className="text-blue-500 border border-blue-500 px-3 py-1 rounded-md hover:bg-blue-500 hover:text-white transition">
                  View Booking
                </button>
                {activeTab === "upcoming" && (
                  <button className="text-red-500 border border-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition">
                    Cancel Booking
                  </button>
                )}
              </div> */}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No bookings found.</p>
        )}
      </div>
    </>
  );
};

export default MyBooking;
