import React from "react";
import styles from "./sidebar.module.css";
import { format } from "date-fns";

const Sidebar = ({ history, onSelect, onNewChat }) => {
  // Group chats by day of the week (Monday, Tuesday, etc.)
  const groupedByDay = history.reduce((acc, chat, index) => {
    const date = new Date(chat.createdAt);
    const day = format(date, "EEEE"); // e.g. "Monday"

    if (!acc[day]) acc[day] = [];
    acc[day].push({ ...chat, index });
    return acc;
  }, {});

  return (
    <div className={styles.sidebar}>
      <button className={styles.newChatBtn} onClick={onNewChat}>
        + New Chat
      </button>

      <div className={styles.historyList}>
        {Object.entries(groupedByDay).map(([day, chats]) => (
          <div key={day} className={styles.dayGroup}>
            <h4 className={styles.dayHeader}>{day}</h4>
            {chats.map((chat) => (
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
