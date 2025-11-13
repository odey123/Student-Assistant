"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
import { AssistantStreamEvent } from "openai/resources/beta/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { useUniversity } from "../context/UniversityContext";
import UniversitySelector from "./UniversitySelector";

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

type ChatHistory = {
  id: string;
  title: string;
  timestamp: number;
  messages: MessageProps[];
};

const UserMessage = ({ text }: { text: string }) => (
  <div className={styles.userMessage}>{text}</div>
);

const AssistantMessage = ({ text }: { text: string }) => (
  <div className={styles.assistantMessage}>
    <Markdown>{text}</Markdown>
  </div>
);

const CodeMessage = ({ text }: { text: string }) => (
  <div className={styles.codeMessage}>
    {text.split("\n").map((line, index) => (
      <div key={index}>
        <span>{`${index + 1}. `}</span>
        {line}
      </div>
    ))}
  </div>
);

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  initialMessages?: MessageProps[];
  onMessagesUpdate?: (messages: MessageProps[]) => void;
  functionCallHandler?: (toolCall: RequiredActionFunctionToolCall) => Promise<string>;
};

const Chat = ({
  initialMessages = [],
  onMessagesUpdate = () => {},
  functionCallHandler = () => Promise.resolve("")
}: ChatProps) => {
  const { selectedUniversity } = useUniversity();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevUniversityRef = useRef(selectedUniversity.id);

  // Load chat histories and current chat when university changes
  useEffect(() => {
    const storageKey = `${selectedUniversity.id}-chat-histories`;
    const currentIdKey = `${selectedUniversity.id}-current-chat-id`;

    const savedHistories = localStorage.getItem(storageKey);
    const savedCurrentId = localStorage.getItem(currentIdKey);

    if (savedHistories) {
      try {
        const parsed = JSON.parse(savedHistories);
        setChatHistories(parsed);

        if (savedCurrentId && parsed.find((h: ChatHistory) => h.id === savedCurrentId)) {
          // Load the existing current chat for this university
          const currentChat = parsed.find((h: ChatHistory) => h.id === savedCurrentId);
          setCurrentChatId(savedCurrentId);
          setMessages(currentChat.messages);
        } else {
          // No valid current chat, start new one
          startNewChat();
        }
      } catch (e) {
        console.error('Failed to load chat histories:', e);
        startNewChat();
      }
    } else {
      // First time user for this university - start new chat
      startNewChat();
    }

    prevUniversityRef.current = selectedUniversity.id;
  }, [selectedUniversity.id]);

  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, { method: "POST" });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  // Save current chat whenever messages change
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      saveCurrentChat();
    }
    onMessagesUpdate(messages);
  }, [messages, currentChatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

 const sendMessage = async (text: string) => {
  if (!threadId) return console.error("No threadId set yet.");
  setIsLoading(true);

  // Add timeout for long-running requests
  const timeout = setTimeout(() => {
    console.warn("Request taking too long, but still waiting...");
  }, 30000); // 30 seconds warning

  try {
    const response = await fetch(`/api/assistants/threads/${threadId}/messages?university=${selectedUniversity.id}`, {
      method: "POST",
      body: JSON.stringify({ content: text }),
    });

    if (!response.ok) throw new Error(await response.text());

    const contentType = response.headers.get('content-type') || '';
    // Local KB fallback: server returns JSON { localResponse }
    if (contentType.includes('application/json')) {
      const json = await response.json();
      if (json.localResponse) {
        // Append local response as assistant message and finish
        clearTimeout(timeout);
        setIsLoading(false);
        setInputDisabled(false);
        appendMessage('assistant', json.localResponse);
        return;
      }
      // no localResponse -> treat as error
      throw new Error(JSON.stringify(json));
    }

    const stream = AssistantStream.fromReadableStream(response.body);

    return new Promise<void>((resolve, reject) => {
      // Add error handler
      stream.on("error", (error) => {
        console.error("Stream error:", error);
        clearTimeout(timeout);
        reject(error);
      });

      stream.on("textCreated", handleTextCreated);
      stream.on("textDelta", handleTextDelta);
      stream.on("imageFileDone", handleImageFileDone);
      stream.on("toolCallCreated", toolCallCreated);
      stream.on("toolCallDelta", toolCallDelta);
      stream.on("event", async (event) => {
        console.log("Stream event:", event.event); // Debug log

        if (event.event === "thread.run.requires_action") await handleRequiresAction(event);
        if (event.event === "thread.run.completed") {
          clearTimeout(timeout);
          setIsLoading(false);
          setInputDisabled(false); // re-enable input
          resolve(); // stream done
        }
        if (event.event === "thread.run.failed") {
          clearTimeout(timeout);
          setIsLoading(false);
          setInputDisabled(false);
          appendMessage("assistant", "Sorry, the request failed. Please try again.");
          resolve();
        }
      });
    });
  } catch (err) {
    console.error("sendMessage error:", err);
    clearTimeout(timeout);
    setIsLoading(false);
    setInputDisabled(false); // ensure re-enable on failure
    appendMessage("assistant", "Sorry, I encountered an error. Please try again or contact support if the problem persists.");
  }
};


  const submitActionResult = async (runId: string, toolCallOutputs: any) => {
    const response = await fetch(`/api/assistants/threads/${threadId}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, toolCallOutputs }),
    });
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!userInput.trim() || inputDisabled) return;

  setMessages((prev) => [...prev, { role: "user", text: userInput }]);
  const text = userInput;
  setUserInput("");
  setInputDisabled(true); // disable immediately

  await sendMessage(text); // wait for full stream
};


  const handleTextCreated = () => appendMessage("assistant", "");
  const handleTextDelta = (delta) => {
    if (delta.value) appendToLastMessage(delta.value);
    if (delta.annotations) annotateLastMessage(delta.annotations);
  };
  const handleImageFileDone = (image) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };
  const toolCallCreated = (toolCall) => {
    if (toolCall.type === "code_interpreter") appendMessage("code", "");
  };
  const toolCallDelta = (delta) => {
    if (delta.type === "code_interpreter" && delta.code_interpreter.input) {
      appendToLastMessage(delta.code_interpreter.input);
    }
  };
  const handleRequiresAction = async (event: AssistantStreamEvent.ThreadRunRequiresAction) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  const handleRunCompleted = () => setInputDisabled(false);

  const handleReadableStream = (stream: AssistantStream) => {
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("imageFileDone", handleImageFileDone);
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action") handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  const appendToLastMessage = (text: string) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), { ...last, text: last.text + text }];
    });
  };

  const appendMessage = (role: MessageProps["role"], text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const annotateLastMessage = (annotations) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      const updated = { ...last };
      annotations.forEach((a) => {
        if (a.type === "file_path") {
          updated.text = updated.text.replaceAll(
            a.text,
            `/api/files/${a.file_path.file_id}`
          );
        } else if (a.type === "file_citation") {
          // Remove citation markers like 【8:0†source】 for cleaner display
          updated.text = updated.text.replaceAll(a.text, "");
        }
      });
      return [...prev.slice(0, -1), updated];
    });
  };

 const handleSuggestedClick = async (text: string) => {
  if (!text || inputDisabled) return;

  // ✅ Check if message already exists
  const alreadySent = messages.some(
    (msg) => msg.role === "user" && msg.text === text
  );
  if (alreadySent) return;

  setUserInput("");
  setInputDisabled(true);

  // ✅ Add message to UI before sending
  setMessages((prev) => [...prev, { role: "user", text }]);

  await sendMessage(text); // only backend logic
};

  // Helper function to generate chat title from first message
  const generateChatTitle = (messages: MessageProps[]): string => {
    const firstUserMessage = messages.find(m => m.role === "user");
    if (firstUserMessage) {
      const title = firstUserMessage.text.substring(0, 50);
      return title.length < firstUserMessage.text.length ? title + "..." : title;
    }
    return "New Chat";
  };

  // Start a new chat
  const startNewChat = () => {
    const newChatId = Date.now().toString();
    const welcomeMessage: MessageProps = {
      role: "assistant",
      text: `👋 Hello! I'm your ${selectedUniversity.shortName} Student Assistant. I can help you with:\n\n• Campus facilities and locations\n• Course registration and academic procedures\n• School fees payment\n• Departments and faculties information\n• General ${selectedUniversity.shortName} information\n\nFeel free to ask me anything about ${selectedUniversity.shortName}!`
    };

    setCurrentChatId(newChatId);
    setMessages([welcomeMessage]);
    const currentIdKey = `${selectedUniversity.id}-current-chat-id`;
    localStorage.setItem(currentIdKey, newChatId);
    setShowSidebar(false);
  };

  // Save current chat to histories
  const saveCurrentChat = () => {
    const currentChat: ChatHistory = {
      id: currentChatId,
      title: generateChatTitle(messages),
      timestamp: Date.now(),
      messages: messages
    };

    const storageKey = `${selectedUniversity.id}-chat-histories`;
    setChatHistories(prev => {
      const filtered = prev.filter(h => h.id !== currentChatId);
      const updated = [currentChat, ...filtered];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  // Load a chat from history
  const loadChat = (chatId: string) => {
    const chat = chatHistories.find(h => h.id === chatId);
    if (chat) {
      setCurrentChatId(chat.id);
      setMessages(chat.messages);
      const currentIdKey = `${selectedUniversity.id}-current-chat-id`;
      localStorage.setItem(currentIdKey, chat.id);
      setShowSidebar(false);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (chatId: string) => {
    setChatToDelete(chatId);
    setShowDeleteModal(true);
  };

  // Delete a chat from history
  const confirmDelete = () => {
    if (chatToDelete) {
      const storageKey = `${selectedUniversity.id}-chat-histories`;
      setChatHistories(prev => {
        const updated = prev.filter(h => h.id !== chatToDelete);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });

      // If deleting current chat, start new one
      if (chatToDelete === currentChatId) {
        startNewChat();
      }
    }
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  const handleClearChat = () => {
    startNewChat();
  };

  // Show clear all confirmation modal
  const handleClearAllChats = () => {
    if (chatHistories.length === 0) return;
    setShowClearAllModal(true);
  };

  // Confirm clear all
  const confirmClearAll = () => {
    const storageKey = `${selectedUniversity.id}-chat-histories`;
    setChatHistories([]);
    localStorage.removeItem(storageKey);
    startNewChat();
    setShowClearAllModal(false);
    setShowSidebar(false);
  };

  // Cancel clear all
  const cancelClearAll = () => {
    setShowClearAllModal(false);
  };


  return (
    <div>
      {/* Improved Header */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setShowSidebar(!showSidebar)}
          title="Chat History"
          aria-label="Open chat history"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className={styles.logoLink}>
          <img
            src={selectedUniversity.logo}
            alt={`${selectedUniversity.shortName} Logo`}
            className={styles.logo}
          />
          <div className={styles.headerText}>
            <h1 className={styles.schoolName}>{selectedUniversity.name.toUpperCase()}</h1>
            <p className={styles.subtitle}>Student Assistant</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <UniversitySelector />
        </div>
      </div>

      {/* Chat History Sidebar */}
      {showSidebar && (
        <>
          <div className={styles.overlay} onClick={() => setShowSidebar(false)} />
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>Chat History</h3>
              <button
                type="button"
                onClick={() => setShowSidebar(false)}
                className={styles.closeButton}
                title="Close sidebar"
                aria-label="Close chat history sidebar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={startNewChat}
              className={styles.sidebarNewChat}
              aria-label="Start new chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Chat
            </button>

            <div className={styles.chatList}>
              {chatHistories.length === 0 ? (
                <p className={styles.emptyState}>No chat history yet</p>
              ) : (
                chatHistories.map(chat => (
                  <div
                    key={chat.id}
                    className={`${styles.chatItem} ${chat.id === currentChatId ? styles.active : ''}`}
                  >
                    <div className={styles.chatItemContent} onClick={() => loadChat(chat.id)}>
                      <p className={styles.chatTitle}>{chat.title}</p>
                      <p className={styles.chatTime}>
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        showDeleteConfirmation(chat.id);
                      }}
                      title="Delete chat"
                      aria-label="Delete this chat"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Clear All Button */}
            {chatHistories.length > 0 && (
              <div className={styles.sidebarFooter}>
                <button
                  type="button"
                  onClick={handleClearAllChats}
                  className={styles.clearAllButton}
                  aria-label="Clear all chat history"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round"/>
                  </svg>
                  Clear all chats
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className={styles.modalOverlay} onClick={cancelDelete} />
          <div className={styles.deleteModal}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Delete chat?</h3>
              <p className={styles.modalText}>
                This will delete this chat permanently.
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.confirmDeleteButton}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllModal && (
        <>
          <div className={styles.modalOverlay} onClick={cancelClearAll} />
          <div className={styles.deleteModal}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Delete all chat history?</h3>
              <p className={styles.modalText}>
                This will permanently delete all your chat history. This action cannot be undone.
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={cancelClearAll}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.confirmDeleteButton}
                  onClick={confirmClearAll}
                >
                  Delete all
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={styles.chatContainer}>
      {/* Dynamic University Watermark */}
      <div className={styles.watermark}>
        <img
          src={selectedUniversity.logo}
          alt={`${selectedUniversity.shortName} watermark`}
        />
      </div>

      <div className={styles.messagesWrapper}>
        <div ref={messagesRef} className={styles.messages}>
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} text={msg.text} />
          ))}
          {isLoading && (
            <div className={styles.assistantMessage}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
<div className={styles.suggestedQuestions}>
        {[
          "Where is the admin block?",
          "How do I register for courses?",
          "How do I pay my school fees?",
          `What are the faculties in ${selectedUniversity.shortName}?`,
          "Where is the library?",
          "How do I check my results?"
        ].map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSuggestedClick(q)}
            className={styles.questionButton}
            disabled={inputDisabled}
          >
            {q}
          </button>
        ))}
      </div>



      <form onSubmit={handleSubmit} className={`${styles.inputForm} ${styles.clearfix}`}>
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={`Ask me anything about ${selectedUniversity.shortName}...`}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled}
          aria-label="Send message"
          title="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </form>
    </div>
    </div>
    
  );
};

export default Chat;
