export default function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center p-6"
      role="status"
      aria-label="Loading"
    >
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
