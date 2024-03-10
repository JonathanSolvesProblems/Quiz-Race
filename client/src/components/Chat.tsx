import React, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

interface Props {
  socket: any;
  username: string;
  room: string;
}

const Chat = ({ socket, username, room }: Props) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageContents, setMessageContents] = useState<any[]>([]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageInformation = {
        room: room,
        username: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageInformation);
      setMessageContents((contents: any[]) => [
        ...contents,
        messageInformation,
      ]);
      setCurrentMessage(''); // clear input after sending message
    }
  };

  useEffect(() => {
    const handleMessage = (data: any) => {
      setMessageContents((contents: any[]) => [...contents, data]);
    };
    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-top">
        <p>Live Chat</p>
      </div>
      <div className="chat-main">
        <ScrollToBottom className="message-container">
          {messageContents.map((messageData) => {
            return (
              <div
                className="message"
                id={username === messageData.username ? 'you' : 'other'}
              >
                <div>
                  <div className="message-content">
                    <p>{messageData.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageData.time}</p>
                    <p id="author">{messageData.username}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-bottom">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hello"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
