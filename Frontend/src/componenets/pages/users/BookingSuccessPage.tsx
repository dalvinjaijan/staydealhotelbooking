import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/redux/store';
import confetti from 'canvas-confetti';
import '../../../App.css'
import { useNavigate } from 'react-router-dom';

const BookingSuccessPage = () => {
  const { reservationDetails } = useSelector((state: RootState) => state.user);
const navigate=useNavigate()
  const celebrateBooking = () => {
    confetti({
      particleCount: 100,
      spread: 30,
      angle: 90,
      origin: { x: 0.5, y: 0.8 },
      colors: ['#f4924b', '#17a2b8', '#2ecc71'],
    });
  };

  useEffect(() => {
    celebrateBooking(); // Trigger confetti animation on component mount
  }, []); // Empty dependency array to run only once

  return (
    <div className="booking-success-container">
      <div className="flex flex-col items-center justify-center max-w-full min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-green-600">Booking successful!</h2>
      {reservationDetails && (
        <>
          <p className="text-lg mb-4 text-black">Booking Id: {reservationDetails.bookingId}</p>
          <p className="text-lg text-black">
            An invoice has been sent to your email: {reservationDetails.GuestDetails.email}
          </p>

          <div className='flex justify-between space-x-20 mt-16'>
            <button  className="px-6 py-2 bg-heading-green text-white rounded-md hover:bg-navbar-green" onClick={()=>navigate('/')}>Go Home</button>
            <button className="px-6 py-2 bg-heading-green text-white rounded-md hover:bg-navbar-green" onClick={()=>navigate('/orderDetailPage')}>My Booking</button>

          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default BookingSuccessPage
