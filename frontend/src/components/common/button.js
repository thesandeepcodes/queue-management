export default function Button({
  children,
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`py-2 px-4 rounded font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${
          disabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      {...props}
    >
      {children}
    </button>
  );
}
