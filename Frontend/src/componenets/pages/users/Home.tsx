import React, { useEffect, useRef, useState } from 'react'
import Header from './Header'
import HotelSearchBar from './HotelSearchBar'
import { FaCheck, FaCopy } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../utils/redux/store'
import { Coupon, CouponsData, latLng, topRatedProps } from '../../../utils/interfaces'
import { fetchCoupons, fetchTopRatedHotels, searchHotelforBooking } from '../../../utils/axios/api'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [copy,setCopy]=useState<number|null>(null)
  const lngLat=useSelector((state:RootState)=>state.user.lngLat)as latLng
  const city=useSelector((state:RootState)=>state.user.selectedLoc)
    const topRatedProperties=[{hotelName:"seagul",address:"kacheripadi kochi",hotelPhoto:"/src/assets/mumbai.png",averageRatings:5},
    {hotelName:"The Senate",address:"kacheripadi kochi",hotelPhoto:"/src/assets/hotelLogin.jpg",averageRatings:5},
    {hotelName:"seagul",address:"kacheripadi kochi",hotelPhoto:"/src/assets/banglore.png",averageRatings:5},
    {hotelName:"seagul",address:"kacheripadi kochi",hotelPhoto:"/src/assets/delhi.png",averageRatings:5},
  ]
    const promoData=[{city:"Chennai",code:"CHE99",description:"flat 10% off use code", validity:"2025-12-25"},
    {city:"Chennai",code:"CHE15",description:"flat 15% off use code", validity:"2025-12-25"},
    {city:"Chennai",code:"CHE20",description:"flat 20% off use code", validity:"2025-12-25"},
    {city:"Chennai",code:"CHE30",description:"flat 30% off use code", validity:"2025-12-25"}
  ]
  const [coupon,setCoupon]=useState<CouponsData[]>(promoData)
  const navigate=useNavigate()
  const dispatch: AppDispatch=useDispatch<AppDispatch>()
  const [topRatedProps,setTopRatedProps]=useState<topRatedProps[]>(topRatedProperties)
    const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [coupScrollLeft, setCoupScrollLeft] = useState(false);
  const [coupScrollRight, setCoupScrollRight] = useState(false);
//coupon useEffect
useEffect(() => { 
async function fetchCoupon(){
  console.log("city",city)
  if(city){
  const couponData = await fetchCoupons(city)
  console.log("coupons",couponData)
  if(couponData.length>0)
    setCoupon(couponData)
  else
    setCoupon(promoData)
  }
}
fetchCoupon()
},[city])   


  const checkOut=new Date()
  checkOut.setDate(checkOut.getDate())+1
  useEffect(()=>{
    const el=topRatedScrollRef.current

    const checkScroll=()=>{
      if(!el) return
          setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(Math.ceil(el.scrollLeft + el.clientWidth) < Math.ceil(el.scrollWidth));

    }
    if(el){
      checkScroll()
      el.addEventListener('scroll', checkScroll)
    }
      return () => {
      el?.removeEventListener("scroll", checkScroll);
    };
  },[topRatedProps])

 

  useEffect(()=>{
    if(lngLat){
      async function getTopRatedProp(lngLat:latLng){
      const response=await fetchTopRatedHotels(lngLat)
      setTopRatedProps(response)
      console.log(response)
      }
      getTopRatedProp(lngLat)
      
    }
  },[])
  

   useEffect(()=>{
    const el=discountScrollRef.current
    function checkScroll(){
      if(!el) return
      setCoupScrollLeft(el.scrollLeft>0)
      setCoupScrollRight(Math.ceil(el.scrollLeft + el.clientWidth) < Math.ceil(el.scrollWidth))
    }
    if(el){
      checkScroll()
    el.addEventListener('scroll', checkScroll)
    }
      return () => {
      el?.removeEventListener("scroll", checkScroll);
    };
    
  },[promoData])



  const handleCopy=async(text:string,index:number)=>{
    try {
      console.log("clicked")
        await navigator.clipboard.writeText(text);
      setCopy(index)
      setTimeout(()=>setCopy(null),2000)

    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  }
  const topRatedScrollRef = useRef<HTMLDivElement | null>(null);
  const discountScrollRef = useRef<HTMLDivElement | null>(null);


const scrollLeft = (ref:React.RefObject<HTMLDivElement>) => {
   if (ref.current)
  ref.current.scrollBy({ left: -300, behavior: 'smooth' });
};

const scrollRight = (ref:React.RefObject<HTMLDivElement>) => {
   if (ref.current)
  ref.current.scrollBy({ left: 300, behavior: 'smooth' });
};

  return (
    <div>
      <Header />
      <div className='mt-16 '>
        <div className='flex justify-center'>
      <HotelSearchBar />

        </div>

      </div>
      <div>
    <img className='w-full ' src="/src/assets/greenBuild.jpg" alt="" />
    <div className="relative">
  {/* Scroll Buttons */}
  {coupScrollLeft &&(<button
    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20   rounded-full"
    onClick={() => scrollLeft(discountScrollRef)}
  >
    <img className='w-8 rounded-full' src="/src/assets/leftArrow.svg" alt="" />
  </button>)}
  {coupScrollRight && promoData.length>0 && (<button
    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 rounded-full"
    onClick={() => scrollRight(discountScrollRef)}
  >
    <img className='w-8 rounded-full' src="/src/assets/rightArrow.svg" alt="" />
    
  </button>)}

  {/* Scrollable Container */}
  <div
    ref={discountScrollRef}
    className="flex overflow-x-auto scroll-element space-x-2 px-10 scroll-smooth"
  >
 {coupon.map((item,index)=>{
      return(
 <div className="w-72 bg-navbar-green h-40 relative z-10 flex-shrink-0" key={index}>
    <p className='absolute mt-3 text-white ml-2' >instant discount</p>
    <p className='absolute mt-8 text-white ml-2 text-xl' >{item.city ? item.city:"Special offer"}</p>
    <div className='flex absolute mt-16 ml-2 z-10 justify-between w-full'>
      <div className='flex flex-col'>
     <p className='text-sm text-white'>{item.description}</p>

        <p className='  text-sm text-white'>{`valid till ${item.validity.toLocaleString().split("T")[0]}`}</p>
      </div>
     <div className='flex mr-12 bg-white w-20 ml-2 h-6'>
    <p  className='  text-black text-base ml-1'>{item.code} </p><button className='cursor-pointer' onClick={()=>handleCopy(`${item.code}`,index)}>
      {copy===index ?  <FaCheck className='ml-2' />:<FaCopy className='text-navbar-green ml-2 mt-1'/>}
    </button>

     </div>
    </div>
    
   

   
      <img src="/src/assets/buildingB&WC.png" className='absolute bottom-0 z-0' alt="" />
    </div>
      )
    })}
    </div>
    </div>
   
   
      </div>

      {/* TOP RATED PROPERTIES  */}

      <div className=''>
        <div className=''>
        <p className='mt-8 ml-6 text-xl  underline underline-offset-4 decoration-2 z-50'>Top rated properties</p>

        </div>
        {/* */}
        <div className='flex relative  items-center'>
           {canScrollLeft && (
    <button
      className="top-1/2 transform -translate-y-1/2 left-0 absolute w-8 z-20"
      onClick={()=>scrollLeft(topRatedScrollRef)}
    >
      <img className="w-8 rounded-full" src="/src/assets/leftArrow.svg" alt="" />
    </button>
  )}
            
       
            {topRatedProps.length > 4 && canScrollRight && (
    <button
      className="top-1/2 transform -translate-y-1/2 right-0 absolute w-8 z-20"
      onClick={()=>scrollRight(topRatedScrollRef)}
    >
      <img className="w-8 rounded-full" src="/src/assets/rightArrow.svg" alt="" />
    </button>
  )}
          <div 
          ref={topRatedScrollRef}
          className='flex scroll-element overflow-x-auto overflow-visible items-center scroll-smooth space-x-12 pt-4 px-9 pb-4 relative'>
        {topRatedProps.map((item,index)=>{
          return(
            <div className='relative flex-shrink-0 z-10'key={index}>
             <div className='w-56 h-64 hoverDiv'  
               onClick={()=>{dispatch(searchHotelforBooking({lngLat,numberOfRooms:1,totalGuests:1,checkIn:new Date(),checkOut,searchTerm:`${item.hotelName}, ${item.address}`,noOfDays:1}))
              navigate('/hotelDetailedPage')
               }}
             >
              <img className='size-full' src={item.hotelPhoto} alt=""
              />
            <p className='text-white text-sm ml-2 bottom-8 absolute'>{item.hotelName}</p>

            <p className='text-white text-xs ml-2 bottom-3 absolute overflow-hidden w-[200px] whitespace-nowrap text-ellipsis'>{item.address}</p>
            </div>
            </div>
         
          )
        })}
       
        </div>
        </div>
        
      </div>

      {/* be the host */}
      <div className='mt-8 w-full relative'>
        <div className='absolute mt-14 ml-14 w-64 font-medium'>
        <p className=' absolute text-2xl text-white tracking-wide'>List your properties</p>
        <button className='absolute mt-12 ml-6 bg-white rounded-lg text-base py-1 w-32 text-blue-500'
        onClick={() => window.open('/host/home', '_blank')}
        >become a host</button>
        </div>
      
        <img className="w-full" src="/src/assets/host.svg" alt="" />
      </div>
    </div>
  )
}

export default Home
