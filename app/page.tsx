"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "./components/chat";
import Sidebar from "./components/sidebar";

const Home = () => {
  // Auto-start with one chat that has current time and day
  const now = new Date();
  const [chats, setChats] = useState([
    {
      title: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [],
      createdAt: now.toISOString(),
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const startNewChat = () => {
    const now = new Date();
    const newChat = {
      title: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [],
      createdAt: now.toISOString(),
    };
    const newChats = [...chats, newChat];
    setChats(newChats);
    setActiveIndex(newChats.length - 1);
  };

  const updateChatMessages = (index, messages) => {
    const updatedChats = [...chats];
    updatedChats[index].messages = messages;
    setChats(updatedChats);
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        history={chats}
        onSelect={(index) => setActiveIndex(index)}
        onNewChat={startNewChat}
      />
      <div className={styles.chatArea}>
        {chats.length > 0 && activeIndex !== null && (
          <Chat
            key={activeIndex}
            initialMessages={chats[activeIndex].messages}
            onMessagesUpdate={(msgs) => updateChatMessages(activeIndex, msgs)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
