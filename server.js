const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const messages = [];
const users = new Map();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ ok: true, usersOnline: users.size, messages: messages.length });
});

io.on('connection', (socket) => {
  socket.emit('chat:history', messages.slice(-50));

  socket.on('user:join', (username) => {
    const cleanName = String(username || 'Guest').trim().slice(0, 24) || 'Guest';
    users.set(socket.id, cleanName);
    socket.emit('user:joined', { username: cleanName });
    io.emit('users:update', Array.from(users.values()));
    socket.broadcast.emit('system:message', `${cleanName} joined the chat`);
  });

  socket.on('typing:start', () => {
    const username = users.get(socket.id);
    if (username) socket.broadcast.emit('typing:start', username);
  });

  socket.on('typing:stop', () => {
    const username = users.get(socket.id);
    if (username) socket.broadcast.emit('typing:stop', username);
  });

  socket.on('chat:message', (text) => {
    const username = users.get(socket.id) || 'Guest';
    const content = String(text || '').trim().slice(0, 1000);
    if (!content) return;

    const message = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      username,
      content,
      time: new Date().toISOString(),
    };

    messages.push(message);
    if (messages.length > 200) messages.shift();
    io.emit('chat:message', message);
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('users:update', Array.from(users.values()));
    if (username) socket.broadcast.emit('system:message', `${username} left the chat`);
  });
});

server.listen(PORT, () => {
  console.log(`Chat app running at http://localhost:${PORT}`);
});
