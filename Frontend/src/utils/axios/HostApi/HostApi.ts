import { createAsyncThunk } from "@reduxjs/toolkit";
import { hostRegister } from "../../interfaces";
import {hostApi} from "../axiosconfig";

const sendOtp=createAsyncThunk(
    'host/sendOtp',
    async(data:hostRegister,{rejectWithValue})=>{
        try {
            console.log(data)
            const response= await hostApi.post('/register',data)
            console.log("rwsponse.data",response.data)
            return response.data
        } catch (err:any) {
            return rejectWithValue(err.response?.data?.error?.message);

        }
    }
)
const verifyOtp=createAsyncThunk(
    'host/verifyOtp',
    async(otp:string,{rejectWithValue})=>{
      try {
        console.log("object",otp)
        const response=await hostApi.post('/verifyOtp',{otp})
        console.log(response.data)
        return response.data
      } catch (err:any) {
        return rejectWithValue(err.response?.data?.error?.message)
      }
    }
  )
  const login=createAsyncThunk(
    'host/login',
    async({email,password}:{email:string,password:string},{rejectWithValue})=>{
      try {
        console.log("email and password",email,password)
        const response=await hostApi.post('/login',{email,password})
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
        
        const response=await hostApi.post('/logout')
        return response.data
      } catch (err:any) {
        return rejectWithValue(err.response?.data?.error?.message)
    }
    }
  )

  const submitHotelDetails=createAsyncThunk(
    'host/submitHotelDetails',
    async(formData:FormData,{rejectWithValue})=>{
      try {
        console.log("formData in thunk",formData)
        const response=await hostApi.post('/addHotel',formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure the correct header
          },
        });
        console.log(response.data)
        return response.data
      } catch (err:any) {
        return rejectWithValue(err.response?.data?.error?.message)
      }
    }
  )
  const fetchHotels = createAsyncThunk('host/fetchHotels', 
    async (hostId: any, { rejectWithValue }) => {
      try {
        console.log("inside thunk");
        const response = await hostApi.get(`/hotels?hostId=${hostId}`);
        console.log(response.data)
        return response.data;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.error?.message);
      }
    }
  );

  const editHotelDetails=createAsyncThunk(
    'host/editHotelDetails',
    async({editedData,hostId}:{editedData:{},hostId:string},{rejectWithValue})=>{
        try {
            console.log("data in thubk",editedData,hostId)
            const response= await hostApi.post('/editHotelDetails',{editedData,hostId})
            console.log("rwsponse.data",response.data.response)
            return response.data
        } catch (err:any) {
            return rejectWithValue(err.response?.data?.error?.message);

        }
    }
)


export{
    sendOtp,
    verifyOtp,
    login,
    logout,
    submitHotelDetails,
    fetchHotels,
    editHotelDetails
}