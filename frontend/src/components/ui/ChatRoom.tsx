import React, { useState, useEffect, useRef } from "react";

const RoomChat: React.FC = () => {
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userCount, setUserCount] = useState(0);
  const username = localStorage.getItem("username") || "Unknown User";
  const roomId = localStorage.getItem("roomId");
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const websocket = new WebSocket("ws://localhost:8080");
    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log("Connected to WebSocket");

      // Notify the backend about joining the room
      const joinMessage = {
        type: "join",
        payload: {
          roomId,
          username,
        },
      };
      websocket.send(JSON.stringify(joinMessage));
    };

    websocket.onmessage = (event) => {
      const receivedMessage = event.data;
      const parsedMessage = JSON.parse(receivedMessage);

      if (parsedMessage.type === "chat") {
        // Update chat messages
        setMessages((prevMessages) => [...prevMessages, parsedMessage.payload]);
      } else if (parsedMessage.type === "userCount") {
        // Update user count
        setUserCount(parsedMessage.payload.count);
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    return () => {
      websocket.close();
    };
  }, [roomId, username]);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const websocket = websocketRef.current;

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      const message = {
        type: "chat",
        payload: {
          username,
          message: currentMessage.trim(),
        },
      };
      websocket.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, { username, message: currentMessage.trim() }]);
      setCurrentMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-200">
      <div className="w-full max-w-3xl p-4 bg-white rounded-md shadow-md flex flex-col">
        {/* Room Info */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h1 className="text-lg font-bold">Room ID: {roomId}</h1>
          <span className="text-sm text-gray-500">Users: {userCount}</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 border rounded-md mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.username === username ? "items-end" : "items-start"
              } mb-3`}
            >
              <span className="text-xs text-gray-500 mb-1">{msg.username}</span>
              <div
                className={`px-4 py-2 rounded-lg ${
                  msg.username === username
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className="flex items-center">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;