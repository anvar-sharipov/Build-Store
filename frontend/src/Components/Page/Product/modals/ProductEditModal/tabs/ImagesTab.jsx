import { useFormikContext, Field, ErrorMessage } from "formik";
import { QRCode } from "react-qrcode-logo";
import UploadImageForm from "../../../../../UI/UploadImageForm";

function QRDisplay({ code }) {
  return (
    <div className="flex items-center justify-center w-20 h-20 border rounded">
      <QRCode value={code} size={64} />
    </div>
  );
}

const ImagesTab = ({ options, product, setProduct }) => {
  const { values } = useFormikContext();

  return (
    <div className="space-y-4">
      {/* QR код: инпут + изображение в 1 строку */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">QR код</label>
          <Field
            name="qr_code"
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800 text-sm"
            placeholder="QR code продукта"
            autoComplete="off"
            disabled
          />
        </div>
        <div className="mt-6">
          <QRDisplay code={values.qr_code} />
        </div>
      </div>

      {/* Изображения продукта */}
      {product.images?.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
          {product.images.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={img.image}
                alt={img.alt_text || ""}
                className="w-full h-24 object-cover rounded border border-gray-300"
                // w-full h-24 object-cover
                // width={100}
              />
              {img.alt_text && (
                <p className="text-[10px] text-center text-gray-500 mt-1 truncate">
                  {img.alt_text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Форма загрузки */}
      <UploadImageForm
        productId={product.id}
        onSuccess={(newImage) =>
          setProduct((prev) => ({
            ...prev,
            images: [...prev.images, newImage],
          }))
        }
      />
    </div>
  );
};

export default ImagesTab;
