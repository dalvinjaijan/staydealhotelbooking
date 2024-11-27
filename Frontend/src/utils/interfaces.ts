export interface userDetails{
    email:string,
    firstName:string,
    lastName:string,
    dob:Date|null,
    phone:number,
    profileImage:string
}

export interface hostRegister{
    firstName:string,
    lastName:string,
    email:string,
    phone:number,
    password:string
}
// export interface Hoststate{
   
//     hostInfo: {
//         accessToken: string | null;
       
//         hostId: any|null,
//         email:string|null,
//         firstName:string|null,
//         lastName:string|null,
        
//         phone:number|null
//         profileImage:string|null

//     } | null;
//     hotelDetails: Array<WritableDraft<{
//         hotelId: string | null;
//         hotelName: string | null;
//         address: {
//           buildingNo: number | null;
//           locality: string | null;
//           district: string | null;
//           state: string | null;
//           pincode: number | null;
//         } | null;
//         totalNoOfRooms: number | null;
//         amenities: string[];
//         hotelPhoto: string[];
//         roomCategories: Array<{
//           roomType: string | null;
//           roomSize: number | null;
//           noOfRooms: number | null;
//           roomPrice: number | null;
//           roomAmenities: string[];
//           roomPhotos: string[];
//         }>;
//         roomPolicies: {
//           checkIn: string | null;
//           checkOut: string | null;
//         };
//         hotelRules: string[];
//         cancellationPolicy: string | null;
//     }>>
//     loading: boolean;
//     error: string | null;
//     message:string|null
// }
type HotelDetail = {
    hotelId: string | null;
    hotelName: string | null;
    address: object | null;
    latitude:number|null
    longitude:number|null
    totalNoOfRooms: number | null;
    amenities: string[];
    hotelPhoto: string[];
    roomCategories: {
        roomType: string | null;
        roomSize: number | null;
        noOfRooms: number | null;
        roomPrice: number | null;
        roomAmenities: string[];
        roomPhotos: string[];
    }[];
    roomPolicies: {
        checkIn: string | null;
        checkOut: string | null;
    };
    hotelRules: string[];
    cancellationPolicy: string | null;
};



export type HostState = {
    hostInfo: {
        accessToken: string | null;
        hostId: string | null;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        profileImage: string | null;
    }|null;
    hotelDetails: HotelDetail[]|null; // No need for WritableDraft here
    newRoomCategories: {
        roomType: string | null;
        roomSize: number | null;
        noOfRooms: number | null;
        roomPrice: number | null;
        roomAmenities: string[];
        roomPhotos: string[];
    }[]|null;
    newHotelDetails:HotelDetail|null
    loading: boolean;
    error: string | null;
    message: string |null;
    hotels:[]|null
};

export interface AdminAuthstate{
   
    adminInfo: {
        accessToken: string | null;
        adminId: any|null,
        email:string|null,
        name:string|null,
        profileImage:string|null

    } | null;
    hotelDetails:[]|null
    loading: boolean;
    error: string | null;
    message:string|null
    users:any[]|null
}
