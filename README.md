# Simple Chat App

A simple real-time chat app built with **Node.js**, **Express**, and **Socket.IO**.

## Features

- Join with a username
- Real-time public chat room
- Online users list
- Typing indicator
- In-memory message history while the server is running
- Responsive browser UI

## Run locally

```bash
npm install
npm start
```

Open:

```txt
http://localhost:3000
```

Health check:

```txt
http://localhost:3000/health
```

## Deploy online with Render

### 1. Create a GitHub repository

Create a new repository on GitHub, for example:

```txt
simple-chat-app
```

Then from this project folder run:

```bash
git init
git add .
git commit -m "Initial simple chat app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/simple-chat-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Create a Render web service

1. Go to https://render.com
2. Sign up or log in
3. Click **New +**
4. Choose **Web Service**
5. Connect your GitHub repository
6. Use these settings:

```txt
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Render will deploy the app and give you a public URL like:

```txt
https://simple-chat-app.onrender.com
```

Send that link to your friends.

## Important notes

This version stores messages in memory, so messages disappear when the server restarts.

For the next improved version, add:

- Login/signup
- Private chats
- Group rooms
- MongoDB/PostgreSQL database
- Message persistence
- User authentication
- Better security and rate limiting
