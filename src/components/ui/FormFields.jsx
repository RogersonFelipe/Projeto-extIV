export function FieldInput({
  label,
  icon,
  name,
  value,
  onChange,
  err,
  placeholder = "",
  span,
}) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          {icon}
        </span>
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition
            ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`}
        />
      </div>
      {err && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">error</span>
          {err}
        </p>
      )}
    </div>
  );
}

export function FieldSelect({
  label,
  icon,
  name,
  value,
  onChange,
  err,
  options,
  children,
  span,
}) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          {icon}
        </span>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-11 pr-8 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition appearance-none
            ${err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`}
        >
          {children ??
            options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
        </select>
        <span className="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          expand_more
        </span>
      </div>
      {err && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">error</span>
          {err}
        </p>
      )}
    </div>
  );
}

export function FieldTextarea({
  label,
  icon,
  name,
  value,
  onChange,
  err,
  placeholder,
  span,
  rows = 3,
}) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="material-icons-outlined absolute left-3 top-3 text-gray-400 text-base pointer-events-none">
          {icon}
        </span>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`w-full pl-11 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none bg-gray-50 focus:bg-white
            ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        />
      </div>
      {err && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">error</span>
          {err}
        </p>
      )}
    </div>
  );
}
