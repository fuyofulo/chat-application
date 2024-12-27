import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
    username?: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket: WebSocket) => {
    console.log("New client connected");

    socket.on("message", (message: any) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "join") {
            const { roomId, username } = parsedMessage.payload;

            console.log(`User joined room: ${roomId} (${username || "Anonymous"})`);

            // Add the user to the room
            allSockets.push({ socket, room: roomId, username });

            // Broadcast updated user count to all users in the room
            const roomUsers = allSockets.filter((user) => user.room === roomId);
            const userCount = roomUsers.length;

            roomUsers.forEach((user) =>
                user.socket.send(
                    JSON.stringify({
                        type: "userCount", // Updated to match frontend
                        payload: { count: userCount },
                    })
                )
            );

            // Acknowledge the room join
            socket.send(
                JSON.stringify({
                    status: "success",
                    message: "Room joined successfully",
                    roomId,
                })
            );
        } else if (parsedMessage.type === "chat") {
            const currentUserRoom = allSockets.find((user) => user.socket === socket)?.room;

            if (currentUserRoom) {
                const currentUsername = allSockets.find((user) => user.socket === socket)?.username || "Anonymous";

                allSockets
                    .filter((user) => user.room === currentUserRoom && user.socket !== socket) // Exclude sender's socket
                    .forEach((user) =>
                        user.socket.send(
                            JSON.stringify({
                                type: "chat",
                                payload: { username: currentUsername, message: parsedMessage.payload.message },
                            })
                        )
                    );

                console.log(`Message sent to room ${currentUserRoom}:`, parsedMessage.payload.message);
            }
        }
    });

    socket.on("close", () => {
        console.log("Client disconnected");

        // Remove user from allSockets and update user counts
        const disconnectedUser = allSockets.find((user) => user.socket === socket);
        if (disconnectedUser) {
            const roomId = disconnectedUser.room;
            allSockets = allSockets.filter((user) => user.socket !== socket);

            // Update user count for the room
            const roomUsers = allSockets.filter((user) => user.room === roomId);
            const userCount = roomUsers.length;

            roomUsers.forEach((user) =>
                user.socket.send(
                    JSON.stringify({
                        type: "userCount", // Updated to match frontend
                        payload: { count: userCount },
                    })
                )
            );
        }
    });
});
