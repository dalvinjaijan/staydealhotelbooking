import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch,RootState } from '../../../utils/redux/store';
import {toast} from 'react-toastify';
import { verifyOtp } from '../../../utils/axios/api';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { resetStates } from '../../../utils/redux/slices/userSlice';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState('');
  const {error,message,userInfo}=useSelector((state:RootState)=>state.user)
  const dispatch:AppDispatch=useDispatch<AppDispatch>()
  const navigate=useNavigate()

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('OTP:', otp);
    dispatch(verifyOtp({otp}))

  };

  useEffect(()=>{

    if(userInfo?.accessToken){
      navigate('/',{replace:true})
    }

    if(error){
      toast.error(error)
      dispatch(resetStates())
    }
    if(message){
      
      if(message==="OTP sent successfully"){
        toast.success(message)
        dispatch(resetStates())
      }
      if(message==="Login successfully"){

        navigate('/',{replace:true})
      }

    }
  },[error,message])

  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-heading-green">Verify OTP</h2>
        
        
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex justify-center items-center">
            <label htmlFor="otp" className="text-sm font-medium text-gray-700 mr-[10px]">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-light-green sm:text-sm inline-block w-[14rem]"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-1/3 flex justify-center py-2 px-4 border border-light-green rounded-md shadow-sm text-sm font-medium text-light-green bg-white-600 hover:bg-light-green hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
    
  );
};

export default VerifyOtp;
