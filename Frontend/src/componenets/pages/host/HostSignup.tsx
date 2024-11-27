import React ,{useEffect, useState}from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HostHeader from './HostHeader'
import { AppDispatch,RootState } from '../../../utils/redux/store'
import { useDispatch ,useSelector} from 'react-redux'
import { sendOtp } from '../../../utils/axios/HostApi/HostApi'
import {toast} from 'react-toastify';
import { resetStates } from '../../../utils/redux/slices/hostSlice'

const HostSignup = () => {
  const {hostInfo}=useSelector((state:RootState)=>state.host)
  const [firstName,setFirstName]=useState("")
  const [lastName,setLastName]=useState("")
  const [phone,setPhone]=useState<number>(0)

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')
  const {error,message}=useSelector((state:RootState)=>state.host)
  useEffect(()=>{
    dispatch(resetStates())
    if(hostInfo?.accessToken){
      navigate('/host/home',{replace:true})
    }
  })
  useEffect(()=>{
    if(error==='failed to sent Otp'){
      toast.error(error)
    }else if(message==='OTP sent successfully'){
      console.log("message",message);
      
      navigate('/host/verifyOtp')
    }
    console.log("message",message)
    return ()=>{
      dispatch(resetStates())
    }
  },[error,message])

    const dispatch:AppDispatch=useDispatch<AppDispatch>()
  const navigate=useNavigate()
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone.length === 10 && /^\d{10}$/.test(phone);
  };

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z][a-zA-Z\s]*$/;
    return nameRegex.test(name);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };

  const validatePasswordMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email.');
      return;
    }

    if (!validatePhone(phone.toString())) {
      toast.error('Phone number must be 10 digits.');
      return;
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      toast.error('Names should not start with special characters or spaces.');
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long and include at least 1 number and 1 special character.");
      return;
    }

    if (!validatePasswordMatch(password, confirmPassword)) {
      toast.error("Passwords do not match.");
      return;
    }


       dispatch(sendOtp({firstName,lastName,email,phone,password}))
      
    }
  return (
    <>
    <HostHeader  />
    <div className='flex justify-around'>
    <div className='ml-22 mt-32 flex flex-col size-96 '>
     <img src='/src/assets/hotelLogin.jpg' /> 
    </div>
    <div className="min-h-screen flex flex-col justify-center ">
  <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-[30rem]">
    <h2 className="text-2xl font-bold mb-6 text-center text-heading-green">Sign up</h2>
    <form className="space-y-4" onSubmit={handleSubmit}>

      {/* First Name and Last Name */}
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder='Enter your first name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-light-green sm:text-sm w-full"
          />
        </div>

        <div className="flex flex-col w-[48%]">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="lastName"
            placeholder='Enter your last name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-light-green sm:text-sm w-full"
          />
        </div>
      </div>

      {/* Email and Phone Number */}
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-light-green sm:text-sm w-full"
          />
        </div>

        <div className="flex flex-col w-[48%]">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phone"
            placeholder='Enter your phone number'
            value={phone}
            onChange={(e:any) => setPhone(e.target.value)}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-light-green sm:text-sm w-full"
          />
        </div>
      </div>

      {/* Create Password and Confirm Password */}
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Create Password</label>
          <input
            type="password"
            id="password"
            placeholder='Create password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-light-green sm:text-sm w-full"
          />
        </div>

        <div className="flex flex-col w-[48%]">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-light-green sm:text-sm w-full"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="w-1/3 flex justify-center py-2 px-4 border border-light-green rounded-md shadow-sm text-sm font-medium text-light-green bg-white-600 hover:bg-light-green hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Sign up
        </button>
      </div>
    </form>
  </div>
</div>
</div>

    </>
  )
}

export default HostSignup
