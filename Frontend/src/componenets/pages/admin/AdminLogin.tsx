import React ,{useEffect, useState}from 'react'
import AdminHeader from './AdminHeader'
import { login } from '../../../utils/axios/AdminApi/AdminApi'
import { useDispatch,useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import { resetStates } from '../../../utils/redux/slices/adminSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


function AdminLogin() {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const {message,error,adminInfo}=useSelector((state:RootState)=>state.admin)
  const navigate=useNavigate()



  const dispatch:AppDispatch=useDispatch<AppDispatch>()
  useEffect(()=>{
    dispatch(resetStates())
    if(adminInfo?.accessToken){
      navigate('/admin/dashBoard',{replace:true})
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
      
      navigate('/admin/dashBoard')
      
    }

    console.log("message",message)
    // return ()=>{
    //   dispatch(resetStates())
    // }
  },[error,message,dispatch])

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
  return (
    <>
    <div className="min-h-full flex flex-col justify-center items-center ">
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-[30rem] ">
      <h2 className="text-2xl font-bold mb-6 text-center text-heading-green">Admin Login</h2>
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
  
        

      </form>
    </div>
    
  </div>
    </>
    
  )
}

export default AdminLogin
