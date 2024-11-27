import { editHotelDetails, fetchHotels, login, logout, sendOtp, submitHotelDetails, verifyOtp } from "../../axios/HostApi/HostApi";
import {  HostState } from "../../interfaces"
import {  createSlice } from "@reduxjs/toolkit"; 



const initialState:HostState={
    hostInfo:{
        accessToken: null,
        hostId:null,
        email:null,
        firstName:null,
        lastName:null,
        phone:null,
        profileImage:null
    },
    hotelDetails:null,
    newRoomCategories:null,
    newHotelDetails:null,
    loading:false,
    error:null,
    message:'',
    hotels:null

}
const hostSlice=createSlice({
    name:'hostSlice',
    initialState,
    reducers:{
            resetStates:(state)=>{
                state.message = null
                state.error = null
    
            },
            addHotelDetails:(state,action)=>{
                console.log("payload add hotell",action.payload)
                state.newHotelDetails=action.payload
                // if(state.hotelDetails){
                //     const newHotelDetail = [...state.hotelDetails,action.payload];
                //     state.hotelDetails= newHotelDetail;
                // }else{
                //     state.hotelDetails=[action.payload]
                // }
            },
            addRoomDetails:(state,action)=>{
                console.log("payload add hotell",action.payload)
                if (Array.isArray(state.newRoomCategories)) {
                    state.newRoomCategories.push(action.payload);
                  } else {
                    state.newRoomCategories = [action.payload];
                  }
               

            }
        
        },
    extraReducers:(builder)=>{
        builder
        .addCase(sendOtp.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(sendOtp.fulfilled,(state,action)=>{
            
            state.loading=false,
            console.log("payload",action.payload.message)
            state.message=action?.payload?.message
        })
         .addCase(sendOtp.rejected,(state,action)=>{
            state.loading=false,
            state.error=(action.payload as any)
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.message=action.payload?.message
            console.log("verifyOtp message-->"+state.message)
            const { accessToken,hostDetails } = action.payload;
            console.log(accessToken,"ACCESS of host");
            

            state.hostInfo = {
              accessToken: accessToken || state.hostInfo?.accessToken || null,
              
              hostId:hostDetails._id,
              email:hostDetails.email,
              firstName:hostDetails.firstName,
              lastName:hostDetails.lastName,
              
              phone:hostDetails.phone,
              profileImage:null
            };
           
        })
        .addCase(login.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(verifyOtp.fulfilled,(state,action)=>{
            
            state.loading=false,
            console.log("payload",action.payload.message)
            state.message=action?.payload.message
        })
         .addCase(verifyOtp.rejected,(state,action)=>{
            state.loading=false,
            state.error=(action.payload as any)
        })
        .addCase(logout.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.message=action.payload?.message
            state.hostInfo=null
            
        })
        .addCase(logout.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(submitHotelDetails.pending,(state,action)=>{
            state.loading=true
        })
        .addCase(submitHotelDetails.fulfilled,(state,action)=>{
            console.log("payload",action.payload.newlyAddedHotel)
            console.log("hotelDetails",state?.hotelDetails);
            state.loading=false

            if(state.hotelDetails){
                state.hotelDetails = [...state.hotelDetails,action.payload.newlyAddedHotel];
            }else{
                state.hotelDetails = [action.payload.newlyAddedHotel]
            }

            state.newHotelDetails=null
            state.newRoomCategories=null
            state.message=action.payload.message
            console.log("message payload",action.payload.message)

           
        })
        .addCase(submitHotelDetails.rejected,(state,action)=>{
            state.loading=false

            state.error=(action.payload as string)
        })
        .addCase(fetchHotels.fulfilled,(state,action)=>{
            console.log("payload",action)
            // state.message=action.payload?.message
            state.hotels=action.payload[0]?.hotels
            
        })
        .addCase(fetchHotels.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })

        .addCase(editHotelDetails.fulfilled,(state,action)=>{
            console.log("payload",action)
            state.hotels=action.payload?.response.hotels
            state.message=action.payload?.message
            
        })
    }
})
export const {  resetStates, addHotelDetails,addRoomDetails } = hostSlice.actions;

export default hostSlice.reducer   