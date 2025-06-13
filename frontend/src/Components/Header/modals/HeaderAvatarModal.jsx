import { motion, AnimatePresence } from "framer-motion";

const HeaderAvatarModal = ({ showAvatarModal, setShowAvatarModal, user }) => {
  return (
    <AnimatePresence>
      {showAvatarModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowAvatarModal(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img
              src={user.photo}
              alt="avatar"
              className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={() => setShowAvatarModal(false)}
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderAvatarModal;
