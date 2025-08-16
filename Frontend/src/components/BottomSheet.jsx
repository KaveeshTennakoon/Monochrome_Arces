import { motion } from "motion/react";

function BottomSheet({ children, onClose }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        exit={{ opacity: 0 }}
        className="w-full h-[100dvh] bg-black fixed bottom-0 left-0"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white fixed bottom-0 left-0 rounded-t-2xl p-5 z-50"
      >
        {children}
      </motion.div>
    </>
  );
}

export default BottomSheet;
