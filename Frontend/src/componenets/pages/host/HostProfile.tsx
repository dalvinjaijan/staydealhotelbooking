import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg'
import { useSelector,useDispatch } from 'react-redux';
import { RootState,AppDispatch } from '../../../utils/redux/store';
import HostHeader from './HostHeader'
import { api, hostApi } from '../../../utils/axios/axiosconfig';
import axios from 'axios';

const HostProfile = () => {

    interface HostDetails{
         firstName:string,
         lastName:string,
         phoneNumber:number,
         email:string,
         wallet:number,
         profileimage:string|null,
    }


    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [walletBalance, setWalletBalance] = useState<number>(0);

    const [preview, setPreview] = useState<string | null>(null);
    const [file,setFile]=useState<any | null>(null);
    const [dob,setDob]=useState<Date | null>(null);
    const [phone,setPhone]=useState<number>(0)
    // const [hostDetails,setHostDetails]=useState<HostDetails>()
  
    const {hostInfo,message}=useSelector((state:RootState)=>state.host)
    const navigate=useNavigate()
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
      const handlePhoneChange=(e:any)=>{setPhone(e.target.value)
        setPopUp("save")
      }
      const hostId=hostInfo?.hostId
    
    useEffect(()=>{
       const fetchHostDetails=async ()=>{
            if(hostId){
              console.log("inside useEffect")
                const response=await hostApi.get('/hostProfile',{params:{hostId}})
                // setHostDetails(response.data)
                if(response.data?.email){
                  setEmail(response.data.email)
                }
                if(response.data?.firstName){
                  setFirstName(response.data.firstName)
                }if(response.data?.lastName){
                  setLastName(response.data.lastName)
                }
                if(response.data?.profileImage){
                  setProfileImage(response.data.profileImage)
                
            
                }
                if(response.data?.phone){
                  setPhone(response.data.phone)
                }
                if(response.data?.wallet){
                  setWalletBalance(response.data.wallet)
                }
                
            }
        }
        fetchHostDetails()
    },[])
  return (
    <div>
    <HostHeader />
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
            
              <div onClick={()=>navigate('/host/walletTransactions')}>
                  <img className='w-28' src="/src/assets/walletIcon.png" alt="" />
                  <p>{`wallet balance ${walletBalance}`}</p>
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
                  // onClick={handleSave}
                  className="w-full py-2 px-4 border  border-light-green text-sm font-medium rounded-md text-light-green bg-white-600 hover:bg-light-green hover:text-white "
                >
                  Save
                </button>)}
              
              </div>
            
          </div>
      
    </div>
  )
}

export default HostProfile
