import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useSpring } from 'react-spring';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

const LiveChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hi! What is your name?', sender: 'bot' },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 200);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);
  
  const faqList = [
    { question: 'What are your working hours?', answer: 'Our working hours are 9 AM to 6 PM, Monday to Friday.' },
    { question: 'How can I book a tour?', answer: 'You can book a tour by calling our office during working hours. Our team will assist you with the process.' },
    { question: 'Do you offer group tours?', answer: 'Yes, we offer group tours. Please call us for more information and to check availability.' },
    { question: 'What types of tours do you provide?', answer: 'We offer city tours, adventure tours, cultural tours, and custom tours tailored to your preferences.' },
    { question: 'Is advance booking required?', answer: 'Yes, we recommend booking in advance to secure your preferred tour date and time.' },
    { question: 'What payment methods do you accept?', answer: 'We accept credit/debit cards, bank transfers, and cash payments. Payment details can be confirmed during the booking call.' },
    { question: 'Do you offer tours in multiple languages?', answer: 'Yes, we have multilingual guides for many of our tours. Please let us know your preferred language when booking.' },
    { question: 'Are meals included in the tours?', answer: 'Some tours include meals, while others do not. Please confirm this detail with our team when making a booking.' },
    { question: 'What safety measures are in place for the tours?', answer: 'We prioritize safety and ensure that all tours comply with the necessary safety guidelines. Please ask our team for specifics about your chosen tour.' },
];

  const handleSendMessage = () => {
    if (userMessage.trim() === '') return;

    const newMessages = [...messages, { text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setUserMessage('');

    if (userName === '') {
      setUserName(userMessage);
      const botGreeting = `Hi ${userMessage}, Thank you for getting in touch! How can I assist you today?`;
      setMessages(prevMessages => [...prevMessages, { text: botGreeting, sender: 'bot' }]);

      setTimeout(() => {
        setShowFAQ(true); // Show FAQ suggestions
        setMessages(prevMessages => [
          ...prevMessages,
          { text: "Here are some frequently asked questions:", sender: 'bot' }
        ]);
      }, 500);
    } else {
      setTimeout(() => {
        const botResponse = 'I will help you with that shortly!';
        setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
      }, 1000);
    }
  };

  const handleFAQClick = (faq) => {
    const newMessages = [
      ...messages,
      { text: `You asked: ${faq.question}`, sender: 'user' },
      { text: faq.answer, sender: 'bot' }, 
    ];

    setMessages(newMessages);

    // After showing the answer, hide FAQ
    setShowFAQ(false);

    setTimeout(() => {
      const botFollowUp = "Is there anything else I can assist you with?";
      setMessages(prevMessages => [...prevMessages, { text: botFollowUp, sender: 'bot' }]);
    }, 500);
  };

  const handleRest = () => {
    setMessages([{ text: 'Hi! What is your name?', sender: 'bot' }]);
    setUserMessage('');
    setUserName('');
    setShowFAQ(false);
  };

  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {isMobile && !visible && (<div
        onClick={toggleChatWindow}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#0077b6',
          borderRadius: '50%',
          padding: '20px',
          cursor: 'pointer',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          zIndex: '9999',
        }}
      >
        <ChatIcon style={{ color: 'white', fontSize: '30px' }} />
      </div>)}

      {!isMobile && (<div
        onClick={toggleChatWindow}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#0077b6',
          borderRadius: '50%',
          padding: '20px',
          cursor: 'pointer',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          zIndex: '9999',
        }}
      >
        <ChatIcon style={{ color: 'white', fontSize: '30px' }} />
      </div>)}

      {isChatOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '80px',
            right: '30px',
            width: '300px',
            height: '450px', 
            backgroundColor: '#cce6f4',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: '10000',
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Typography variant="h5" sx={{ fontFamily: 'Dancing Script', fontSize: '18px' }}>Live Chat</Typography>
            <Button onClick={toggleChatWindow} style={{ padding: '0', minWidth: 'auto', fontSize: '18px' }}>X</Button>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: '1',
              overflowY: 'auto',
              padding: '10px 0',
              marginTop: '10px',
              borderBottom: '1px solid #ddd',
              marginBottom: '10px',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  textAlign: message.sender === 'bot' ? 'left' : 'right',
                  marginBottom: '15px',
                }}
              >
                <Typography
                  sx={{
                    display: 'inline-block',
                    backgroundColor: message.sender === 'bot' ? '#f0f0f0' : '#25d366',
                    color: message.sender === 'bot' ? '#000' : '#fff',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    maxWidth: '80%',
                    fontSize: '16px',
                    lineHeight: '1.5',
                  }}
                >
                  {message.text}
                </Typography>
              </div>
            ))}
            {showFAQ && (
              <Box sx={{ marginTop: '20px' }}>
                <List>
                  {faqList.map((faq, index) => (
                    <ListItem button key={index} onClick={() => handleFAQClick(faq)}>
                      <ListItemText primary={faq.question} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>

          <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
           variant="outlined"
            placeholder="Type a message..."
            fullWidth
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); 
                handleSendMessage(); 
              }
            }}
            style={{ marginRight: '10px', fontSize: '14px', width: 'calc(100% - 50px)' }}
            InputProps={{
              style: {
                fontSize: '14px',
                padding: '10px',
              }
            }}
          />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              sx={{
                backgroundColor: '#0077b6',
                fontSize: '16px',
                padding: '10px 15px',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#128c7e',
                },
              }}
            >
              Send
            </Button>
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <Button
              variant="text"
              backgroundColor="#880d1e"
              onClick={handleRest}
              sx={{
                fontSize: '14px',
                color: '#ff6347',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
                marginRight: '5px', 
              }}
            >
              Rest Chat
            </Button>

            <Button
              variant="text"
              backgroundColor="#280556"
              onClick={() => setShowFAQ(!showFAQ)}
              sx={{ fontSize: '14px' }}
            >
              {showFAQ ? 'Hide FAQs' : 'Show FAQs'}
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default LiveChat;
