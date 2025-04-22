import React, { useState } from "react";
import { FaComment, FaTimes } from "react-icons/fa";
import "./Chat.css";

interface Message {
  text: string;
  isUser: boolean;
}

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is a bot response", isUser: false },
        ]);
      }, 1000);
    }
  };

  return (
    <div className={`chat-container ${isOpen ? "open" : ""}`}>
      {!isOpen ? (
        <button className="chat-icon" onClick={() => setIsOpen(true)}>
          <FaComment size={24} />
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat with us</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.isUser ? "user" : "bot"}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
