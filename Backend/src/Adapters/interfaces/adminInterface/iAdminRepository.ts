export interface adminRepositoryInterface{
    findByEmail(email:string):Promise<any>
    findHotelRequest():Promise<any>
    approveHotel(hostId:string,hotelId:string):Promise<any>
    findApprovedHotel():Promise<any>
    blockHotel(hotelId:string):Promise<any>
    findRejectedHotel():Promise<any>
    fetchUsers():Promise<any>
    blockUser(userId:string):Promise<any>
    unBlockUser(userId:string):Promise<any>
    findEditedHotelRequest():Promise<any>
    rejectEditHotelRequests(hostId:string,hotelId:string):Promise<string>
    approveEditHotelRequests(hostId:string,hotelId:string):Promise<string>
    fetchWalletDetails():Promise<any>
    fetchYearlyBookings():Promise<any>
    fetchMonthlyBookings():Promise<any>
    fetchDailyBookings():Promise<any>
    fetchComplaints():Promise<any>


}