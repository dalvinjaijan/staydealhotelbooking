import { createSlice } from "@reduxjs/toolkit"
import { approveEditHotelRequest, approveHotelRequest, blockHotelRequest, blockUser, fetchUsers, getAllHotelRequest, getApprovedHotels, getEditedHotelsRequest, getRejectedHotels, login, logout, rejectHotelEditRequest, unBlockUser } from "../../axios/AdminApi/AdminApi"
import { AdminAuthstate } from "../../interfaces"

const initialState:AdminAuthstate={
    adminInfo:{
        accessToken: null,
        adminId:null,
        email:null,
        name:null,
        profileImage:null
    },
    hotelDetails:null, 
    loading:false,
    error:null,
    message:'',
    users:null

}
const adminSlice=createSlice({
    name:'adminSlice',
    initialState,
    reducers:{
            resetStates:(state)=>{
                state.message = null
                state.error = null
    
            },
           
        
        },
    extraReducers:(builder)=>{
        builder
        .addCase(login.fulfilled,(state,action)=>{
            state.message=action.payload?.message
            console.log("verifyOtp message-->"+state.message)
            const { accessToken,adminDetails } = action.payload;
            console.log(accessToken,"ACCESS of host");
            

            state.adminInfo = {
              accessToken: accessToken || state.adminInfo?.accessToken || null,
              
              adminId:adminDetails._id,
              email:adminDetails.email,
              name:adminDetails.lastName,
              profileImage:null
            };
           
        })
        .addCase(login.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(logout.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            state.adminInfo=null
            
        })
        .addCase(logout.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(getAllHotelRequest.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            state.hotelDetails=action.payload.response
            
        })
        .addCase(getAllHotelRequest.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(approveHotelRequest.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            
            
        })
        .addCase(approveHotelRequest.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(getApprovedHotels.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            state.hotelDetails=action.payload.response
            
        })
        .addCase(getApprovedHotels.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(blockHotelRequest.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            
            
        })
        .addCase(blockHotelRequest.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(getRejectedHotels.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            state.hotelDetails=action.payload.response
            
        })
        .addCase(getRejectedHotels.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(fetchUsers.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            state.users=[...action.payload.response]
            
        })
        .addCase(fetchUsers.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(blockUser.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            
        })
        .addCase(blockUser.rejected,(state,action)=>{
            state.error=(action.payload as string)
            
        })
        .addCase(unBlockUser.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            
        })
        .addCase(unBlockUser.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(getEditedHotelsRequest.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            state.hotelDetails=action.payload?.response
            
        })
        .addCase(rejectHotelEditRequest.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload    
        })
        .addCase(approveEditHotelRequest.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload    
        })
    }
})
export const {  resetStates } = adminSlice.actions;

export default adminSlice.reducer   
