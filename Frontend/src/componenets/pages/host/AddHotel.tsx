import React, { ReactEventHandler, useContext, useState } from 'react'
import HostHeader from './HostHeader'
import InputBox from '../InputBox';
import { AiOutlineClose } from 'react-icons/ai'; 
import { AppDispatch } from '../../../utils/redux/store';
import { useDispatch } from 'react-redux';
import { addHotelDetails } from '../../../utils/redux/slices/hostSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import usePlacesAutocomplete from 'use-places-autocomplete';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import PlacesAutoComplete from './PlacesAutoComplete';
import { PlacesContext } from '../../../context/placesContext';



const AddHotel = () => {
  
  const dispatch:AppDispatch=useDispatch<AppDispatch>()
  const [hotelName, setHotelName] = useState<string | null>(null);
  // const [buildingNo, setBuildingNo] = useState<string | null>(null);
  // const [locality, setLocality] = useState<string | null>(null);
  // const [district, setDistrict] = useState<string | null>(null);

  // const [state, setState] = useState<string | null>(null);
  // const [pincode, setPincode] = useState<number | null>(null);
  const [totalNoOfRooms, setTotalNoOfRooms] = useState<number | null>(null);
  const [amenities, setAmenities] = useState<string[]>([
    'AC',
    'Parking',
    'WIFI',
    'Telephone',
    'Towels'
  ]);
  const [selectedAmenities,setSelectedAmenities]=useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  // State to handle input visibility and new amenity
  const [isAdding, setIsAdding] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const navigate=useNavigate()
  const isLoaded = useContext(PlacesContext)




  // Handle adding the new amenity
  const handleLocationSelect = (address: string, latLng: { lat: number, lng: number }) => {
    setSelectedLocation(address);
    setLatLng(latLng);
  };
 // Set the selected location

  const handleAddAmenity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newAmenity.trim() !== '') {
      setAmenities([...amenities, newAmenity]);
      setNewAmenity('');
      setIsAdding(false);
    }
  };

      const [selectedImages,setSelectedImages]=useState<string[]>([])
      const handleImageChange=(e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const filesArray = Array.from(e.target.files);
          // Limit to 4 images
          if (filesArray.length > 4) {
            alert('You can only upload up to 4 images');
            return;
          }
          const fileReaders = filesArray.map((file) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file); // Convert the image to Base64 string
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (error) => reject(error);
            });
          });
    
          // Convert all images to Base64 and store them
          Promise.all(fileReaders)
            .then((base64Images) => {
              setSelectedImages(base64Images);
            })
            .catch((error) => console.error('Error converting images: ', error));
        }
      };
      const handleRemoveImage = (index: number) => {
        const updatedImages = [...selectedImages];
        updatedImages.splice(index, 1); // Remove the image at the specified index
        setSelectedImages(updatedImages);
      };
      
  const inputStyle ='px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-light-green sm:text-sm inline-block w-[14rem]';
      const handleNext=(e:any)=>{
        console.log("selected images  ",selectedImages)
        e.preventDefault()
        const nameRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces
        if (!nameRegex.test(hotelName) || hotelName?.trim() === '') {
          toast.error('Hotel Name should consist only of letters and not be empty');
          return; // Prevent navigation if validation fails
        }
        
        // Validate Pincode (should be exactly 6 digits)
        // if (!pincode || pincode.toString().length !== 6) {
        //   toast.error('Pincode must be a 6-digit number');
        //   return; // Prevent navigation if validation fails
        // }
        
        // Validate Total Number of Rooms (should not be negative or 0)
        if (totalNoOfRooms === null || totalNoOfRooms <= 0) {
          toast.error('Total number of rooms must be a positive number');
          return; // Prevent navigation if validation fails
        }
        
        // Validate if at least one image is uploaded
        if (selectedImages.length === 0) {
          toast.error('Please upload at least one hotel image');
          return; // Prevent navigation if validation fails
        }
        
        // Validate that uploaded files are images
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp','image/jpg']; // Add other image types if needed
        const invalidImages = selectedImages.some((file) => !validImageTypes.includes(file.type));
        
        
        // If all validations pass, proceed to submit and navigate\
        console.log("address-->",selectedLocation,latLng)
        const formData = {
          hotelName,
          address: selectedLocation,
          latitude: latLng?.lat,
          longitude: latLng?.lng,
          totalNoOfRooms,
          amenities:selectedAmenities,
          hotelPhoto: selectedImages,
        };
        console.log("formData",selectedAmenities)
      
        dispatch(addHotelDetails(formData)); // Dispatch the action with hotel details
      
        navigate('/host/addRoom'); // Navigate to the next page only if all validations pass
      }
      const handleAmenityChange=(amenity:string)=>{
        setSelectedAmenities((prevSelected) =>
          prevSelected.includes(amenity)
            ? prevSelected.filter((item) => item !== amenity) // Remove if already selected
            : [...prevSelected, amenity] // Add if not selected
        );
      }
  return (
    <>
      <HostHeader />
      <main className="h-auto w-[70%] mx-auto mt-[4rem] border border-light-green p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Enter hotel details</h3>

          {/* Hotel Name */}
          <div className="mb-6">
            <InputBox label="Hotel name:" type="text" placeholder="Enter hotel name" inputClassName={inputStyle} 
            value={hotelName ||''}
            onChange={(e:any) => setHotelName(e.target.value)}/>
          </div>

          {/* Location */}

          
          <h3 className="text-lg font-medium mb-2">Location</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            {/* Building No (with autocomplete) */}

                     {isLoaded ? (
  <PlacesAutoComplete onSelectLocation={handleLocationSelect} />
) : (
  <div>Loading...</div> // Optional loading state
)}

       
          </div>

          {/* Total number of rooms */}
          <div className="mb-6">
            <InputBox label="Total no. of rooms:" type="number" placeholder="Enter total number" inputClassName={inputStyle}
             value={totalNoOfRooms !== null ? totalNoOfRooms : ''} // Convert number to string if null
             onChange={(e) => setTotalNoOfRooms(Number(e.target.value))} />
          </div>

          {/* General Amenities */}
          <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">General Amenities</h3>
      <div className="flex flex-wrap gap-4">
        {/* Display the amenities as checkboxes */}
        {amenities.map((amenity, index) => (
          <label key={index}>
            <input type="checkbox" 
                        onChange={() => handleAmenityChange(amenity)}
                        checked={selectedAmenities.includes(amenity)} // Check if it's selected
             /> {amenity}
          </label>
        ))}

        {/* If isAdding is true, show input for adding new amenity */}
        {isAdding && (
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={handleAddAmenity}
            placeholder="Add amenity"
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        )}

        {/* "Add more" button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-light-blue underline"
          >
            + add more
          </button>
        )}
      </div>
    </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Upload Hotel Photo</h3>
            <input
              type="file"
              accept="image/*"
              multiple
              className="border border-gray-300 px-3 py-2 rounded-md"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500 mt-1">You can upload up to 4 images</p>
            
            {/* Image Previews */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="border border-gray-300 p-2">
                    <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md z-10"
                    style={{ zIndex: 10 }} 
                  >
                    <AiOutlineClose className="text-red-500 w-4 h-4" />
                  </button>
                  <img
                    src={image}
                    alt={`Hotel Preview ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </div>


          {/* Next Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-heading-green text-white rounded-md hover:bg-navbar-green" onClick={handleNext}>Next</button>
          </div>
        </div>
      </main>
    </>
  );
  }

export default AddHotel;
