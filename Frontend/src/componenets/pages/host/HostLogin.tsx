import React ,{useEffect, useState}from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HostHeader from './HostHeader'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import {toast} from 'react-toastify';
import { resetStates } from '../../../utils/redux/slices/hostSlice'
import { login } from '../../../utils/axios/HostApi/HostApi'


const HostLogin:React.FC = () => {
 
  const {message,error,hostInfo}=useSelector((state:RootState)=>state.host)
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const dispatch:AppDispatch=useDispatch<AppDispatch>()
  const navigate=useNavigate()
  useEffect(()=>{
    dispatch(resetStates())
    if(hostInfo?.accessToken){
      navigate('/host/home',{replace:true})
    }
  })
  useEffect(()=>{
    console.log("hai")
    if(error){
      toast.error(error)
      dispatch(resetStates())
    }else if(message==='Login successfully'){
      console.log("loging successfully")
      console.log("message",message);
      
      navigate('/host/home')
      
    }

    console.log("message",message)
    // return ()=>{
    //   dispatch(resetStates())
    // }
  },[error,message,dispatch])

  useEffect(()=>{
    if(message==='Signup successfully'){
    toast.success(message)
    dispatch(resetStates())

     }
     //else{
    //   toast.error(error)
    // dispatch(resetStates())


    // }
  },[message])

  useEffect(()=>{
    if(message==='Logout successfully'){
      toast.success(message)
    dispatch(resetStates())

    }
    // else{
    //   toast.error(error)
    // dispatch(resetStates())

    // }
  })

 
  const handleSubmit=(e:React.FormEvent)=>{

    console.log("login clicked")
    e.preventDefault()
    dispatch(login({email,password}))

  }
  const handleGoogleAuth=()=>{

  }
  return (
    <>
    <HostHeader />
    <div className='flex justify-around'>
    <div className='ml-22 mt-32 flex flex-col size-96 '>
     <img src='/src/assets/hotelLogin.jpg' /> 
    </div>
    <div className="min-h-screen flex flex-col justify-center ">
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-[30rem] ">
      <h2 className="text-2xl font-bold mb-6 text-center text-heading-green">Login as a host</h2>
      <form  className="space-y-4" onSubmit={handleSubmit} >
        <div className='flex justify-around items-center'>
         
          <label htmlFor="email" className="text-sm font-medium text-gray-700 mr-[10px]">
            Email
          </label>
          
         
          <input
            type="email"
            id="email"
            placeholder='Enter your email'
             value={email}
            onChange={(e) => setEmail(e.target.value)}                                                               
            required
            className="mt-1 ml-6 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:border-light-green sm:text-sm inline-block w-[14rem]"
          />
         
       
        </div>
        <div className='flex justify-around items-center'>
         
          <label htmlFor="password" className="text-sm font-medium text-gray-700 mr-[10px]">
            Password
          </label>
          
         
          <input
            type="password"
            id="password"
            placeholder='Enter your password'
             value={password}
            onChange={(e) => setPassword(e.target.value)}                                                               
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
            Login
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
        <div className="text-center mt-4">
        <p className='font-medium text-gray-700'>New User?</p><Link to={'/host/signup'} className="text-blue-500 hover:text-blue-700 font-semibold">Signup</Link>

        </div>

      </form>
    </div>
    
  </div>
    </div>
    
    </>
    
  )
}

export default HostLogin
