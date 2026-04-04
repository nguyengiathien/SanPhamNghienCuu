"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth.store";
import Footer from "@/components/common/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faBookOpen,
  faPlus,
  faPenToSquare,
  faTrash,
  faAngleRight,
  faRightFromBracket,
  faUser,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

const USERS_API = `${API_BASE}/api/users`;
const COURSES_API = `${API_BASE}/api/courses`;

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

function ShortText({ text = "", max = 18 }) {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export default function AdminPage() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [tab, setTab] = useState("users");

  // ===== USERS =====
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    email: "",
    fullName: "",
    role: "student",
    address: "",
    dob: "",
  });

  // ===== COURSES =====
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState("");

  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    courseName: "",
    courseDescription: "",
    creator_id: "",
  });

  // ===== COURSE DETAIL / STATS =====
  const [viewingCourse, setViewingCourse] = useState(null);
  const [courseDetailLoading, setCourseDetailLoading] = useState(false);
  const [courseDetailError, setCourseDetailError] = useState("");
  const [courseDetail, setCourseDetail] = useState(null);

  const [courseStatsMap, setCourseStatsMap] = useState({});
  const [chartLoading, setChartLoading] = useState(false);

  // ===== AUTH GUARD =====
  useEffect(() => {
    if (user === null) return;

    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/");
      return;
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    alert("Đăng xuất thành công!");
    router.push("/");
  };

  // ===== USERS API =====
  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const res = await fetch(USERS_API, {
        method: "GET",
        headers: { ...authHeaders() },
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Không tải được danh sách user");

      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (e) {
      setUsersError(e?.message || "Lỗi tải users");
    } finally {
      setUsersLoading(false);
    }
  };

  const openEditUser = (u) => {
    setEditingUser(u);
    setUserForm({
      email: u.email || "",
      fullName: u.fullName || "",
      role: u.role || "student",
      address: u.address || "",
      dob: u.dob ? String(u.dob).slice(0, 10) : "",
    });
  };

  const closeEditUser = () => {
    setEditingUser(null);
  };

  const submitEditUser = async () => {
    if (!editingUser) return;
    setUsersError("");

    try {
      const res = await fetch(`${USERS_API}/${editingUser.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          email: userForm.email,
          fullName: userForm.fullName,
          role: userForm.role,
          address: userForm.address,
          dob: userForm.dob || null,
        }),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Cập nhật user thất bại");

      const updated = data?.user;
      setUsers((prev) =>
        prev.map((x) => (x.user_id === updated.user_id ? updated : x))
      );

      closeEditUser();
      alert("✅ Cập nhật user thành công");
    } catch (e) {
      setUsersError(e?.message || "Cập nhật user thất bại");
    }
  };

  const deleteUser = async (u) => {
    if (!confirm(`Xóa user "${u.username}" ?`)) return;

    setUsersError("");
    try {
      const res = await fetch(`${USERS_API}/${u.user_id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Xóa user thất bại");

      setUsers((prev) => prev.filter((x) => x.user_id !== u.user_id));
      alert("✅ Đã xóa user");
    } catch (e) {
      setUsersError(e?.message || "Xóa user thất bại");
    }
  };

  // ===== COURSES API =====
  const loadCourseStats = async (courseList) => {
    if (!Array.isArray(courseList) || courseList.length === 0) {
      setCourseStatsMap({});
      return;
    }

    setChartLoading(true);
    try {
      const results = await Promise.all(
        courseList.map(async (c) => {
          try {
            const res = await fetch(`${COURSES_API}/${c.course_id}/admin-overview`, {
              method: "GET",
              headers: { ...authHeaders() },
            });
            const data = await safeJson(res);
            if (!res.ok) throw new Error(data?.message || "Lỗi tải thống kê");
            return [c.course_id, data];
          } catch {
            return [
              c.course_id,
              {
                stats: {
                  learnersCount: 0,
                  ratingAvg: Number(c.ratingAvg || 0),
                  ratingNum: Number(c.ratingNum || 0),
                  totalLessons: 0,
                },
              },
            ];
          }
        })
      );

      const map = {};
      for (const [courseId, data] of results) {
        map[courseId] = data;
      }
      setCourseStatsMap(map);
    } finally {
      setChartLoading(false);
    }
  };

  const loadCourses = async () => {
    setCoursesLoading(true);
    setCoursesError("");
    try {
      const res = await fetch(`${COURSES_API}?page=1&limit=100`, {
        method: "GET",
        headers: { ...authHeaders() },
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Không tải được danh sách khóa học");

      const list = data?.courses || data?.data || [];
      const finalList = Array.isArray(list) ? list : [];
      setCourses(finalList);

      await loadCourseStats(finalList);
    } catch (e) {
      setCoursesError(e?.message || "Lỗi tải courses");
    } finally {
      setCoursesLoading(false);
    }
  };

  const openCreateCourse = () => {
    setEditingCourse({ __create: true });
    setCourseForm({
      courseName: "",
      courseDescription: "",
      creator_id: "",
    });
  };

  const openEditCourse = (c) => {
    setEditingCourse(c);
    setCourseForm({
      courseName: c.courseName || "",
      courseDescription: c.courseDescription || "",
      creator_id: String(c.creator_id ?? ""),
    });
  };

  const closeEditCourse = () => setEditingCourse(null);

  const submitCourse = async () => {
    if (!editingCourse) return;
    setCoursesError("");

    const isCreate = !!editingCourse.__create;

    const body = {
      courseName: courseForm.courseName,
      courseDescription: courseForm.courseDescription,
      creator_id: courseForm.creator_id ? Number(courseForm.creator_id) : undefined,
    };

    try {
      const url = isCreate
        ? COURSES_API
        : `${COURSES_API}/${editingCourse.course_id}`;

      const method = isCreate ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(body),
      });

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Lưu khóa học thất bại");

      await loadCourses();
      closeEditCourse();
      alert("✅ Đã lưu khóa học");
    } catch (e) {
      setCoursesError(e?.message || "Lưu khóa học thất bại");
    }
  };

  const deleteCourse = async (c) => {
    if (!confirm(`Xóa khóa học "${c.courseName}" ?`)) return;

    setCoursesError("");
    try {
      const res = await fetch(`${COURSES_API}/${c.course_id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Xóa khóa học thất bại");

      setCourses((prev) => prev.filter((x) => x.course_id !== c.course_id));
      setCourseStatsMap((prev) => {
        const next = { ...prev };
        delete next[c.course_id];
        return next;
      });

      alert("✅ Đã xóa khóa học");
    } catch (e) {
      setCoursesError(e?.message || "Xóa khóa học thất bại");
    }
  };

  const openViewCourse = async (c) => {
    setViewingCourse(c);
    setCourseDetail(null);
    setCourseDetailError("");
    setCourseDetailLoading(true);

    try {
      const res = await fetch(`${COURSES_API}/${c.course_id}/admin-overview`, {
        method: "GET",
        headers: { ...authHeaders() },
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Không tải được chi tiết khóa học");

      setCourseDetail(data);
    } catch (e) {
      setCourseDetailError(e?.message || "Không tải được chi tiết khóa học");
    } finally {
      setCourseDetailLoading(false);
    }
  };

  const closeViewCourse = () => {
    setViewingCourse(null);
    setCourseDetail(null);
    setCourseDetailError("");
  };

  // ===== LOAD DATA =====
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    if (tab === "users") loadUsers();
    if (tab === "courses") loadCourses();
  }, [tab, user]);

  const headerTitle = useMemo(() => {
    if (tab === "users") return "Quản lý người dùng";
    if (tab === "courses") return "Quản lý khóa học";
    return "Quản lý hệ thống";
  }, [tab]);

  const chartData = useMemo(() => {
    return courses.map((c) => ({
      course_id: c.course_id,
      name: c.courseName,
      providerName:
        c.creator?.fullName || c.creator?.username || `User #${c.creator_id}`,
      learnersCount: Number(courseStatsMap?.[c.course_id]?.stats?.learnersCount || 0),
    }));
  }, [courses, courseStatsMap]);

  const maxLearners = useMemo(() => {
    if (!chartData.length) return 0;
    return Math.max(...chartData.map((x) => x.learnersCount), 0);
  }, [chartData]);

  return (
    <div id="container" className="min-h-screen bg-gray-50">
      <aside className="bg-white w-[260px] h-screen fixed border-r-2 border-indigo-200 px-2 shadow-sm">
        <div className="w-full text-center py-8 text-xl font-bold text-indigo-600">
          Admin Panel
        </div>

        <nav className="px-2 space-y-1">
          <button
            onClick={() => setTab("users")}
            className={`w-full text-left rounded-lg px-3 py-2 flex items-center gap-2 transition ${
              tab === "users" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
            }`}
          >
            <FontAwesomeIcon icon={faUsers} className="w-4" />
            <span className="font-semibold text-sm">Quản lý người dùng</span>
          </button>

          <button
            onClick={() => setTab("courses")}
            className={`w-full text-left rounded-lg px-3 py-2 flex items-center gap-2 transition ${
              tab === "courses" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
            }`}
          >
            <FontAwesomeIcon icon={faBookOpen} className="w-4" />
            <span className="font-semibold text-sm">Quản lý khóa học</span>
          </button>

          <a
            href="/"
            className="w-full rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <FontAwesomeIcon icon={faHome} className="w-4" />
            <span className="font-semibold text-sm">Về trang chủ</span>
          </a>
        </nav>

        <div className="w-full px-4 absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col gap-2">
          <a
            href="/profile"
            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faUser} className="w-4 text-gray-700" />
            <span className="text-sm font-semibold text-gray-800">Thông tin cá nhân</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 text-gray-700" />
            <span className="text-sm font-semibold text-gray-800">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="ml-[260px] min-h-screen">
        <div className="bg-white border-b border-gray-100 px-6 py-5">
          <div className="font-bold text-2xl text-indigo-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faAngleRight} />
            {headerTitle}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Đăng nhập với: <b>{user?.username}</b> ({user?.role})
          </div>
        </div>

        <div className="p-6">
          {tab === "users" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-lg">Danh sách Users</div>
                <button
                  onClick={loadUsers}
                  className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
                >
                  Reload
                </button>
              </div>

              {usersError && (
                <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                  {usersError}
                </div>
              )}

              {usersLoading ? (
                <div className="text-gray-500">Đang tải...</div>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">ID</th>
                        <th className="py-2">Username</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">FullName</th>
                        <th className="py-2">Role</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.user_id} className="border-b hover:bg-gray-50">
                          <td className="py-2">{u.user_id}</td>
                          <td className="py-2">{u.username}</td>
                          <td className="py-2">{u.email}</td>
                          <td className="py-2">{u.fullName}</td>
                          <td className="py-2">
                            <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditUser(u)}
                                className="px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-800 hover:bg-yellow-100 font-semibold"
                              >
                                <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
                                Sửa
                              </button>
                              <button
                                onClick={() => deleteUser(u)}
                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold"
                              >
                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {users.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-gray-500">
                            Không có user
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {editingUser && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
                  <div className="bg-white w-full max-w-xl rounded-2xl p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-bold text-lg">
                        Sửa user: {editingUser.username}
                      </div>
                      <button
                        onClick={closeEditUser}
                        className="px-3 py-1 rounded-lg border hover:bg-gray-50"
                      >
                        Đóng
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold">Email</label>
                        <input
                          className="w-full border rounded-lg px-3 py-2"
                          value={userForm.email}
                          onChange={(e) =>
                            setUserForm((p) => ({ ...p, email: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">Role</label>
                        <select
                          className="w-full border rounded-lg px-3 py-2"
                          value={userForm.role}
                          onChange={(e) =>
                            setUserForm((p) => ({ ...p, role: e.target.value }))
                          }
                        >
                          <option value="admin">admin</option>
                          <option value="provider">provider</option>
                          <option value="student">student</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold">FullName</label>
                        <input
                          className="w-full border rounded-lg px-3 py-2"
                          value={userForm.fullName}
                          onChange={(e) =>
                            setUserForm((p) => ({ ...p, fullName: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">DOB</label>
                        <input
                          type="date"
                          className="w-full border rounded-lg px-3 py-2"
                          value={userForm.dob}
                          onChange={(e) =>
                            setUserForm((p) => ({ ...p, dob: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">Address</label>
                        <input
                          className="w-full border rounded-lg px-3 py-2"
                          value={userForm.address}
                          onChange={(e) =>
                            setUserForm((p) => ({ ...p, address: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={closeEditUser}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-50 font-semibold"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={submitEditUser}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "courses" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-lg">
                      Biểu đồ thống kê số học viên theo khóa học
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Mỗi cột biểu diễn số học viên đã bắt đầu học khóa học đó.
                    </div>
                  </div>

                  <button
                    onClick={loadCourses}
                    className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
                  >
                    Reload chart
                  </button>
                </div>

                {chartLoading ? (
                  <div className="text-gray-500">Đang tải biểu đồ...</div>
                ) : chartData.length === 0 ? (
                  <div className="text-gray-500">Chưa có dữ liệu để hiển thị biểu đồ.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                      <div className="h-[320px] flex items-end gap-4 border-b border-l border-gray-200 px-4 pt-6 pb-2">
                        {chartData.map((item) => {
                          const height =
                            maxLearners > 0
                              ? Math.max((item.learnersCount / maxLearners) * 220, item.learnersCount > 0 ? 20 : 8)
                              : 8;

                          return (
                            <div
                              key={item.course_id}
                              className="flex-1 min-w-[90px] flex flex-col items-center justify-end"
                              title={`${item.name}: ${item.learnersCount} học viên`}
                            >
                              <div className="text-xs text-gray-600 mb-2 font-semibold">
                                {item.learnersCount}
                              </div>
                              <div
                                className="w-14 rounded-t-xl bg-indigo-500 hover:bg-indigo-600 transition"
                                style={{ height: `${height}px` }}
                              />
                              <div className="mt-3 text-center text-xs text-gray-700 font-semibold">
                                {ShortText({ text: item.name, max: 16 })}
                              </div>
                              <div className="mt-1 text-center text-[11px] text-gray-400">
                                {ShortText({ text: item.providerName, max: 14 })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-lg">Danh sách Khóa học</div>

                  <div className="flex gap-2">
                    <button
                      onClick={openCreateCourse}
                      className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-semibold"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Thêm khóa học
                    </button>
                    <button
                      onClick={loadCourses}
                      className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
                    >
                      Reload
                    </button>
                  </div>
                </div>

                {coursesError && (
                  <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                    {coursesError}
                  </div>
                )}

                {coursesLoading ? (
                  <div className="text-gray-500">Đang tải...</div>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2">ID</th>
                          <th className="py-2">Tên khóa học</th>
                          <th className="py-2">Nhà cung cấp</th>
                          <th className="py-2">Học viên</th>
                          <th className="py-2">Rating</th>
                          <th className="py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((c) => {
                          const stats = courseStatsMap?.[c.course_id]?.stats || {};
                          return (
                            <tr key={c.course_id} className="border-b hover:bg-gray-50">
                              <td className="py-2">{c.course_id}</td>

                              <td className="py-2">
                                <div className="font-semibold">{c.courseName}</div>
                                {c.courseDescription && (
                                  <div className="text-xs text-gray-500 line-clamp-2">
                                    {c.courseDescription}
                                  </div>
                                )}
                              </td>

                              <td className="py-2">
                                <div className="font-semibold">
                                  {c.creator?.fullName ||
                                    c.creator?.username ||
                                    `User #${c.creator_id}`}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {c.creator?.username
                                    ? `@${c.creator.username}`
                                    : `ID: ${c.creator_id}`}
                                </div>
                              </td>

                              <td className="py-2">
                                <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                                  {stats.learnersCount ?? 0} học viên
                                </span>
                              </td>

                              <td className="py-2">
                                {c.ratingAvg ?? 0} ({c.ratingNum ?? 0})
                              </td>

                              <td className="py-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openViewCourse(c)}
                                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                                  >
                                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                                    Xem
                                  </button>

                                  <button
                                    onClick={() => openEditCourse(c)}
                                    className="px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-800 hover:bg-yellow-100 font-semibold"
                                  >
                                    <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
                                    Sửa
                                  </button>

                                  <button
                                    onClick={() => deleteCourse(c)}
                                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold"
                                  >
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                        {courses.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-gray-500">
                              Không có khóa học
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {editingCourse && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-5 shadow-lg">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-bold text-lg">
                          {editingCourse.__create ? "Thêm khóa học" : "Sửa khóa học"}
                        </div>
                        <button
                          onClick={closeEditCourse}
                          className="px-3 py-1 rounded-lg border hover:bg-gray-50"
                        >
                          Đóng
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-semibold">Tên khóa học</label>
                          <input
                            className="w-full border rounded-lg px-3 py-2"
                            value={courseForm.courseName}
                            onChange={(e) =>
                              setCourseForm((p) => ({ ...p, courseName: e.target.value }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold">Mô tả</label>
                          <textarea
                            className="w-full border rounded-lg px-3 py-2 min-h-[90px]"
                            value={courseForm.courseDescription}
                            onChange={(e) =>
                              setCourseForm((p) => ({
                                ...p,
                                courseDescription: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold">
                            Creator ID (tùy backend)
                          </label>
                          <input
                            className="w-full border rounded-lg px-3 py-2"
                            value={courseForm.creator_id}
                            onChange={(e) =>
                              setCourseForm((p) => ({
                                ...p,
                                creator_id: e.target.value,
                              }))
                            }
                            placeholder="Nếu backend tự lấy creator từ token thì bỏ trống"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={closeEditCourse}
                          className="px-4 py-2 rounded-lg border hover:bg-gray-50 font-semibold"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={submitCourse}
                          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {viewingCourse && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-5xl rounded-2xl p-5 shadow-lg max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="font-bold text-xl text-gray-900">
                            Chi tiết khóa học
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {viewingCourse.courseName}
                          </div>
                        </div>

                        <button
                          onClick={closeViewCourse}
                          className="px-3 py-1 rounded-lg border hover:bg-gray-50"
                        >
                          Đóng
                        </button>
                      </div>

                      {courseDetailError && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                          {courseDetailError}
                        </div>
                      )}

                      {courseDetailLoading ? (
                        <div className="text-gray-500">Đang tải...</div>
                      ) : courseDetail ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="rounded-xl border p-4 bg-gray-50">
                              <div className="text-sm text-gray-500">Nhà cung cấp</div>
                              <div className="font-bold text-gray-900 mt-1">
                                {courseDetail.course?.creator?.fullName ||
                                  courseDetail.course?.creator?.username ||
                                  "—"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {courseDetail.course?.creator?.email || ""}
                              </div>
                            </div>

                            <div className="rounded-xl border p-4 bg-gray-50">
                              <div className="text-sm text-gray-500">Số học viên đang học</div>
                              <div className="font-bold text-2xl text-indigo-700 mt-1">
                                {courseDetail.stats?.learnersCount ?? 0}
                              </div>
                            </div>

                            <div className="rounded-xl border p-4 bg-gray-50">
                              <div className="text-sm text-gray-500">Điểm đánh giá TB</div>
                              <div className="font-bold text-2xl text-yellow-600 mt-1">
                                {courseDetail.stats?.ratingAvg ?? 0}/5
                              </div>
                            </div>

                            <div className="rounded-xl border p-4 bg-gray-50">
                              <div className="text-sm text-gray-500">Số lượt đánh giá</div>
                              <div className="font-bold text-2xl text-green-700 mt-1">
                                {courseDetail.stats?.ratingNum ?? 0}
                              </div>
                            </div>
                          </div>

                          <div className="mb-6 rounded-xl border p-4">
                            <div className="font-semibold text-lg mb-2">Thông tin khóa học</div>
                            <div className="text-sm text-gray-700">
                              <b>Tên khóa học:</b> {courseDetail.course?.courseName}
                            </div>
                            <div className="text-sm text-gray-700 mt-2">
                              <b>Mô tả:</b>{" "}
                              {courseDetail.course?.courseDescription || "Chưa có mô tả"}
                            </div>
                            <div className="text-sm text-gray-700 mt-2">
                              <b>Mức độ:</b> {courseDetail.course?.level || "—"}
                            </div>
                            <div className="text-sm text-gray-700 mt-2">
                              <b>Tổng số bài học:</b> {courseDetail.stats?.totalLessons ?? 0}
                            </div>
                          </div>

                          <div className="rounded-xl border p-4">
                            <div className="font-semibold text-lg mb-4">
                              Đánh giá của học viên
                            </div>

                            {!courseDetail.ratings || courseDetail.ratings.length === 0 ? (
                              <div className="text-gray-500">
                                Khóa học này chưa có đánh giá nào.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {courseDetail.ratings.map((r, idx) => (
                                  <div
                                    key={`${r.user_id}-${idx}`}
                                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                                  >
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                      <div>
                                        <div className="font-semibold text-gray-900">
                                          {r.User?.fullName ||
                                            r.User?.username ||
                                            `User #${r.user_id}`}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {r.User?.email || ""}
                                        </div>
                                      </div>

                                      <div className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-semibold">
                                        {r.stars}/5 sao
                                      </div>
                                    </div>

                                    <div className="mt-3 text-sm text-gray-700">
                                      {r.comment?.trim()
                                        ? r.comment
                                        : "Không có nhận xét."}
                                    </div>

                                    <div className="mt-2 text-xs text-gray-400">
                                      Cập nhật:{" "}
                                      {r.updatedAt
                                        ? new Date(r.updatedAt).toLocaleString("vi-VN")
                                        : "—"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}