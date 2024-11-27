import React, { useContext, useEffect, useState } from 'react'
import Header from './Header'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../utils/redux/store'
import { toast } from 'react-toastify'
import { resetHotelSearchs, resetStates, setLocation, sortHotelsByPrice } from '../../../utils/redux/slices/userSlice'
import PlacesAutoComplete from '../host/PlacesAutoComplete'
import { PlacesContext } from '../../../context/placesContext'
import { fetchFilteredHotels, searchHotel, selectCity } from '../../../utils/axios/api'
import { useNavigate } from 'react-router-dom'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import { IoSearchOutline } from "react-icons/io5";




const Home = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const { message, error, nearByHotels, selectedLoc, lngLat, hotelSearchResult } = useSelector((state: RootState) => state.user)
  // console.log("neabyHotels",nearByHotels)
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedOtherFilters, setSelectedOtherFilters] = useState<string[]>([]);
  // const [filteredSort,setFilteredSort] = useState<[]|null>([])
  const navigate = useNavigate()

  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedCity, setSelectedCity] = useState<string>('');
  const isLoaded = useContext(PlacesContext)
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null)
  // const [suggestions, setSuggestions] = useState([]);

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
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  console.log("latitude", latLng)

  const handleLocationSelect = (address: string, latLng: { lat: number, lng: number }) => {
    setSelectedLocation(address);
    setLatLng(latLng);
    setShowLocationPopup(false)

  };
  const cities = [
    { name: 'Kochi', icon: '/src/assets/kochi.png' },
    { name: 'Mumbai', icon: '/src/assets/mumbai.png' },
    { name: 'Bengaluru', icon: '/src/assets/banglore.png' },
    { name: 'Delhi', icon: '/src/assets/delhi.png' },
    { name: 'Chennai', icon: '/src/assets/chennai.png' },
    { name: 'Kolkata', icon: '/src/assets/kolkata.png' },

  ];

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
      navigate(`/hotelDetails?hotelId=${selectedHotel.hotelId}`);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setLatLng(latLng);
    setShowLocationPopup(false); // Close the popup after selecting a city

  };
  useEffect(() => {
    if (latLng) {
      dispatch(selectCity(latLng))
    }
  }, [latLng])
  useEffect(() => {
    if (selectedLocation) {
      setShowLocationPopup(false)
    }
  })

  useEffect(() => {
    if (selectedLocation) {
      console.log("selectedLocation", selectedLocation, typeof selectedLocation)

      let city = selectedLocation.split(',')[0].trim()
      dispatch(setLocation(city))
    }
  }, [selectedLocation])

 
  
  return (
    <>
      <Header />

      {showLocationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-navbar-green text-white p-8 rounded-lg w-2/3 max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Select Your City</h2>
              <button
                className="text-white hover:text-red-500 text-2xl"
                onClick={() => setShowLocationPopup(false)}
              >
                &times;
              </button>
            </div>
            {isLoaded ? (
              <PlacesAutoComplete onSelectLocation={handleLocationSelect} />
            ) : (
              <div>Loading...</div> // Optional loading state
            )}

            <div className="grid grid-cols-4 gap-6 mt-10">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedCity === city.name ? 'text-yellow-500' : ''
                    }`}
                  onClick={() => handleCitySelect(city.name)}
                >
                  <img
                    src={city.icon}
                    alt={`${city.name} icon`}
                    className="h-16 w-16 mb-2"
                  />
                  <span className="text-sm">{city.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <div>
                {/* <input
        type="text"
        placeholder="Search hotels"
        value={searchTerm}
        onChange={handleInputChange}
      /> */}
                {/* Render the suggestions as a dropdown list */}
                {/* {hotelSearchResult.length > 0 && (
        <ul style={{ border: '1px solid #ccc', marginTop: '8px' }}>
          {hotelSearchResult.map((hotel:any) => (
            <li key={hotel.id}>{hotel.hotelName+","+hotel.address}</li>
          ))}
        </ul>
      )}     */}
                <Combobox onSelect={handleSelect}>

                  <ComboboxInput
                    value={searchTerm}
                    onChange={handleInputChange}
                    // disabled={!ready}
                    placeholder="Search for hotels"
                    className="mt-8 px-3 py-1 border border-navbar-green rounded-xl shadow-sm w-96 text-black "
                  />
                 
                  <ComboboxPopover className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
                    {hotelSearchResult.length > 0 ? (
                      <ComboboxList className="max-h-48 overflow-y-auto">

                        {hotelSearchResult.map((hotel: any) => (
                          <ComboboxOption key={hotel.id} value={hotel.hotelName + "," + hotel.address}
                            className="p-2 border-b border-gray-100 last:border-none cursor-pointer hover:bg-gray-100"
                          />
                        ))}
                      </ComboboxList>
                    ) : loading ? <p>Loading...</p> :(<p>
                      No hotels found
                    </p>)}

                  </ComboboxPopover>

                </Combobox>
              </div>

              <div className="text-sm">
                <label htmlFor="sort" className="mr-2">Sort by:</label>
                <select id="sort" className="border rounded-md p-1" onChange={sortByPrice}>
                  <option value="high-to-low" >Price High to Low</option>
                  <option value="low-to-high">Price Low to High</option>
                </select>
              </div>    
            </div>
            <div>
              {message === "No hotels found" ? <h3 className="text-xl font-semibold flex flex-col">Oops hotel not found</h3> :
                <h3 className="text-xl font-semibold flex flex-col">{`Hotels in ${selectedLoc}`}</h3>

              }

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
                        <button className="bg-indigo-500 text-white px-4 py-2 rounded-md">
                          Book Now
                        </button>
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
