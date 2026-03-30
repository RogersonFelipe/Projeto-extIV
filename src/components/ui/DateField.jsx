import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fmtData } from "../../utils/date";

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const WEEK_PT = ["D", "S", "T", "Q", "Q", "S", "S"];

export function DateField({ label, name, value, onChange, err }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const calRef = useRef(null);

  const parsed = value
    ? (() => {
        const [y, m, d] = value.split("-").map(Number);
        return { y, m: m - 1, d };
      })()
    : null;

  const today = new Date();
  const [viewY, setViewY] = useState(parsed?.y ?? today.getFullYear());
  const [viewM, setViewM] = useState(parsed?.m ?? today.getMonth());

  function openCalendar() {
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: r.left });
    setOpen(true);
  }

  function selectDay(d) {
    const mm = String(viewM + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange({ target: { name, value: `${viewY}-${mm}-${dd}` } });
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function out(e) {
      if (
        calRef.current &&
        !calRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", out);
    return () => document.removeEventListener("mousedown", out);
  }, [open]);

  const firstDay = new Date(viewY, viewM, 1).getDay();
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();

  const calendar =
    open &&
    createPortal(
      <div
        ref={calRef}
        style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999, minWidth: 264 }}
        className="bg-white rounded-xl shadow-2xl border border-gray-200 p-3"
      >
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => {
              if (viewM === 0) { setViewM(11); setViewY((y) => y - 1); }
              else setViewM((m) => m - 1);
            }}
            className="p-1 rounded hover:bg-gray-100"
          >
            <span className="material-icons-outlined text-gray-500 text-sm">chevron_left</span>
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {MONTHS_PT[viewM]} {viewY}
          </span>
          <button
            type="button"
            onClick={() => {
              if (viewM === 11) { setViewM(0); setViewY((y) => y + 1); }
              else setViewM((m) => m + 1);
            }}
            className="p-1 rounded hover:bg-gray-100"
          >
            <span className="material-icons-outlined text-gray-500 text-sm">chevron_right</span>
          </button>
        </div>
        <div className="grid grid-cols-7 text-center mb-1">
          {WEEK_PT.map((w, i) => (
            <span key={i} className="text-xs font-semibold text-gray-400 py-1">{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center gap-y-1">
          {Array(firstDay).fill(null).map((_, i) => <span key={"e" + i} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const sel = parsed && parsed.y === viewY && parsed.m === viewM && parsed.d === d;
            const isToday =
              d === today.getDate() && viewM === today.getMonth() && viewY === today.getFullYear();
            return (
              <button
                key={d}
                type="button"
                onClick={() => selectDay(d)}
                className={`w-8 h-8 mx-auto rounded-full text-xs flex items-center justify-center transition font-medium
                  ${sel ? "bg-slate-700 text-white" : isToday ? "ring-2 ring-slate-400 text-slate-700 font-bold" : "text-gray-700 hover:bg-gray-100"}`}
              >
                {d}
              </button>
            );
          })}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => { onChange({ target: { name, value: "" } }); setOpen(false); }}
            className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-red-500 transition py-1.5 rounded-lg hover:bg-red-50"
          >
            <span className="material-icons-outlined text-xs">close</span> Limpar data
          </button>
        )}
      </div>,
      document.body,
    );

  return (
    <div>
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          calendar_today
        </span>
        <button
          type="button"
          ref={btnRef}
          onClick={openCalendar}
          className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm text-left focus:outline-none focus:ring-2 focus:ring-slate-300 transition
            ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-white"}`}
        >
          {value ? fmtData(value) : <span className="text-gray-400">Selecione a data</span>}
        </button>
      </div>
      {err && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">error</span>
          {err}
        </p>
      )}
      {calendar}
    </div>
  );
}
