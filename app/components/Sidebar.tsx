import React, { useState } from "react";
import styles from "./sidebar.module.css";
import { format } from "date-fns";

const Sidebar = ({ history, onSelect, onNewChat }) => {
  const [expandedDay, setExpandedDay] = useState(null);

  const groupedByDay = history.reduce((acc, chat, index) => {
    const date = new Date(chat.createdAt);
    const day = format(date, "EEEE");

    if (!acc[day]) acc[day] = [];
    acc[day].push({ ...chat, index });
    return acc;
  }, {});

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className={styles.sidebar}>
      <button className={styles.newChatBtn} onClick={onNewChat}>
        + New Chat
      </button>

      <div className={styles.historyList}>
        {Object.entries(groupedByDay).map(([day, chats]) => (
          <div key={day} className={styles.dayGroup}>
            <div className={styles.dayHeader} onClick={() => toggleDay(day)}>
              {day}
              <span className={styles.expandIcon}>
                {expandedDay === day ? "▲" : "▼"}
              </span>
            </div>

            {expandedDay === day &&
              chats.map((chat) => (
                <div
                  key={chat.index}
                  className={styles.historyItem}
                  onClick={() => onSelect(chat.index)}
                >
                  {chat.title}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
