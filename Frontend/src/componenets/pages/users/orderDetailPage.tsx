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
  const formattedCheckIn=new Date(reservationDetails?.checkIn)
  const formattedCheckOut=new Date(reservationDetails?.checkOut)


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
            <span>{formattedCheckIn.toLocaleString()}</span>
          </div>
          <div className="flex space-x-4 mt-2">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75v-2.25m4.5 0h-1.5m10.5 0h-1.5M3 13.5v-2.25m0 0h18m-18 0v2.25m0 0h18M3 8.25v-2.25m0 0h18m-18 0v2.25m0 0h18" />
              </svg>
              <span>Check Out:</span>
            </div>
            <span>{formattedCheckOut.toLocaleString()}</span>
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