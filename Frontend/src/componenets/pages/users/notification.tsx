import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../utils/redux/store";
import { NotificationGetter } from "../../../utils/interfaces";
import { useSocket } from "../../../context/socketio";
import { api } from "../../../utils/axios/axiosconfig";

function UserNotification() {
    const { userInfo } = useSelector((state: RootState) => state.user)

    const [notification,setNotification] = useState<NotificationGetter[]|[]>([])
    const navigate = useNavigate()
    const {socket} = useSocket()
   

    useEffect(() => {
        if (userInfo?.userId) {

            const fetchNotification = async () => {
                try {
                    const id=userInfo?.userId
                  const response = await api.get(`/notificationGetter/${id}`);
                  console.log("response",response.data)
                  if (response) {
                    setNotification(response.data.notfiyData)
                  }
                } catch (error) {
                  console.error("Error fetching chat:", error);
                }
              };
            
              fetchNotification();
          

        }
    }, [])

    useEffect(()=>{
        socket?.on("gettNotification",(response)=>{
             console.log(response);
             setNotification(response.notfiyData)
        })

        return()=>{
            socket?.off("gettNotification")
        }

    },[socket])

    return (<><div className="w-[100%] md:w-[80%] h-[600px] flex flex-col   justify-between ">
        <div className="w-[60%] h-[40px] bg-banner-gray rounded-sm text-center">
            <h1 className="text-md font-semibold text-gray-200 pt-2 py-2 pl-2">Notifications</h1>
        </div>
        <div className="w-[60%]  h-[540px] space-y-2 overflow-hidden overflow-y-scroll scrollbar-hide">
            {notification.map((data, index) => (<div className="w-[100%] h-[70px] bg-banner-gray rounded-md flex " key={index}>
                <div className="w-[50%] h-[70px] flex flex-col justify-between">
                    <div className="w-[50%]  h-[30px]">
                        <h1 className="text-md font-dm font-semibold text-white pl-4 pt-2">{data.host.firstName}</h1>
                    </div>
                    <div className="w-[50%]  h-[30px]">
                    </div>
                        <p className="text-sm  font-semibold pl-4 text-gray-300 pb-4">{data.message.message}</p>
                </div>
                <div className="w-[50%] h-[70px]  flex justify-end space-x-3">
                    <div className="w-[50%] h-[70px]  place-content-center">
                        <p className="text-sm text-blue-500">{`${data.count} unread messages`}</p>
                    </div>
                    <div className="w-[40%] h-full  place-content-center pr-3">
                        <button className="w-[100%] h-[40px] bg-gray-800 text-sm text-gray-400 rounded-md font-dm font-semibold " onClick={()=>{
                          navigate(`/profile/chat/${data._id}/${data.hostId}`)
                        }}>Reply</button>
                    </div>


                </div>
            </div>))}
        </div>


    </div></>)
}

export default UserNotification