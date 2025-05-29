export default function Input({ label, ...props }) {
    return (
      <div className="space-y-1">
        {label && <label className="text-sm text-gray-700">{label}</label>}
        <input
          {...props}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    );
  }
  