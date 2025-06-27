import { useState } from "react";
import myAxios from "../axios";

const UploadImageForm = ({ productId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("product", productId);
    formData.append("image", file);
    formData.append("alt_text", altText);

    try {
      const res = await myAxios.post("/product-images/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess(res.data);
      setFile(null);
      setAltText("");
    } catch (err) {
      console.error("Ошибка загрузки изображения", err);
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm"
      />
      <input
        type="text"
        placeholder="Альтернативный текст"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        className="border border-gray-300 p-1 rounded w-full"
      />
      <button
        onClick={handleUpload}
        type="button"
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Загрузить
      </button>
    </div>
  );
};

export default UploadImageForm;
