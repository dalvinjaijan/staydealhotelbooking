import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../utils/redux/store';
import { saveGuestDetails } from '../../../utils/redux/slices/userSlice';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const AddGuestDetails = () => {
    const {bookingDetails,userInfo}=useSelector((state: RootState) => state.user)
    const dispatch =useDispatch<AppDispatch>()
    const navigate=useNavigate()


    const checkInDateString = bookingDetails?.checkIn;
    const checkOutDateString = bookingDetails?.checkOut;
    const [name,setName]=useState<string>("")
    const [email,setEmail]=useState<string>("")
    const [phone,setPhone]=useState<string>("")
    const [country,setCountry]=useState<string|HTMLOptionElement>("India")
    const [bookingForOption,setBookingForOption]=useState("bookForMe")
     const handleBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setBookingForOption(e.target.value);
      };

    const [errors, setErrors] = useState({ name: "", email: "", phone: "" });

    const validateName = (name: string) => {
      const nameRegex = /^[a-zA-Z]+([a-zA-Z ]*[a-zA-Z])?$/; // No special characters or numbers, spaces allowed only between
      if (!name.trim()) return "Name cannot be empty.";
      if (!nameRegex.test(name)) return "Invalid name. Only letters and spaces are allowed.";
      return "";
    };
  
    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format
      if (!email.trim()) return "Email cannot be empty.";
      if (!emailRegex.test(email)) return "Invalid email address.";
      return "";
    };
  
    const validatePhone = (phone: string) => {
      const phoneRegex = /^\d{10}$/; // Exactly 10 digits
      if (!phone.trim()) return "Phone number cannot be empty.";
      if (!phoneRegex.test(phone)) return "Phone number must be exactly 10 digits.";
      return "";
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const nameError = validateName(name);
      const emailError = validateEmail(email);
      const phoneError = validatePhone(phone);
  
      setErrors({ name: nameError, email: emailError, phone: phoneError });
  
      if (!nameError && !emailError && !phoneError) {
       dispatch(saveGuestDetails({name,email,country,phone}))
       navigate('/paymentMethod')
      }
    };


// Convert the string to a Date object
const checkInDateObject = new Date(checkInDateString||"");

// Format the date to "DD MMM YYYY" (e.g., "25 Dec 2024")
const checkInFormattedDate = checkInDateObject.toLocaleDateString("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const checkOutDateObject = new Date(checkOutDateString||"");

// Format the date to "DD MMM YYYY" (e.g., "25 Dec 2024")
const chekOutFormattedDate = checkOutDateObject.toLocaleDateString("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const handleBookForMe=()=>{
  const name=`${userInfo?.firstName} ${userInfo?.lastName}`
  const email=userInfo?.email
  const phone=userInfo?.phone
  const country="India"
  dispatch(saveGuestDetails({name,email,country,phone}))
  navigate('/paymentMethod')
}

    return (

      <>
      <Header />
       <div className="flex flex-col lg:flex-row gap-x-10 justify-center p-6 mt-16">
          {/* Left Section */}

          <div className='flex:row mb-4 lg:mborder rounded-lg p-6 bg-gray-50 shadow-md w-full lg:w-1/2 b-0'>

          <div className="space-y-4">
            {/* Radio button for Book for me */}
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bookingForOption"
                  value="bookForMe"
                  checked={bookingForOption === "bookForMe"}
                  onChange={handleBookChange}
                  className="mr-2"
                />
                Book for me
              </label>
            </div>

            {/* Radio button for Bokk for Another */}
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bookingForOption"
                  value="bookForAnother"
                  checked={bookingForOption === "bookForAnother"}
                  onChange={handleBookChange}
                  className="mr-2"
                />
                Book for another
              </label>
            </div>
          </div>
          {bookingForOption==="bookForAnother" ?
          (<div className=" mb-4 lg:mborder rounded-lg p-6 bg-gray-50 shadow-md w-full lg:w-1/2b-0">
            <h2 className="text-xl font-semibold mb-4">Enter your details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full name</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e)=>{
                      setName(e.target.value)
                  
                    }
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                   {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    className="w-full border rounded px-3 py-2"
                    onChange={(e)=>{
                      setEmail(e.target.value)
                 
                    
                    }}


                  />
                   {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                  <select
                    id="country"
                    className="w-full border rounded px-3 py-2"
                  onChange={(e)=>{
                    setCountry(e.target.options[e.target.selectedIndex])
  

                  }
                  }>
                    <option>India</option>
                    <option>USA</option>
                    <option>UK</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone number</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="Enter your number"
                    value={phone}
                    className="w-full border rounded px-3 py-2"
                    onChange={(e)=>setPhone(e.target.value)}

                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
              >
                Continue
              </button>
            </form>
          </div>): 
           <button
           onClick={handleBookForMe}
           className="mt-4 w-1/3 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
         >
           Continue
         </button>}

          </div>

          
          
    
          {/* Right Section */}
          <div  className="border rounded-lg p-6 bg-gray-50 shadow-md w-full lg:w-1/3">
            {bookingDetails && 
            
             <div>
             <h2 className="text-xl font-semibold mb-4">Booking details</h2>
             <div className="space-y-2">
               <div className="flex justify-between">
                 <span>Check In</span>
                 <span>{checkInFormattedDate}</span>
               </div>
               <div className="flex justify-between">
                 <span>Check Out</span>
                 <span>{chekOutFormattedDate}</span>
               </div>
               <div className="flex justify-between">
                 <span>Guest</span>
                 <span>{bookingDetails.guestNumber||bookingDetails.totalGuests}</span>
               </div>
               <hr className="my-2" />
               <div className="flex justify-between">
                 <span>{bookingDetails.roomType}</span>
                 <span>Rooms: {bookingDetails.numberOfRooms}</span>
               </div>
               <div className="flex justify-between">
                 <span>Price / night</span>
                 <span>{bookingDetails.roomPrice}</span>
               </div>
               <div className="flex justify-between ">
                 <span>No of days</span>
                 <span>{bookingDetails.noOfDays}</span>
               </div>
               <hr className="my-2" />
               <div className="flex justify-between font-semibold">
                 <span>Total Amount</span>
                 <span>{bookingDetails.totalAmount}</span>
               </div>
             </div>
           </div>
            }
          </div>
         
        </div>
      </>
       
      );
}

export default AddGuestDetails
