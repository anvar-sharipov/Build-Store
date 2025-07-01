import MyModal from "../../../UI/MyModal";

const ProductDeleteModal = ({
  setOpenDeleteModal,
  openDeleteModal,
  deleteProduct,
  loadingDeleteId,
  t,
}) => {
  const { data } = openDeleteModal;

  return (
    <MyModal
      onClose={() =>
        setOpenDeleteModal({ open: false, data: null, index: null })
      }
    >
      <div className="max-w-md mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t("confirmDeleteProduct")}
          </h2>

          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            «{data.name}»
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("thisActionIsIrreversible")}
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              onClick={() => setOpenDeleteModal({ open: false, data: null })}
            >
              {t("cancel")}
            </button>
            <button
              disabled={loadingDeleteId === data.id}
              onClick={() => deleteProduct(data.id, data.name)}
              className={`px-5 py-2 rounded-lg text-white transition ${
                loadingDeleteId === data.id
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loadingDeleteId === data.id ? t("deleting") : t("delete")}
            </button>
          </div>
        </div>
      </div>
    </MyModal>
  );
};

export default ProductDeleteModal;
