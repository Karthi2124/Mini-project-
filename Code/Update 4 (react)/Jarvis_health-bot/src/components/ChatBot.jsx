import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaPaperPlane, FaAmbulance } from 'react-icons/fa';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Initial greeting
    setMessages([{ 
      text: "Hello! I'm Jarvis, your AI health assistant. How can I help you today?", 
      sender: 'bot',
      id: Date.now() 
    }]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user', id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botMessage = { 
        text: getBotResponse(input),
        sender: 'bot',
        id: Date.now() + 1
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('emergency') || lowerInput.includes('help')) {
      setEmergencyMode(true);
      return "I've detected this might be an emergency. Please confirm if you need immediate assistance.";
    }
    
    if (lowerInput.includes('symptom') || lowerInput.includes('pain')) {
      return "I can provide general health information, but for specific symptoms, please consult a doctor immediately if severe.";
    }
    
    return "I'm analyzing your health query. For accurate medical advice, please consult a healthcare professional.";
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in your browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    isListening ? recognition.stop() : recognition.start();
  };

  const handleEmergencyConfirm = () => {
    setMessages(prev => [...prev, 
      { text: "Emergency services have been alerted. Help is on the way.", sender: 'bot', id: Date.now() }
    ]);
    setEmergencyMode(false);
    // In a real app, call emergency services API here
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Health Assistant
        </motion.h2>
      </div>

      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`message ${msg.sender}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: msg.sender === 'user' ? 50 : -50 }}
              transition={{ duration: 0.3 }}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {emergencyMode && (
        <motion.div 
          className="emergency-confirm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <p>Is this a medical emergency?</p>
          <div className="emergency-buttons">
            <button onClick={handleEmergencyConfirm}>Yes, Get Help</button>
            <button onClick={() => setEmergencyMode(false)}>No, False Alarm</button>
          </div>
        </motion.div>
      )}

      <div className="chat-input">
        <motion.button
          className={`mic-btn ${isListening ? 'active' : ''}`}
          onClick={toggleSpeechRecognition}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaMicrophone />
        </motion.button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your health query..."
        />
        <motion.button 
          className="send-btn"
          onClick={handleSend}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaPaperPlane />
        </motion.button>
      </div>

      <div className="emergency-section">
        <motion.button
          className="emergency-btn"
          onClick={() => setEmergencyMode(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaAmbulance /> Emergency Help
        </motion.button>
      </div>
    </div>
  );
};

export default ChatBot;