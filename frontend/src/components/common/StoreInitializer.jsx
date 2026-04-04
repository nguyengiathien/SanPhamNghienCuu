/**
 * Store Initializer - Khởi tạo store từ localStorage
 * Chỉ gọi một lần khi component mount
 */

'use client';

import { useEffect, useRef } from 'react';
import useAuthStore from '@/store/auth.store';

export default function StoreInitializer() {
  const init = useAuthStore((state) => state.init);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Chỉ init một lần
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      init();
    }
  }, []); // Empty dependency array - chỉ chạy một lần

  return null;
}

