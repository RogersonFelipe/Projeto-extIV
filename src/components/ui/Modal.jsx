import { useEffect } from "react";
import { createPortal } from "react-dom";

export function Modal({ children, onClose, wide = false }) {
  useEffect(() => {
    function esc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
      <div
        className={`relative bg-white rounded-xl shadow-2xl w-full ${wide ? "max-w-4xl" : "max-w-2xl"}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ModalHeader({
  title,
  subtitle,
  icon,
  onClose,
  color = "from-slate-700 to-slate-600",
}) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-5 bg-gradient-to-r ${color} rounded-t-xl`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="material-icons-outlined text-white text-xl">
            {icon}
          </span>
        </div>
        <div>
          <p className="text-xs text-white/70 font-medium uppercase tracking-wide">
            {subtitle}
          </p>
          <h2 className="text-base font-bold text-white leading-tight truncate max-w-xs">
            {title}
          </h2>
        </div>
      </div>
      <button onClick={onClose} className="text-white/70 hover:text-white transition">
        <span className="material-icons-outlined text-xl">close</span>
      </button>
    </div>
  );
}
