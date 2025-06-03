import { format } from 'date-fns'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/redux/store';
import Header from '../users/Header';
import HostHeader from '../host/HostHeader';
import AdminHeader from '../admin/AdminHeader';


interface Transaction {
  id: string;
  date: string;
  totalAmount: number;
  amountRecieved?:number;
  hostCharge?:number
  type: string; 
  bookingId:string
 
}

interface WalletTransactionProps {
  role: 'user' | 'admin' | 'host';

}

const WalletTransaction: React.FC<WalletTransactionProps> = ({ role }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
    let userId:string
    let hostId:any
    console.log("inside WalletTransaction role-->",role)
    
  if(role==='user'){
    const {userInfo}=useSelector((state:RootState)=>state.user)
    userId=userInfo?.userId
  }else if(role==='host'){
    const {hostInfo}=useSelector((state:RootState)=>state.host)
    hostId=hostInfo?.hostId
  }

  useEffect(() => {

    const fetchTransactions = async () => {
      try {
        const url = role === 'user'? `/wallet-transactions`: role === 'host'
        ? '/host/wallet-transactions'
        : '/admin/wallet-transactions'; 
        const id:string=  role === 'user'? userId : role === 'host'
        ? hostId
        : '';  
        console.log("id",id)
        const response = await axios.get(`http://localhost:3001${url}`, {
          params: { role, id },
        });
        setTransactions(response.data.walletTransaction ||[]);
        console.log("transactions",response.data)

      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [role]);

  if (loading) {
    return <p>Loading transactions...</p>;
  }
  // console.log("transactions",transactions,transactions.length)

  return (
    <div>

      {role==='user'?<Header /> : role==='host' ? <HostHeader /> : <AdminHeader />}
    <div className="wallet-transaction-container">
    <div className="p-4 bg-gray-100 rounded shadow mt-16">
      <h2 className="text-lg text-center font-semibold">Wallet Transactions</h2>
      { transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="w-2/3 mt-8 mx-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Booking Id</th>

            <th className="border border-gray-300 p-2">TotalAmount</th>
            <th className="border border-gray-300 p-2">Amount:Credit/Debit</th>

            <th className="border border-gray-300 p-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 &&
            transactions.map((transaction) => {
              const formattedDate = format(
                new Date(transaction.date),
                'dd MMM yyyy, hh:mm a'
              );
              return (
                <tr key={transaction.id}>
                  <td className="border border-gray-300 p-2">{formattedDate}</td>
                  <td className="border border-gray-300 p-2">{transaction.bookingId}</td>

                  <td className="border border-gray-300 p-2">{transaction.totalAmount}</td>
                  
                  <td className="border border-gray-300 p-2">{role==="user"?transaction.amountRecieved : role==="host"  && transaction.type==="credit" ? transaction.amountRecieved: transaction.hostCharge}</td>
                  
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

    </div>
  );
};

export default WalletTransaction;
