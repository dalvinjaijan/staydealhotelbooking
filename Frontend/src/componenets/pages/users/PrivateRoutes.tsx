import {FC, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../utils/redux/store'
import { Outlet, useNavigate } from 'react-router-dom';
import UserLogin from './UserLogin';

interface PrivateRouteProps {
    role?:'user';
  }

const PrivateRoutes :React.FC<PrivateRouteProps>= ({role}) => {
  const navigate=useNavigate()
  const {userInfo} = useSelector((state:RootState)=>state.user)
  useEffect(()=>{
    if(!userInfo){
      navigate('/login')
    }else if(userInfo.role!==role){
      navigate('/login')

    }

  })

 
    console.log("userInfo from PrivateRoutes--"+ userInfo?.accessToken )
    // console.log("Children"+JSON.stringify(JSON.parse({children})))
    return (userInfo?.accessToken && userInfo.role==="user") ? (<div><Outlet/></div>):<UserLogin />
}

export default PrivateRoutes
