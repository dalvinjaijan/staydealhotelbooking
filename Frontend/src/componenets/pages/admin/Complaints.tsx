import React, { useEffect, useState } from 'react'
import { adminApi } from '../../../utils/axios/axiosconfig'
import Swal from 'sweetalert2';
import { blockHotelRequest } from '../../../utils/axios/AdminApi/AdminApi';
import { AppDispatch, RootState } from '../../../utils/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Complaints = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const {message}=useSelector((state:RootState)=>state.admin)


  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const fetchComplaints = async () => {
        const response = await adminApi.get('/fetchComplaints');

        if (response.data) {
            console.log(response.data)
            setComplaints(response.data);
        }
    };
    useEffect(() => {
        
        fetchComplaints();
    }, []);

    const handleViewComplaint = (complaint: string) => {
      setSelectedComplaint(complaint);
      setShowModal(true);
  };

  const handleBlockHotel = async (hotelName:string,hotelId: string) => {
      try {
        Swal.fire({
          title: `Block ${hotelName}?`,
          text: `Are you sure you want to block this hotel?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33", // Unblock: Blue, Block: Red
          cancelButtonColor: "#aaa",
          confirmButtonText:  "Yes, Block",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(blockHotelRequest({hotelId}))
              
              if (message === "hotel blocked") {
                toast.error(message);
              }
            
          }
        });
      } catch (error) {
          console.error("Error blocking hotel:", error);
          alert("Failed to block hotel.");
      }
  };
  return (
    <div className="p-6">
    <h2 className="text-xl font-bold mb-4">Complaints</h2>
    <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
                <tr className="text-left">
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">User Name</th>
                    <th className="border border-gray-300 p-2">Hotel Name</th>
                    <th className="border border-gray-300 p-2">Booking ID</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {complaints.map((complaint) => (
                    <tr key={complaint._id} className="border border-gray-300">
                        <td className="border border-gray-300 p-2">
                            {new Date(complaint.date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 p-2">
                            {complaint.userId.firstName} {complaint.userId.lastName}
                        </td>
                        <td className="border border-gray-300 p-2">
                            {complaint.hotelId.hotelName}
                        </td>
                        <td className="border border-gray-300 p-2">{complaint.bookingId}</td>
                        <td className="border border-gray-300 p-2 flex gap-2">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                onClick={() => handleViewComplaint(complaint.complaint)}
                            >
                                View Complaint
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() => handleBlockHotel(complaint.hotelId.hotelName,complaint.hotelId._id)}
                            >
                                Block Hotel
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    {/* Complaint Modal */}
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-2">Complaint Details</h2>
                <p>{selectedComplaint}</p>
                <button
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowModal(false)}
                >
                    Close
                </button>
            </div>
        </div>
    )}
</div>
);
}

export default Complaints
