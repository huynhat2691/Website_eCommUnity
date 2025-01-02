// import { useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import socketIO from "socket.io-client";
// import axios from "axios";
// import { backend_url, server } from "../../server";
// import { format } from "timeago.js";
// import {
//   toggleChatPopup,
//   setCurrentConversation,
// } from "../../redux/actions/chatActions";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { ScrollArea } from "../ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import {
//   ChevronDown,
//   Send,
//   Image as ImageIcon,
//   MessageSquare,
//   Search,
//   Pin,
//   Trash2,
//   X,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";

// const ENDPOINT = "http://localhost:5001/";
// let socket;

// const ChatPopup = () => {
//   const dispatch = useDispatch();
//   const { isOpen, currentConversation } = useSelector((state) => state.chat);
//   const { user } = useSelector((state) => state.user);
//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [receiverInfos, setReceiverInfos] = useState({});
//   const scrollAreaRef = useRef(null);
//   const [images, setImages] = useState();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [pinnedConversations, setPinnedConversations] = useState([]);
//   const [isVisible, setIsVisible] = useState(false);
//   const [arrivalMessage, setArrivalMessage] = useState(null);

//   useEffect(() => {
//     socket = socketIO(ENDPOINT, { transports: ["websocket"] });

//     if (user?._id) {
//       socket.emit("addUser", user._id);
//       socket.on("getUsers", (users) => {
//         setOnlineUsers(users);
//       });
//       socket.on("getMessage", (data) => {
//         setArrivalMessage({
//           sender: data.senderId,
//           text: data.text,
//           images: data.images,
//           createdAt: Date.now(),
//         });
//       });
//     }

//     return () => {
//       socket.off("getUsers");
//       socket.off("getMessage");
//       socket.disconnect();
//     };
//   }, [user]);

//   useEffect(() => {
//     if (
//       arrivalMessage &&
//       currentConversation?.members?.includes(arrivalMessage.sender)
//     ) {
//       setMessages((prev) => [...prev, arrivalMessage]);
//     }
//   }, [arrivalMessage, currentConversation]);

//   useEffect(() => {
//     if (isOpen && user) {
//       fetchConversations();
//     }
//   }, [isOpen, user]);

//   useEffect(() => {
//     if (currentConversation) {
//       fetchMessages();
//       const conversationElement = document.getElementById(
//         `conversation-${currentConversation._id}`
//       );
//       if (conversationElement) {
//         conversationElement.scrollIntoView({ behavior: "smooth" });
//       }
//     }
//   }, [currentConversation]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (isOpen) {
//       setIsVisible(true);
//     } else {
//       setTimeout(() => setIsVisible(false), 300);
//     }
//   }, [isOpen]);

//   const fetchConversations = async () => {
//     try {
//       const response = await axios.get(
//         `${server}/conversation/get-all-user-conversation/${user._id}`,
//         {
//           withCredentials: true,
//         }
//       );
//       setConversations(response.data.conversations);
//     } catch (error) {
//       console.error("Error fetching conversations:", error);
//     }
//   };

//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get(
//         `${server}/message/get-all-messages/${currentConversation._id}`,
//         {
//           withCredentials: true,
//         }
//       );
//       setMessages(response.data.messages);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === "" && !images) return;

//     const receiverId = currentConversation.members.find(
//       (member) => member !== user._id
//     );

//     const message = {
//       sender: user._id,
//       text: newMessage,
//       conversationId: currentConversation._id,
//       images: images,
//     };

//     socket.emit("sendMessage", {
//       senderId: user._id,
//       receiverId,
//       text: newMessage,
//       images: images,
//     });

//     try {
//       const res = await axios.post(
//         `${server}/message/create-new-message`,
//         message
//       );
//       setMessages([...messages, res.data.message]);
//       setNewMessage("");
//       setImages(null);
//       await updateLastMessage();
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImages(null);
//   };

//   const updateLastMessage = async () => {
//     socket.emit("updateLastMessage", {
//       lastMessage: newMessage || "Đã gửi một hình ảnh",
//       lastMessageId: user._id,
//     });

//     try {
//       await axios.put(
//         `${server}/conversation/update-last-message/${currentConversation._id}`,
//         {
//           lastMessage: newMessage || "Đã gửi một hình ảnh",
//           lastMessageId: user._id,
//         }
//       );
//     } catch (error) {
//       console.error("Error updating last message:", error);
//     }
//   };

//   const scrollToBottom = () => {
//     if (scrollAreaRef.current) {
//       const scrollContainer = scrollAreaRef.current.querySelector(
//         "[data-radix-scroll-area-viewport]"
//       );
//       if (scrollContainer) {
//         scrollContainer.scrollTop = scrollContainer.scrollHeight;
//       }
//     }
//   };

//   const getReceiverInfo = async (conversation) => {
//     const recipientId = conversation.members.find((m) => m !== user._id);
//     if (receiverInfos[recipientId]) return receiverInfos[recipientId];

//     try {
//       const res = await axios.get(
//         `${server}/shop/get-shop-info/${recipientId}`
//       );
//       const recipient = res.data.shop;
//       const info = {
//         name: recipient?.name || "Unknown",
//         avatar: recipient?.avatar || "",
//       };
//       setReceiverInfos((prev) => ({ ...prev, [recipientId]: info }));
//       return info;
//     } catch (error) {
//       console.error("Error fetching recipient info:", error);
//       return {
//         name: "Unknown",
//         avatar: "",
//       };
//     }
//   };

//   const getAvatarSrc = (avatar) => {
//     if (avatar && avatar.startsWith("data:image")) {
//       return avatar;
//     } else if (avatar) {
//       return `${backend_url}${avatar}`;
//     }
//     return "";
//   };

//   useEffect(() => {
//     conversations.forEach((conv) => {
//       const recipientId = conv.members.find((m) => m !== user._id);
//       if (!receiverInfos[recipientId]) {
//         getReceiverInfo(conv);
//       }
//     });
//   }, [conversations]);

//   const onlineCheck = (chat) => {
//     const chatMember = chat.members.find((member) => member !== user._id);
//     const online = onlineUsers.find((user) => user.userId === chatMember);
//     return online ? true : false;
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     const base64 = await convertToBase64(file);
//     setImages(base64);
//   };

//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const handlePinConversation = (conversationId) => {
//     setPinnedConversations((prev) => [...prev, conversationId]);
//   };

//   const handleUnpinConversation = (conversationId) => {
//     setPinnedConversations((prev) =>
//       prev.filter((id) => id !== conversationId)
//     );
//   };

//   const handleDeleteConversation = async (conversationId) => {
//     try {
//       await axios.delete(
//         `${server}/conversation/delete-conversation/${conversationId}`
//       );
//       setConversations((prev) =>
//         prev.filter((conv) => conv._id !== conversationId)
//       );
//     } catch (error) {
//       console.error("Error deleting conversation:", error);
//     }
//   };

//   const filteredConversations = conversations.filter((conv) => {
//     const receiverId = conv.members.find((m) => m !== user._id);
//     const receiverInfo = receiverInfos[receiverId] || { name: "" };
//     return receiverInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   const sortedConversations = [...filteredConversations].sort((a, b) => {
//     if (
//       pinnedConversations.includes(a._id) &&
//       !pinnedConversations.includes(b._id)
//     )
//       return -1;
//     if (
//       !pinnedConversations.includes(a._id) &&
//       pinnedConversations.includes(b._id)
//     )
//       return 1;
//     return 0;
//   });

//   if (!isVisible && !isOpen) {
//     return (
//       <Button
//         className="fixed bottom-5 right-24 bg-[#27b3e2] text-white rounded-md shadow-lg"
//         onClick={() => dispatch(toggleChatPopup())}
//       >
//         <div className="font-[500] flex items-center">
//           <MessageSquare strokeWidth={3} size={20} />
//           <p className="ml-2 text-[20px]">Chat</p>
//         </div>
//       </Button>
//     );
//   }

//   return (
//     <div className="fixed bottom-4 right-24 z-20 w-[600px] h-[600px] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden transition-all duration-300 ease-in-out ">
//       <div className="p-1 px-4 bg-[#27b3e2] text-white rounded-t-md flex justify-between items-center">
//         <h3 className="font-bold">Chat</h3>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => dispatch(toggleChatPopup())}
//         >
//           <ChevronDown className="h-4 w-4" />
//         </Button>
//       </div>
//       <div className="flex-grow flex">
//         <div className="w-2/5 border-r flex flex-col">
//           <div className="p-2">
//             <Input
//               type="text"
//               placeholder="Tìm kiếm"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               startAdornment={<Search className="h-4 w-4 text-gray-500" />}
//             />
//           </div>
//           <ScrollArea className="flex-grow">
//             {sortedConversations.map((conv) => {
//               const receiverId = conv.members.find((m) => m !== user._id);
//               const receiverInfo = receiverInfos[receiverId] || {
//                 name: "Loading...",
//                 avatar: "",
//               };
//               return (
//                 <div
//                   key={conv._id}
//                   id={`conversation-${conv._id}`}
//                   className="p-2 hover:bg-gray-100 cursor-pointer relative"
//                 >
//                   <div
//                     className="flex items-center space-x-2"
//                     onClick={() => dispatch(setCurrentConversation(conv))}
//                   >
//                     <Avatar>
//                       <AvatarImage
//                         className="object-cover"
//                         src={getAvatarSrc(receiverInfo.avatar)}
//                         alt={receiverInfo.name}
//                       />
//                       <AvatarFallback>
//                         {receiverInfo.name.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center">
//                         <p className="text-sm font-medium truncate mr-1">
//                           {receiverInfo.name}
//                         </p>
//                         {pinnedConversations.includes(conv._id) && (
//                           <Pin className="h-3 w-3 text-gray-500" />
//                         )}
//                       </div>
//                       <p className="text-xs text-gray-500 truncate">
//                         {conv.lastMessage}
//                       </p>
//                     </div>
//                     {onlineCheck(conv) && (
//                       <div className="w-2 h-2 bg-green-500 rounded-full" />
//                     )}
//                   </div>
//                   <DropdownMenu modal={false}>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="absolute right-2 top-2"
//                       >
//                         <ChevronDown className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                       {pinnedConversations.includes(conv._id) ? (
//                         <DropdownMenuItem
//                           onSelect={() => handleUnpinConversation(conv._id)}
//                         >
//                           <Pin className="mr-2 h-4 w-4" /> Bỏ ghim
//                         </DropdownMenuItem>
//                       ) : (
//                         <DropdownMenuItem
//                           onSelect={() => handlePinConversation(conv._id)}
//                         >
//                           <Pin className="mr-2 h-4 w-4" /> Ghim
//                         </DropdownMenuItem>
//                       )}
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <DropdownMenuItem
//                             onSelect={(e) => e.preventDefault()}
//                           >
//                             <Trash2 className="mr-2 h-4 w-4" /> Xóa
//                           </DropdownMenuItem>
//                         </DialogTrigger>
//                         <DialogContent>
//                           <DialogHeader>
//                             <DialogTitle>Xác nhận xóa</DialogTitle>
//                             <DialogDescription>
//                               Bạn có chắc chắn muốn xóa cuộc trò chuyện này?
//                             </DialogDescription>
//                           </DialogHeader>
//                           <DialogFooter>
//                             <Button variant="outline" onClick={() => {}}>
//                               Hủy
//                             </Button>
//                             <Button
//                               variant="destructive"
//                               onClick={() => handleDeleteConversation(conv._id)}
//                             >
//                               Xóa
//                             </Button>
//                           </DialogFooter>
//                         </DialogContent>
//                       </Dialog>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               );
//             })}
//           </ScrollArea>
//         </div>
//         <div className="w-3/5 flex flex-col">
//           {currentConversation ? (
//             <>
//               <div className="p-2 border-b">
//                 <DropdownMenu modal={false}>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="w-full justify-between">
//                       <div className="flex items-center">
//                         <Avatar className="mr-2">
//                           <AvatarImage
//                             className="object-cover"
//                             src={getAvatarSrc(
//                               receiverInfos[
//                                 currentConversation.members.find(
//                                   (m) => m !== user._id
//                                 )
//                               ]?.avatar
//                             )}
//                             alt={
//                               receiverInfos[
//                                 currentConversation.members.find(
//                                   (m) => m !== user._id
//                                 )
//                               ]?.name
//                             }
//                           />
//                           <AvatarFallback>
//                             {receiverInfos[
//                               currentConversation.members.find(
//                                 (m) => m !== user._id
//                               )
//                             ]?.name.charAt(0)}
//                           </AvatarFallback>
//                         </Avatar>
//                         {
//                           receiverInfos[
//                             currentConversation.members.find(
//                               (m) => m !== user._id
//                             )
//                           ]?.name
//                         }
//                       </div>
//                       <ChevronDown className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="z-[1000]">
//                     <DropdownMenuItem>
//                       <a
//                         href={`/shop/preview/${currentConversation.members.find(
//                           (m) => m !== user._id
//                         )}`}
//                       >
//                         Thông tin cá nhân
//                       </a>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//               <ScrollArea
//                 className="flex-grow p-4 h-[350px]"
//                 ref={scrollAreaRef}
//               >
//                 {messages.map((msg, index) => {
//                   const isSender = msg.sender === user._id;
//                   return (
//                     <div
//                       key={msg._id || index}
//                       className={`mb-4 flex ${
//                         isSender ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       {!isSender && (
//                         <Avatar className="mr-2">
//                           <AvatarImage
//                             className="object-cover"
//                             src={getAvatarSrc(
//                               receiverInfos[
//                                 currentConversation.members.find(
//                                   (m) => m !== user._id
//                                 )
//                               ]?.avatar
//                             )}
//                             alt={
//                               receiverInfos[
//                                 currentConversation.members.find(
//                                   (m) => m !== user._id
//                                 )
//                               ]?.name
//                             }
//                           />
//                           <AvatarFallback>
//                             {receiverInfos[
//                               currentConversation.members.find(
//                                 (m) => m !== user._id
//                               )
//                             ]?.name.charAt(0)}
//                           </AvatarFallback>
//                         </Avatar>
//                       )}
//                       <div
//                         className={`max-w-[70%] ${
//                           isSender ? "text-right" : "text-left"
//                         }`}
//                       >
//                         <div
//                           className={`inline-block rounded-lg ${
//                             isSender
//                               ? "bg-[#27b3e2] p-2  text-white"
//                               : " p-2 bg-gray-200"
//                           }`}
//                         >
//                           {msg.text}
//                           {msg.images && (
//                             <img
//                               src={msg.images}
//                               alt="Sent"
//                               className="max-w-[150px] rounded"
//                             />
//                           )}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {format(msg.createdAt)}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </ScrollArea>
//               <form onSubmit={handleSendMessage} className="p-2 border-t">
//                 <div className="mb-2 relative">
//                   {images && (
//                     <div className="relative inline-block">
//                       <img
//                         src={images}
//                         alt="To be sent"
//                         className="max-w-[50px] rounded"
//                       />
//                       <button
//                         type="button"
//                         onClick={handleRemoveImage}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                       >
//                         <X size={12} />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex items-center">
//                   <Input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     className="flex-grow mr-2 !border-none"
//                     placeholder="Nhập nội dung tin nhắn"
//                   />
//                   <Input
//                     type="file"
//                     id="image"
//                     className="hidden"
//                     onChange={handleImageUpload}
//                   />
//                   <label
//                     htmlFor="image"
//                     className="mr-2 cursor-pointer hover:bg-gray-100 p-2 rounded-full"
//                   >
//                     <ImageIcon className="h-5 w-5 text-gray-600" />
//                   </label>
//                   <Button
//                     type="submit"
//                     size="icon"
//                     variant="ghost"
//                     className="p-2 rounded-full"
//                   >
//                     <Send className="h-5 w-5 text-gray-600" />
//                   </Button>
//                 </div>
//               </form>
//             </>
//           ) : (
//             <div className="flex-grow flex flex-col items-center justify-center">
//               <p className="text-gray-500">Chọn một cuộc trò chuyện</p>
//               <p className="text-gray-500">để bắt đầu trò chuyện</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPopup;
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import socketIO from "socket.io-client";
import axios from "axios";
import { backend_url, server } from "../../server";
import { format } from "timeago.js";
import {
  toggleChatPopup,
  setCurrentConversation,
} from "../../redux/actions/chatActions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ChevronDown,
  Send,
  Image as ImageIcon,
  MessageSquare,
  Search,
  Pin,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const ENDPOINT = "http://localhost:5001/";
let socket;

const ChatPopup = () => {
  const dispatch = useDispatch();
  const { isOpen, currentConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receiverInfos, setReceiverInfos] = useState({});
  const scrollAreaRef = useRef(null);
  const [images, setImages] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [pinnedConversations, setPinnedConversations] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
    if (user?._id) {
      socket.emit("addUser", user._id);
      socket.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
      socket.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          images: data.images,
          createdAt: Date.now(),
        });
      });
      socket.on("getLastMessage", (data) => {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === data.conversationId
              ? { ...conv, lastMessage: data.lastMessage }
              : conv
          )
        );
      });
    }
    return () => {
      socket.off("getUsers");
      socket.off("getMessage");
      socket.off("getLastMessage");
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentConversation?.members?.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `${server}/conversation/get-all-user-conversation/${user._id}`,
        {
          withCredentials: true,
        }
      );
      setConversations(response.data.conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${server}/message/get-all-messages/${currentConversation._id}`,
        {
          withCredentials: true,
        }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchConversations();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages();
      const conversationElement = document.getElementById(
        `conversation-${currentConversation._id}`
      );
      if (conversationElement) {
        conversationElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" && !images) return;
    const receiverId = currentConversation.members.find(
      (member) => member !== user._id
    );
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentConversation._id,
      images: images,
    };
    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
      images: images,
    });
    try {
      const res = await axios.post(
        `${server}/message/create-new-message`,
        message
      );
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage("");
      setImages(null);
      await updateLastMessage();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleRemoveImage = () => {
    setImages(null);
  };

  const updateLastMessage = async () => {
    const lastMessageText = newMessage || "Đã gửi một hình ảnh";
    socket.emit("updateLastMessage", {
      lastMessage: lastMessageText,
      lastMessageId: user._id,
    });
    try {
      await axios.put(
        `${server}/conversation/update-last-message/${currentConversation._id}`,
        {
          lastMessage: lastMessageText,
          lastMessageId: user._id,
        }
      );
      // Cập nhật state của conversations
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === currentConversation._id
            ? { ...conv, lastMessage: lastMessageText }
            : conv
        )
      );
    } catch (error) {
      console.error("Error updating last message:", error);
    }
  };

  useEffect(() => {
    if (arrivalMessage) {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.members.includes(arrivalMessage.sender)) {
            return {
              ...conv,
              lastMessage: arrivalMessage.text || "Đã gửi một hình ảnh",
            };
          }
          return conv;
        })
      );
    }
  }, [arrivalMessage]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const getReceiverInfo = async (conversation) => {
    const recipientId = conversation.members.find((m) => m !== user._id);
    if (receiverInfos[recipientId]) return receiverInfos[recipientId];

    try {
      const res = await axios.get(
        `${server}/shop/get-shop-info/${recipientId}`
      );
      const recipient = res.data.shop;
      const info = {
        name: recipient?.name || "Unknown",
        avatar: recipient?.avatar || "",
      };
      setReceiverInfos((prev) => ({ ...prev, [recipientId]: info }));
      return info;
    } catch (error) {
      console.error("Error fetching recipient info:", error);
      return {
        name: "Unknown",
        avatar: "",
      };
    }
  };

  const getAvatarSrc = (avatar) => {
    if (avatar && avatar.startsWith("data:image")) {
      return avatar;
    } else if (avatar) {
      return `${backend_url}${avatar}`;
    }
    return "";
  };

  useEffect(() => {
    conversations.forEach((conv) => {
      const recipientId = conv.members.find((m) => m !== user._id);
      if (!receiverInfos[recipientId]) {
        getReceiverInfo(conv);
      }
    });
  }, [conversations]);

  const onlineCheck = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setImages(base64);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePinConversation = (conversationId) => {
    setPinnedConversations((prev) => [...prev, conversationId]);
  };

  const handleUnpinConversation = (conversationId) => {
    setPinnedConversations((prev) =>
      prev.filter((id) => id !== conversationId)
    );
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await axios.delete(
        `${server}/conversation/delete-conversation/${conversationId}`
      );
      setConversations((prev) =>
        prev.filter((conv) => conv._id !== conversationId)
      );
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const receiverId = conv.members.find((m) => m !== user._id);
    const receiverInfo = receiverInfos[receiverId] || { name: "" };
    return receiverInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (
      pinnedConversations.includes(a._id) &&
      !pinnedConversations.includes(b._id)
    )
      return -1;
    if (
      !pinnedConversations.includes(a._id) &&
      pinnedConversations.includes(b._id)
    )
      return 1;
    return 0;
  });

  if (!isVisible && !isOpen) {
    return (
      <Button
        className="fixed bottom-5 right-24 bg-[#27b3e2] text-white rounded-md shadow-lg"
        onClick={() => dispatch(toggleChatPopup())}
      >
        <div className="font-[500] flex items-center">
          <MessageSquare strokeWidth={3} size={20} />
          <p className="ml-2 text-[20px]">Chat</p>
        </div>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-24 z-20 w-[600px] h-[600px] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden transition-all duration-300 ease-in-out ">
      <div className="p-1 px-4 bg-[#27b3e2] text-white rounded-t-md flex justify-between items-center">
        <h3 className="font-bold">Chat</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleChatPopup())}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-grow flex">
        <div className="w-2/5 border-r flex flex-col">
          <div className="p-2">
            <Input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startAdornment={<Search className="h-4 w-4 text-gray-500" />}
            />
          </div>
          <ScrollArea className="flex-grow">
            {sortedConversations.map((conv) => {
              const receiverId = conv.members.find((m) => m !== user._id);
              const receiverInfo = receiverInfos[receiverId] || {
                name: "Loading...",
                avatar: "",
              };
              return (
                <div
                  key={conv._id}
                  id={`conversation-${conv._id}`}
                  className="p-2 hover:bg-gray-100 cursor-pointer relative"
                >
                  <div
                    className="flex items-center space-x-2"
                    onClick={() => dispatch(setCurrentConversation(conv))}
                  >
                    <Avatar>
                      <AvatarImage
                        className="object-cover"
                        src={getAvatarSrc(receiverInfo.avatar)}
                        alt={receiverInfo.name}
                      />
                      <AvatarFallback>
                        {receiverInfo.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium truncate mr-1">
                          {receiverInfo.name}
                        </p>
                        {pinnedConversations.includes(conv._id) && (
                          <Pin className="h-3 w-3 text-gray-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {onlineCheck(conv) && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {pinnedConversations.includes(conv._id) ? (
                        <DropdownMenuItem
                          onSelect={() => handleUnpinConversation(conv._id)}
                        >
                          <Pin className="mr-2 h-4 w-4" /> Bỏ ghim
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onSelect={() => handlePinConversation(conv._id)}
                        >
                          <Pin className="mr-2 h-4 w-4" /> Ghim
                        </DropdownMenuItem>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Xác nhận xóa</DialogTitle>
                            <DialogDescription>
                              Bạn có chắc chắn muốn xóa cuộc trò chuyện này?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {}}>
                              Hủy
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteConversation(conv._id)}
                            >
                              Xóa
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </ScrollArea>
        </div>
        <div className="w-3/5 flex flex-col">
          {currentConversation ? (
            <>
              <div className="p-2 border-b">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center">
                        <Avatar className="mr-2">
                          <AvatarImage
                            className="object-cover"
                            src={getAvatarSrc(
                              receiverInfos[
                                currentConversation.members.find(
                                  (m) => m !== user._id
                                )
                              ]?.avatar
                            )}
                            alt={
                              receiverInfos[
                                currentConversation.members.find(
                                  (m) => m !== user._id
                                )
                              ]?.name
                            }
                          />
                          <AvatarFallback>
                            {receiverInfos[
                              currentConversation.members.find(
                                (m) => m !== user._id
                              )
                            ]?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {
                          receiverInfos[
                            currentConversation.members.find(
                              (m) => m !== user._id
                            )
                          ]?.name
                        }
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-[1000]">
                    <DropdownMenuItem>
                      <a
                        href={`/shop/preview/${currentConversation.members.find(
                          (m) => m !== user._id
                        )}`}
                      >
                        Thông tin cá nhân
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ScrollArea
                className="flex-grow p-4 h-[350px]"
                ref={scrollAreaRef}
              >
                {messages.map((msg, index) => {
                  const isSender = msg.sender === user._id;
                  return (
                    <div
                      key={msg._id || index}
                      className={`mb-4 flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isSender && (
                        <Avatar className="mr-2">
                          <AvatarImage
                            className="object-cover"
                            src={getAvatarSrc(
                              receiverInfos[
                                currentConversation.members.find(
                                  (m) => m !== user._id
                                )
                              ]?.avatar
                            )}
                            alt={
                              receiverInfos[
                                currentConversation.members.find(
                                  (m) => m !== user._id
                                )
                              ]?.name
                            }
                          />
                          <AvatarFallback>
                            {receiverInfos[
                              currentConversation.members.find(
                                (m) => m !== user._id
                              )
                            ]?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[200px] ${
                          isSender ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block rounded-lg break-words ${
                            isSender
                              ? "bg-[#27b3e2] p-2 text-white"
                              : "p-2 bg-gray-200"
                          } break-words`}
                        >
                          <div className="overflow-hidden">
                            <p className="break-words whitespace-pre-wrap">
                              {msg.text}
                            </p>
                          </div>
                          {msg.images && (
                            <img
                              src={msg.images}
                              alt="Sent"
                              className="max-w-[150px] rounded"
                            />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {format(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="p-2 border-t">
                <div className="mb-2 relative">
                  {images && (
                    <div className="relative inline-block">
                      <img
                        src={images}
                        alt="To be sent"
                        className="max-w-[50px] rounded"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow mr-2 !border-none"
                    placeholder="Nhập nội dung tin nhắn"
                  />
                  <Input
                    type="file"
                    id="image"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="image"
                    className="mr-2 cursor-pointer hover:bg-gray-100 p-2 rounded-full"
                  >
                    <ImageIcon className="h-5 w-5 text-gray-600" />
                  </label>
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="p-2 rounded-full"
                  >
                    <Send className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center">
              <p className="text-gray-500">Chọn một cuộc trò chuyện</p>
              <p className="text-gray-500">để bắt đầu trò chuyện</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
