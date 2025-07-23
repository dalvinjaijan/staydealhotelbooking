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
        role:string
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
        role:string,
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

export interface dataForBookingHotel{
    lngLat:{
        lat:number,
        lng:number
    },
    noOfDays:number
    numberOfRooms:number,
    totalGuests:number,
    checkIn:Date,
    checkOut:Date  ,
    searchTerm:string,
    guestNumber:number,
    hotelName:string,
    hotelAddress:string,
    roomPrice:number,
    totalRoomPrice:number,
    discount:number,
    totalAmount:number,
    roomType:string,
    name:string,
    email:string,
    phone:string,
    country:string,
    hotelId:string,
    roomId:string,
    paymentId:string,
    paymentMethod:string,
    userId:string
}

export interface hotelSearchResult {
    address: string;
    amenities: string[];
    cancellationPolicy: string;
    hotelId: string;
    hotelName: string;
    hotelPhoto: string[];
    hotelRules: string[];
    location: {
      coordinates: [number, number]; // Assuming coordinates are in [longitude, latitude] format
    };
    roomCategories: RoomCategory[];
    roomPolicies: {
      checkIn: string;
      checkOut: string;
      _id: string;
    };
    totalNoOfRooms: number;
    ratings:any[]|null
  }
  
  export interface RoomCategory {
    _id: string;
    roomType: string;
    roomSize: string;
    noOfRooms: number;
    roomPrice: number;
    roomAmenities: string[];
    roomPhotos: string[];
    availableRooms:number,
    isAvailable:boolean
  }

export  interface GuestDetails {
    name: string;
    email: string;
    phone: number;
    country: string;
  }
  
  export interface reservationDetailsType {
    bookingId: string;
    userId: string;
    hotelId: string;
    roomId: string;
    roomNumbers: string[];
    noOfRooms: number;
    noOfGuests: number;
    checkIn: string; // ISO date string
    checkOut: string; // ISO date string
    totalAmount: number;
    paymentMethod: string;
    paymentId: string | null;
    GuestDetails: GuestDetails;
    
  }

  interface IMessage {
    _id: string;
    chatId: string;
    message: string;
    sender: "user" | "host"; 
    hostdelete: boolean;
    userdelete: boolean;
    createdAt: string; // ISO string format for date
    updatedAt: string; // ISO string format for date
    seen:boolean;
    __v: number; // Version key added by MongoDB
  }
  

export interface IChatingUser {
    _id: string;
    host: {
      _id: string; 
      firstName: string; 
      profileImage?:string
    }
    user: {
      _id: string; 
      firstName: string; 
      profileImage: string; 
    };
    newMessage?:{message:string,updatedAt:string}
    messages?:IMessage[]
  }

  export interface NotificationGetter {
    count: number;
    createdAt: string; // ISO date string
    latestMessage: string; // ObjectId represented as a string
    message: {
      _id: string; // ObjectId represented as a string
      sender: string;
      chatId: string; // ObjectId represented as a string
      message: string;
      hostdelete: boolean;
      userdelete: boolean;
      seen: boolean;
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
      __v: number;
    };
    hostId: string; // ObjectId represented as a string
    updatedAt: string; // ISO date string
    host: {
      firstName: string;
      profileImage: string;
    };
    userId: string; // ObjectId represented as a string
    _id: string; // ObjectId represented as a string
  }


  export interface ratings{
    _id: string;
    rating: number;
    review:string;
    bookingId:string;
    user:{
      _id:string,
      email:string;
      firstName:string;
      lastName:string;
      profileImage:string
    }
  }

  export interface topRatedProps{
    hotelName:string;
    address:string
    hotelPhoto:string,
    averageRatings:number|null
  }
  export interface latLng{
    
        lat:number,
        lng:number
    
  }
  export interface Coupon{
    city:string|null,
    code:string,
    description:string,
    validity:string|Date,
    offerPercentage:string|number,
    maxDiscount:string|number,
    minPurchase:string|number
  }
  
  export interface CouponsData{
    city:string|null,
    code:string,
    description:string,
    validity:string|Date,

  }