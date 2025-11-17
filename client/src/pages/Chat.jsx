import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Chat = () => {
  const { ownerId } = useParams();
  const { user, axios } = useAppContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const markMessagesAsRead = async () => {
    try {
      const chatId = [user._id, ownerId].sort().join("_");
      await axios.post("/api/chat/mark-read", {
        chatId,
        userId: user._id,
      });
    } catch {
      console.log("Failed to mark messages as read");
    }
  };

  const fetchOwnerInfo = async () => {
    try {
      const { data } = await axios.get(`/api/user/user/${ownerId}`);
      if (data.success) {
        setOwnerInfo(data.user);
      } else {
        setOwnerInfo({ name: "Car Owner", image: "" });
      }
    } catch {
      setOwnerInfo({ name: "Car Owner", image: "" });
    }
  };

  const fetchMessages = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const { data } = await axios.get(
        `/api/chat/messages/${user._id}/${ownerId}`
      );
      if (data.success) {
        const newMessages = data.messages;

        // Check if there are new messages
        if (newMessages.length > 0) {
          const latestMessageId = newMessages[newMessages.length - 1]._id;

          if (lastMessageIdRef.current !== latestMessageId) {
            setMessages(newMessages);
            lastMessageIdRef.current = latestMessageId;

            // Mark messages as read
            markMessagesAsRead();
          }

          if (!ownerInfo) {
            const owner =
              newMessages[0].sender._id === ownerId
                ? newMessages[0].sender
                : newMessages[0].receiver;
            setOwnerInfo(owner);
          }
        } else if (!ownerInfo) {
          // Fetch owner info separately if no messages exist
          fetchOwnerInfo();
        }
      }
    } catch (error) {
      if (!isPolling) {
        toast.error("Failed to load messages");
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Initial fetch
    fetchMessages();

    // Start polling for new messages every 2 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(true);
    }, 2000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [user, ownerId, axios, navigate]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post("/api/chat/send", {
        senderId: user._id,
        receiverId: ownerId,
        message: newMessage.trim(),
      });

      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      } else {
        toast.error("Failed to send message");
      }
    } catch {
      toast.error("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0F14]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A4D9F]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0F14]">
      {/* Header */}
      <div className="bg-[#121A22] shadow-[0_8px_24px_rgba(0,0,0,0.6)] border-b border-[rgba(255,255,255,0.04)] px-6 py-4 flex items-center gap-4 relative">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-[#0C2A44] rounded-full transition-colors flex-shrink-0"
        >
          <img
            src={assets.arrow_icon}
            alt="back"
            className="w-5 h-5 rotate-180 brightness-0 invert opacity-60"
          />
        </button>

        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            {ownerInfo?.image ? (
              <img
                src={ownerInfo.image}
                alt="owner"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0A4D9F]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#121A22] flex items-center justify-center text-[#0A4D9F] font-semibold text-xl ring-2 ring-[#0A4D9F]">
                {ownerInfo?.name?.charAt(0)?.toUpperCase() || "O"}
              </div>
            )}
            {/* Online status indicator */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#16A34A] border-2 border-[#121A22] rounded-full"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-[#DCE7F5] text-lg">
              {ownerInfo?.name || "Car Owner"}
            </h2>
            <p className="text-sm text-[#8DA0BF]">Car Owner</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#0C2A44] rounded-full transition-colors">
              <svg
                className="w-5 h-5 text-[#8DA0BF]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-[#0C2A44] rounded-full transition-colors">
              <svg
                className="w-5 h-5 text-[#8DA0BF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#0A0F14]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#8DA0BF]">
            <img
              src={assets.car_icon}
              alt="chat"
              className="w-16 h-16 opacity-50 mb-4 brightness-0 invert opacity-30"
            />
            <p>Start a conversation about the car</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.sender._id === user._id;
            const showAvatar =
              !isOwn &&
              (index === 0 ||
                messages[index - 1].sender._id !== msg.sender._id);

            return (
              <div
                key={index}
                className={`flex ${isOwn ? "justify-end" : "justify-start"} ${
                  showAvatar ? "mt-4" : "mt-1"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-xs lg:max-w-md ${
                    isOwn ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar for received messages */}
                  {showAvatar &&
                    (ownerInfo?.image ? (
                      <img
                        src={ownerInfo.image}
                        alt="sender"
                        className="w-7 h-7 rounded-full object-cover mb-1"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#121A22] flex items-center justify-center text-[#0A4D9F] font-semibold text-xs mb-1">
                        {ownerInfo?.name?.charAt(0)?.toUpperCase() || "O"}
                      </div>
                    ))}
                  {!showAvatar && !isOwn && <div className="w-7"></div>}

                  <div className="flex flex-col">
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isOwn
                          ? "bg-[#0A4D9F] text-white rounded-br-md"
                          : "bg-[#121A22] text-[#DCE7F5] rounded-bl-md border border-[rgba(255,255,255,0.04)]"
                      } shadow-sm`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>

                    {/* Timestamp and read status */}
                    <div
                      className={`flex items-center gap-1 mt-1 px-1 ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="text-xs text-[#8DA0BF]">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {/* Read status for sent messages */}
                      {isOwn && (
                        <div className="flex items-center ml-1">
                          {msg.read ? (
                            <div className="flex">
                              <div className="w-3 h-3 text-[#0A4D9F]">
                                <svg viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
                                </svg>
                              </div>
                              <div className="w-3 h-3 text-[#0A4D9F] -ml-1">
                                <svg viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <div className="w-3 h-3 text-[#8DA0BF]">
                              <svg viewBox="0 0 16 16" fill="currentColor">
                                <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-[#121A22] border-t border-[rgba(255,255,255,0.04)] px-6 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        <form onSubmit={sendMessage} className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-5 py-3 pr-12 border border-[rgba(255,255,255,0.04)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:border-transparent resize-none bg-[#0F161C] text-[#DCE7F5] placeholder:text-[#8DA0BF] transition-all"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
            />
            {/* Emoji button placeholder */}
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8DA0BF] hover:text-[#DCE7F5] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-[#0A4D9F] text-white rounded-2xl hover:bg-[#083A78] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
