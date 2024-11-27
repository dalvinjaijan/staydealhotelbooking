import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import {}
import { AppDispatch, RootState } from '../../../utils/redux/store'
import { sendOtp } from '../../../utils/axios/api'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify';
import Header from './Header'
import { resetStates } from '../../../utils/redux/slices/userSlice'


const UserLogin:React.FC = () => {

  const [email,setEmail]=useState("")
  const navigate=useNavigate()

  const dispatch:AppDispatch=useDispatch<AppDispatch>()
  const {loading,message,error,userInfo}=useSelector((state:RootState)=>state.user)
  
  useEffect(()=>{
    // dispatch(resetStates())
    if(userInfo?.accessToken){
      navigate('/',{replace:true})
    }
  })

  useEffect(()=>{
    if(error==='failed to sent Otp' ||  error==='user is blocked'){
      
      toast.error(error)
     
    }else if(message==="OTP sent successfully"){
      console.log("else is working")
      navigate('/verifyOtp')

    }
  },[error,message])
  const handleSubmit=async(e:React.FormEvent)=>{
    console.log("button clicked ");
    
    e.preventDefault()
    console.log(email); 
    const type='email'
    dispatch(sendOtp({email,type}))
   
  }

  const handleGoogleAuth=async(e:React.FormEvent)=>{
    e.preventDefault()
    const type = 'google'
    dispatch(sendOtp({ email, type }))
  }
  return (
    <>
     <Header />
    <div className="min-h-screen flex items-center justify-center">
      
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full ">
        <h2 className="text-2xl font-bold mb-6 text-center text-heading-green">Login</h2>
        <form  className="space-y-4" onSubmit={handleSubmit} >
          <div className='flex justify-center items-center'>
           
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mr-[10px]">
              Email
            </label>
            
           
            <input
              type="email"
              id="email"
              placeholder='Enter your email'
            //   value={email}
              onChange={(e) => setEmail(e.target.value)}                                                               
              required
              className="mt-1 w- px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:border-light-green sm:text-sm inline-block w-[14rem]"
            />
           
         
          </div>
          {/* {loading && <p>Sending OTP...</p>} */}
          {/* {error && <p className="text-red-500">{error}</p>} */}

        
          <div className="flex items-center justify-center">
            <button
              type="submit" 
              className="w-1/3  flex justify-center py-2 px-4 border border-light-green rounded-md shadow-sm text-sm font-medium text-light-green bg-white-600 hover:bg-light-green hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        {/* <h2 className="text-md font-bold mb-6 text-center text-heading-green">OR</h2>
        <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-3rem  flex justify-center py-2 px-4 border border-light-green rounded-md shadow-sm text-sm font-medium text-light-green bg-white-600 hover:bg-light-green hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={handleGoogleAuth}
            >
            <img className="size-4 mr-6" src="/src/assets/google_logo.png" alt=""  /> Continue with google
            </button>
          </div> */}

        </form>
      </div>
      
    </div>
    </>
   
     
  )
}

export default UserLogin
