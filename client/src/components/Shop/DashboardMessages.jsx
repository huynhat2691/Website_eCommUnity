/* eslint-disable react/prop-types */

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { backend_url, server } from "../../server";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Image, SendHorizonal, ChevronDown, Pin, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "react-toastify";

const ENDPOINT = "http://localhost:5001/";
let socket;

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [conversationsUpdate, setConversationsUpdate] = useState(0);
  const [images, setImages] = useState(null);
  const [pinnedConversations, setPinnedConversations] = useState([]);

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    if (seller) {
      socket.emit("addUser", seller._id);
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
    }

    return () => {
      socket.off("getUsers");
      socket.off("getMessage");
      socket.disconnect();
    };
  }, [seller]);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members?.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-seller-conversation/${seller?._id}`,
          {
            withCredentials: true,
          }
        );
        setConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    if (seller) {
      getConversations();
    }
  }, [seller, conversationsUpdate]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const response = await axios.get(
            `${server}/message/get-all-messages/${currentChat._id}`
          );
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" && !images) return;

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
      images: images,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socket.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
      images: images,
    });

    try {
      const res = await axios.post(
        `${server}/message/create-new-message`,
        message
      );
      setMessages([...messages, res.data.message]);
      setNewMessage("");
      setImages(null);
      await updateLastMessage();
      setConversationsUpdate((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socket.emit("updateLastMessage", {
      lastMessage: newMessage || "Đã gửi một hình ảnh",
      lastMessageId: seller._id,
    });

    try {
      await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: newMessage || "Đã gửi một hình ảnh",
          lastMessageId: seller._id,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onlineCheck = (chat) => {
    const chatMember = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return !!online;
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

  const getAvatarSrc = (avatar) => {
    if (avatar && avatar.startsWith("data:image")) {
      return avatar;
    } else if (avatar) {
      return `${backend_url}${avatar}`;
    }
    return "";
  };

  const handlePinConversation = (conversationId) => {
    if (pinnedConversations.includes(conversationId)) {
      setPinnedConversations(
        pinnedConversations.filter((id) => id !== conversationId)
      );
    } else {
      setPinnedConversations([...pinnedConversations, conversationId]);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      const response = await axios.delete(
        `${server}/conversation/delete-conversation/${conversationId}`
      );

      if (response.data.success) {
        setConversations(
          conversations.filter((conv) => conv._id !== conversationId)
        );
        if (currentChat?._id === conversationId) {
          setCurrentChat(null);
          setMessages([]);
        }
        // Thông báo xóa thành công
        toast.success("Cuộc trò chuyện đã được xóa thành công");
      } else {
        throw new Error(
          response.data.message || "Không thể xóa cuộc trò chuyện"
        );
      }
    } catch (error) {
      console.error("Lỗi khi xóa cuộc trò chuyện:", error);
      toast.error("Lỗi khi xóa cuộc trò chuyện: " + error.message);
    }
  };

  return (
    <Card className="w-full m-4 h-[51rem]">
      <CardContent className="p-0 flex">
        <div className="w-1/3 border-r">
          <CardHeader className="bg-[#00a8ff] text-white">
            <CardTitle className="text-center text-2xl">
              Danh sách tin nhắn
            </CardTitle>
          </CardHeader>

          <ScrollArea className="h-[calc(100%-4rem)]">
            {conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full p-6">
                <p className="text-2xl">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              <>
                {pinnedConversations.map((pinnedId) => {
                  const pinnedConv = conversations.find(
                    (conv) => conv._id === pinnedId
                  );
                  if (pinnedConv) {
                    return (
                      <MessageList
                        key={pinnedConv._id}
                        data={pinnedConv}
                        setCurrentChat={setCurrentChat}
                        me={seller._id}
                        setUserData={setUserData}
                        online={onlineCheck(pinnedConv)}
                        setActiveStatus={setActiveStatus}
                        getAvatarSrc={getAvatarSrc}
                        isPinned={true}
                        onPin={handlePinConversation}
                        onDelete={handleDeleteConversation}
                        isActive={currentChat?._id === pinnedConv._id}
                      />
                    );
                  }
                  return null;
                })}
                {conversations
                  .filter((conv) => !pinnedConversations.includes(conv._id))
                  .map((item) => (
                    <MessageList
                      key={item._id}
                      data={item}
                      setCurrentChat={setCurrentChat}
                      me={seller._id}
                      setUserData={setUserData}
                      online={onlineCheck(item)}
                      setActiveStatus={setActiveStatus}
                      getAvatarSrc={getAvatarSrc}
                      isPinned={false}
                      onPin={handlePinConversation}
                      onDelete={handleDeleteConversation}
                      isActive={currentChat?._id === item._id}
                    />
                  ))}
              </>
            )}
          </ScrollArea>
        </div>

        <div className="w-2/3">
          {currentChat ? (
            <SellerInbox
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessageHandler={sendMessageHandler}
              messages={messages}
              sellerId={seller._id}
              userData={userData}
              activeStatus={activeStatus}
              handleImageUpload={handleImageUpload}
              getAvatarSrc={getAvatarSrc}
              images={images}
              setImages={setImages}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-2xl text-gray-400">
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MessageList = ({
  data,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
  getAvatarSrc,
  isPinned,
  onPin,
  onDelete,
  isActive,
}) => {
  const [user, setUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const userId = data.members.find((user) => user !== me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [me, data]);

  const handleClick = () => {
    setCurrentChat(data);
    setUserData(user);
    setActiveStatus(online);
  };

  const handleDelete = () => {
    onDelete(data._id);
    setIsDialogOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-between border-b ${
        isActive ? "bg-gray-100" : ""
      }`}
    >
      <Button
        variant="ghost"
        className="flex-grow h-[4rem] justify-start p-3"
        onClick={handleClick}
      >
        <Avatar className="w-12 h-12 mr-3 ">
          <AvatarImage
            src={getAvatarSrc(user?.avatar)}
            className="object-cover"
          />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="font-semibold flex items-center">
            {user?.name}
            {isPinned && <Pin className="ml-2 h-4 w-4" />}
          </p>
          <p className="text-sm text-muted-foreground truncate w-40">
            {data.lastMessage || "Bắt đầu cuộc trò chuyện"}
          </p>
        </div>
        {online && (
          <div className="w-3 h-3 bg-green-500 rounded-full ml-auto mr-2" />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => onPin(data._id)}
              className="p-2 flex items-center justify-start"
            >
              {isPinned ? "Bỏ ghim" : "Ghim"} tin nhắn
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setIsDialogOpen(true)}
              className="p-2 flex items-center justify-start"
            >
              <span className="text-red-500 ">Xóa tin nhắn</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SellerInbox = ({
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
  getAvatarSrc,
  images,
  setImages,
}) => {
  const scrollAreaRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const lastChild = scrollAreaRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [messages]);

  const handleRemoveImage = () => {
    setImages(null);
  };

  return (
    <div className="flex flex-col h-[810px]">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 bg-[#00a8ff] text-white">
        <div className="flex items-center">
          <Avatar className="w-12 h-12 mr-3">
            <AvatarImage
              src={getAvatarSrc(userData?.avatar)}
              className="object-cover"
            />
            <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{userData?.name}</p>
            <p className="text-sm text-muted-foreground">
              {activeStatus ? "Đang hoạt động" : "Ngoại tuyến"}
            </p>
          </div>
        </div>
      </div>

      {/* ScrollArea */}
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-grow p-3 overflow-y-auto "
      >
        {messages &&
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex w-full my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
            >
              {item.sender !== sellerId && (
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage
                    src={getAvatarSrc(userData?.avatar)}
                    className="object-cover"
                  />
                  <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col ${
                  item.sender === sellerId ? "items-end" : "items-start"
                }`}
              >
                {item.images && (
                  <img
                    src={item.images}
                    alt=""
                    className="max-w-[300px] object-cover rounded-[10px] mb-1"
                  />
                )}

                {item.text !== "" && (
                  <div
                    className={`p-2 rounded-xl ${
                      item.sender === sellerId
                        ? "bg-[#27b3e2] text-white"
                        : "bg-[#d7dce2] text-black"
                    }`}
                  >
                    <p>{item.text}</p>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  {format(item.createdAt)}
                </p>
              </div>
            </div>
          ))}
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Form */}
      <form
        onSubmit={sendMessageHandler}
        className="flex-shrink-0 p-3 border-t bg-white"
      >
        {images && (
          <div className="w-full mb-2 relative">
            <img
              src={images}
              alt="Preview"
              className="size-[50px] object-cover rounded-[10px]"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 left-10 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            >
              <X />
            </button>
          </div>
        )}
        <div className="flex w-full">
          <Input
            type="file"
            id="image"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mr-2 cursor-pointer"
            asChild
          >
            <label htmlFor="image">
              <Image className="h-5 w-5" />
            </label>
          </Button>
          <Input
            type="text"
            placeholder="Nhập nội dung tin nhắn"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon" className="ml-2">
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;
