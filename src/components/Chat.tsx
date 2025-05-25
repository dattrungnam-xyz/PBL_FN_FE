import React, { useState, useEffect, useRef } from "react";
import { FaComment, FaTimes } from "react-icons/fa";
import "./Chat.css";
import { getChat } from "../services/chat.service";
import { IProduct } from "../interface";

interface Message {
  text: string;
  isUser: boolean;
  products?: IProduct[];
}

const CHAT_HISTORY_KEY = "chat_history";

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (error) {
        console.error("Error parsing saved messages:", error);
        return [
          {
            text: "Xin chào, tôi là bot của cửa hàng. Tôi có thể giúp gì cho bạn?",
            isUser: false,
          },
        ];
      }
    }
    return [
      {
        text: "Xin chào, tôi là bot của cửa hàng. Tôi có thể giúp gì cho bạn?",
        isUser: false,
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      setIsLoading(true);
      try {
        const response = await getChat(inputMessage);
        setMessages((prev) => [
          ...prev,
          {
            text: response.message,
            isUser: false,
            products: response.products,
          },
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching chat response:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Lỗi khi tìm kiếm sản phẩm. Vui lòng thử lại sau.",
            isUser: false,
          },
        ]);
        setIsLoading(false);
      }
    }
  };

  const renderProductSuggestions = (products: IProduct[]) => {
    if (!products || products.length === 0) return null;

    return (
      <div className="product-suggestions">
        {products.map((product) => (
          <div key={product.id} className="product-suggestion">
            <img src={product.images[0]} alt={product.name} />
            <div
              onClick={() => window.open(`/product/${product.id}`, "_blank")}
              className="product-info"
            >
              <h4>{product.name}</h4>
              <p>{product.price.toLocaleString("vi-VN")}đ</p>
            </div>
          </div>
        ))}
      </div>
    );
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
            <h3>Hỗ trợ khách hàng</h3>
            <div className="chat-header-buttons">
              <button className="close-button" onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.isUser ? "user" : "bot"}`}
              >
                {message.text}
                {message.products && renderProductSuggestions(message.products)}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
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
