"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "@/store/auth.store";
import { userService } from "@/services/user.service";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

// helper: ghép url avatar từ backend (avatarUrl thường là "/uploads/...")
const toAbsoluteAvatarUrl = (avatarUrl, cacheBust = false) => {
  if (!avatarUrl) return "";
  const base = API_BASE.replace(/\/$/, "");
  const path = avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
  const url = `${base}${path}`;
  return cacheBust ? `${url}?t=${Date.now()}` : url;
};

export default function ProfilePage() {
  const authUser = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
    dob: "",
    address: "",
    avatarUrl: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(""); // có thể là blob hoặc absolute url

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // fill form từ store
  useEffect(() => {
    if (!authUser) {
      setMessage("Vui lòng đăng nhập lại");
      return;
    }

    setProfile({
      fullName: authUser.fullName || "",
      email: authUser.email || "",
      username: authUser.username || "",
      dob: authUser.dob ? String(authUser.dob).slice(0, 10) : "",
      address: authUser.address || "",
      avatarUrl: authUser.avatarUrl || "",
    });

    // ✅ đảm bảo preview là URL tuyệt đối
    if (authUser.avatarUrl) {
      setAvatarPreview(toAbsoluteAvatarUrl(authUser.avatarUrl));
    } else {
      setAvatarPreview("");
    }
  }, [authUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ảnh quá lớn (tối đa 5MB)");
      return;
    }

    setAvatarFile(file);

    // preview bằng blob
    const blobUrl = URL.createObjectURL(file);
    setAvatarPreview(blobUrl);
  };

  // cleanup blob url
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // src cuối cùng cho ảnh
  const avatarSrc = useMemo(() => {
    // ưu tiên blob preview
    if (avatarPreview) return avatarPreview;

    // nếu chưa có preview thì lấy từ profile.avatarUrl (absolute)
    if (profile.avatarUrl) return toAbsoluteAvatarUrl(profile.avatarUrl);

    return "/no_avatar.jpg";
  }, [avatarPreview, profile.avatarUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // 1) update text fields
      const payload = {
        fullName: profile.fullName,
        dob: profile.dob || null,
        address: profile.address || null,
      };

      let updatedUser = await userService.updateMe(payload);

      // 2) upload avatar nếu có chọn (✅ optional, không bắt buộc)
      if (avatarFile) {
        updatedUser = await userService.updateMyAvatar(avatarFile); // truyền File
        setAvatarFile(null);
      }

      // 3) update store + localStorage (setAuth đã làm việc đó)
      const token = localStorage.getItem("token");
      if (token && typeof setAuth === "function") {
        setAuth(token, updatedUser);
      }

      // 4) update UI local
      setProfile((p) => ({
        ...p,
        fullName: updatedUser.fullName ?? p.fullName,
        dob: updatedUser.dob ? String(updatedUser.dob).slice(0, 10) : p.dob,
        address: updatedUser.address ?? p.address,
        avatarUrl: updatedUser.avatarUrl ?? p.avatarUrl,
      }));

      // ✅ set preview bằng URL tuyệt đối + cache bust để hiện ngay ảnh mới
      if (updatedUser.avatarUrl) {
        setAvatarPreview(toAbsoluteAvatarUrl(updatedUser.avatarUrl, true));
      } else {
        setAvatarPreview("");
      }

      setMessage("Cập nhật thành công");
    } catch (err) {
      setMessage(err?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <Header />

      <div className="pt-[80px] px-6 md:px-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8 font-montserrat text-indigo-500">
            Thông tin cá nhân
          </h1>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 w-full md:w-[220px]">
              <img
                src={avatarSrc}
                alt="Ảnh đại diện"
                className="w-32 h-32 rounded-full object-cover shadow border"
              />

              <label className="w-full px-3 py-2 bg-indigo-300 rounded-lg text-black font-medium shadow-lg hover:shadow-none transition-colors duration-200 ease-in-out hover:bg-indigo-400 cursor-pointer text-center">
                Tải ảnh lên
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>

              
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full md:flex-1 max-w-[720px]">
              {message && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    message.includes("thành công")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div className="w-full">
                  <label className="block text-indigo-900/80 font-semibold mb-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    disabled
                    className="w-full border border-indigo-400 rounded-lg px-3 py-2 text-sm bg-gray-100"
                  />
                </div>

                {/* Email */}
                <div className="w-full">
                  <label className="block text-indigo-900/80 font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full border border-indigo-400 rounded-lg px-3 py-2 text-sm bg-gray-100"
                  />
                </div>

                {/* Full name */}
                <div className="w-full md:col-span-2">
                  <label className="block text-indigo-900/80 font-semibold mb-1">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, fullName: e.target.value }))
                    }
                    className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                    required
                  />
                </div>

                {/* DOB */}
                <div className="w-full">
                  <label className="block text-indigo-900/80 font-semibold mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, dob: e.target.value }))
                    }
                    className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  />
                </div>

                {/* Address */}
                <div className="w-full">
                  <label className="block text-indigo-900/80 font-semibold mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, address: e.target.value }))
                    }
                    className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  />
                </div>
              </div>

              <div className="w-full flex justify-end mt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 px-4 rounded-lg border-2 shadow-lg font-medium transition duration-150 flex items-center gap-2 ${
                    loading
                      ? "bg-gray-300 border-gray-200 cursor-not-allowed"
                      : "bg-green-400 border-green-300 hover:bg-green-500 hover:shadow-none cursor-pointer"
                  }`}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {loading ? "Đang lưu..." : "Lưu thông tin"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </main>
  );
}
