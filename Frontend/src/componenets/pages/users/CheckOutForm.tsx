import React from "react";
import { CardElement, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert("Stripe is not loaded");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
    });

    if (error) {
      console.error(error);
      alert("Payment failed");
    } else {
      console.log("Payment successful:", paymentMethod);
      alert("Payment successful!");
      // Proceed with further payment processing (e.g., server-side confirmation)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <div className="border rounded-lg p-2">
          <PaymentElement />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Pay Now
      </button>
    </form>
  );
};

export default CheckOutForm;
