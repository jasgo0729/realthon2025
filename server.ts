// server.ts
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { ClientToServerEvents, ServerToClientEvents } from './src/types/socket'
import { IMessage } from './src/types/chat';

const app = express();
const httpServer = createServer(app);

app.use(cors())

// Socket.IO 인스턴스에 타입 적용
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`[Server] 새로운 사용자 연결됨: ${socket.id}`);

    // 1. 방 참가 이벤트 처리 (roomId는 string으로 타입 추론됨)
    socket.on('joinRoom', (roomId: string) => {
        socket.join(roomId);
        console.log(`${socket.id} 님이 방 ${roomId}에 참가했습니다.`);
    });

    // 2. 메시지 수신 이벤트 처리 (data는 IMessage 타입으로 타입 추론됨)
    socket.on('sendMessage', (data: IMessage) => {
        const { roomId, username, userId, content } = data;
        // 💡 io.to().emit: receiveMessage 이벤트는 ServerToClientEvents에 정의된 시그니처를 따라야 함
        io.to(roomId).emit('message', data); 
    });

    socket.on('disconnect', () => {
        console.log(`[Server] 사용자 연결 해제: ${socket.id}`);
    });
});

const PORT = 4000;
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Socket.IO 서버가 ${PORT} 에서 실행 중입니다.`);
});