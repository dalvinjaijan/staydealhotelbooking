import {FC, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../utils/redux/store'
import { Outlet, useNavigate } from 'react-router-dom';

interface MyComponentProps {
    children?: React.ReactNode;
  }

const AdminProtectedRoutes: FC<MyComponentProps>  = ({children}) => {
    const navigate=useNavigate()
    useEffect(()=>{
        if(!adminInfo?.accessToken){
            navigate('/admin/login')
        }
    })

    const {adminInfo} = useSelector((state:RootState)=>state.admin)
    console.log("adminInfo from AdminProtectedRoutes--"+ adminInfo?.accessToken )
    // console.log("Children"+JSON.stringify(JSON.parse({children})))
    return (adminInfo?.accessToken)? (<div><Outlet/></div>):<div>NO ACCESS TOKEN</div>
}

export default AdminProtectedRoutes