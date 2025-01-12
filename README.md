# Chat App 🎉

A real-time chat application where users can create chat rooms, invite others, and join existing conversations. Built with modern technologies for an engaging and seamless experience.

## 🌟 Features

- **Create Chat Rooms**: Set up chat rooms quickly for private or group conversations.  
- **Invite Friends**: Share unique links to invite others to your chat rooms.  
- **Join Existing Rooms**: Easily connect to ongoing chats.  
- **Real-Time Messaging**: Instant updates using WebSockets.  
- **Modern UI**: Minimalistic and responsive design with Tailwind CSS.  

---

## 🛠️ Tech Stack

### Frontend
- **React** with **TypeScript**  
- **Tailwind CSS**  

### Backend
- **Node.js** with **TypeScript**  
- **WebSockets** for real-time communication  

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)  
- **npm** (v7 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/chat-app.git
   cd chat-app
   ```

2. **Install dependencies**:
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Configure environment variables**:
   Create a `.env` file in the `backend` directory with the following:
   ```env
   PORT=4000
   SOCKET_PORT=5000
   ```

4. **Run the application**:
   - Start the backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Start the frontend:
     ```bash
     cd ../frontend
     npm run dev
     ```

5. **Access the app**:  
   Open your browser and visit [http://localhost:3000](http://localhost:3000).

---

## 🌐 Project Structure

```plaintext
chat-app/
├── backend/         # Backend server with WebSocket logic
│   ├── src/         # TypeScript source files for backend
│   └── package.json # Backend dependencies
├── frontend/        # React-based frontend
│   ├── src/         # TypeScript + Tailwind CSS source files
│   └── package.json # Frontend dependencies
└── README.md        # Project documentation
```

---

## 🤝 Contributing

We welcome contributions to enhance this project! Here's how you can help:

1. **Fork the repository**.  
2. **Create a branch**: `git checkout -b feature-name`.  
3. **Make your changes** and commit them: `git commit -m 'Add new feature'`.  
4. **Push the branch**: `git push origin feature-name`.  
5. **Submit a pull request**.  

---

## 📧 Contact

For questions or collaboration:  
- **GitHub**: [Anshul00007](https://github.com/your-username)  
- **Email**: anshulshamnani5@gmail.com 

---
