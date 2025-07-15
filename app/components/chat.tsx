"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
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
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, { method: "POST" });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  useEffect(() => {
    onMessagesUpdate(messages);
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!threadId) return console.error("No threadId set yet.");
    try {
      const response = await fetch(`/api/assistants/threads/${threadId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: text }),
      });
      if (!response.ok) throw new Error(await response.text());

      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    } catch (err) {
      console.error("sendMessage error:", err);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prev) => [...prev, { role: "user", text: userInput }]);
    setUserInput("");
    setInputDisabled(true);
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
        }
      });
      return [...prev.slice(0, -1), updated];
    });
  };

  const handleSuggestedClick = (text: string) => {
    setUserInput(text);
    sendMessage(text);
    setMessages((prev) => [...prev, { role: "user", text }]);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <img
          src="https://res.cloudinary.com/ddjnrebkn/image/upload/v1752596610/all%20folder/download_2_icfqnb.png"
          alt="UNILAG Logo"
          className={styles.logo}
        />
        <h2 className={styles.schoolName}>UNIVERSITY OF LAGOS</h2>
        <p className={styles.subHeader}>Student Assistant AI</p>
      </div>

      <div className={styles.suggestedQuestions}>
        {["Where is the admin block?", "How do I register for courses?", "HOD of All Department", "Unilag Portal Url"].map((q, i) => (
          <button
            key={i}
            onClick={() => handleSuggestedClick(q)}
            className={styles.questionButton}
          >
            {q}
          </button>
        ))}
      </div>

      <div className={styles.messagesWrapper}>
        <div ref={messagesRef} className={styles.messages}>
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} text={msg.text} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`${styles.inputForm} ${styles.clearfix}`}>
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your question"
        />
        <button type="submit" className={styles.button} disabled={inputDisabled}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
