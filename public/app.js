const socket = io();

const loginCard = document.querySelector('#loginCard');
const chatCard = document.querySelector('#chatCard');
const loginForm = document.querySelector('#loginForm');
const usernameInput = document.querySelector('#usernameInput');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#messageInput');
const messages = document.querySelector('#messages');
const usersList = document.querySelector('#usersList');
const onlineCount = document.querySelector('#onlineCount');
const statusText = document.querySelector('#statusText');
const typingText = document.querySelector('#typingText');

let currentUser = '';
let typingTimer;
const typingUsers = new Set();

function formatTime(iso) {
  return new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function addMessage(message) {
  const li = document.createElement('li');
  li.className = `message ${message.username === currentUser ? 'mine' : ''}`;
  li.innerHTML = `
    <div class="meta"><strong></strong><span>${formatTime(message.time)}</span></div>
    <div class="content"></div>
  `;
  li.querySelector('strong').textContent = message.username;
  li.querySelector('.content').textContent = message.content;
  messages.appendChild(li);
  scrollToBottom();
}

function addSystemMessage(text) {
  const li = document.createElement('li');
  li.className = 'system';
  li.textContent = text;
  messages.appendChild(li);
  scrollToBottom();
}

function renderTyping() {
  const names = Array.from(typingUsers).filter((name) => name !== currentUser);
  typingText.textContent = names.length ? `${names.join(', ')} typing...` : '';
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  currentUser = usernameInput.value.trim() || 'Guest';
  socket.emit('user:join', currentUser);
  loginCard.classList.add('hidden');
  chatCard.classList.remove('hidden');
  messageInput.focus();
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit('chat:message', text);
  socket.emit('typing:stop');
  messageInput.value = '';
});

messageInput.addEventListener('input', () => {
  socket.emit('typing:start');
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => socket.emit('typing:stop'), 900);
});

socket.on('connect', () => {
  statusText.textContent = 'Connected';
});

socket.on('disconnect', () => {
  statusText.textContent = 'Disconnected, reconnecting...';
});

socket.on('chat:history', (history) => {
  messages.innerHTML = '';
  history.forEach(addMessage);
});

socket.on('chat:message', addMessage);
socket.on('system:message', addSystemMessage);

socket.on('users:update', (users) => {
  usersList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user;
    usersList.appendChild(li);
  });
  onlineCount.textContent = users.length;
});

socket.on('typing:start', (username) => {
  typingUsers.add(username);
  renderTyping();
});

socket.on('typing:stop', (username) => {
  typingUsers.delete(username);
  renderTyping();
});
