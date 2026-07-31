type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileSidebar({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-gray-900 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="mb-8 rounded-lg bg-gray-800 px-4 py-2"
        >
          ✕ Close
        </button>

        <p className="text-gray-400">
          Sidebar coming next...
        </p>
      </aside>
    </>
  );
}