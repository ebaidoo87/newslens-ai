import type { ReactNode } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Logo from "../components/Logo/Logo";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-gray-950 text-white">
      <aside className="border-r border-gray-800 bg-gray-900">
        <div className="border-b border-gray-800 p-6">
          <Logo />
        </div>

        <Sidebar />
      </aside>

      <div className="flex flex-col">
        <Header />

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}