import { useLocation } from 'react-router-dom';
import { useState } from 'react'; // Optional: For managing coupon code input
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/redux/store';
import Header from './Header';

const HotelDetails = () => {
  const location = useLocation();
  const {nearByHotels}=useSelector((state:RootState)=>state.user)
  const queryParams = new URLSearchParams(location.search);
  const hotelId = queryParams.get('hotelId'); // Get the hotel ID from the URL

  // Find the selected hotel from the data
  const hotel:any = nearByHotels?.find((hotel:any) => hotel.hotelId === hotelId);

  if (!hotel) return <p>Hotel not found!</p>;

  // const [coupon, setCoupon] = useState(""); // Optional coupon input

  return (
    <>
    <Header />
    <div className="mt-14 max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Left Section: Hotel Images and Information */}
  <div className="md:col-span-3 h-80 flex overflow-hidden gap-1">
    <div className="w-3/4">
      <img
        src={hotel.hotelPhoto[0]}
        alt={hotel.hotelName}
        className="w-full h-80 object-cover rounded-lg"
      />
    </div>
    <div className="w-1/4 flex flex-col gap-1 relative">
      <div className='h-1/2'>
        <img
          src={hotel.hotelPhoto[1]}
          alt={hotel.hotelName}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className='h-1/2'>
        <img
          src={hotel.hotelPhoto[1]}
          alt={hotel.hotelName}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-md">
        2 more photos
      </div>
    </div>
  </div>

  {/* Left Content Section */}
  <div className="space-y-6 md:col-span-2">
    <h1 className="text-3xl font-bold">{hotel.hotelName}</h1>
    <p className="text-gray-600">{hotel.address}</p>

    <h1 className="text-xl font-semibold">Amenities</h1>
    <div className="mt-2 flex items-center gap-2 flex-wrap">
      {hotel.amenities.map((amenity: string, index: number) => (
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

    {/* Rating and Reviews Section */}
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
      <p className="mt-4">
        <strong>Devarkonda</strong> - It's unfortunate to hear about the poor
        service experience at OYO Nanda Inn hotel despite good neatness.
      </p>
      <button className="text-blue-500 mt-2">See all reviews</button>

      {/* Hotel Policies */}
      <div className="space-y-2 mt-6">
        <h2 className="text-2xl font-bold">Hotel Policies</h2>
        <div className="flex justify-between">
          <span>Check-in: {hotel.roomPolicies.checkIn}</span>
          <span>Check-out: {hotel.roomPolicies.checkOut}</span>
        </div>
        <ul className="list-disc pl-6 mt-2">
        {hotel.hotelRules.map((rule: string, index: number) => (
    <li key={index}>{rule}</li>
  ))}
         
        </ul>
      </div>
    </div>
  </div>

  {/* Right Section: Room Categories */}
  <div className="space-y-6 md:col-span-1">
    <h2 className="text-2xl font-bold">Room Categories</h2>
    {Array.isArray(hotel.roomCategories) &&
      hotel.roomCategories.map((category: any, index: number) => (
        <div
          key={index}
          className="flex border p-4 rounded-lg items-center gap-6"
        >
          <img
            src={hotel.hotelPhoto[0]}
            alt={category.roomType}
            className="w-32 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{category.roomType}</h3>
            <p className="text-sm text-gray-600">{category.roomSize} sqft</p>
            <div className="mt-2 flex gap-4">
              {Array.isArray(category.amenities) &&
                category.amenities.map((item: string, i: number) => (
                  <span key={i} className="text-sm text-gray-700">
                    {item}
                  </span>
                ))}
            </div>
            <p className="text-lg font-bold mt-2">₹ {category.roomPrice}</p>
          </div>
        </div>
      ))}
  </div>
</div>
    

 
    
    </>
    
  );
};

export default HotelDetails;
