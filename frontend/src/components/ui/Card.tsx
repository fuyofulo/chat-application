import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Card () {

    const websocketRef = useRef<WebSocket | nu\
    ll>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const websocket = new WebSocket("wss://roomchat123.onrender.com");
        websocket.onopen = () => {
            console.log("WebSocket connection established!");
        };

        websocketRef.current = websocket;

        return () => {
            websocket.close();
        };
    }, [])

    //@ts-ignore
    let [username, setUsername] = useState(" ");
    //@ts-ignore
    let [roomId, setRoomId] = useState("");
    //@ts-ignore
    let [userRoomId, setUserRoomId] = useState(" ");

    function createRoom () {

        if(username == " ") {
            console.log("enter a username");
            return;
        }
        
        const generatedRoomId = Math.random().toString(36).substring(2, 9);
        console.log("Room ID:", generatedRoomId);
        setRoomId(generatedRoomId);
        localStorage.setItem("generatedRoomId", generatedRoomId);
        localStorage.setItem("username", username);

        const websocket = websocketRef.current;

        if (websocket && websocket.readyState === WebSocket.OPEN) {
            const message = {
              type: "join",
              payload: {
                roomId: generatedRoomId,
                username
              },
            };
            websocket.send(JSON.stringify(message)); // Convert the message to a JSON string
            console.log("Sent message to backend:", message);
        } else {
            console.error("WebSocket is not open. Cannot send the message.");
        }

        localStorage.setItem("roomId", generatedRoomId);
        navigate(`/chatroom`);
    }

    function joinRoom() {

        if(userRoomId == " ") {
            console.log("enter a room ID");
            return;
        }

        if(username == " ") {
            console.log("enter a room ID");
            return;
        }

        localStorage.setItem("userGivenRoom",userRoomId);
        console.log("Room ID:", userRoomId);

        const websocket = websocketRef.current;

        if (websocket && websocket.readyState === WebSocket.OPEN) {
            const message = {
              type: "join",
              payload: {
                roomId: userRoomId,
                username: username
              },
            };
            websocket.send(JSON.stringify(message)); // Convert the message to a JSON string
            console.log("Sent message to backend:", message);
        } else {
            console.error("WebSocket is not open. Cannot send the message.");
        }

        localStorage.setItem("roomId", userRoomId);
        localStorage.setItem("username", username);
        navigate(`/chatroom`);
    }

    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center">
          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-serif font-bold text-white tracking-wide">
              RoomChat
            </h1>
            <p className="text-xl text-white font-serif mt-2">Create instantly, Chat freely</p>
          </div>
      
          {/* Box with Form and Footer */}
          <div className="w-[30rem] min-h-[28rem] bg-black p-10 rounded-lg shadow-2xl border-2 border-white flex flex-col justify-between">
            {/* Form Section */}
            <div>
              <h2 className="text-2xl font-serif mb-6 text-white">Create or Join a Chatroom</h2>
              <div className="space-y-8">
                {/* Username Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 font-serif border border-white bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
      
                {/* Create Room Button */}
                <button
                  onClick={createRoom}
                  className="w-full bg-rose-500 font-serif text-white px-4 py-3 rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                >
                  Create Room
                </button>
      
                {/* Room ID and Join Button */}
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Room ID"
                    className="flex-1 font-serif px-4 py-3 border border-white bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300 mr-2"
                    onChange={(e) => setUserRoomId(e.target.value)}
                  />
                  <button
                    onClick={joinRoom}
                    className="bg-fuchsia-500 text-white px-4 py-3 font-serif rounded-md hover:bg-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
      
            {/* Footer Section */}
            <div className="mt-8 border-t border-gray-600 pt-4 flex items-center justify-between">
              {/* Footer Text */}
              <p className="text-white text-sm font-serif">
                Crafted with a lot of patience by fuyofulo
              </p>
      
              {/* Footer Icons */}
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/fuyofulo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-400"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="https://github.com/fuyofulo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-400"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/fuyofulo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-600"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href="https://www.instagram.com/fuyofulo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-pink-400"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      );
      
      
}      