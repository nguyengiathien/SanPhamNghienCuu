'use client';

export default function CoursePicker({
  courses = [],
  selectedCourseId,
  onChange,
  onReload,
  disabledReload = false,
}) {
  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div>
        <div className="font-bold text-gray-900">Chọn khóa học để thao tác</div>
        <div className="text-sm text-gray-500">
          Các tính năng (bài học / video / quiz / learners) đều cần chọn course.
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <select
          value={selectedCourseId}
          onChange={(e) => onChange?.(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm min-w-[260px]"
        >
          <option value="">-- Chọn khóa học --</option>
          {courses.map((c) => (
            <option key={c.course_id} value={c.course_id}>
              {c.courseName}
            </option>
          ))}
        </select>

        <button
          onClick={onReload}
          className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
          disabled={disabledReload}
        >
          Reload courses
        </button>
      </div>
    </div>
  );
}
