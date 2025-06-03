import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/redux/store';
import Header from './Header';

interface ReservationDetails {
  bookingId: string;
  hotelName: string;
  hotelAddress: string;
  guestDetails: {
    name: string;
  };
  checkIn: String;
  checkOut: String;
  roomType: string;
  noOfRooms: number;
  totalAmount: number;
  paymentMethod: string;
}

const OrderDetailPage: React.FC = () => {
  const { reservationDetails } = useSelector((state: RootState) => state.user) as {
    reservationDetails: ReservationDetails | null;
  };
  const formattedCheckIn = new Date(reservationDetails?.checkIn);
  const formattedCheckOut = new Date(reservationDetails?.checkOut);
  
  // Extract components for formattedCheckIn
  const yearIn = formattedCheckIn.getUTCFullYear();
  const monthIn = (formattedCheckIn.getUTCMonth() + 1).toString(); // Months are 0-based
  const dayIn = formattedCheckIn.getUTCDate().toString();
  const hoursIn = formattedCheckIn.getUTCHours();
  const minutesIn = formattedCheckIn.getUTCMinutes().toString().padStart(2, "0");
  const secondsIn = formattedCheckIn.getUTCSeconds().toString().padStart(2, "0");
  
  // Format hours for 12-hour clock and determine AM/PM
  const hour12In = hoursIn % 12 || 12; // Convert 0 to 12 for 12-hour format
  const ampmIn = hoursIn >= 12 ? "PM" : "AM";
  
  const formattedDateCheckIn = `${monthIn}/${dayIn}/${yearIn}, ${hour12In}:${minutesIn}:${secondsIn} ${ampmIn}`;
  console.log("Check-In Date:", formattedDateCheckIn);
  
  // Extract components for formattedCheckOut
  const yearOut = formattedCheckOut.getUTCFullYear();
  const monthOut = (formattedCheckOut.getUTCMonth() + 1).toString(); // Months are 0-based
  const dayOut = formattedCheckOut.getUTCDate().toString();
  const hoursOut = formattedCheckOut.getUTCHours();
  const minutesOut = formattedCheckOut.getUTCMinutes().toString().padStart(2, "0");
  const secondsOut = formattedCheckOut.getUTCSeconds().toString().padStart(2, "0");
  
  // Format hours for 12-hour clock and determine AM/PM
  const hour12Out = hoursOut % 12 || 12; // Convert 0 to 12 for 12-hour format
  const ampmOut = hoursOut >= 12 ? "PM" : "AM";
  
  const formattedDateCheckOut = `${monthOut}/${dayOut}/${yearOut}, ${hour12Out}:${minutesOut}:${secondsOut} ${ampmOut}`;
  console.log("Check-Out Date:", formattedDateCheckOut);


  return (
    <>
    <Header />
    <div className="container mx-auto p-8 mt-16 flex flex-col justify-center items-center ">
      <h1 className="text-3xl font-bold mb-4 ">Booking Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md ">
        <p>Booking ID: {reservationDetails?.bookingId}</p>
        <h2 className="text-2xl font-semibold mt-4">
          {reservationDetails?.hotelName}
        </h2>
        <p className="text-gray-600">{reservationDetails?.hotelAddress}</p>

        <div className="mt-4">
          <p className="font-semibold">Primary Guest:</p>
          <p>{reservationDetails?.guestDetails?.name}</p>
        </div>

        <div className="mt-4">
          <p className="font-semibold">Stay Dates:</p>
          <div className="flex space-x-4">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75v-2.25m4.5 0h-1.5m10.5 0h-1.5M3 13.5v-2.25m0 0h18m-18 0v2.25m0 0h18M3 8.25v-2.25m0 0h18m-18 0v2.25m0 0h18" />
              </svg>
              <span>Check In:</span>
            </div>
            <span>{formattedDateCheckIn}</span>
          </div>
          <div className="flex space-x-4 mt-2">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75v-2.25m4.5 0h-1.5m10.5 0h-1.5M3 13.5v-2.25m0 0h18m-18 0v2.25m0 0h18M3 8.25v-2.25m0 0h18m-18 0v2.25m0 0h18" />
              </svg>
              <span>Check Out:</span>
            </div>
            <span>{formattedDateCheckOut}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="font-semibold">Room Details:</p>
          <p>
            {reservationDetails?.roomType} - Rooms: {reservationDetails?.noOfRooms}
          </p>
        </div>

        <div className="mt-4">
          <p className="font-semibold">Total Amount:</p>
          <p>₹ {reservationDetails?.totalAmount?.toFixed(2)}</p> 
        </div>

        <div className="mt-4">
          <p className="font-semibold">Payment Method:</p>
          <p>{reservationDetails?.paymentMethod}</p>
        </div>
      </div>
    </div>

    </>
    
  );
};

export default OrderDetailPage;