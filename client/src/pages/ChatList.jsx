import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const ChatList = () => {
  const { user, axios } = useAppContext();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchChats = async () => {
      try {
        setLoading(true);
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
        console.error("Error fetching chats:", error);
        toast.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, axios, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        {chats.length === 0 ? (
          <div className="text-center py-12">
            <img
              src={assets.car_icon}
              alt="no chats"
              className="w-16 h-16 opacity-50 mx-auto mb-4"
            />
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Start chatting with car owners from car details pages
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.partnerId}
                onClick={() => navigate(`/chat/${chat.partnerId}`)}
                className={`flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 ${
                  chat.unreadCount > 0
                    ? "border-l-primary bg-blue-50"
                    : "border-l-transparent"
                } hover:bg-gray-50`}
              >
                <div className="relative">
                  <img
                    src={chat.partner?.image || assets.user_profile}
                    alt={chat.partner?.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold truncate ${
                        chat.unreadCount > 0 ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {chat.partner?.name || "Unknown User"}
                    </h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-400">
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
                          ? "text-gray-800 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {chat.latestMessage?.message || "No messages yet"}
                    </p>

                    {/* Read status indicator for sent messages */}
                    {chat.latestMessage &&
                      chat.latestMessage.sender === user._id && (
                        <div className="ml-2 flex-shrink-0">
                          {chat.latestMessage.read ? (
                            <div className="flex text-blue-500">
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
                            <div className="w-3 h-3 text-gray-400">
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
