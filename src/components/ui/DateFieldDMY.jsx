import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const WEEK_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/** DateField que armazena/recebe valor no formato dd/mm/aaaa */
export function DateFieldDMY({ name, value, err, onChange, label = "Data" }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef(null);
  const calRef = useRef(null);

  function parseValue(v) {
    if (!v || v.length !== 10) return null;
    const [d, m, y] = v.split("/");
    const date = new Date(+y, +m - 1, +d);
    return isNaN(date) ? null : date;
  }

  const selected = parseValue(value);
  const today    = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState(() => {
    const s = parseValue(value);
    return s
      ? new Date(s.getFullYear(), s.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth(), 1);
  });

  function openCalendar() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX, width: Math.max(rect.width, 288) });
    }
    setOpen((o) => !o);
  }

  useEffect(() => {
    function handler(e) {
      if (btnRef.current && !btnRef.current.contains(e.target) &&
          calRef.current  && !calRef.current.contains(e.target))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function selectDay(day) {
    const d = String(day).padStart(2, "0");
    const m = String(view.getMonth() + 1).padStart(2, "0");
    const y = view.getFullYear();
    onChange({ target: { name, value: `${d}/${m}/${y}` } });
    setOpen(false);
  }

  const year = view.getFullYear(), month = view.getMonth();
  const offset    = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysCount = new Date(year, month + 1, 0).getDate();

  const calendar = open ? (
    <div
      ref={calRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => setView(new Date(year, month - 1, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
          <span className="material-icons-outlined text-gray-500 text-base">chevron_left</span>
        </button>
        <span className="text-sm font-semibold text-gray-800">{MONTHS_PT[month]} {year}</span>
        <button type="button" onClick={() => setView(new Date(year, month + 1, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
          <span className="material-icons-outlined text-gray-500 text-base">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {WEEK_PT.map((w) => (
          <div key={w} className="text-center text-xs font-semibold text-gray-400">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysCount }, (_, i) => i + 1).map((day) => {
          const d     = new Date(year, month, day);
          const isSel = selected && d.getTime() === selected.getTime();
          const isTod = d.getTime() === today.getTime();
          return (
            <button key={day} type="button" onClick={() => selectDay(day)}
              className={`w-8 h-8 mx-auto rounded-full text-xs flex items-center justify-center transition font-medium
                ${isSel ? "bg-slate-700 text-white" : isTod ? "ring-2 ring-slate-400 text-slate-700 font-bold" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      {value && (
        <button type="button"
          onClick={() => { onChange({ target: { name, value: "" } }); setOpen(false); }}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-red-500 transition py-1.5 rounded-lg hover:bg-red-50"
        >
          <span className="material-icons-outlined text-xs">close</span> Limpar data
        </button>
      )}
    </div>
  ) : null;

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      <button
        ref={btnRef}
        type="button"
        onClick={openCalendar}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition focus:outline-none focus:ring-2 focus:ring-slate-300
          ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-white"}`}
      >
        <span className="material-icons-outlined text-gray-400 text-base">calendar_today</span>
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || "Selecionar data"}</span>
      </button>
      {open && createPortal(calendar, document.body)}
      {err && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">error</span>
          {err}
        </p>
      )}
    </div>
  );
}
