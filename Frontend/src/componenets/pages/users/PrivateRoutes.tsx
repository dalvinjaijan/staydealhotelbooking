import {FC, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../utils/redux/store'
import { Outlet, useNavigate } from 'react-router-dom';
import UserLogin from './UserLogin';

interface MyComponentProps {
    children?: React.ReactNode;
  }

const PrivateRoutes = () => {
  const navigate=useNavigate()
  const {userInfo} = useSelector((state:RootState)=>state.user)
  useEffect(()=>{
    if(!userInfo){
      navigate('/login')
    }

  })

 
    console.log("userInfo from PrivateRoutes--"+ userInfo?.accessToken )
    // console.log("Children"+JSON.stringify(JSON.parse({children})))
    return (userInfo?.accessToken)? (<div><Outlet/></div>):<UserLogin />
}

export default PrivateRoutes
