export default function Input({
  id,
  label,
  type = "text",
  required = false,
  value,
  onChange,
  error,
  placeholder,
  ...props
}) {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label htmlFor={id} className="text-sm text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
