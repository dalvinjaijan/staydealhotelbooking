import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface RatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string, photo?: File) => void;
}

const RatingAndReview: React.FC<RatingPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setSelectedFile(event.target.files[0]);
  //   }
  // };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }
    onSubmit(rating, review );
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white rounded-lg shadow-lg p-6 w-96 relative"
      >
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✖</button>
        
        <h2 className="text-xl font-semibold text-center mb-4">Rate the Stay</h2>
        
        {/* Star Rating */}
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="text-2xl cursor-pointer">
              {star <= (hover || rating) ? <AiFillStar className="text-yellow-500" /> : <AiOutlineStar className="text-gray-400" />}
            </span>
          ))}
        </div>

        {/* Review Input */}
        <label className="block text-gray-700 text-sm mb-1">Review</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="How was your stay?"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        ></textarea>

        {/* Upload Photo */}
        {/* <label className="block text-gray-700 text-sm mb-1">Upload Photos</label>
        <input type="file" onChange={handleFileChange} className="mb-4" /> */}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </motion.div>
    </div>
  );
};

export default RatingAndReview;
