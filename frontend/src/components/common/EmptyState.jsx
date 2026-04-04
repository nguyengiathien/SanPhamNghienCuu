/**
 * Empty State component
 */

export default function EmptyState({ 
  title = 'Không có dữ liệu', 
  message = 'Hiện tại chưa có dữ liệu để hiển thị.',
  icon = null 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{message}</p>
    </div>
  );
}

