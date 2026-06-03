import { useEffect, useRef, useState } from "react";

function SearchPicker({
  label,
  placeholder,
  value,
  selectedLabel,
  results = [],
  disabled = false,
  emptyMessage = "No results found",
  helperText,
  onSearchChange,
  onSelect,
  renderItem,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (event) => {
    onSearchChange(event.target.value);
    setOpen(true);
  };

  const handleFocus = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-semibold text-[#0b2a4a] mb-2">
        {label}
      </label>

      {selectedLabel && (
        <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">
            Selected
          </p>

          <p className="text-sm font-bold text-[#0b2a4a] mt-1">
            {selectedLabel}
          </p>
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-white rounded-xl px-4 py-3 pl-11 outline-none border border-slate-200 focus:border-[#082b4f] disabled:opacity-60 disabled:cursor-not-allowed"
        />

        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
          search
        </span>

        {value && !disabled && (
          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              setOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
          >
            ✕
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-slate-400 mt-2">{helperText}</p>
      )}

      {open && !disabled && value.trim().length > 0 && (
        <div className="absolute z-40 mt-2 w-full bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden">
          <div className="max-h-72 overflow-y-auto p-2">
            {results.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                {emptyMessage}
              </div>
            )}

            {results.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onSelect(item.raw);
                  setOpen(false);
                }}
                className="w-full text-left rounded-xl px-4 py-3 hover:bg-slate-50 transition"
              >
                {renderItem(item.raw)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPicker;