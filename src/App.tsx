import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IMessage } from './types/chat';

const BACKEND_URL = 'http://localhost:4000';
const currentUserId = `USER-${Math.floor(Math.random() * 9000) + 1000}`; 
const currentUsername = `Guest-${currentUserId.slice(-4)}`;

const socket = io(BACKEND_URL)

function App() {
  const [currentRoomId, setCurrentRoomId] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (currentRoomId !== '') {
      socket.emit('joinRoom', currentRoomId);
      setJoined(true);
      setMessageList([]);
      console.log(`${currentUsername} joined room: ${currentRoomId}`);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== '' && joined) {
      const messageData: IMessage = {
        roomId: currentRoomId,
        username: currentUsername,
        userId: currentUserId,
        content: currentMessage
      };

      await socket.emit('sendMessage', messageData);
      
      setMessageList((list) => [...list, messageData]); 
      setCurrentMessage('');
    }
  };

  const saveMessage = () => {
    let result = "";
    messageList.forEach((message: IMessage) => {
      result += message.username + ": " + message.content + " ";
    });
    console.log(result);
    // const saveFile = async (blob: any) => {
    //   const a = document.createElement('a');
    //   a.download = 'my-file.txt';
    //   a.href = URL.createObjectURL(blob);
    //   a.addEventListener('click', (e) => {
    //     setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    //   });
    //   a.click();
    // };
    // saveFile(new Blob([result]));
    fetch("http://localhost:8000/assign-roles", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' // 필수!
      },
      body: JSON.stringify({
        conversation_text: result,
        target_situation: "프로젝트 발표에 맞는 역할 분배"
      })
    }).then((res) => res.json()).then(data => {
      console.log(data);
    });
  }

  useEffect(() => {
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
          <br />
          <button onClick={saveMessage}>Save Messages</button>
        </>
      )}
    </div>
  );
}

export default App;