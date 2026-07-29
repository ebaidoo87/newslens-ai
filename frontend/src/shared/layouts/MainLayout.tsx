import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          height: "64px",
          borderBottom: "1px solid #333",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <strong>NewsLens AI</strong>
      </header>

      <main
        style={{
          padding: "24px",
        }}
      >
        {children}
      </main>
    </div>
  );
}