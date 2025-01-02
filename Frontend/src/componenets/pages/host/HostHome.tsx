import React, { useEffect } from 'react';
import HostHeader from './HostHeader';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../utils/redux/store';
import { toast } from 'react-toastify';

import { fetchHotels } from '../../../utils/axios/HostApi/HostApi';
import { resetStates } from '../../../utils/redux/slices/hostSlice';

const HostHome = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  
  const { hotels,hostInfo, message } = useSelector((state: RootState) => state.host);
  const hostId=hostInfo?.hostId
  console.log("hotels",hotels)
  useEffect(() => {
    // Fetch hotels from the backend when the component is mounted
   
      dispatch(fetchHotels(hostId));

    
  }, [dispatch]);

  useEffect(() => {
    if (message === 'Request for adding hotel is sent') {
      toast.success(message);
      dispatch(resetStates());
    }
  }, [message, dispatch]);

  // const handleRemove = (hotelId: string) => {
  //   dispatch(deleteHotel(hotelId));
  // };

  const hotelDetail = (index: number) => {
    if (hotels) {
      const selectedHotel: any = hotels[index]
      console.log("details of hotel", selectedHotel)
      navigate(`/host/hotelDetails?hotelId=${selectedHotel._id}`)
    }

  }

  return (
    <>
      <HostHeader />
      <div className='flex justify-between items-center mt-24 px-10'>
        <h2 className='text-2xl font-semibold'>Listed Properties</h2>
        <button
          className='bg-heading-green text-white  hover:bg-navbar-green"  px-3 py-2 rounded-md'
          onClick={() => navigate('/host/addHotel')}
        >
          Add new property
        </button>
      </div>

      <div className='mt-10 px-10'>
        {/* Conditional rendering to handle case where no hotels are available */}
        {hotels && hotels.length === 0 ? (
          <div className='text-center mt-10'>
            <p className='text-gray-500 text-lg'>No properties found.</p>
            <button
              className='mt-5 bg-blue-500 text-white px-4 py-2 rounded-md'
              onClick={() => navigate('/host/addHotel')}
            >
              Add your first property
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {hotels && hotels.map((hotel: any,index) => (
              <div key={hotel._id} className='border rounded-lg p-4'>
                {/* Check if hotelPhoto exists and is not empty */}
                {hotel.hotelPhoto && hotel.hotelPhoto.length > 0 ? (
                  <img
                    src={`${hotel.hotelPhoto[0]}`} 
                    alt={hotel.hotelName}
                    className='w-full h-48 object-cover rounded-md'
                    onClick={() => hotelDetail(index)}
                  />
                ) : (
                  <div className='w-full h-48 bg-gray-200 flex items-center justify-center rounded-md'>
                    <p className='text-gray-500'>No image available</p>
                  </div>
                )}
                <h3 className='mt-4 text-lg font-semibold'>{hotel.hotelName}</h3>
                <p className='text-sm text-gray-500'>{hotel.address?.locality}, {hotel.address?.state}</p>
                {/* <button
                  className='mt-4 bg-red-500 text-white px-3 py-1 rounded-md'
                  onClick={() => handleRemove(hotel._id)}
                >
                  Remove
                </button> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HostHome;
