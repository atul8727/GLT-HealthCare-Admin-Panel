import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

/**
 * Single reusable Modal used across the app for Add/Edit forms,
 * delete confirmations, previews, etc. Don't build page-specific modals.
 */
export default function Modal({ isOpen, onClose, title, children, footer, size = "md" }) {
  const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${sizeMap[size] || sizeMap.md} overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-2xl`}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-slate-50/60 px-6 py-4">
              <h3 className="text-lg font-bold text-[#14142B]">{title}</h3>
              <button
                onClick={onClose}
                className="cursor-pointer rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close dialog"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-[#E2E8F0] bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}