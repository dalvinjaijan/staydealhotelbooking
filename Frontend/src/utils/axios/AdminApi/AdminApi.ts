import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../axiosconfig";
import { Coupon } from "../../interfaces";

const login=createAsyncThunk(
    'admin/login',
    async ({email,password}:{email:string,password:string},{rejectWithValue})=>{
        try{
        const response=await adminApi.post('/login',{email,password})
       
        return response.data
      } catch (err:any) {
        return rejectWithValue(err.response?.data?.error?.message)
      }
    }
)
const logout=createAsyncThunk(
  'admin/logout',
  async(_,{rejectWithValue})=>{
    try {
      console.log("inside thunk");
      
      const response=await adminApi.post('/logout')
     

      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
  }
  }
)
const getAllHotelRequest=createAsyncThunk(
  'admin/getAllHotelRequest',
  async (_,{rejectWithValue})=>{
      try{
        console.log("inside thunk of getHotel");
        
      const response=await adminApi.get('/getHotelRequest')
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)
const approveHotelRequest=createAsyncThunk(
  'admin/approveHotelRequest',
  async ({hostId,hotelId}:{hostId:string,hotelId:string},{rejectWithValue})=>{
      try{
        console.log("inside thunk of getHotel");
        
      const response=await adminApi.patch('/approveHotelRequest',{hostId,hotelId})
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)
const getApprovedHotels=createAsyncThunk(
  'admin/getApprovedHotels',
  async (_,{rejectWithValue})=>{
      try{
        console.log("inside thunk of getHotel");
        
      const response=await adminApi.get('/getApprovedHotels')
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)
const blockHotelRequest=createAsyncThunk(
  'admin/blockHotelRequest',
  async ({hotelId}:{hotelId:string},{rejectWithValue})=>{
      try{
        console.log("inside thunk of getHotel");
        
      const response=await adminApi.patch('/blockHotel',{hotelId})
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)
const getRejectedHotels=createAsyncThunk(
  'admin/getRejectedHotels',
  async (_,{rejectWithValue})=>{
      try{
        console.log("inside thunk of getHotel");
        
      const response=await adminApi.get('/getRejectedHotels')
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const fetchUsers=createAsyncThunk(
  'admin/fetchUsers',
  async (page:number,{rejectWithValue})=>{
      try{
        console.log("inside thunk of fetchUsers");
        
      const response=await adminApi.get(`/fetchUsers?page=${page}`)
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const blockUser=createAsyncThunk(
  'admin/blockUsers',
  async (userId:{userId:string},{rejectWithValue})=>{
      try{
        console.log("inside thunk of blockuser");
        
      const response=await adminApi.patch('/blockUser',{userId})
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const unBlockUser=createAsyncThunk(
  'admin/unBlockUser',
  async (userId:{userId:string},{rejectWithValue})=>{
      try{
        console.log("inside thunk of unBlockUser");
        
      const response=await adminApi.patch('/unBlockUser',{userId})
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)
const getEditedHotelsRequest=createAsyncThunk(
  'admin/getEditedHotelsRequest',
  async (_,{rejectWithValue})=>{
      try{
        console.log("inside thunk of getHotel");
        
      const response=await adminApi.get('/getEditedHotelsRequest')
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const rejectHotelEditRequest=createAsyncThunk(
  'admin/rejectHotelEditRequest',
  async ({hostId,hotelId}:{hostId:string,hotelId:string},{rejectWithValue})=>{
      try{
        console.log("inside thunk of rejectEditHotel");
        
      const response=await adminApi.patch('/rejectHotelEditRequest',{hostId,hotelId})
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const approveEditHotelRequest=createAsyncThunk(
  'admin/approveEditHotelRequest',
  async ({hostId,hotelId}:{hostId:string,hotelId:string},{rejectWithValue})=>{
      try{
        console.log("inside thunk of approveEditHotel");
        
      const response=await adminApi.patch('/approveEditHotelRequest',{hostId,hotelId})
      console.log(response.data)
      return response.data
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error?.message)
    }
  }
)

const addCoupons=async (data:Coupon)=>{
  try {
    const response=await adminApi.post('/addCoupons',data)
      console.log(response.data)
    return response.data
  } catch (error:any) {
    throw new Error(error)
  }
}

const fetchCoupons=async (page:number=1)=>{
  try {
    const response=await adminApi.get(`/fetchCoupons?page=${page}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    
  }
}





export{
    login,
    logout,
    getAllHotelRequest,
    approveHotelRequest,
    getApprovedHotels,
    blockHotelRequest,
    getRejectedHotels,
    fetchUsers,
    blockUser,
    unBlockUser,
    getEditedHotelsRequest,
    rejectHotelEditRequest,
    approveEditHotelRequest,
    addCoupons,
    fetchCoupons
}