import { createAsyncThunk, } from "@reduxjs/toolkit";
import {api} from "./axiosconfig";
import { dataForBookingHotel, latLng, userDetails } from "../interfaces";
import axios from "axios";

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
      console.log("Userprofile",userDetails.data);
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
      console.log("latLng",latLng)
      const response=await api.get(`/fetchHotels?page=1&latLng=${encodeURIComponent(JSON.stringify(latLng))}`)
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
    console.log("searchHotel",lngLat)

      const response=await api.get(`/fetchHotels?lngLat=${encodeURIComponent(JSON.stringify(lngLat))}&&searchInput=${searchInput}`)
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

const searchHotelforBooking=createAsyncThunk(
  'user/searchHotelforBooking',
  async({lngLat,numberOfRooms,totalGuests,checkIn,checkOut,searchTerm,noOfDays}:{lngLat:any,numberOfRooms:number,totalGuests:number,checkIn:Date,checkOut:Date,searchTerm:string,noOfDays:number},{rejectWithValue})=>{
    try {
    console.log("inside searchHotelforBooking",checkIn,searchTerm,checkOut,noOfDays)

      const response=await api.post('/searchHotel',{lngLat,numberOfRooms,totalGuests,checkIn,checkOut,searchTerm,noOfDays})
      console.log("hotelDetails",response.data)
      // console.log("message",response.data.message)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const changeBookingDetail=createAsyncThunk(
  'user/changeBookingDetail',
  async({lngLat,numberOfRooms,guestNumber,checkIn,checkOut,hotelId,roomId,noOfDays}:{lngLat:any,numberOfRooms:number,guestNumber:number,checkIn:Date,checkOut:Date,hotelId:string,roomId:string,noOfDays:number},{rejectWithValue})=>{
    try {
      const data={lngLat,numberOfRooms,guestNumber,checkIn,checkOut,hotelId,roomId,noOfDays}
      console.log("data",data,typeof data.numberOfRooms)
      const response=await api.post('/changeBookingDetails',data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
      
    }
  }
)

const bookRoom=createAsyncThunk(
  'user/bookRoom',
  async(bookingDetails:dataForBookingHotel,{rejectWithValue})=>{
    try {
      const response=await api.post('/bookRoom',bookingDetails)
      console.log("response",response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
      
    }
  }
)

const fetchTopRatedHotels=async (lngLat:latLng)=>{
  try {
    const response=await api.get(`/topRatedProperties?lngLat=${encodeURIComponent(JSON.stringify(lngLat))}`)
    return response.data
  } catch (error:any) {
    throw new Error(error)
  }
}

const fetchCoupons=async (city:string)=>{
  try {
    const response=await api.get(`/coupons?city=${city}`)
    console.log("data",response.data)
    return response.data
  } catch (error:any) {
    throw new Error(error)
  }
}

const applyCouponRequest=async (code:string,purchaseAmount:number)=>{
  try {
    const response=await api.post('/applyCoupon',{code,purchaseAmount})
    console.log("data",response.data)
    return response.data
  } catch (error:any) {
    throw new Error(error)
  }
}

const stripeRequest=async(amount:number,roomType:string)=>{
  try {
    const response=await axios.post("http://localhost:3001/create-checkout-session", {
            amount: amount,
            currency: "inr",
            description: `Booking for ${roomType}`,
          },
        {
          withCredentials:true
        });
        return response
  } catch (error:any) {
    throw new Error(error)
    
  }
}

export{
    sendOtp,
    verifyOtp,
    logout,
    userProfile,
    saveUserDetails,
    selectCity,
    searchHotel,
    fetchFilteredHotels,
    searchHotelforBooking,
    changeBookingDetail,
    bookRoom,
    fetchTopRatedHotels,
    fetchCoupons,
    applyCouponRequest,
    stripeRequest
}