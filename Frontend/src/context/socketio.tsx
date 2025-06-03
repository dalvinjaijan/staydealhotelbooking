import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../utils/redux/store";




const socketContext = createContext<{ socket: Socket | null ,online:true|false }>({ socket: null ,online:false})

// making custom hook 
export const useSocket = () => {
    return useContext(socketContext)
}


export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const { hostInfo } = useSelector((state: RootState) => state.host)
    const { userInfo } = useSelector((state: RootState) => state.user)
    const loggedUserId = userInfo?.userId ? userInfo.userId : hostInfo?.hostId
    const [online,setOnline] = useState<boolean>(false)
console.log(loggedUserId);

    useEffect(() => {
        if (loggedUserId) {
            const newSocket = io(import.meta.env.VITE_BACKEND_API,{
                query:{
                    loggedUserId:loggedUserId
                }
            })
            setOnline(true)
            setSocket(newSocket)
            console.log("socket",newSocket)
            
            return () => {
                newSocket.disconnect() 
            }
            
   
        }else{
            
            setSocket(null)
            setOnline(false)
        }
     
        
        
    }, [loggedUserId])
  
    return (<socketContext.Provider value={{ socket ,online}}>
        {children}
    </socketContext.Provider>)

}