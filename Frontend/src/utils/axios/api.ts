import { createAsyncThunk, } from "@reduxjs/toolkit";
import {api} from "./axiosconfig";
import { userDetails } from "../interfaces";

const sendOtp=createAsyncThunk(
    'login/sendOtp',
    async({ email, type }: { email: string; type: string }, { rejectWithValue })=>{
        try {
         
            const response = await api.post(`/login/${type}`, { email,type });
            return response.data;
          } catch (err :any) {
            console.log("error from sedOTp craete-->"+JSON.stringify(err.response.data.error.message))
            return rejectWithValue(err.response?.data?.error?.message);
          }
    }
)

const verifyOtp=createAsyncThunk(
  'login/verifyOtp',
  async({otp}:{otp:string},{rejectWithValue})=>{
    try {
      const response=await api.post('/verifyOtp',{otp})
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const logout=createAsyncThunk(
  'logout',
  async(_,{rejectWithValue})=>{
    try {
      console.log("inside thunk");
      
      const response=await api.post('/logout')
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
  }
  }
)

const userProfile=createAsyncThunk(
  'user/userProfile',
  async(userId:{userId:string},{rejectWithValue})=>{
    try {
      // console.log("inside thunk");
      // console.log("userId inside thunk-->"+userId)
      const userDetails=await api.post('/profile',{userId})
      // console.log("Userprofile",userDetails.data);
      return userDetails.data
      
    } catch (err:any) {
      console.log("err",err.response?.data);
      
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)
const saveUserDetails=createAsyncThunk(
  'user/saveUserProfile',
  async({formData,userInfo}:{formData:FormData,userInfo:any},{rejectWithValue})=>{
    // console.log("userDetails---->",formData)
    try {
      const response=await api.put('/editProfile',formData,
        {
          headers:{
            Autherization:`Bearer ${userInfo?.accessToken}`,
            'Content-Type': 'multipart/form-data'
          },
          
        }
      )
      console.log(response)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.message)
    }
   
    

  }
) 

const selectCity=createAsyncThunk(
  'user/selectCity',
  async(latLng:any,{rejectWithValue})=>{
    try {
      const response=await api.post('/fetchHotels',latLng)
      console.log("hotelDetails",response.data?.response)
      console.log("latLng",response.data?.latLng)
      

      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const searchHotel=createAsyncThunk(
  'user/searchHotel',
  async({lngLat,searchInput}:{lngLat:any,searchInput:any},{rejectWithValue})=>{
    try {
    console.log("lngLat",lngLat)

      const response=await api.post('/fetchHotels',{lngLat,searchInput})
      console.log("hotelDetails",response.data)
      // console.log("message",response.data.message)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const fetchFilteredHotels=createAsyncThunk(
  'user/fetchFilteredHotels',
  async(payload:any,{rejectWithValue})=>{
    try {
    console.log("payload",payload)
      const response=await api.post('/filterHotels',payload)
      console.log("filtered data",response.data?.response)
      // console.log("message",response.data.message)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)



export{
    sendOtp,
    verifyOtp,
    logout,
    userProfile,
    saveUserDetails,
    selectCity,
    searchHotel,
    fetchFilteredHotels
}