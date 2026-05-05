const TextField = ({
  label,
  value,
  onChange,
  inputProps = {},
  error,
  helperText,
  fullWidth = true,
  leftIcon,
  rightIcon,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
      
      {/* 🔷 Label */}
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </label>
      )}

      {/* 🔷 Input Wrapper */}
      <div className="relative">
        
        {/* Left Icon */}
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {leftIcon}
          </span>
        )}

        {/* Input */}
        <input
          value={value}
          onChange={onChange}
          {...inputProps}
          className={`
            w-full rounded-xl border bg-white text-sm text-gray-800
            transition-all duration-200 outline-none shadow-sm
            placeholder:text-gray-400
            
            ${leftIcon ? "pl-9" : "pl-3"} 
            ${rightIcon ? "pr-9" : "pr-3"} 
            py-2.5

            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100 hover:border-gray-300"
            }

            focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
        />

        {/* Right Icon */}
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {rightIcon}
          </span>
        )}
      </div>

      {/* 🔷 Helper / Error */}
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