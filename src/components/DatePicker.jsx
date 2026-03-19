const DatePicker = ({ selectedDate, max, onChange }) => {
  return (
    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
      {/* 🔷 Label */}
      <label className="text-sm font-medium text-gray-700">
        Select Date
      </label>

      {/* 🔷 Input Wrapper */}
      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className="w-full sm:w-auto appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        {/* subtle icon hint */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          📅
        </span>
      </div>
    </div>
  );
};

export default DatePicker;