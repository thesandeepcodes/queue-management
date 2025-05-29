export default function Button({ children, onClick, type = "button", className = "", disabled }) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg text-white bg-primary hover:bg-blue-700 transition ${className}`}
      >
        {children}
      </button>
    );
  }
  