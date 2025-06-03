import React, { useState } from "react";

interface ReportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ( complaint: string) => void;
}

const ReportHotel: React.FC<ReportPopupProps> = ({ isOpen, onClose, onSubmit }) => {

  const [complaint, setComplaint] = useState("");
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setSelectedFile(event.target.files[0]);
  //   }
  // };

  const handleSubmit = () => {
    if (complaint.length === 0) {
      alert("Please write complaint!");
      return;
    }
    onSubmit(complaint );
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>✖</button>
      
      <h2 className="text-xl font-semibold text-center mb-4">Report the Hotel</h2>
      
      {/* Complaint Input */}
      <label className="block text-gray-700 text-sm mb-1">Complaint</label>
      <textarea
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder="State your complaint"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      ></textarea>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </div>
  </div>
  );
};

export default ReportHotel;
