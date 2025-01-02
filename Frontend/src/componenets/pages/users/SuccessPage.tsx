import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../utils/redux/store";
import { bookRoom } from "../../../utils/axios/api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  let {bookingDetails,userInfo}=useSelector((state:RootState)=>state.user)
  const navigate = useNavigate();
  const dispatch=useDispatch<AppDispatch>()
  const userId=userInfo?.userId

  useEffect(() => {
    const createBooking = async () => {
      const amount = searchParams.get("amount");
      const description = searchParams.get("description");

      try {
      
        if(bookingDetails){
            bookingDetails={...bookingDetails,paymentMethod:"online",userId}
            dispatch(bookRoom(bookingDetails))
    navigate("/confirmation");


        }

        // Redirect to confirmation page or show success message
        // navigate("/confirmation");
      } catch (error:any) {
        console.error("Error creating booking:", error.message);
        // Handle error (e.g., show an error message)
      }
    };

    createBooking();
  }, [searchParams, navigate]);

  return <div>Processing ...</div>;
};

export default PaymentSuccess;
