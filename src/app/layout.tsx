import { ReactNode } from "react";

// Root layout — passes through to [locale]/layout.tsx which provides the full <html> shell.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children as React.JSX.Element;
}
