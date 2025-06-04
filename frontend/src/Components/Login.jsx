import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const login = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/token/', { username, password })
      .then(res => {
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        setMessageType('success');
        setMessage('Успешный вход');
        window.location = '/faktura'
      })
      .catch(() => {
        setMessageType('error');
        setMessage('Ошибка входа');
      });
  };

  useEffect(() => {
      document.title = 'Login';
    }, []);

  return (
    <form onSubmit={login} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Вход</h2>

      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Имя"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Пароль"
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Войти
      </button>

      <AnimatePresence>
        {message && (
          <motion.div
          initial={{opacity:0, y:-10}}
          animate={{opacity:1, y:0}}
          exit={{opacity:0, y:-10}}
          className={`mt-4 p-3 rounded text-center font-semibold
            ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} 
          >
            {message}
            
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
