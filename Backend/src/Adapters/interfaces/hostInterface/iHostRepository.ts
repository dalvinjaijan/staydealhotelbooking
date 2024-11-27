import { Types } from "mongoose"
import { Document } from 'mongoose';

export interface hostRepositoryInterface{
   
     createHost(hostDetails:any):Promise<Types.ObjectId>
     findHostByEmail(email: string): Promise<any>
     addHotel(data:any,hotelPhotos:string[],roomPhotos: { [key: string]: string[] },hostDetails:HostDocument):Promise<any>
    findHostById(hostid:string):Promise<HostDocument>
    fetchHotels(hostId:any):Promise<any>
    addingEditedhotelData(editedData:any,hostId:string):Promise<any>
}



export interface Address {
    buildingNo: string | null;
    locality: string | null;
    district: string | null;
    state: string | null;
    pincode: string | null;
}

export interface RoomCategory extends Types.Subdocument {
    roomType: string | null;
    roomSize: string | null;
    noOfRooms: number | null;
    roomPrice: number | null;
    roomAmenities: string[];
    roomPhotos: string[];
}

export interface RoomPolicy {
    checkIn: string | null;
    checkOut: string | null;
}

export interface Hotel extends Types.Subdocument {
    hotelName: string | null;
    address: object | null;
    totalNoOfRooms: number | null;
    amenities: string[];
    hotelPhoto: string[];
    roomCategories: Types.DocumentArray<RoomCategory>;
    roomPolicies: RoomPolicy | null;
    hotelRules: string[];
    cancellationPolicy: string | null;
}

export interface HostInterface {
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: number | null;
    profileImage: string | null;
    password: string;
    hotels: Types.DocumentArray<Hotel>;
}

export interface HostDocument extends HostInterface, Document {}