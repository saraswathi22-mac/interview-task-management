const TextField = ({
  label,
  value,
  onChange,
  inputProps = {},
  error,
  helperText,
  fullWidth = true,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
      {/* 🔷 Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* 🔷 Input */}
      <input
        value={value}
        onChange={onChange}
        {...inputProps}
        className={`
          bg-white border rounded-lg px-3 py-2 text-sm text-gray-800
          transition-all duration-200 outline-none
          placeholder:text-gray-400
          
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
          }

          focus:ring-2
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
      />

      {/* 🔷 Helper / Error Text */}
      {(helperText || error) && (
        <p
          className={`text-xs ${
            error ? "text-red-500" : "text-gray-500"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;