import {FC, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../utils/redux/store'
import { Outlet, useNavigate } from 'react-router-dom';

interface MyComponentProps {
    children?: React.ReactNode;
  }

const ProtectedRoutes: FC<MyComponentProps>  = ({children}) => {
    const navigate=useNavigate()
    useEffect(()=>{
        if(!hostInfo?.accessToken){
            navigate('/host/login')
        }
    })

    const {hostInfo} = useSelector((state:RootState)=>state.host)
    console.log("hostInfo from ProtectedRoutes--"+ hostInfo?.accessToken )
    // console.log("Children"+JSON.stringify(JSON.parse({children})))
    return (hostInfo?.accessToken)? (<div><Outlet/></div>):<div>NO ACCESS TOKEN</div>
} 

export default ProtectedRoutes