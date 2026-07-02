import { useState, useEffect } from "react";

// Yalnızca tarayıcıda render eden sarmalayıcı (SSR uyumsuz parçalar için).
export function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : fallback;
}
