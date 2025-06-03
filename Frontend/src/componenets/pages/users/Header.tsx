import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { AppDispatch, RootState } from '../../../utils/redux/store';
import { logout,selectCity,userProfile } from '../../../utils/axios/api';
import { toast } from 'react-toastify';
import PlacesAutoComplete from '../host/PlacesAutoComplete';
import { PlacesContext } from '../../../context/placesContext';
import { setLocation } from '../../../utils/redux/slices/userSlice';
import { IoIosNotifications } from "react-icons/io";
import { useSocket } from '../../../context/socketio';
import { api } from '../../../utils/axios/axiosconfig';


const Header = () => {
  const navigate = useNavigate();
  
  // useSelector must be inside the component
  const dispatch:AppDispatch = useDispatch<AppDispatch>();
    const [notificationCount, setNotificationCount] = useState<number>(0);

  const {message,error,userInfo,selectedLoc}=useSelector((state:RootState)=>state.user)
  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const isLoaded = useContext(PlacesContext)
  const { socket } = useSocket();

  console.log("error",error);
  
  // const userInfoString=localStorage.getItem('userInfo')
  // let userInfo: { userId: string } | null = null;

  // if(userInfoString){
  //   userInfo=JSON.parse(userInfoString)
  // }
  

  // useEffect(() => {
  //   dispatch(loadTokensFromCookies());
  // }, [dispatch])
  // useEffect(() => {
  //   if (userInfo?.userId) {

  //     const fetchNotification = async () => {
  //       try {
  //           const id=userInfo?.userId
  //         const response = await api.get(`/notificationUpdater/${id}`);
  //         console.log("response",response.data)
  //         if (response) {
  //           setNotificationCount(response.data.count)
  //         }
  //       } catch (error) {
  //         console.error("Error fetching chat:", error);
  //       } 
  //     };
    
  //     fetchNotification();
  
       
  //   }

//     socket?.on("notifictaionUpdated", (response: { count: number }) => {
//         setNotificationCount(response.count);
//     });

//     return () => {
//         socket?.off("notifictaionUpdated");
//     };
// }, [socket]);


  useEffect(()=>{
   if(!selectedLoc){
    setShowLocationPopup(true)
   }

  },[selectedLoc])
  const [isDropdownOpen,setDropdown]=useState(false)
  const toggleDropdown=()=>{
    setDropdown(!isDropdownOpen)
  }

  const handleLogout=()=>{
    console.log("logout clicked");
    
    dispatch(logout())
    navigate('/login')
  }
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  console.log("latitude",latLng)

  const handleLocationSelect = (address: string, latLng: { lat: number, lng: number }) => {
    console.log("handleCitySelect clicked",selectedCity)
    setSelectedLocation(address);
    if(address){
      let city=address.split(',')[0].trim()
      dispatch(setLocation(city))
    }
 console.log("selectedLocation",address)   

    
    setLatLng(latLng);
    console.log("objectt",latLng)
    setShowLocationPopup(false)
    dispatch(selectCity(latLng))

    
    navigate('/')




  };
  const cities = [
    { name: 'Kochi', icon: '/src/assets/kochi.png' ,coordinates:{lat:9.9312328,lng:76.26730409999999}},
    { name: 'Mumbai', icon: '/src/assets/mumbai.png',coordinates: {lat: 19.0759837, lng: 72.8776559}},
    { name: 'Bengaluru', icon: '/src/assets/banglore.png',coordinates:{lat:12.9715987,lng:77.5945627}},
    { name: 'Delhi', icon: '/src/assets/delhi.png',coordinates:{lat:28.7040592,lng:77.10249019999999} },
    { name: 'Chennai', icon: '/src/assets/chennai.png',coordinates:{lat:13.0843007, lng: 80.2704622} },
    { name: 'Kolkata', icon: '/src/assets/kolkata.png',coordinates:{lat: 22.5743545, lng: 88.3628734}},
    
  ];

  const handleCitySelect = (city: string,coordinates:{lat:number,lng:number}) => {
    setSelectedCity(city);
    setLatLng(latLng);
    setShowLocationPopup(false); // Close the popup after selecting a city
    if(coordinates){
      dispatch(selectCity(coordinates))
      dispatch(setLocation(city))
      navigate('/hotelsIn')
      
    }
  
  };
  useEffect(()=>{
    if(latLng){
      dispatch(selectCity(latLng))
    }
  },[latLng])

  useEffect(()=>{
    if(selectedLocation){
      console.log("selectedLocation",selectedLocation,typeof selectedLocation)
      
      let city=selectedLocation.split(',')[0].trim()
      dispatch(setLocation(city))
    }
  },[selectedLocation])

  



  return (
    <>
      <div className='h-14 bg-navbar-green flex items-center justify-center font-brawler fixed z-50 top-0 left-0 right-0 w-full'>
        <div className="flex justify-between items-center text-white w-full">
          <div className='size-20 flex items-center ml-6 h-full'>
            <img src="/src/assets/Frame.svg" alt="Logo" />
          </div>
          <div className='hidden sm:flex justify-between w-full px-56 '>
            <ul className='cursor-pointer'
            onClick={()=>navigate('/')}>Home</ul>
            <ul className='cursor-pointer'
            onClick={()=>navigate('/host/home')}
            >List your properties</ul>
            {/* <ul>Contact us</ul> */}
            <ul className='cursor-pointer' 
            onClick={()=>navigate('/myBooking')}
            >
              My booking</ul>
              {/* <div>
              <div className="relative">
                                    <IoIosNotifications className="text-orange text-2xl" />

                                    <div className="absolute -top-3 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center bg-green-500">
                                        {notificationCount}
                                    </div>
                                </div>

              <ul className='cursor-pointer' 
            onClick={()=>navigate('/notification')}
            >
              Notification</ul>
              </div> */}
              
           
          </div>
          <button className='border rounded-2xl w-40'
          onClick={()=>setShowLocationPopup(true)}
          > {selectedLoc ? selectedLoc: "choose city"}</button>
          {userInfo?.accessToken?(
            <div className='relative'>
            <CgProfile className='flex justify-center w-40 size-6 text-black cursor-pointer'
            onClick={toggleDropdown} />
            {isDropdownOpen && (
              <div className="absolute right-4 mt-4 w-28 bg-white rounded-lg shadow-lg">
              <ul className="py-1">
              <li className="px-6 py-1 hover:bg-light-green cursor-pointer text-black hover:text-white"
                                onClick={()=>navigate('/userProfile')}>Profile</li>
                 
                <li className="px-6 py-1 hover:bg-light-green cursor-pointer text-black hover:text-white"
                onClick={handleLogout}
                
                >Logout</li>
              </ul>
            </div>
            )}
            </div>
          ):
            <div onClick={() => navigate('/login')} className='flex justify-center w-40 pr-12 cursor-pointer'>Login</div>}
         
            
         
        </div>
      </div>
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
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    selectedLoc === city.name ? 'text-yellow-500' : ''
                  }`}
                  onClick={() => handleCitySelect(city.name,city.coordinates)}
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
      {/* <Outlet /> */}
    </>
  );
};

export default Header;
