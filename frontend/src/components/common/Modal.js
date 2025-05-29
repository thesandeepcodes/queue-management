export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
          {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
          {children}
        </div>
      </div>
    );
  }
  