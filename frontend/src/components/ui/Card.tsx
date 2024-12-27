import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Card () {

    const websocketRef = useRef<WebSocket | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const websocket = new WebSocket("ws://localhost:8080");
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
        navigate(`/chatroom`);
    }

    return (
        <>
            <div className="h-screen bg-rose-200">
                <h1 className="font-serif">RoomChat</h1>
                <p className="font-serif">Create instantly, Chat freely</p>
                <div className="w-80 border-2 border-slate-700 rounded-md font-serif flex flex-col">
                    <div className="">Create or Join a chatroom</div>
                    <input placeholder="username" className="px-2 rounded-md" onChange={e => setUsername(e.target.value)}></input>
                    <button className="bg-fuchsia-300 hover:bg-fuchsia-400 rounded-md cursor-copy" onClick={createRoom}>create room</button>
                    <div className="flex h-6 justify-between">
                        <input placeholder="room ID" className="px-2 rounded-md" onChange={e => setUserRoomId(e.target.value)}></input>
                        <button className="bg-fuchsia-300 hover:bg-fuchsia-400 rounded-md cursor-copy px-2" onClick={joinRoom}>join room</button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}
