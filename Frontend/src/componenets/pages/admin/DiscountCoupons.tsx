import React, { useEffect, useState } from 'react'
import CouponModal from './CouponModal'
import { fetchCoupons } from '../../../utils/axios/AdminApi/AdminApi'
import { Coupon } from '../../../utils/interfaces'

const DiscountCoupons = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [message, setMessage] = useState<string>("")
  const [page, setPage] = useState(1);
  useEffect(() => {
    const getCoupons = async () => {
      const result = await fetchCoupons(page); 

      if (result === "No active coupons available") {
        setMessage(result)
      } else {
        setMessage('')
        setCoupons(result);
      }
    };
    console.log("this is working")

    getCoupons();
  }, [!isModalOpen,page])
  return (
    <div>
      <div className='flex w-full justify-between items-center'>
        <div className=''>
          <p className='text-3xl'>Coupon management</p>
        </div>
        <div className=''>
          <button className='bg-heading-green text-white w-28 py-2 mr-10'
            onClick={() => setIsModalOpen(true)}>
            Add coupon
          </button>
        </div>
      </div>
      <CouponModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Add Coupon'
      />
      {coupons.length > 0 && (
        <div>
<table className='mt-8 border border-gray-300 border-collapse w-full'>
        <thead>
          <tr>
          <th className='border border-gray-300'>Si</th>
          <th className='border border-gray-300'>code</th>
          <th className='border border-gray-300'>description</th>
          <th className='border border-gray-300'>offer %</th>
          <th className='border border-gray-300'>min purchase</th>
          <th className='border border-gray-300'>max amount</th>
          <th className='border border-gray-300'>valid till</th>
          <th className='border border-gray-300'>action</th>
          </tr>

        </thead>
        <tbody>

          {coupons.length > 0 && coupons.map((data, index) => {
            return (
              <tr key={index}>
                <td className='border border-gray-300 px-4 py-2'>{8*(page-1)+(index + 1)}</td>
                <td className='border border-gray-300 px-4 py-2'>{data.code}</td>
                <td className='border border-gray-300 px-4 py-2'>{data.description}</td>
                <td className='border border-gray-300 px-4 py-2'>{data.offerPercentage}</td>
                <td className='border border-gray-300 px-4 py-2'>{data.minPurchase}</td>
                <td className='border border-gray-300 px-4 py-2'>{data.maxDiscount}</td>
                <td className='border border-gray-300 px-4 py-2'>{data.validity.toLocaleString().split('T')[0]}</td>
                <td className='border border-gray-300 px-4 py-2'></td>
              </tr>
            )
          })}



        </tbody>
      </table>
      <div className='flex mt-2 space-x-2 justify-center'>
        <button className='px-2 py-1 bg-blue-600 text-white' onClick={()=>setPage(prev=>prev-1)}
          disabled={page===1}>
          &lt;- prev
        </button>
        <button className='px-2 py-1 bg-blue-600 text-white' onClick={()=>setPage(prev=>prev+1)}
          disabled={coupons.length<8}>
          next -&gt;
        </button>
      </div>
        </div>
        )
      }
      {message === "No active coupons available" && (
        <p className='text-xl font-medium'>{message}</p>
      )}
    </div>
  )
}

export default DiscountCoupons
