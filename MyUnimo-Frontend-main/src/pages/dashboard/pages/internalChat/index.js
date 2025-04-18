import { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Paper, TextField, IconButton, List, ListItem, ListItemText, Divider, Box, Avatar, } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Alice', message: 'Hello Bob!', timestamp: '10:00 AM' },
    { sender: 'Bob', message: 'Hi Alice, how are you?', timestamp: '10:01 AM' },
  ]);
  const [receiver, setReceiver] = useState('Bob');

  const messagesEndRef = useRef(null);

  // Simulate sending a message
  const handleSendMessage = () => {
    if (message.trim() === '') return; // Prevent sending empty messages
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { sender: 'Alice', message, timestamp }]);
    setMessage('');
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default Enter key behavior (e.g., form submission)
      handleSendMessage();
    }
  };

  // Scroll to the bottom of the messages list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box sx={{ display: 'flex', height: '70vh' }}>
      <Paper sx={{ width: '25%', backgroundColor: 'background.paper' }} square>
        <List>
          <ListItem button>
            <Avatar sx={{ mr: 1 }}><PersonIcon /></Avatar>
            <ListItemText primary="Bob" />
          </ListItem>
          <Divider />
        </List>
      </Paper>
      <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <AppBar position="static" sx={{ backgroundColor: '#cecece' }}>
          <Toolbar>
            <Typography variant="h6">Chat with {receiver}</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: msg.sender === 'Alice' ? 'row-reverse' : 'row',
                mb: 2,
                alignItems: 'flex-end',
              }}
            >
              <Avatar sx={{ ml: 1, mr: 1, bgcolor: msg.sender === 'Alice' ? '#cecece' : '#eaebee' }} >
                {msg.sender === 'Alice' ? <PersonIcon /> : <PersonIcon />}
              </Avatar>
              <Box
                sx={{
                  maxWidth: '80%',
                  p: 2,
                  borderRadius: '16px',
                  backgroundColor: msg.sender === 'Alice' ? '#cecece' : '#eaebee',
                  color: 'black',
                  textAlign: msg.sender === 'Alice' ? 'right' : 'left',
                }}
              >
                <Typography variant="body1">{msg.message}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                  <Typography variant="caption">{msg.timestamp}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <TextField
            sx={{ flexGrow: 1, mr: 1 }}
            label="Type a message"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
