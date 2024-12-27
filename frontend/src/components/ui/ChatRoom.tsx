import React, { useState, useEffect, useRef } from "react";
import { FaCopy } from "react-icons/fa";
import Footer from "./Footer";

const RoomChat: React.FC = () => {
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userCount, setUserCount] = useState(0);
  const username = localStorage.getItem("username") || "Unknown User";
  const roomId = localStorage.getItem("roomId");
  const websocketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Room ID copied to clipboard!");
    });
  };

  useEffect(() => {
    const websocket = new WebSocket("ws://roomchat123.onrender.com");
    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log("Connected to WebSocket");

      const joinMessage = {
        type: "join",
        payload: { roomId, username },
      };
      websocket.send(JSON.stringify(joinMessage));
    };

    websocket.onmessage = (event) => {
      const receivedMessage = event.data;
      const parsedMessage = JSON.parse(receivedMessage);

      if (parsedMessage.type === "chat") {
        setMessages((prevMessages) => [...prevMessages, parsedMessage.payload]);
      } else if (parsedMessage.type === "userCount") {
        setUserCount(parsedMessage.payload.count);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    return () => {
      websocket.close();
    };
  }, [roomId, username]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const websocket = websocketRef.current;

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      const message = {
        type: "chat",
        payload: { username, message: currentMessage.trim() },
      };
      websocket.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, { username, message: currentMessage.trim() }]);
      setCurrentMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col">
    <div className="flex justify-center items-center w-full h-screen bg-black">
        
        
      <div className="w-full max-w-4xl p-4 bg-black border-solid border-2 border-white bg-opacity-90 rounded-md shadow-xl flex flex-col h-[90vh]">
      <h1 className="text-3xl font-serif text-white text-center mb-4">RoomChat</h1>

        {/* Room Info */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
        <div className="flex items-center space-x-2"> {/* Add space between room ID and copy button */}
          <h1 className="text-xl font-serif text-gray-50">Room ID: {roomId}</h1>
          <button
            onClick={() => copyToClipboard(roomId || "")}
            className="text-gray-50 p-1 rounded hover:bg-gray-600"
            title="Copy Room ID" // Tooltip for better UX
          >
            <FaCopy />
          </button>
        </div>
        <span className="text-lg font-serif text-white px-3 py-1 rounded-full shadow-md">Users: {userCount}</span>
      </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto max-h-[800px] p-4 border rounded-md mb-4 bg-black shadow-inner">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.username === username ? "items-end" : "items-start"
              } mb-3`}
            >
              <span className="text-xs text-white font-serif mb-1">{msg.username}</span>
              <div
                className={`px-4 py-2 rounded-lg font-serif shadow-md ${
                    msg.username === username
                    ? "bg-white text-black"
                    : "bg-white text-black"
                }`}
                >
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Field */}
        <div className="flex items-center">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-l-md font-serif focus:outline-none shadow-md bg-black text-white"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-white text-black rounded-r-md font-serif border shadow-md "
          >
            Send
          </button>
          
        </div>
        <Footer />
      </div>
    </div>
    <div>
        
    </div>
    </div>
  );
};

export default RoomChat;
