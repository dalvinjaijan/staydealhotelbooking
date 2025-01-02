import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../utils/redux/store";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { saveSessionId } from "../../../utils/redux/slices/userSlice";
import { bookRoom } from "../../../utils/axios/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentMethod = () => {
  let { bookingDetails } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [paymentOption, setPaymentOption] = useState("payAtHotel");
  const dispatch=useDispatch<AppDispatch>()


  const checkInDateString = bookingDetails?.checkIn;
  const checkOutDateString = bookingDetails?.checkOut;
  const checkInDateObject = new Date(checkInDateString || "");
  const checkInFormattedDate = checkInDateObject.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const checkOutDateObject = new Date(checkOutDateString || "");
  const checkOutFormattedDate = checkOutDateObject.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentOption(e.target.value);
  };

  const handleBookNow = () => {
    // Logic for "Pay at Hotel"
    // alert("Booking confirmed for Pay at Hotel");
    if(bookingDetails){
      bookingDetails={...bookingDetails,paymentMethod:"pay at hotel"}
      dispatch(bookRoom(bookingDetails))
    navigate("/confirmation");


  }
  };

  const handleOnlinePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/create-checkout-session", {
        amount: bookingDetails?.totalAmount,
        currency: "inr",
        description: `Booking for ${bookingDetails?.roomType}`,
      });

      const { id: sessionId } = response.data;
      console.log("sessionId",sessionId)
      if(sessionId){
        dispatch(saveSessionId(sessionId))
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirectToCheckout error:", error.message);
        setError("Failed to redirect to Stripe Checkout.");
      }
    } catch (err: any) {
      console.error("Payment initiation error:", err.message);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row gap-x-10 justify-center p-6 mt-16">
        {/* Left Section */}
        <div className="border rounded-lg p-6 space-y-8 bg-gray-50 shadow-md w-full md:w-1/2 mb-4 lg:mb-0">
          <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
          <div className="flex w-2/3 justify-between">
            <h4 className="font-semibold">Payment Amount</h4>
            <span className="font-semibold">{bookingDetails?.totalAmount}</span>
          </div>

          <div className="space-y-4">
            {/* Radio button for Pay at Hotel */}
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentOption"
                  value="payAtHotel"
                  checked={paymentOption === "payAtHotel"}
                  onChange={handlePaymentChange}
                  className="mr-2"
                />
                Pay at Hotel
              </label>
            </div>

            {/* Radio button for Online Payment */}
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentOption"
                  value="online"
                  checked={paymentOption === "online"}
                  onChange={handlePaymentChange}
                  className="mr-2"
                />
                Pay Online
              </label>
            </div>
          </div>

          {/* Online Payment Button */}
          {paymentOption === "online" && (
            <div className="mt-6">
              <button
                onClick={handleOnlinePayment}
                className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Pay Now"}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          )}

          {/* Book Now Button for Pay at Hotel */}
          {paymentOption === "payAtHotel" && (
            <button
              onClick={handleBookNow}
              className="mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Book Now
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="border rounded-lg p-6 bg-gray-50 shadow-md w-full lg:w-1/3">
          {bookingDetails && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Booking details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Check In</span>
                  <span>{checkInFormattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check Out</span>
                  <span>{checkOutFormattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guest</span>
                  <span>{bookingDetails.guestNumber || bookingDetails.totalGuests}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span>{bookingDetails.roomType}</span>
                  <span>Rooms: {bookingDetails.numberOfRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price</span>
                  <span>{bookingDetails.roomPrice.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>{bookingDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
