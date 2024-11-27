import {  createSlice, PayloadAction } from "@reduxjs/toolkit"; 
import { sendOtp,verifyOtp,logout, userProfile,saveUserDetails, selectCity, searchHotel, fetchFilteredHotels } from "../../axios/api";






export interface Authstate{
   
    userInfo: {
        accessToken: string | null;
       
        userId: any|null,
        email:string|null,
        firstName:string|null,
        lastName:string|null,
        dob:string|null,
        phone:number|null
        profileImage:string|null

    } | null;
    loading: boolean;
    error: string | null;
    message:string|null,
    nearByHotels:any[]|null,
    selectedLoc:string |null,
    lngLat:object|null,
    hotelSearchResult:object[]
}

const initialState:Authstate={
    userInfo:{
        accessToken: null,
        userId:null,
        email:null,
        firstName:null,
        lastName:null,
        dob:null,
        phone:null,
        profileImage:null
    },
    loading:false,
    error:null,
    message:'',
    nearByHotels:null,
    selectedLoc:null,
    lngLat:null,
    hotelSearchResult:[]

}
const userSlice=createSlice({
    name:'userSlice',
    initialState,
    reducers:{
            resetStates:(state)=>{
                state.message = null
                state.error = null
    
            },
            resetHotelSearchs : (state)=>{
                state.hotelSearchResult = []
            },
            setLocation:(state,action)=>{
                console.log("payload",action.payload)
                state.selectedLoc=action.payload
            },
            sortHotelsByPrice: (state, action:PayloadAction<{ sortOrder: string }>) => {
                const { sortOrder } = action.payload;
                if (state.nearByHotels && state.nearByHotels.length > 0) { // Ensure it's not empty
                    state.nearByHotels = [...state.nearByHotels].sort((a, b) => {
                      const priceA = a.roomCategories[0]?.roomPrice || 0; // Fallback if no roomCategories
                      const priceB = b.roomCategories[0]?.roomPrice || 0;
                      
                      return sortOrder === "low-to-high" ? priceA - priceB : priceB - priceA;
                    });
                  }
                },
        
        },
    extraReducers:(builder)=>{
        builder
        .addCase(sendOtp.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(sendOtp.fulfilled,(state,action)=>{
            
            state.loading=false,
           
            state.message=action?.payload?.message
        })
         .addCase(sendOtp.rejected,(state,action)=>{
            state.loading=false,
            console.log("error in rejected",action.payload)
            state.error=(action.payload as any)
        })
        .addCase(verifyOtp.fulfilled,(state,action)=>{
            state.message=action.payload?.message
            console.log("verifyOtp message-->"+state.message)
            const { accessToken,userId } = action.payload;
            console.log(accessToken,"ACCESS");
            

            state.userInfo = {
              accessToken: accessToken || state.userInfo?.accessToken || null,
              
              userId:userId,
              email:null,
              firstName:null,
              lastName:null,
              dob:null,
              phone:null,
              profileImage:null
            };
            // localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        })
        .addCase(verifyOtp.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(logout.fulfilled,(state,action)=>{
            state.message=action.payload?.message
            state.userInfo=null
            
        })
        .addCase(logout.rejected,(state,action)=>{
            state.error=(action.payload as string)
        })
        .addCase(userProfile.pending,(state)=>{
            state.loading=true
        })
        .addCase(userProfile.fulfilled,(state,action)=>{
            state.loading=false
            console.log("userProfile.fulfilled")
            // state.message=action.payload?.userDetails.message
            if(state.userInfo){
                // console.log("payload",action.payload?.userDetails)
                state.userInfo.email=action.payload?.userDetails?.email||null
                state.userInfo.firstName=action.payload?.userDetails?.firstName||null
                state.userInfo.lastName=action.payload?.userDetails?.lastName||null
                state.userInfo.dob=action.payload?.userDetails?.dob||null
                state.userInfo.phone=action.payload?.userDetails?.phone||null
                state.userInfo.profileImage=action.payload?.userDetails?.profileImage||null
                

                state.userInfo={
                    ...state.userInfo,
                    email:state.userInfo.email,
                    firstName:state.userInfo.firstName,
                    lastName:state.userInfo.lastName,
                    dob:state.userInfo.dob,
                    phone:state.userInfo.phone,
                    profileImage:state.userInfo.profileImage

                }
                // localStorage.setItem('userInfo',JSON.stringify(state.userInfo))

            }
        }).addCase(userProfile.rejected,(state,action)=>{
            state.error=(action.payload as string)
            console.log("user blocked",action.payload)

            if(action.payload==='User has been blocked'){
                console.log("user blocked")
                state.userInfo=null
            }
        })
        .addCase(saveUserDetails.fulfilled,(state,action)=>{
            state.message=(action.payload?.message)

        })
        .addCase(selectCity.fulfilled,(state,action)=>{
            state.lngLat=(action.payload?.latLng)
            state.nearByHotels=(action.payload.response)


        })
        .addCase(searchHotel.fulfilled,(state,action)=>{
            state.hotelSearchResult=[...(action.payload) as object[]]
            state.loading=false
            console.log("searchResult",action.payload)
        })
        .addCase(searchHotel.pending,(state,action)=>{
            state.loading=true
            console.log("searchResult",action.payload)
        })
         .addCase(searchHotel.rejected,(state,action)=>{
            state.loading=false
            console.log("searchResult",action.payload)
        })
        .addCase(fetchFilteredHotels.fulfilled,(state,action)=>{
            console.log("message",action.payload?.message)
           state.message=(action.payload?.message ? action.payload?.message :null)
            state.nearByHotels=(action.payload?.response)


        })


    }
} 
)

export const {  resetStates,setLocation,sortHotelsByPrice , resetHotelSearchs } = userSlice.actions;
export default userSlice.reducer    