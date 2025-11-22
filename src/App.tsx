// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IMessage } from './types/chat';

const BACKEND_URL = 'http:/localhost:4000';
// userId는 세션별 고유값으로 설정
const currentUserId = `USER-${Math.floor(Math.random() * 9000) + 1000}`; 
const currentUsername = `Guest-${currentUserId.slice(-4)}`;

const socket = io(BACKEND_URL)

function App() {
  const [currentRoomId, setCurrentRoomId] = useState(''); // 현재 접속할 방 ID
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [joined, setJoined] = useState(false); // 방에 접속했는지 여부

  // 1. **방 접속 함수**
  const joinRoom = () => {
    if (currentRoomId !== '') {
      // 서버에 'join_room' 이벤트와 함께 방 ID 전송
      socket.emit('joinRoom', currentRoomId);
      setJoined(true);
      setMessageList([]); // 새 방에 들어가면 메시지 목록 초기화
      console.log(`${currentUsername} joined room: ${currentRoomId}`);
    }
  };

  // 2. **메시지 전송 함수**
  const sendMessage = async () => {
    if (currentMessage !== '' && joined) {
      // 서버에서 요구하는 메시지 객체 구조 (username, userId, roomId, content)
      const messageData: IMessage = {
        roomId: currentRoomId,
        username: currentUsername,
        userId: currentUserId,
        content: currentMessage
      };

      // 'send_message' 이벤트와 함께 서버로 데이터 전송
      await socket.emit('sendMessage', messageData);
      
      // 자신의 메시지를 화면에 즉시 표시 (UX 개선)
      setMessageList((list) => [...list, messageData]); 
      setCurrentMessage('');
    }
  };

  // 3. 실시간 메시지 수신 로직
  useEffect(() => {
    // 서버로부터 'receive_message' 이벤트를 수신하여 메시지 목록 업데이트
    socket.on('message', (data) => {
      if (data.userId != currentUserId) {
        setMessageList((list) => [...list, data]);
      }
    });
    
    return () => {
      socket.off('message');
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Socket.IO Chat App</h1>
      <p>현재 사용자: **{currentUsername}** ({currentUserId})</p>
      
      {/* 방 접속 UI */}
      {!joined ? (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="입장할 방 ID (예: room1)"
            value={currentRoomId}
            onChange={(e) => setCurrentRoomId(e.target.value)}
            style={{ padding: '8px', marginRight: '5px' }}
          />
          <button onClick={joinRoom} style={{ padding: '8px 15px' }}>
            방 접속
          </button>
        </div>
      ) : (
        <>
          <h2>현재 접속 방: {currentRoomId}</h2>

          {/* 메시지 표시 영역 */}
          <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'auto', marginBottom: '10px', padding: '10px' }}>
            {messageList?.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  textAlign: msg.userId === currentUserId ? 'right' : 'left', 
                  marginBottom: '10px' 
                }}
              >
                <div style={{ 
                  background: msg.userId === currentUserId ? '#DCF8C6' : '#EAEAEA', 
                  padding: '5px 10px', 
                  borderRadius: '10px', 
                  maxWidth: '70%', 
                  display: 'inline-block' 
                }}>
                  <strong style={{ display: 'block', fontSize: '12px', color: '#666' }}>
                    {msg.userId === currentUserId ? '나' : msg.username}
                  </strong>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* 메시지 입력 영역 */}
          <input
            type="text"
            placeholder="메시지 입력..."
            value={currentMessage}
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === 'Enter' && sendMessage();
            }}
            style={{ padding: '8px', marginRight: '5px', width: '70%' }}
            disabled={!joined}
          />
          <button onClick={sendMessage} style={{ padding: '8px 15px' }} disabled={!joined}>
            전송
          </button>
        </>
      )}
    </div>
  );
}

export default App;