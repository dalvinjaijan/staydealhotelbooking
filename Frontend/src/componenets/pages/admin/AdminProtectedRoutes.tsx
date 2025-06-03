import {FC, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../utils/redux/store'
import { Outlet, useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
    role?:'admin';
  }

const AdminProtectedRoutes:React.FC<PrivateRouteProps> = ({role}) => {
    const navigate=useNavigate()
    useEffect(()=>{
        if(!adminInfo?.accessToken){
            navigate('/admin/login')
        }else if(adminInfo.role!==role){
            navigate('/admin/login')
        }
    })

    const {adminInfo} = useSelector((state:RootState)=>state.admin)
    console.log("adminInfo from AdminProtectedRoutes--"+ adminInfo?.accessToken )
    // console.log("Children"+JSON.stringify(JSON.parse({children})))
    return (adminInfo?.accessToken && adminInfo.role==="admin")? (<div><Outlet/></div>):<div>NO ACCESS TOKEN</div>
}

export default AdminProtectedRoutes