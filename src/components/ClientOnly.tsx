'use client';

import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

/**
 * Renders children only after the component has mounted on the client.
 * Prevents any accidental SSR rendering of browser-only trees (e.g., BrowserRouter).
 */
export default function ClientOnly({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <>{children}</>;
}
