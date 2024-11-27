import React, { useEffect, useState } from 'react';

function EditHotelModal({ isOpen, onClose, hotelData, onSave }:any) {
  const [editedData, setEditedData] = useState(hotelData);
  const [isAdding, setIsAdding] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [selectedAmenities,setSelectedAmenities]=useState<string[]>(editedData.amenities)
  const [amenities, setAmenities] = useState<string[]>(editedData.amenities);

  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomAmenity, setRoomNewAmenity] = useState('');
  const [selecteRoomdAmenities,setSelectedRoomAmenities]=useState<string[]>([])
//   const [amenitiesRoom, setAmenitiesRoom] = useState<string[]>([]);

const [hotelRules, setHotelRules] = useState<string[]>(editedData.hotelRules);
const [selectedRules,setSelectedRules]=useState<string[]>(editedData.hotelRules)
  const [isAddingRules, setIsAddingRules] = useState(false);
  const [newRules, setNewRules] = useState('');



  const handleAddRules = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newRules.trim() !== '') {
        setHotelRules([...hotelRules, newRules]);
      setNewRules('');
      setIsAddingRules(false);
    }
  };
  const handleRuleChange=(rule:string)=>{
    setEditedData((prev : any)=>{
        if(selectedRules?.includes(rule)){
            let updatedRules = prev.hotelRules.filter((each:string
                
            )=>each !== rule)
            return {
                ...prev,
                hotelRules : updatedRules
            }
        }
        return {
            ...prev,
            hotelRules : [...prev.hotelRules,rule]
        }
    })
    setSelectedRules((prevSelected) =>
      prevSelected.includes(rule)
        ? prevSelected.filter((item) => item !== rule) // Remove if already selected
        : [...prevSelected, rule] // Add if not selected
    );
  }

  if (!isOpen) return null;

  const handleChangeRoomPolices = (e: any) => {
    const { name, value } = e.target;
    setEditedData((prevData: any) => ({
      ...prevData,
      roomPolicies: {
        ...prevData.roomPolicies,
        [name]: value,
      },
    }));
  };
  
  const handleRoomAmenityChange=(amenity:string,id : string)=>{

    setEditedData((prev : any)=>{
      
      let updatedRoomCategories = []

      for(let roomData of prev?.roomCategories){
        let newRoomAmenities : any = []
          if(roomData?._id === id){
            newRoomAmenities =  roomData.roomAmenities.includes(amenity) ? roomData.roomAmenities.filter((item:string) => item !== amenity)   : [...roomData?.roomAmenities, amenity] 
            updatedRoomCategories.push({
              ...roomData,
              roomAmenities : newRoomAmenities
            })
          }else{
            updatedRoomCategories.push(roomData)
          }
        }
      return {
        ...prev,
        roomCategories: updatedRoomCategories
      }
})

   
  }
  const handleAddRoomAmenity = (e: React.KeyboardEvent<HTMLInputElement>,id : string) => {
    if (e.key === 'Enter' && newRoomAmenity.trim() !== '') {
        // setAmenitiesRoom([...amenitiesRoom, newRoomAmenity]);
        setEditedData((prev : any)=>{
          let updatedData = [];
          for(let roomData of prev?.roomCategories){
              if(roomData?._id === id){
                  updatedData.push({
                      ...roomData,
                      roomAmenities : [...roomData.roomAmenities, newRoomAmenity]
                  })
              }else{
                  updatedData.push(roomData)
              }
          }
          return {
              ...prev,
              roomCategories : updatedData
          }
      })
        
        setRoomNewAmenity('');
      setIsAddingRoom(false);
    }
  };

  const handleAmenityChange=(amenity:string)=>{
    setEditedData((prev : any)=>{
      if(selectedAmenities?.includes(amenity)){
          let updatedAmenities = prev.amenities.filter((each:string
              
          )=>each !== amenity)
          return {
              ...prev,
              amenities : updatedAmenities
          }
      }
      return {
          ...prev,
          amenities : [...prev.amenities,amenity]
      }
  })
    setSelectedAmenities((prevSelected) =>
      prevSelected.includes(amenity)
        ? prevSelected.filter((item) => item !== amenity) // Remove if already selected
        : [...prevSelected, amenity] // Add if not selected
    );
  }

  const handleAddAmenity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newAmenity.trim() !== '') {
      setAmenities([...amenities, newAmenity]);
      setNewAmenity('');
      setIsAdding(false);
    }
  };

  const handleSave = () => {
    onSave(editedData);
    console.log("save clicked");
    
    onClose();
  };


  useEffect(()=>{
    console.log("EDITED",editedData);
    
  },[editedData])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-scroll scroll-element relative">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 absolute top-5 right-5">
            ✕
          </button>
        <div className="flex justify-end">
        </div>
        <h2 className="text-2xl font-semibold mb-4">Edit Hotel Details</h2>
        
        <div className="space-y-4">
          {/* <div>
            <label className="block font-medium">Total no of rooms</label>
            <input
              type="number"
              name="totalNoOfRooms"
              value={editedData.totalNoOfRooms}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
          </div> */}

          {/* <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={editedData.address}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
          </div> */}

          <div className="space-y-4">
            <label className="block font-medium">General Amenities</label>
            <div className="flex flex-wrap gap-4">
        {/* Display the amenities as checkboxes */}
        {amenities.map((amenity:string, index:number) => (
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
        </div>
        <div className="space-y-4">

        <h4 className="text-xl font-semibold my-8">Edit Room Details</h4>

        {
            editedData?.roomCategories?.map((room : any)=>{
                return ( 
                <div key={room?._id}>
                    <p className='text-2xl font-bold my-4'>{room?.roomType}</p>
                    <div className="space-y-4">
                        <label className="block font-medium">Room Price</label>
                        <input
                        type="number"
                        name="RoomPrice"
                        value={room?.roomPrice}
                        onChange={(e)=>setEditedData((prev : any)=>{
                            let updatedData = [];
                            for(let roomData of prev?.roomCategories){
                                if(roomData?._id === room?._id){
                                    updatedData.push({
                                        ...roomData,
                                        roomPrice : parseInt(e.target.value)
                                    })
                                }else{
                                    updatedData.push(roomData)
                                }
                            }
                            return {
                                ...prev,
                                roomCategories : updatedData
                            }
                        })}
                        className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4 ">
              {room?.roomAmenities.map((amenity :any, index : number) => (
                <label key={index} className="flex items-center">
                  <input type="checkbox" 
                  onChange={() => handleRoomAmenityChange(amenity,room._id)}
                  checked={true}
                  className="mr-2" /> {amenity}
                </label>
              ))}
              {isAddingRoom && isAddingRoom === room?._id && (
                <input
                  type="text"
                  value={newRoomAmenity}
                  onChange={(e) => setRoomNewAmenity(e.target.value)}
                  onKeyDown={(e)=>handleAddRoomAmenity(e,room?._id)}
                  placeholder="Add amenity"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
              {!isAddingRoom && (
                <button
                  onClick={() => setIsAddingRoom(room?._id)}
                  className="text-light-blue underline"
                >
                  + add more
                </button>
              )}
            </div>
        
                </div>)
            })
        }
</div>

<h3 className="text-lg font-medium mb-2">Hotel Rules</h3>
      <div className="flex flex-wrap gap-4">
        {/* Display the amenities as checkboxes */}
        {hotelRules.map((rules, index) => (
          <label key={index}>
            <input type="checkbox" 
             onChange={() => handleRuleChange(rules)}
            checked={selectedRules.includes(rules)} /> {rules}
          </label>
        ))}

        {/* If isAdding is true, show input for adding new amenity */}
        {isAddingRules && (
          <input
            type="text"
            value={newRules}
            onChange={(e) => setNewRules(e.target.value)}
            onKeyDown={handleAddRules}
            placeholder="Add amenity"
            className="px-3 py-2 border border-gray-300 rounded-md "
          />
        )}

        {/* "Add more" button */}
        {!isAddingRules && (
          <button
            onClick={() => setIsAddingRules(true)}
            className="text-light-blue underline"
          >
            + add more
          </button>
        )}
      </div>

      <h3 className="text-lg font-medium mb-2">Room Polices</h3>
      <div className='flex space-y-4 justify-between gap-4'>
      <label className="block font-medium mt-6">check-in</label>
            <input
              type="text"
              name="checkIn"
              value={editedData.roomPolicies.checkIn}
              onChange={handleChangeRoomPolices}
              className="border p-2 rounded-md w-44"
            />
             <label className="block font-medium mt-10">check-out</label>
            <input
              type="text"
              name="checkOut"
              value={editedData.roomPolicies.checkOut}
              onChange={handleChangeRoomPolices}
              className="border p-2 rounded-md w-44"
            />

      </div>
      
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditHotelModal;
