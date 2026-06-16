import { useMemo, useRef, useState, useEffect } from "react";
import { FaMagnifyingGlass, FaCheck } from "react-icons/fa6";

/**
 * Dropdown multi-pilih dengan pencarian (searchable tag select).
 * props: label, icon, options (string[]), value (string[]), onChange, placeholder, hint
 */
export default function MultiSelect({ label, icon: Icon, options, value, onChange, placeholder, hint }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q)).slice(0, 200);
  }, [options, search]);

  const toggle = (opt) =>
    value.includes(opt) ? onChange(value.filter((v) => v !== opt)) : onChange([...value, opt]);

  return (
    <div className="relative" ref={ref}>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        {Icon && (
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
            <Icon className="text-xs" />
          </span>
        )}
        {label}
        {hint && <span className="font-normal text-slate-400">· {hint}</span>}
      </label>

      <div
        onClick={() => setOpen((o) => !o)}
        className={`flex min-h-[48px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-2xl border bg-white/80 px-3 py-2 transition-all ${
          open ? "border-brand-400 ring-4 ring-brand-100" : "border-slate-200 hover:border-brand-300"
        }`}
      >
        {value.length === 0 && <span className="text-sm text-slate-400">{placeholder || "Pilih..."}</span>}
        {value.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm"
          >
            {v}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggle(v); }}
              className="ml-0.5 rounded-full hover:bg-white/25"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <FaMagnifyingGlass className="text-slate-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <ul className="max-h-56 overflow-auto py-1 text-sm">
            {filtered.length === 0 && <li className="px-3 py-3 text-center text-slate-400">Tidak ada hasil.</li>}
            {filtered.map((opt) => {
              const active = value.includes(opt);
              return (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => toggle(opt)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left capitalize transition-colors ${
                      active ? "bg-brand-50 text-brand-700" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span>{opt}</span>
                    {active && <FaCheck className="text-brand-500" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
