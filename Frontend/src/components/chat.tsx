import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function ChatApp() {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: roomId,
          },
        })
      );
      console.log(`Joined room ${roomId}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: data.sender, message: data.message },
          ]);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    const message = inputRef.current?.value;

    if (message && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: message,
          },
        })
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "me", message: message },
      ]);

      inputRef.current.value = "";
    }
  };

  return (
    <motion.div
      className="flex flex-col justify-between bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      
      <motion.header
        className="bg-gray-900 p-4 shadow-xl text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-lg font-bold text-indigo-400">
          Chat Room - <span className="text-teal-500">{roomId}</span>
        </h1>
      </motion.header>

   
      <motion.main
        className="flex-1 overflow-y-auto p-4 space-y-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`p-3 rounded-lg shadow-xl max-w-xs ${
              msg.sender === "me"
                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white ml-auto"
                : "bg-gradient-to-r from-purple-400 to-purple-600 text-white mr-auto"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              
            }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 150,
              damping: 25,
              delay: index * 0.2,
            }}
          >
            <span className="block text-sm font-semibold">
              {msg.sender === "me" ? "You" : msg.sender}
            </span>
            <span>{msg.message}</span>
          </motion.div>
        ))}
      </motion.main>

    
      <footer className="bg-gray-900 p-4 flex items-center space-x-3">
        <motion.input
          ref={inputRef}
          type="text"
          placeholder="Type your message here"
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          whileFocus={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
        <motion.button
          onClick={handleSendMessage}
          className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          whileHover={{
            scale: 1.1,
            transition: { type: "spring", stiffness: 300 },
          }}
          whileTap={{
            scale: 0.95,
            transition: { type: "spring", stiffness: 500 },
          }}
        >
          Send
        </motion.button>
      </footer>
    </motion.div>
  );
}
