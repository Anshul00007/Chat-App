import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as THREE from "three";

const ws = new WebSocket("ws://localhost:8081");

const LandingPage: React.FC = () => {
  const [view, setView] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const Navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      alert("Room ID cannot be empty");
      return;
    }

    ws.send(
      JSON.stringify({
        type: "join",
        payload: { roomId },
      })
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "joined") {
        Navigate(`/chat/${roomId}`);
      } else if (data.type === "error") {
        alert(data.message);
      }
    };
  };

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      alert("Room Name cannot be empty");
      return;
    }

    ws.send(
      JSON.stringify({
        type: "create",
        payload: { roomName },
      })
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "success") {
        Navigate(`/chat/${roomName}`);
      } else if (data.type === "error") {
        alert(data.message);
      }
    };
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.SphereGeometry(0.1, 6, 6);
    const particlesMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
    });
    const particles: any = [];

    for (let i = 0; i < 500; i++) {
      const particle = new THREE.Mesh(particlesGeometry, particlesMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
      scene.add(particle);
      particles.push(particle);
    }

    const light = new THREE.PointLight(0x00ff00, 2, 100);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera.position.z = 20;

    let time = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.01;

      particles.forEach((particle: any) => {
        particle.position.x += Math.sin(time + Math.random()) * 0.5;
        particle.position.y += Math.cos(time + Math.random()) * 0.5;
        particle.position.z += Math.sin(time + Math.random()) * 0.5;
      });

      light.intensity = Math.sin(time) * 1.5 + 1.5;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
      />

      <motion.header
        className="text-center mb-12 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-teal-500 to-blue-600 text-transparent bg-clip-text">
          Chat App By Anshul
        </h1>
        <p className="text-lg font-medium text-gray-300">
          Join or Create a Room to Begin
        </p>
      </motion.header>

      {!view && (
        <motion.div
          className="flex space-x-6 mt-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.button
            onClick={() => { setView("join"); }}
            className="px-8 py-4 text-xl bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Join Room
          </motion.button>

          <motion.button
            onClick={() => { setView("create"); }}
            className="px-8 text-black py-4 text-xl bg-gradient-to-r from-indigo-400 to-indigo-800 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Create Room
          </motion.button>
        </motion.div>
      )}

      {view === "join" && (
        <motion.div
          className="flex flex-col items-center mt-12 space-y-6 bg-gray-800 rounded-lg p-8 shadow-xl border-4 border-teal-500"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-teal-400">Join Room</h2>
          <input
            type="text"
            placeholder="Enter Room ID"
            className="px-4 py-3 w-72 text-lg bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            onClick={handleJoinRoom}
            className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Submit
          </button>
          <button
            onClick={() => setView(null)}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back
          </button>
        </motion.div>
      )}

      {view === "create" && (
        <motion.div
          className="flex flex-col items-center mt-12 space-y-6 bg-gray-800 rounded-lg p-8 shadow-xl border-4 border-indigo-500"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-indigo-400">Create Room</h2>
          <input
            type="text"
            placeholder="Enter Room Name"
            className="px-4 py-3 w-72 text-lg bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            onClick={handleCreateRoom}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Create
          </button>
          <button
            onClick={() => setView(null)}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LandingPage;
