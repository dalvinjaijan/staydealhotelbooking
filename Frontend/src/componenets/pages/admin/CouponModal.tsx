import React, { useEffect, useState } from 'react'
import {FaXmark} from 'react-icons/fa6'
import { addCoupons } from '../../../utils/axios/AdminApi/AdminApi';
import Swal from 'sweetalert2';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;

}
const CouponModal:React.FC<ModalProps> = ({isOpen,onClose,title}) => {

  const [code,setCode]=useState<string>('')
  const [description,setDescription]=useState<string>('')
  const [validity,setValidity]=useState<string>('')
  const [offerPercentage,setoOfferPercentage]=useState<string>("0")
  const [maxDiscount,setMaxDiscount]=useState<string>('1')
  const [minPurchase,setMinPurchase]=useState<string>("1")
  const [couponType,setCouponType]=useState<"citySpecific"|"other">("other")
  const [cityCoupon,setCityCoupon]=useState<string>('')


  const getTomorrowDate=()=>{
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  const [codeError,setCodeError]=useState<string>("")
  const [descError,setDescError]=useState<string>("")
  const [dateError,setDateError]=useState<string>("")
  const [offerError,setOfferError]=useState<string>("")
  const [maxAmountError,setMaxAmountError]=useState<string>("")
  const [minPurchaseError,setMinPurchaseError]=useState<string>("")
  
 
  const codeValidation=()=>{
    console.log("code validation")
     if(code.length!=5){
       setCodeError("coupon code should contain exactly 5 character")
       return false
     }
      const regex = /^[A-Za-z]{3}[0-9]{2}$/;
  if (!regex.test(code)) {
     setCodeError("Coupon code must be 3 letters followed by 2 digits");
     return false
  }

   setCodeError("");
   return true
  }
  const descValidation=()=>{
    if(description.length===0){
      setDescError("description cannot be empty")
return false
    }
    setDescError("")
    return  true
  }
  const dateValidation=()=>{
    if(validity.length===0){
      setDateError("validity date cannot be empty")
      return false
    }
       setDateError("")
       return true
  }
  const offerValidation=()=>{
    if(offerPercentage && parseInt(offerPercentage)>50){
      setOfferError("offer percentage should not be greater than 50")
      return false
    }
    setOfferError("")
    return true
  }
  const maxAmountValidation=()=>{
    if(maxDiscount && parseInt(maxDiscount)>3000){
      setMaxAmountError("max discount should not be greater than 3000")
      return false
    }
    setMaxAmountError("")
    return true
  }
  const minPurchaseValidation=()=>{
    if(minPurchase && parseInt(minPurchase)>5000){
      setMinPurchaseError("max discount should not be greater than 5000")
      return false
    }
    setMinPurchaseError("")
    return true
  }
 const validateAll = () => {
  const isCodeValid = codeValidation();
  const isDescValid = descValidation();
  const isDateValid = dateValidation();
  const isOfferValid = offerValidation();
  const isMaxValid = maxAmountValidation();
  const isMinValid = minPurchaseValidation();

  return (
    isCodeValid &&
    isDescValid &&
    isDateValid &&
    isOfferValid &&
    isMaxValid &&
    isMinValid
  );
};

  const addCoupon=async (e:any)=>{
    e.preventDefault()
    if(validateAll()){
      let city
      if(couponType==="citySpecific" && cityCoupon.length>0){
        city=cityCoupon
      }
      else{
        city=null
      }
      console.log("city",city)
      const data = {city,code,description,validity,offerPercentage,maxDiscount,minPurchase}
      const result=await addCoupons(data)
      if(result==="Coupon added successfully"){
        onClose()
       Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Coupon added successfully.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Something went wrong while adding the coupon.',
        });
      }
    }
  }


    if(!isOpen) return null
  return (
    <div className='fixed bg-gray-500 bg-opacity-70 w-[80%] flex items-center justify-center mt-2'>
      <div className='bg-white p-6 rounded-lg w-[100%] max-w-md relative shadow-lg'>
        <div className='flex justify-between'>
{title && <h2 className='font-semibold text-black underline underline-offset-4'>{title}</h2>}
    <button
    onClick={onClose}><FaXmark /></button>
        </div>
        <div className='flex flex-col space-y-2'>
                 <div className='flex gap-5 mt-3 '>
        <label htmlFor="cityButton">
        <input type="radio" id='cityButton' value="citySpecific" checked={couponType==="citySpecific"} onChange={(e:any)=>{
          setCouponType(e.target.value)
        }}/>
      <span className='ml-1'>city specific</span>
        </label>
        <label htmlFor="otherButton">
        <input type="radio" id='otherButton' value="other" checked={couponType==="other"}
        onChange={(e:any)=>{
          setCouponType(e.target.value)
        }}/>
      <span className='ml-1'>other</span>
        </label>

       </div>
              {couponType==="citySpecific" &&(
        <div id='dropDown'>
          <select name="" id="" value={cityCoupon}
          onChange={(e) => setCityCoupon(e.target.value)}
          >
            <option value="">--select city--</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Chennai">Chennai</option>
        <option value="Kochi">Kochi</option>
        <option value="Banglore">Banglore</option>
        <option value="Hyderabad">Hyderabad</option>
        <option value="Delhi">Delhi</option>
        <option value="Kolkata">Kolkata</option> 

          </select>
        </div>
       )}
 <div className='flex '>
      <p>coupon code</p>
      <input className={codeError.length>0 ?`border border-red-500  rounded-md px-3 py-1 ml-20`:`border border-navbar-green rounded-md px-3 py-1 ml-20`} type="text" placeholder='enter coupon code'onChange={(e)=>{setCode(e.target.value)
        setCodeError("")
      }} value={code} />
      </div>
      {codeError.length>0 &&(<p className='text-red'>{codeError}</p>)}
      <div className='flex'>
      <p>description</p>
      <input className={descError.length > 0 ?`border border-red-500 rounded-md px-3 py-1 ml-24`:`border border-navbar-green rounded-md px-3 py-1 ml-24`} type="text" placeholder='enter description' onChange={(e)=>{setDescription(e.target.value)
        setDescError("")
      }} value={description} />
      </div>
      {descError.length>0 &&(<p className='text-red'>{descError}</p>)}

      <div className='flex'>
      <p>valid till</p>
      <input className={dateError.length > 0 ?`border border-red-500 rounded-md px-3 py-1 ml-[122px]`:`border border-navbar-green rounded-md px-3 py-1 ml-[122px]`} type="date" placeholder='enter date'onChange={(e)=>{setValidity(e.target.value)
        setDateError("")
      }} value={validity} min={getTomorrowDate()} />
      </div>
      {dateError.length>0 &&(<p className='text-red'>{dateError}</p>)}

      <div className='flex'>
      <p>discount percentage</p>
      <input className={offerError.length>0?'border border-red-500 rounded-md px-3 py-1 ml-8':'border border-navbar-green rounded-md px-3 py-1 ml-8'} type="number" min={1} placeholder='enter percentage' onChange={(e)=>{setoOfferPercentage(e.target.value)
        setOfferError("")
      }} value={offerPercentage} />
      </div>
       {offerError.length>0 &&(<p className='text-red'>{offerError}</p>)}
      <div className='flex'>
      <p>max discount amount</p>
      <input className={maxAmountError.length>0? 'border border-red-500 rounded-md px-3 py-1 ml-6':'border border-navbar-green rounded-md px-3 py-1 ml-6'} type="number" min={1} placeholder='enter max amount'onChange={(e)=>{setMaxDiscount(e.target.value)
        setMaxAmountError("")
      }}  value={maxDiscount} />
      </div>
       {maxAmountError.length>0 &&(<p className='text-red'>{maxAmountError}</p>)}
      <div className='flex'>
      <p>min purchase</p>
      <input className={minPurchaseError.length>0 ? 'border border-red-500 rounded-md px-3 py-1 ml-[84px]':'border border-navbar-green rounded-md px-3 py-1 ml-[84px]'} type="number" placeholder='enter amount' onChange={(e)=>{setMinPurchase(e.target.value)
        setMinPurchaseError("")
      }} value={minPurchase} />
      </div>
       {minPurchaseError.length>0 &&(<p className='text-red'>{minPurchaseError}</p>)}

   
      <div className=' flex justify-center'>
        <button className='mt-2 bg-heading-green px-4 py-1' onClick={(e)=>addCoupon(e)}>submit</button>
      </div>
      
    
        </div>
     
      </div>

    </div>
  )
}

export default CouponModal
