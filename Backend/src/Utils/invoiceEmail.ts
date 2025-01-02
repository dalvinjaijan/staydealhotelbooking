import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

interface BookingDetails {
  bookingId: string;
  hotelName: string;
  address: string;
  roomNumbers: string[];
  checkIn: Date; // ISO date Date
  checkOut: Date; // ISO date string
  hotelRules: string[];
}

export async function sendInvoice(email: string, bookingDetails: BookingDetails) {
  const { bookingId, hotelName, address, roomNumbers, checkIn, checkOut, hotelRules } = bookingDetails;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const formattedCheckIn = new Date(checkIn).toLocaleDateString();
  const formattedCheckOut = new Date(checkOut).toLocaleDateString();
  const formattedRules = hotelRules.map((rule, index) => `<li>${rule}</li>`).join('');

  const emailContent = `
    <h3>Booking Invoice</h3>
    <p>Thank you for booking with us! Here are your booking details:</p>
    <ul>
      <li><b>Booking ID:</b> ${bookingId}</li>
      <li><b>Hotel Name:</b> ${hotelName}</li>
      <li><b>Address:</b> ${address}</li>
      <li><b>Room Numbers:</b> ${roomNumbers.join(', ')}</li>
      <li><b>Check-In Date:</b> ${formattedCheckIn}</li>
      <li><b>Check-Out Date:</b> ${formattedCheckOut}</li>
    </ul>
    <h4>Hotel Rules</h4>
    <ul>
      ${formattedRules}
    </ul>
    <p>We look forward to hosting you!</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Booking Confirmation & Invoice",
      html: emailContent,
    });
    console.log(`Invoice sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
