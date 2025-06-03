import {FC, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../utils/redux/store'
import { Outlet, useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
    role?:'host';
  }

const ProtectedRoutes:React.FC<PrivateRouteProps>  = ({role}) => {
    const navigate=useNavigate()

    useEffect(()=>{
        if(!hostInfo?.accessToken){
          navigate('/host/login')
        }else if(hostInfo.role!==role){
          navigate('/host/login')
    
        }
    
      })
   

    const {hostInfo} = useSelector((state:RootState)=>state.host)
    console.log("hostInfo from ProtectedRoutes--"+ hostInfo?.accessToken )
    // console.log("Children"+JSON.stringify(JSON.parse({children})))
    return (hostInfo?.accessToken && hostInfo.role==="host")? (<div><Outlet/></div>):<div>NO ACCESS TOKEN</div>
} 

export default ProtectedRoutes