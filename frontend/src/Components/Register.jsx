import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/register/', { username, password })
      .then(() => alert('Регистрация успешна'))
      .catch(() => alert('Ошибка регистрации'));
  };

  useEffect(() => {
      document.title = 'Register';
    }, []);

  return (
    <form onSubmit={register} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Регистрация</h2>

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
        Зарегистрироваться
      </button>
    </form>
  );
}
