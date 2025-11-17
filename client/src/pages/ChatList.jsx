import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const ChatList = () => {
  const { user, axios } = useAppContext();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollingIntervalRef = useRef(null);

  const fetchChats = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const { data } = await axios.get(`/api/chat/user/${user._id}`);
      if (data.success) {
        // Process chats to ensure unique conversations and get unread counts
        const uniqueChats = {};

        data.chats.forEach((chat) => {
          const partnerId = chat.partnerId;
          if (
            !uniqueChats[partnerId] ||
            new Date(chat.latestMessage?.createdAt) >
              new Date(uniqueChats[partnerId].latestMessage?.createdAt)
          ) {
            uniqueChats[partnerId] = {
              ...chat,
              unreadCount: 0, // Will be calculated separately
            };
          }
        });

        // Get unread message counts for each chat
        const chatsWithUnread = await Promise.all(
          Object.values(uniqueChats).map(async (chat) => {
            try {
              const { data: messagesData } = await axios.get(
                `/api/chat/messages/${user._id}/${chat.partnerId}`
              );
              if (messagesData.success) {
                const unreadCount = messagesData.messages.filter(
                  (msg) => msg.sender._id !== user._id && !msg.read
                ).length;
                return { ...chat, unreadCount };
              }
              return chat;
            } catch (error) {
              console.error("Error fetching unread count:", error);
              return chat;
            }
          })
        );

        // Sort by latest message date
        chatsWithUnread.sort(
          (a, b) =>
            new Date(b.latestMessage?.createdAt || 0) -
            new Date(a.latestMessage?.createdAt || 0)
        );

        setChats(chatsWithUnread);
      }
    } catch (error) {
      if (!isPolling) {
        console.error("Error fetching chats:", error);
        toast.error("Failed to load chats");
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
    fetchChats();

    // Start polling for new messages every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchChats(true);
    }, 3000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [user, axios, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0F14]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A4D9F]"></div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 bg-[#0A0F14] min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#0A4D9F]">Messages</h1>

        {chats.length === 0 ? (
          <div className="text-center py-12">
            <img
              src={assets.car_icon}
              alt="no chats"
              className="w-16 h-16 opacity-50 mx-auto mb-4 brightness-0 invert opacity-30"
            />
            <p className="text-[#8DA0BF]">No conversations yet</p>
            <p className="text-[#8DA0BF] text-sm mt-2">
              Start chatting with car owners from car details pages
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.partnerId}
                onClick={() => navigate(`/chat/${chat.partnerId}`)}
                className={`flex items-center gap-4 p-4 bg-[#121A22] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-all duration-200 cursor-pointer border-l-4 border ${
                  chat.unreadCount > 0
                    ? "border-l-[#0A4D9F] bg-[#0C2A44]"
                    : "border-l-transparent border-[rgba(255,255,255,0.03)]"
                } hover:bg-[#0C2A44]`}
              >
                <div className="relative">
                  {chat.partner?.image ? (
                    <img
                      src={chat.partner.image}
                      alt={chat.partner?.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#0A4D9F]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#121A22] flex items-center justify-center text-[#0A4D9F] font-semibold text-lg ring-2 ring-[#0A4D9F]">
                      {chat.partner?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#0A4D9F] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold truncate ${
                        chat.unreadCount > 0
                          ? "text-[#DCE7F5]"
                          : "text-[#8DA0BF]"
                      }`}
                    >
                      {chat.partner?.name || "Unknown User"}
                    </h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-[#8DA0BF]">
                        {chat.latestMessage
                          ? new Date(
                              chat.latestMessage.createdAt
                            ).toLocaleDateString() ===
                            new Date().toLocaleDateString()
                            ? new Date(
                                chat.latestMessage.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date(
                                chat.latestMessage.createdAt
                              ).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm truncate ${
                        chat.unreadCount > 0
                          ? "text-[#DCE7F5] font-medium"
                          : "text-[#8DA0BF]"
                      }`}
                    >
                      {chat.latestMessage?.message || "No messages yet"}
                    </p>

                    {/* Read status indicator for sent messages */}
                    {chat.latestMessage &&
                      chat.latestMessage.sender === user._id && (
                        <div className="ml-2 flex-shrink-0">
                          {chat.latestMessage.read ? (
                            <div className="flex text-[#0A4D9F]">
                              <div className="w-3 h-3">
                                <svg viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
                                </svg>
                              </div>
                              <div className="w-3 h-3 -ml-1">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
