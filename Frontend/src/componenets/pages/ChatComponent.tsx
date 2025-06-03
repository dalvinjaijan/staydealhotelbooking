import { IoSend } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../utils/axios/axiosconfig";
import { RootState } from "../../utils/redux/store";
import { IChatingUser } from "../../utils/interfaces";
import { useSocket } from "../../context/socketio";

export function ChatComponenet() {

  const { socket } = useSocket();
  const messagedivref = useRef<HTMLDivElement>(null);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [message, setMessage] = useState<string>("");
  const [typing, setTyping] = useState<{
    typer: "user" | "host";
    indicate: "typing...." | null;
  }>({ typer: "user", indicate: null });
  const [chatConverstaion, setChatConverstaion] = useState<IChatingUser | null>(
    null
  );
  const naviagte = useNavigate()
  const [online, setOnline] = useState<boolean>(false);
  const params = useParams();

  useEffect(() => {
    const fetchChat = async () => {
        try {
          console.log("chatComponent mounted")
          const response = await api.get(`/getChatOfOneToOne/${params.chatid}/user`);
          console.log("response",response.data)
          if (response) {
            setChatConverstaion(response.data.data);
            console.log("params",params)
            socket?.emit("oppositeGuysIsInOnlineOrNot", {
              userId: params.hostid,
              emitTo: userInfo?.userId,
              whom: "user"
            });
          }
        } catch (error) {
          console.error("Error fetching chat:", error);
        }
      };
    
      fetchChat();
    

   
    socket?.on("isOnline", (response) => {
      setOnline(response.online);
    });
    socket?.on("userOffline", (response) => {
      if (params.hostid === response.id) {
        setOnline(response.online);
      }
    });
    socket?.emit("join-chat", params.chatid);

    socket?.on("receivemessage", (response) => {
    
     
     if (response.response.sender==="host") { 
      socket.emit("updateMessageseen",{messageId:response.response._id})
     }
        
      
      
      setChatConverstaion((prev) => {
        if (prev && prev._id === response.response.chatId) {
          return {
            ...prev,
            messages: [...(prev.messages || []), response.response],
          };
        }
        return prev;
      });
      
    });

    socket?.on("typing", (response) => {
      if (response.typer === "host") {
        setTyping({ typer: response.typer, indicate: "typing...." });
        setTimeout(() => {
          setTyping({ typer: "user", indicate: null });
        }, 5000);
      }
    });

    socket?.on("setup", (response) => {
      console.log("setup response",response)
      if (response.id === params.hostid) {
        console.log("true online")
        setOnline(true);
      }
    });
  
    socket?.on("checkedUserIsOnlineOrNot", (response) => {
      if (!response.success) {
        toast.warning("User is Offline");
      } else {
        naviagte(`/call/${params.hostid}`); 
      }
    });

    return () => {
      socket?.off("receivemessage");
      socket?.off("join-chat");
      socket?.off("typing");
      socket?.off("isOnline");
      socket?.off("userOffline");
      socket?.off("setup");
      socket?.off("checkedUserIsOnlineOrNot");
    };
  }, [socket]);

  

  useEffect(() => {
    if (messagedivref.current) {
      messagedivref.current.scrollTop = messagedivref.current.scrollHeight;
    }
  }, [chatConverstaion?.messages]);

  const sendMessage = (
    sender: string,
    chatId: string,
    message: string,
    recieverId: string
  ) => {
    if (!message.trim()) return;
    const messageDetails = {
      sender: sender,
      chatId: chatId,
      message: message,
      recieverId: recieverId,
    };
    socket?.emit("send-message", messageDetails);
    console.log("message details",messageDetails)
    setMessage("");
  };

  const typingIndicator = () => {
    socket?.emit("isTyping", { typer: "user", chatid: params.chatid });
  };

  const checkUserisOnlinOrNotBeforeCalling = (hostid: string) => {
    socket?.emit("checkOnlineorNot", {
      userid: userInfo?.userId,
      hostid: hostid,
      checker: "user",
    });
  };

  return (
    <>
      <div className="w-[100%] md:w-[95%] h-[600px]  flex space-x-1">
        {/* chat listing */}
        <div className=" hidden w-[40%] h-[600px] animate-fadeInDownBig bg-banner-gray rounded-md flex flex-col items-center s ">
          <div className="w-[90%] h-[80px]   border-b-2 place-items-center">
            <h1 className="text-md font-dm font-medium text-center text-white mt-4">
              Chat With host
            </h1>
            <div className="h-[32px] w-[100%] flex justify-between">
              <input
                type="text"
                className="h-[32px] w-[90%] rounded-sm text-white text-sm font-sm font-semibold bg-banner-gray outline-none"
                placeholder="Search with host Name.."
                name=""
                id=""
              />
              {/* <MdCancel className="text-2xl text-gray-800 cursor-pointer"  onClick={()=>{
               
            }}/> */}
            </div>
          </div>
          <div className=" flex flex-col w-[90%] h-[530px] mt-3 space-y-2 overflow-y-scroll scrollbar-hide">
            {/* {chats.map((data, index) => (
            <div
              // onClick={() => onClickAChat(data.host._id, data._id)}
              key={index}
              className="w-[100%] h-[60px] bg-red-500 space-x-2 flex flex-shrink-0  hover:bg-slate-900 rounded-sm cursor-pointer"
            > <div className="w-[17%]  rounded-full overflow-hidden flex items-center justify-center">
                <img src={data.host.logoUrl} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="w-[60%] flex flex-col">
                <div className="w-[100%] h-[30px] ">
                  <h1 className="truncate text-white">{data.host.workshopName}</h1>
                </div>
                <div className="w-[100%] h-[30px]  ">
                  <p className=" truncate text-sm text-white">{data.newMessage?.message}</p>
                </div>

              </div>
              <div className="w-[20%] ">
                <p className="text-sm text-white tracking-tighter">{`${v.getHours()} : ${v.getMinutes()} ${v.getHours() < 12 ? "AM" : "PM"}`}</p>
              </div>
            </div>

          ))} */}
          </div>
        </div>
        {/*  end chat listing */}
        <div className="w-[100%] md:w-[60%] h-[600px]  flex flex-col animate-fadeInDownBig">
        <div className="w-[100%] h-[80px] bg-blue-300 space-x-2 flex flex-shrink-0 bg-banner-gray    rounded-sm cursor-pointer">
                {" "}
                <div className="w-[9%] ml-2 h-[65px] mt-3 bg-green rounded-full  overflow-hidden flex items-center justify-center">
              <img
                src={chatConverstaion?.host.profileImage}
                alt=""
                className="w-[90%] h-[90%] object-cover"
              />
            </div>
            <div className="w-[60%] flex flex-col">
              <div className="w-[100%] h-[30px] ">
                <h1 className="truncate text-black mt-3">
                  {chatConverstaion?.host.firstName}
                </h1>
              </div>
              <div className="w-[100%] h-[80px]">
                {online === true ? (
                  <h1 className="truncate text-green-500 text-sm mt-3 animate-pulse  ">
                    {online && !typing.indicate
                      ? "online"
                      : typing.indicate &&
                        typing.typer === "host" &&
                        typing.indicate}
                  </h1>
                ) : (
                  <h1 className="truncate text-white-400 text-sm mt-3 animate-pulse  ">
                    Offline
                  </h1>
                )}
              </div>
            </div>
            <div className="w-[30%]  flex justify-center items-center">
              {/* <MdOutlineCall
                className="text-2xl text-blue-500"
                onClick={() => {
                   if(params.hostid){
                    checkUserisOnlinOrNotBeforeCalling(params.hostid);
                   }
                }}
              /> */}
            </div>
            </div>
              <div className="w-[100%] h-[460px]  bg-gray-300">
                <div className="w-[100%] flex justify-center  bg-gradient-to-b from-gray-950 h-[460px] animate-fadeInDownBig ">
              <div
                ref={messagedivref}
                className="w-[90%] h-[460px] overflow-y-scroll scrollbar-hide mt-2 space-y-3"
              >
                {chatConverstaion?.messages &&
                  chatConverstaion?.messages.map((data, index) => (
                    <>
                      {data.sender !== "user" ? (
                        <div
                          key={index}
                          className="w-[100%] flex justify-start"
                        >
                          <div className="w-[60%] h-[]  bg-banner-gray rounded-md ">
                            <p className=" text-black break-words text-sm text-start ml-2 mt-1 mb-2 font-medium rounded-md">
                              {data.message}
                            </p>
                            <p className="text-end text-sm text-black mr-3 tracking-tighter">
                              {`${new Date(data.createdAt).toLocaleString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-[100%] flex justify-end">
                          <div className="w-[60%] h-[]  bg-brown  rounded-md ">
                            <p className=" text-black break-words text-sm text-start ml-2 mt-1 mb-2 font-medium rounded-md">
                              {data.message}
                            </p>
                            <p className="text-end text-sm text-black mr-3 tracking-tighter">
                              {`${new Date(data.createdAt).toLocaleString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}`}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ))}
              </div>
            </div>
            <div className="w-[100%] h-[50px]   flex space-x-6 ">
              <input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  typingIndicator();
                }}
                maxLength={151}
                className="w-[100%] text-black pl-3 bg-banner-gray h-[40px] rounded-md "
                placeholder="Type a message"
                type="text"
                name=""
                id=""
              />
              <IoSend
                className="text-orange text-4xl"
                onClick={() => {
                  if (chatConverstaion) {
                    sendMessage(
                      "user",
                      chatConverstaion?._id + "",
                      message,
                      chatConverstaion?.host._id
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
