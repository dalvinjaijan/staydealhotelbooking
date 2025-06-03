import React, { useEffect, useState } from 'react'
import Header from './Header'
import { CgProfile } from 'react-icons/cg'
import { useSelector,useDispatch } from 'react-redux';
import { RootState,AppDispatch } from '../../../utils/redux/store';
import { saveUserDetails, userProfile } from '../../../utils/axios/api';
import {toast} from 'react-toastify'
import { resetStates } from '../../../utils/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {

  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [file,setFile]=useState<any | null>(null);
  const [dob,setDob]=useState<Date | null>(null);
  const [phone,setPhone]=useState<number>(0)
  const [formattedDob, setFormattedDob] = useState('');
  const isProfileIncomplete = !email || !firstName || !lastName || !dob || !phone; // to change complete profile to edit profile
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const {userInfo,message}=useSelector((state:RootState)=>state.user)
  const [errors, setErrors] = useState({
    email: false,
    firstName: false,
    lastName: false,
    dob: false,
    phone: false,
  });

  const [popUp,setPopUp]=useState("")
  const dispatch:AppDispatch = useDispatch<AppDispatch>();

  // console.log("emailll",userInfo)

  useEffect(()=>{
    console.log("userInfo.userId--"+userInfo?.userId)
    dispatch(userProfile(userInfo?.userId))
  },[])
  useEffect(()=>{
    if(message==="user update succcessfully"){
      toast.success(message)
      dispatch(resetStates())
      setPopUp("")
    }
  })

  useEffect(()=>{
    console.log("formatted dob"+formattedDob)
    if(userInfo?.email){
      setEmail(userInfo.email)
    }
    if(userInfo?.firstName){
      setFirstName(userInfo.firstName)
    }if(userInfo?.lastName){
      setLastName(userInfo.lastName)
    }
    if(userInfo?.profileImage){
      setProfileImage(userInfo.profileImage)
    

    }
    if(userInfo?.dob){
      const dateObject = new Date(userInfo.dob);
      setDob(dateObject);
      setFormattedDob(formatDateToInputValue(dateObject));
    }if(userInfo?.phone){
      setPhone(userInfo.phone)
    }
  },[userInfo?.dob,userInfo?.email,userInfo?.firstName,userInfo?.lastName,userInfo?.phone,userInfo?.profileImage])

  const handleImageUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files?.[0];
    if (files) {
      setFile(files)
      const previewURL = URL.createObjectURL(files);
      setPreview(previewURL)
    }
  };

  const handleEmailChange = (e:any) => setEmail(e.target.value);
  const handleFirstNameChange = (e:any) => {setFirstName(e.target.value)
    setPopUp("save")
  };
  const handleLastNameChange = (e:any) => {setLastName(e.target.value)
    setPopUp("save")
  };
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormattedDob(date);
    setDob(new Date(date));
    setPopUp("save")
  };
  const handlePhoneChange=(e:any)=>{setPhone(e.target.value)
    setPopUp("save")
  }


  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      email: false,
      firstName: false,
      lastName: false,
      dob: false,
      phone: false,
    };
  
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      newErrors.email = true;
      isValid = false;
      toast.error("Please enter a valid email");
    }
  
    // First name validation
    if (!firstName || !/^[A-Za-z]+$/.test(firstName) || firstName.startsWith(' ')) {
      newErrors.firstName = true;
      isValid = false;
      toast.error("First name cannot be empty or contain numbers");
    }
  
    // Last name validation
    if (!lastName || !/^[A-Za-z]+$/.test(lastName) || lastName.startsWith(' ')) {
      newErrors.lastName = true;
      isValid = false;
      toast.error("Last name cannot be empty or contain numbers");
    }
  
    // Phone number validation (10 digits, numbers only)
    if (!/^\d{10}$/.test(phone.toString())) {
      newErrors.phone = true;
      isValid = false;
      toast.error("Phone number must be 10 digits and numbers only");
    }
  
    // Date of birth validation
    if (!dob) {
      newErrors.dob = true;
      isValid = false;
      toast.error("Date of birth cannot be empty");
    }
  
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSave = async () => {
    if (!validateFields()) {
      return; // If validation fails, stop the function here
    }
  
    if (dob) {
      dob.setHours(0, 0, 0, 0);
    }
  
    const formData = new FormData();
    if (userInfo) formData.append('userId', userInfo?.userId);
    if (email) formData.append('email', email);
    if (firstName) formData.append('firstName', firstName);
    if (lastName) formData.append('lastName', lastName);
    if (dob) formData.append('dob', dob.toISOString());
    if (phone) formData.append('phone', phone.toString());
    if (file) formData.append('profileImage', file);
  
    dispatch(saveUserDetails({ formData, userInfo }));
  };
  function formatDateToInputValue(date: Date) {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
  const toggleCompleteProfile = () => setShowCompleteProfile(!showCompleteProfile);

  return (
    <>
      <Header />
      <div className="w-7/12 px-11 mx-auto mt-28 bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Profile</h1>
        <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col items-center">
        <label htmlFor="file-input" className="cursor-pointer">
    {preview ? (
      
      <img src={preview} alt="Profile Preview" className="w-24 h-24 rounded-full" />
    ) : profileImage ? (
      
      <img src={`${profileImage}`} alt="Profile" className="w-24 h-24 rounded-full" />
    ) : (
   
      <CgProfile className="w-24 h-24 text-gray-500" />
    )}
    <span className="text-blue-500">{profileImage || preview ? 'Change Photo' : 'Upload Photo'}</span>
  </label>
  <input id="file-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
</div>
          <div className="flex flex-col ml-6 w-1/3">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input disabled
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`mt-1 block w-full px-3 py-2 bg-white border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
            </div>
           
            <p
              onClick={toggleCompleteProfile}
              className=" font-semibold"
            >
              {isProfileIncomplete ? 'Complete Your Profile' : ''}
            </p>
          </div>
          <div onClick={()=>navigate('/walletTransactions')}>
              <img className='w-28' src="/src/assets/walletIcon.png" alt="" />
              <p>{`wallet balance ${userInfo?.wallet}`}</p>
            </div>
        </div>
     
          <div className="mt-6 space-y-4">
            
            <div className='flex gap-4'>
              <div className='w-1/2'>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div className='w-1/2'>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
            </div>
            
            <div className='flex gap-4'>
              <div className='w-1/2'>
                <label className="block text-sm font-medium text-gray-700">Date of birth</label>
                <input
                  type="Date"
                  value={formattedDob}
                  onChange={handleDobChange}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${
                    errors.dob ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div className='w-1/2'>
                <label className="block text-sm font-medium text-gray-700">phone number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
            </div>
            
            {popUp==="save" && (  <button
              onClick={handleSave}
              className="w-full py-2 px-4 border  border-light-green text-sm font-medium rounded-md text-light-green bg-white-600 hover:bg-light-green hover:text-white "
            >
              Save
            </button>)}
          
          </div>
        
      </div>
    </>
  );
}

export default UserProfile;
