import type { ReactNode } from "react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import Logo from "../components/Logo/Logo";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
      }}
    >
      <div>
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #374151",
            background: "#1f2937",
          }}
        >
          <Logo />
        </div>

        <Sidebar />
      </div>

      <div>
        <Header />

        <main style={{ padding: "24px" }}>{children}</main>
      </div>
    </div>
  );
}