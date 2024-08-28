import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { chatBotSession } from '../api';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [quickRepliesVisible, setQuickRepliesVisible] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [userInput2, setUserInput2] = useState('');
  const [isUserInputEnabled, setIsUserInputEnabled] = useState(false);
  const [isUserInputEnabled2, setIsUserInputEnabled2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storeIssuesVisible, setStoreIssuesVisible] = useState(false);
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  

  useEffect(() => {
    const initialMessage = "안녕하세요! PETTORY에 오신 것을 환영합니다! 원하는 기능의 버튼을 클릭해 주세요😊";
    setMessages([{ text: initialMessage, sender: 'bot' }]);
    setMessages(prevMessages => [...prevMessages, { text: '멍냥이는 PETTORY의 귀염둥이 AI입니다!​\n무엇이든 물어보세요🤗​'}]);
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current && isUserInputEnabled) {
      inputRef.current.focus();
    }
    if (inputRef2.current && isUserInputEnabled2) {
      inputRef2.current.focus();
    }
  }, [isUserInputEnabled, isUserInputEnabled2]);

  const handleQuickReply = async (text) => {
    setMessages(prevMessages => [...prevMessages, { text, sender: 'user' }]);
    setQuickRepliesVisible(false);

    if (text === '상품 문의') {
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: '찾으시는 상품의 이름을 입력해주세요.', sender: 'bot' }]);
        setIsUserInputEnabled(true);
      }, 500);
    } else if (text === '매장 문의') {
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: '매장에 종이 가방이 부족하거나 청결 상태가 나빠진 경우 하단의 버튼을 클릭해주세요.\n 점주에게 안내 메일이 발송됩니다.', sender: 'bot' }]);
        setQuickRepliesVisible(false);
        setStoreIssuesVisible(true);
      }, 500);
    } else if (text === '멍냥이') {
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: "멍냥이와 대화를 시작합니다.\n대화 종료를 원할 경우 '종료'를 입력하세요."}]);
      }, 500);
      const botResponse = await chatBotSession.getGeminiResponse('');
      setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
      setQuickRepliesVisible(false);
      setIsUserInputEnabled(false);
      setIsUserInputEnabled2(true);
    }
  };

  const handleUserInput = async (e) => {
    e.preventDefault();
    setMessages(prevMessages => [...prevMessages, { text: userInput, sender: 'user' }]);
    setLoading(true);

    if (userInput === '종료') {
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: '원하는 기능의 버튼을 클릭해 주세요.\n멍냥이는 PETTORY의 귀염둥이 AI입니다!​\n무엇이든 물어보세요🤗​'}]);
        setQuickRepliesVisible(true);
      }, 500);
      setIsUserInputEnabled(false);
      setUserInput('');
      setLoading(false);
      return;
    }
    
    // const userNum = localStorage.getItem('userNum');
    const userNum = 1;

    try {
      const response = await axios.get(`/petShop/chatbot/${userNum}/${userInput}`);
      const product = response.data;

      if (Array.isArray(product) && product.length > 0) {
        setTimeout(() => {
          setMessages(prevMessages => [...prevMessages, { text: `다음 상품을 보유하고 있습니다.\n\n${product.map(product => product.pdName).join('\n')}`, sender: 'bot' }]);
        }, 500);
        setTimeout(() => {
          setMessages(prevMessages => [...prevMessages, { text: "더 검색하고 싶으시면 상품 이름을 다시 입력해 주세요. 검색을 마치려면 '종료'를 입력하세요."}]);
        }, 1000);
      } else {
        setMessages(prevMessages => [...prevMessages, { text: '찾으시는 상품이 없습니다.', sender: 'bot' }]);
        setMessages(prevMessages => [...prevMessages, { text: "더 검색하고 싶으시면 상품 이름을 다시 입력해 주세요. 검색을 마치려면 '종료'를 입력하세요."}]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessages(prevMessages => [...prevMessages, { text: '상품 검색 중 오류가 발생했습니다. 다시 시도해 주세요.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }

    setUserInput('');
  };

  const handleUserInput2 = async (e) => {
    e.preventDefault();
    setMessages(prevMessages => [...prevMessages, { text: userInput2, sender: 'user' }]);
    setLoading(false);

    if (userInput2 === '종료') {
      chatBotSession.resetSession();
      setMessages(prevMessages => [...prevMessages, { text: '원하는 기능의 버튼을 클릭해 주세요.\n멍냥이는 PETTORY의 귀염둥이 AI입니다!​\n무엇이든 물어보세요🤗​'}]);
      setQuickRepliesVisible(true); // 상품 문의와 매장 문의 버튼을 다시 활성화
      setIsUserInputEnabled2(false); // userInput2 비활성화
      setUserInput2(''); // userInput2 초기화
      setLoading(false);
      return;
    }


    try {
      const botResponse = await chatBotSession.getGeminiResponse(userInput2);
      setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages(prevMessages => [...prevMessages, { text: '응답을 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }

    setUserInput2('');
  };

  const handleStoreIssue = async (text) => {
    setMessages(prevMessages => [...prevMessages, { text, sender: 'user' }]);
    setStoreIssuesVisible(false);
    setQuickRepliesVisible(false);

    if (text === '종이 가방 부족') {
      setMessages(prevMessages => [...prevMessages, { text: '잠시만 기다려 주세요...'}]);
      try {
        const mailType = "종이";
        await axios.get(`/petShop/chatbot/${mailType}`);
        setMessages(prevMessages => [...prevMessages, { text: '점주에게 안내 메일이 발송되었습니다.', sender: 'bot' }]);
        setQuickRepliesVisible(true);
        setIsUserInputEnabled(false);
        setUserInput('');
        setLoading(false);
      } catch (error) {
        console.error('Error sending mail:', error);
        setMessages(prevMessages => [...prevMessages, { text: '메일 발송 중 오류가 발생했습니다. 다시 시도해 주세요.', sender: 'bot' }]);
      }
    } else if (text === '매장 청결 이상') {
      setMessages(prevMessages => [...prevMessages, { text: '잠시만 기다려 주세요...', sender: 'bot' }]);
      try {
        const mailType = "청결";
        await axios.get(`/petShop/chatbot/${mailType}`);
        setMessages(prevMessages => [...prevMessages, { text: '점주에게 안내 메일이 발송되었습니다.', sender: 'bot' }]);
        setQuickRepliesVisible(true);
        setIsUserInputEnabled(false);
        setUserInput('');
        setLoading(false);
      } catch (error) {
        console.error('Error sending mail:', error);
        setMessages(prevMessages => [...prevMessages, { text: '메일 발송 중 오류가 발생했습니다. 다시 시도해 주세요.', sender: 'bot' }]);
      }
    } else if (text === '종료') {
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: '원하는 기능의 버튼을 클릭해 주세요.\n멍냥이는 PETTORY의 귀염둥이 AI입니다!​\n무엇이든 물어보세요🤗​'}]);
        setQuickRepliesVisible(true);
      }, 500);
      setIsUserInputEnabled(false);
      setUserInput('');
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <span className="sender-icon">{msg.sender === 'user' ? '🙂' : '🐬'}</span>
            <span className="message-text" style={{ whiteSpace: 'pre-line' }}>{msg.text}</span>
          </div>
        ))}
        {quickRepliesVisible && (
          <div className="quick-replies">
            <button onClick={() => handleQuickReply('상품 문의')}>상품 문의</button><br />
            <button onClick={() => handleQuickReply('매장 문의')}>매장 문의</button><br />
            <button onClick={() => handleQuickReply('멍냥이')}>멍냥이</button><br />
          </div>
        )}
        {storeIssuesVisible && (
          <div className="quick-replies">
            <button onClick={() => handleStoreIssue('종이 가방 부족')}>종이 가방 부족</button><br />
            <button onClick={() => handleStoreIssue('매장 청결 이상')}>매장 청결 이상</button><br />
            <button onClick={() => handleStoreIssue('종료')}>종료</button><br />
          </div>
        )}
        {loading && <div className="loading">로딩 중...</div>}
      </div>
      {isUserInputEnabled && (
        <form onSubmit={handleUserInput} className="chat-input-form">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="상품명을 입력하세요"
            ref={inputRef}
          />
          <button type="submit" disabled={loading}>전송</button>
        </form>
      )}
      {isUserInputEnabled2 && (
        <form onSubmit={handleUserInput2} className="chat-input-form">
          <input
            type="text"
            value={userInput2}
            onChange={(e) => setUserInput2(e.target.value)}
            placeholder="멍냥이와 대화하기"
            ref={inputRef2}
          />
          <button type="submit" disabled={loading}>전송</button>
        </form>
      )}
    </div>
  );
};

export default Chatbot;
