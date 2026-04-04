/**
 * Loading component
 */

export default function Loading({ message = 'Đang tải...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

