import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUser, FiLock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import myAxios from "./axios";
import MyButton from "./UI/MyButton";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [photo, setPhoto] = useState(null);

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

const register = (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("username", username.toLowerCase());
  formData.append("password", password);
  formData.append("password2", password2);
  formData.append("group", selectedGroup);
  if (photo) {
    formData.append("photo", photo);
  }

  myAxios
    .post("register/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(() => {
      setMessageType("success");
      setMessage("Регистрация успешна");
    })
    .catch((error) => {
      const data = error.response?.data || {};
      let userMessage = "Ошибка регистрации";
      console.log('errorrrrrrr', error);
      
      if (data.username?.[0] === "A user with that username already exists.") {
        userMessage = "Пользователь с таким именем уже существует";
      } else if (data.group?.[0] === "This field may not be blank.") {
        userMessage = "Группа обязательна для выбора";
      } else if (data.group?.[0] === "GROUP_NOT_FOUND") {
        userMessage = "Выбранная группа не найдена";
      } else if (data.password2?.[0] === "PASSWORDS_DO_NOT_MATCH") {
        userMessage = "Пароли не совпадают";
      }

      setMessageType("error");
      setMessage(userMessage);
    });
};

  useEffect(() => {
    myAxios
      .get("groups/")
      .then((res) => setGroups(res.data))
      .catch(() => setGroups([]));
  }, []);

  useEffect(() => {
    document.title = "Register";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <form
        onSubmit={register}
        className="w-full max-w-md p-8 bg-gray-300 dark:bg-gray-800 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-300">
          {t("register")}
        </h2>

        <div className="relative mb-6">
          <FiUser className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-300 text-lg" />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("userName")}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="relative mb-6">
          <FiLock className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-300 text-lg" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("password")}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="relative mb-6">
          <FiLock className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-300 text-lg" />
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder={t("password2")}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="mb-6">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
      bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
      focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="" disabled>
              {t("selectGroup")}
            </option>
            {groups.map((group) => (
              <option key={group.name} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            {t("uploadPhoto")}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="block w-full text-sm text-gray-700 dark:text-gray-200
               file:mr-4 file:py-2 file:px-4
               file:rounded-lg file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100"
          />
        </div>

        <MyButton
          variant="green"
          type="submit"
          className="w-full dark:text-gray-300 font-semibold py-2.5 rounded-lg transition text-gray-800"
        >
          {t("register2")}
        </MyButton>
        {/* <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
        >
          Зарегистрироваться
        </button> */}

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-6 p-3 rounded text-center font-medium shadow-sm
                ${
                  messageType === "success"
                    ? "bg-green-100 dark:bg-green-200 text-green-700"
                    : "bg-red-100 dark:bg-red-200 text-red-700"
                }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
