import React, { useEffect, useState } from 'react';
import HostHeader from './HostHeader';
import { AiOutlineClose } from 'react-icons/ai';
import InputBox from '../InputBox';
import { addRoomDetails } from '../../../utils/redux/slices/hostSlice';
import { AppDispatch, RootState } from '../../../utils/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {
  const dispatch:AppDispatch=useDispatch<AppDispatch>()
  const {newRoomCategories}=useSelector((state:RootState)=>state.host)
  const navigate=useNavigate()


    const [roomType, setRoomType] = useState<string | null>(null);
    const [roomSize, setRoomSize] = useState<number | null>(null);
    const [noOfRooms, setNoOfRooms] = useState<number | null>(null);
    const [roomPrice, setRoomPrice] = useState<number | null>(null);

  
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [amenities,setAmenities] = useState<string[]>(['Wardrobe', 'WIFI', 'TV']); // Example amenities
  const [selectedAmenities,setSelectedAmenities]=useState<string[]>([])

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showAddMoreRoom,setShowAddMoreRoom]=useState<boolean>(false)
  


  const addmMoreRoom=()=>{
    console.log("clicked")
    resetForm()
    setErrorMessage(null)
    navigate('/host/addRoom')
  } 
  const resetForm=()=>{
    setRoomType(null)
  setRoomSize(null);
  setNoOfRooms(null);
  setRoomPrice(null);
  setSelectedAmenities([]);
  setSelectedImages([]);
  setErrors({});
  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAddAmenity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newAmenity.trim() !== '') {
      setAmenities([...amenities, newAmenity]);
      setNewAmenity('');
      setIsAdding(false);
    }
  };
  
  const handleSubmit = (e:any,arg:string)=>{
    console.log("selected images  ",selectedImages)
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}; // Store error messages

  // Validation for each field
  if (!roomType) {
    newErrors.roomType = 'Please select a room type.';
  }
  if (!roomSize || roomSize <= 0 || roomSize > 2000) {
    newErrors.roomSize = 'Room size must be between 1 and 2000 sqft.';
  }
  if (!noOfRooms || noOfRooms <= 0) {
    newErrors.noOfRooms = 'Number of rooms must be greater than 0.';
  }
  if (!roomPrice || roomPrice <= 0) {
    newErrors.roomPrice = 'Price per night must be greater than 0.';
  }
  if (selectedAmenities.length === 0) {
    newErrors.roomAmenities = 'Please select at least one amenity.';
  }
  if (selectedImages.length === 0) {
    newErrors.roomPhotos = 'Please upload at least one room photo.';
  }

  // If there are errors, set them and stop submission
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors); // Set errors state
    return;
  }


    const formData = {
      roomType,
      roomSize,
      noOfRooms,
      roomPrice,
      roomAmenities:selectedAmenities,
      roomPhotos:selectedImages,
    };
    console.log("selected ammini",selectedAmenities)
   if(arg==="next"){
    if(newRoomCategories===null){
      setErrorMessage("click save and then  proceed to next step")
      // console.log("errormessage",errorMessage)

    }else{
    
      navigate('/host/addHotelPolicy')

    }
   }else{
    if(newRoomCategories){
      const alreadyExistType=newRoomCategories.filter((category)=>{
        return category.roomType===roomType
      })
      if(alreadyExistType.length>0){
        setErrorMessage('Room type already added')
        return
      }
    }
    setErrorMessage(null)
   
    dispatch(addRoomDetails(formData))
    setShowAddMoreRoom(true)
   }

  }

  const handleAmenityChange=(amenity:string)=>{
    setSelectedAmenities((prevSelected)=>
    prevSelected.includes(amenity)?
    prevSelected.filter((item)=>item!==amenity):
    [...prevSelected,amenity]
    )
  }

  return (
    <>
      <HostHeader />
      <main className="h-auto w-[70%] mx-auto mt-[4rem] border border-light-green p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Enter Room details</h3>

          {/* Room Details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            {/* <InputBox label="Room Type:" type="text" placeholder="Enter room type" inputClassName="border border-gray-300 p-2 rounded-md w-full" />
             */}
               <label className="block text-gray-600">Room Type</label>
            <select  className={`w-full p-2 border rounded-lg ${errors.roomType ? 'border-red-500' : 'border-gray-300'}`}               value={roomType || ''}  // Bind the selected value to the state
                 onChange={(e) => setRoomType(e.target.value)}  // Update the state when the user selects a new option
>
             <option value="" disabled>Select a room type</option>
            <option value="classic">Classic</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
            </select>
            {errors.roomType && <p className="text-red-500 text-sm">{errors.roomType}</p>}
            <div className="flex items-center border border-gray-300 rounded-md w-full">
  <InputBox 
    label="Room Size:" 
    type="number" 
    placeholder="Enter room size" 
    inputClassName={`w-full p-2 rounded-l-md ${errors.roomSize ? 'border-red-500' : 'border-gray-300'}`} // Added h-full for full height
    value={roomSize || ''} 
    onChange={(e: any) => setRoomSize(e.target.value)} 
  />
  <span className=" p-2 rounded-r-md ml-4 h-full flex items-center">sqft</span> {/* Centering text vertically */}
</div>
{errors.roomSize && <p className="text-red-500 text-sm">{errors.roomSize}</p>}

            <InputBox label="No. of Rooms:" type="number" placeholder="Enter number of rooms" inputClassName={`w-full p-2 border rounded-md ${errors.noOfRooms ? 'border-red-500' : 'border-gray-300'}`} 
            value={noOfRooms ||''}
            onChange={(e:any) => setNoOfRooms(e.target.value)}/> 
            {errors.noOfRooms && <p className="text-red-500 text-sm">{errors.noOfRooms}</p>}
            <InputBox label="Price per night:" type="number" placeholder="Enter price" inputClassName={`w-full p-2 border rounded-md ${errors.roomPrice ? 'border-red-500' : 'border-gray-300'}`} 
            value={roomPrice ||''}
            onChange={(e:any) => setRoomPrice(e.target.value)}/> 
            {errors.roomPrice && <p className="text-red-500 text-sm">{errors.roomPrice}</p>}
          </div>
          

          {/* Specialised Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Amenities Specialised for Room</h3>
            <div className="flex flex-wrap gap-4">
              {amenities.map((amenity, index) => (
                <label key={index} className="flex items-center">
                  <input type="checkbox" 
                  onChange={() => handleAmenityChange(amenity)}
                  checked={selectedAmenities.includes(amenity)}
                  className="mr-2" /> {amenity}
                </label>
              ))}
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
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-light-blue underline"
                >
                  + add more
                </button>
              )}
            </div>
            {errors.roomAmenities && <p className="text-red-500 text-sm">{errors.roomAmenities}</p>}
          </div>

          {/* Upload Room Photo */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Upload Room Photo</h3>
            <input
              type="file"
              accept="image/*"
              multiple
              className={`border p-2 rounded-md ${errors.roomPhotos ? 'border-red-500' : 'border-gray-300'}`}
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500 mt-1">You can upload up to 4 images</p>
            
            {/* Image Previews */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative border border-gray-300 p-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md z-10"
                  >
                    <AiOutlineClose className="text-red-500 w-4 h-4" />
                  </button>
                  <img
                    src={image}
                    alt={`Room Preview ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
            {errors.roomPhotos && <p className="text-red-500 text-sm">{errors.roomPhotos}</p>}
          </div>
          

          {/* Next Button */}
          <div className="flex justify-end">
          {errorMessage && (
        <p className="text-red-500 mr-4">{errorMessage}</p>
      )}
      
      {showAddMoreRoom && (<button className="px-6 py-2 bg-heading-green text-white rounded-md hover:bg-navbar-green mr-4" onClick={addmMoreRoom} >Add more</button>)}
          <button className="px-6 py-2 bg-heading-green text-white rounded-md hover:bg-navbar-green" onClick={(e:any)=>handleSubmit(e,"save")}>Save</button>

            <button className="ml-4 px-6 py-2 bg-heading-green text-white rounded-md hover:bg-navbar-green" onClick={(e:any)=>handleSubmit(e,"next")}>Next</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddRoom;
