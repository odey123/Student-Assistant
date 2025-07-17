"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "./components/chat";


const Home = () => {
  
  return (
    <div className={styles.layout}>
      
      <div className={styles.chatArea}>
          <Chat/>
      </div>
    </div>
  );
};

export default Home;
