/**
 * Header Component
 */
"use client";

import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";

import {
  faUserPlus,
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "@/store/auth.store";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

const toAbsoluteAvatarUrl = (avatarUrl, cacheKey = "") => {
  if (!avatarUrl) return "";
  if (avatarUrl.startsWith("http")) return avatarUrl;

  const base = API_BASE.replace(/\/$/, "");
  const path = avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
  const url = `${base}${path}`;

  if (cacheKey) return `${url}?v=${encodeURIComponent(cacheKey)}`;
  return url;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const authed = isAuthenticated();

  const isProviderPage = pathname?.startsWith("/provider");
  const homeHref = isProviderPage ? "/provider" : "/";

  const avatarSrc = useMemo(() => {
    if (!authed) return "/no_avatar.jpg";

    const cacheKey =
      user?.updatedAt || user?.avatarUpdatedAt || user?.avatarUrl || "1";

    const abs = toAbsoluteAvatarUrl(user?.avatarUrl, cacheKey);
    return abs || "/no_avatar.jpg";
  }, [authed, user?.avatarUrl, user?.updatedAt, user?.avatarUpdatedAt]);

  const handleLogout = (e) => {
    e.preventDefault();

    const ok = window.confirm("Bạn có chắc muốn đăng xuất không?");
    if (!ok) return;

    logout();
    alert("Đăng xuất thành công!");
    router.push("/");
  };

  return (
    <header className="fixed w-full z-20 bg-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
      <div className="max-w-[1200px] m-auto flex flex-row justify-between items-center">
        <div className="left-site flex flex-row items-center">
          <h1 className="text-indigo-500 text-lg font-bold p-2 w-fit">Elearning-platform</h1>

          <nav className="flex flex-row justify-evenly items-center gap-12 w-fit ml-12">
            <li className="group/icon flex flex-row items-center">
              <a
                href={homeHref}
                className="text-gray-800 font-semibold transition duration-200 group-hover/icon:text-indigo-500 ease-in-out text-sm text-nowrap py-3"
              >
                Trang chủ
              </a>
            </li>

            {authed && !isProviderPage && (
              <li className="group/icon flex flex-row items-center">
                <a
                  href="/courses"
                  className="text-gray-800 font-semibold transition duration-200 group-hover/icon:text-indigo-500 ease-in-out text-sm text-nowrap py-3"
                >
                  Khóa học
                </a>
              </li>
            )}

            {authed && user?.role === "admin" && (
              <li className="group/icon flex flex-row items-center">
                <FontAwesomeIcon
                  icon={faUserShield}
                  className="mr-1 text-gray-800 !w-[14px] transition duration-200 group-hover/icon:text-indigo-500"
                />
                <a
                  href="/admin"
                  className="text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap py-3 group-hover/icon:text-indigo-500"
                >
                  Admin Panel
                </a>
              </li>
            )}

            {authed && user?.role !== "admin" && !isProviderPage && (
              <li className="group/icon flex flex-row items-center">
                <a
                  href="/contact"
                  className="text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap py-3 group-hover/icon:text-indigo-500"
                >
                  Liên hệ
                </a>
              </li>
            )}
          </nav>
        </div>

        <div className="right-site flex flex-row items-center gap-3">
          {authed ? (
            <>
              <a
                href="/profile"
                className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition"
                title="Thông tin cá nhân"
              >
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <span className="text-gray-800 font-semibold text-sm text-nowrap hover:text-indigo-500 transition">
                  {user?.fullName || "Thông tin cá nhân"}
                </span>
              </a>

              <div className="group/icon flex flex-row items-center">
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="p-[8px] text-gray-800 !w-[15px] transition duration-200 group-hover/icon:text-indigo-500"
                />
                <a
                  href="#"
                  onClick={handleLogout}
                  className="p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500"
                >
                  Đăng xuất
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="group/icon flex flex-row items-center">
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  className="p-[8px] text-gray-800 !w-[15px] transition duration-200 group-hover/icon:text-indigo-500"
                />
                <a
                  href="/login"
                  className="p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500"
                >
                  Đăng nhập
                </a>
              </div>

              <div className="group/icon flex flex-row items-center">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="p-[8px] text-gray-800 !w-[15px] transition duration-200 group-hover/icon:text-indigo-500"
                />
                <a
                  href="/register"
                  className="p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500"
                >
                  Đăng ký
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}