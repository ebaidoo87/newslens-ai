import type { ReactNode } from "react";

import Header from "../components/Header";
import Logo from "../components/Logo/Logo";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/Sidebar/MobileSidebar";

import { useSidebar } from "../hooks/useSidebar";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  const {
    isOpen,
    openSidebar,
    closeSidebar,
  } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-950 text-white lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop Sidebar */}
      <aside className="hidden border-r border-gray-800 bg-gray-900 lg:block">
        <div className="border-b border-gray-800 p-6">
          <Logo />
        </div>

        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={isOpen}
        onClose={closeSidebar}
      />

      <div className="flex flex-col">
        <Header onMenuClick={openSidebar} />

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}