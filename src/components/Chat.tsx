import React, { useState } from "react";
import { FaComment, FaTimes } from "react-icons/fa";
import "./Chat.css";
import { getChat } from "../services/chat.service";

interface Message {
  text: string;
  isUser: boolean;
}

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Xin chào, tôi là bot của cửa hàng. Tôi có thể giúp gì cho bạn?",
      isUser: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");

      const response = await getChat(inputMessage);
      setMessages((prev) => [
        ...prev,
        { text: response.response, isUser: false },
      ]);
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
