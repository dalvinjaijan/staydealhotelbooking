import React, { useEffect } from 'react'
import { adminApi } from '../../../utils/axios/axiosconfig'
import { format } from 'date-fns'


const Wallet = () => {

  interface walletTransaction{
    
      date: Date,
      type: string, 
      amount: number,
      bookingId:string,
      hotelName:string
    
  }

  interface walletDetails{
    wallet:number,
    walletTransaction:walletTransaction[]
  }

  const [walletDetails, setWalletDetails] = React.useState<walletDetails>()
  useEffect(()=>{
    const fetchWalletDetails=async()=>{
      try {
        const response=await adminApi.get('/walletDetails')
        setWalletDetails(response.data)
        console.log("data",response.data)
      } catch (error) {
        
      }
    }
    fetchWalletDetails()
  
  },[])

  return (
    <div className=''>
      <div className="flex flex-col  border border-navbar-green  ">
      <div className='flex justify-between px-10 '>
      <h2 className="text-lg text-center mt-8 font-semibold">Wallet Transactions</h2>

        <div className='flex'>
          <img className='w-28 mt-4' src="/src/assets/adminWallet.jpg" alt="" />
          <div className='flex flex-col'>
          <span className='font-medium mt-10'>Balance </span>
          <span className='font-extrabold'>{walletDetails?.wallet}</span>
          </div>
         

        </div>
      </div>
            { Array.isArray(walletDetails?.walletTransaction) && walletDetails?.walletTransaction.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              <table className="w-2/3 mt-8 mx-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Booking id</th>
                  <th className="border border-gray-300 p-2">hotelName</th>

                  <th className="border border-gray-300 p-2">Amount</th>
                  <th className="border border-gray-300 p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {walletDetails?.walletTransaction && walletDetails?.walletTransaction.length > 0 &&
                  walletDetails?.walletTransaction.map((transaction,index) => {
                    const formattedDate = format(
                      new Date(transaction.date),
                      'dd MMM yyyy, hh:mm a'
                    );
                    return (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">{formattedDate}</td>
                        <td className="border border-gray-300 p-2">{transaction.bookingId ?? 'NA'}</td>
                        <td className="border border-gray-300 p-2">{transaction.hotelName ?? 'NA'}</td>

                        <td className="border border-gray-300 p-2">{transaction.amount}</td>
                        <td
                          className={`border border-gray-300 p-2 ${
                            transaction.type === 'credit'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {transaction.type}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            
            )}
      </div>
    </div>
  )
}

export default Wallet
