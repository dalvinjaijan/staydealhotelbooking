import { IoSend } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSocket } from "../../../context/socketio";
import { hostApi } from "../../../utils/axios/axiosconfig";
import { RootState } from "../../../utils/redux/store";
import { IChatingUser } from "../../../utils/interfaces";

function HostChatComponnent() {
  const messagedivref = useRef<HTMLDivElement>(null);
  const { hostInfo } = useSelector((state: RootState) => state.host);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const [typing, setTyping] = useState<{
    typer: "user" | "host";
    indicate: "typing...." | null;
  }>({ typer: "user", indicate: null });

  const [chatConverstaion, setChatConverstaion] = useState<IChatingUser | null>(
    null
  );
  const { socket } = useSocket();
  const [online, setOnline] = useState<boolean>(false);
  const params = useParams();

  useEffect(() => {

    const fetchChat = async () => {
        try {
          const response = await hostApi.get(`/getonetonechat/${params.chatid}`);
          console.log("response",response.data)
          if (response) {
            setChatConverstaion(response.data.data);
            socket?.emit("oppositeGuysIsInOnlineOrNot", {
              userId: params.userid,
              emitTo: hostInfo?.hostId,
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
      if (params.userid === response.id) {
        setOnline(response.online);
      }
    });
    socket?.on("setup", (response) => {
      if (params.userid === response.id) {
        setOnline(true);
      }
    });
    socket?.emit("join-chat", params.chatid);
    socket?.on("receivemessage", (response) => {
      if (response.response.sender === "user") {
        socket.emit("updateMessageseen", { messageId: response.response._id });
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
      if (response.typer === "user") {
        setTyping({ typer: response.typer, indicate: "typing...." });
        setTimeout(() => {
          setTyping({ typer: "host", indicate: null });
        }, 5000);
      }
    });

    socket?.on("setup", (response) => {
      if (response.id === params.userid) {
        setOnline(true);
      }
    });

    socket?.on("checkedUserIsOnlineOrNot", (response) => {
      if (!response.success) {
        toast.warning("User is Offline");
      } else {
        navigate(`/host/call/${params.userid}`);
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
    setMessage("");
  };

  const typingIndicator = () => {
    socket?.emit("isTyping", { typer: "host", chatid: params.chatid });
  };

  const checkUserisOnlinOrNotBeforeCalling = (userid: string) => {
    socket?.emit("checkOnlineorNot", {
      userid: userid,
      hostid: hostInfo?.hostId,
      checker: "host",
    });
  };

  return (
    <>
      <div className="w-[100%] md:w-[95%] h-[580px]     flex flex-col md:flex-row  mt-5 md:space-x-3 ">
        {/* chat listing */}
        <div className="hidden w-[40%]  h-[580px] animate-fadeInDownBig bg-banner-gray rounded-md  flex-col items-center s ">
          <div className="w-[90%] h-[80px]   border-b-2 place-items-center">
            <h1 className="text-md font-dm font-medium text-center text-white mt-4">
              Chat With Your Customer
            </h1>
            <div className="h-[32px] w-[100%] flex justify-between">
              <input
                type="text"
                className="h-[32px] w-[90%] rounded-sm text-white text-sm font-sm font-semibold bg-banner-gray outline-none"
                placeholder="Search with Customer Name.."
                name=""
                id=""
              />
              {/* <MdCancel className="text-2xl text-gray-800 cursor-pointer"  onClick={()=>{
               
            }}/> */}
            </div>
          </div>
          <div className="flex flex-col w-[90%] h-[530px] mt-3 space-y-2 overflow-y-scroll scrollbar-hide">
            {/* {chats.map((data, index) => (
              <div
                // onClick={() => onClickAChat(data.user._id, data._id)}
                key={index}
                className={`  ${
                  data._id === chatConverstaion?._id && "bg-slate-900"
                } w-[100%] h-[60px] bg-red-500 space-x-2 flex flex-shrink-0  hover:bg-slate-900 rounded-sm cursor-pointer`}
              >
                {" "}
                <div className="w-[13%] bg-blue-300 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={data.user.logoUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-[60%] flex flex-col">
                  <div className="w-[100%] h-[30px] ">
                    <h1 className="truncate text-white">{data.user.name}</h1>
                  </div>
                  <div className="w-[100%] h-[30px]  ">
                    <p className=" truncate text-sm text-white">
                      {`${data.newMessage ? data.newMessage.message : ""}`}{" "}
                    </p>
                  </div>
                </div>
                <div className="w-[20%] ">
                  <p className="text-sm text-white tracking-tighter">{`${v.getHours()} : ${v.getMinutes()} ${
                    v.getHours() < 12 ? "AM" : "PM"
                  }`}</p>
                </div>
              </div>
            ))} */}
          </div>
        </div>
        {/*  end chat listing */}
        <div
          className={`${!chatConverstaion ? "w-[100%]" : " w-[100%] md:w-[60%]"
            } h-[580px]  ${chatConverstaion
              ? "flex flex-col"
              : "flex justify-center items-center"
            } bg-banner-gray `}
        >
          {chatConverstaion ? (
            <>
              <div className="w-[100%] h-[80px] bg-blue-200 space-x-2 flex flex-shrink-0 bg-banner-gray    rounded-sm cursor-pointer">
                {" "}
                <div className="w-[9%] ml-2 h-[65px] mt-3 bg-green rounded-full  overflow-hidden flex items-center justify-center">
                  <img
                    src={chatConverstaion?.user.profileImage}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="w-[60%] flex flex-col">
                  <div className="w-[100%] h-[30px] ">
                    <h1 className="truncate text-black mt-3">
                      {chatConverstaion?.user.firstName}
                    </h1>
                  </div>
                  <div className="w-[100%] h-[80px]   ">
                    {online === true ? (
                      <h1 className="truncate text-green-500 text-sm mt-3 animate-pulse  ">
                        {online && !typing.indicate
                          ? "online"
                          : typing.indicate &&
                          typing.typer === "user" &&
                          typing.indicate}
                      </h1>
                    ) : (
                      <h1 className="truncate text-gray-200 text-sm mt-3 animate-pulse  ">
                        Offline
                      </h1>
                    )}
                  </div>
                </div>
                <div className="w-[30%]  flex justify-center items-center">
                  {/* <MdOutlineCall
                    className="text-2xl text-blue-500"
                    onClick={() => {
                      if (params.userid) {
                        checkUserisOnlinOrNotBeforeCalling(params.userid);
                      }
                    }}
                  /> */}
                </div>
              </div>
              <div className="w-[100%] h-[460px]  bg-gray-500">
                <div className="w-[100%] flex justify-center  bg-gradient-to-b from-gray-950 h-[460px] animate-fadeInDownBig ">
                  <div
                    ref={messagedivref}
                    className=" w-[90%] h-[450px] overflow-y-scroll scrollbar-hide mt-2 space-y-3"
                  >
                    {chatConverstaion?.messages ? (
                      chatConverstaion?.messages.map((data, index) => (
                        <>
                          {data.sender !== "host" ? (
                            <div
                              key={index}
                              className=" w-[100%] flex justify-start"
                            >
                              <div className="w-[60%] h-[]  bg-banner-gray rounded-md ">
                                <p className=" text-white break-words text-sm text-start ml-2 pr-2 mt-1 mb-2 font-medium rounded-md">
                                  {data.message}
                                </p>
                                <p className="text-end text-sm text-white mr-3 tracking-tighter">
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
                            <div className="w-[100%] flex justify-end ">
                              <div className="w-[60%] h-[]  bg-brown  rounded-md ">
                                <p className=" text-white break-words text-sm text-start mr-2 pl-3 mt-1 mb-2 font-medium rounded-md">
                                  {data.message}
                                </p>
                                <p className="text-end text-sm text-white mr-3 tracking-tighter">
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
                                <div className="w-[100%] h-[5px] hidden ">
                                  <p className="text-sm text-gray-500 text-end">
                                    {data.seen ? "seen" : "Not seen"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))
                    ) : (
                      <>
                        <h1 className="text-center text-gray-600">
                          {`Start Messaging ${chatConverstaion?.user.name}`}{" "}
                        </h1>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-[100%] h-[50px] bg-grey   flex space-x-6 ">
                  <input
                    value={message}
                    onChange={(e) => {
                      typingIndicator();
                      setMessage(e.target.value);
                    }}
                    maxLength={151}
                    className="w-[100%] ml-3   text-black bg-banner-gray h-[40px] rounded-md pl-3"
                    placeholder="Type a message"
                    type="text"
                    name=""
                    id=""
                  />
                  <IoSend
                    className="text-orange text-4xl cursor-pointer"
                    onClick={() => {
                      if (chatConverstaion?._id) {
                        sendMessage(
                          "host",
                          chatConverstaion?._id,
                          message,
                          chatConverstaion.user._id
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className=" text-center text-gray-400 flex flex-col items-center">
                <h1 className="text-lg font-semibold mb-2">
                  No Active Chat Selected
                </h1>
                <p className="text-sm">
                  Click on a customer's name from the list on the Any of
                  Bookings
                </p>
                <p className="mt-4 text-gray-500">
                  Build strong relationships with your customers by engaging in
                  meaningful conversations.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HostChatComponnent;
