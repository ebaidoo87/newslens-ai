import {
  useEffect,
  useRef,
} from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};


export default function MobileSidebar({
  open,
  onClose,
}: Props) {
  const closeButtonRef =
    useRef<HTMLButtonElement>(
      null,
    );


  useEffect(
    () => {
      if (!open) {
        return;
      }

      closeButtonRef.current?.focus();

      function handleKeyDown(
        event: KeyboardEvent,
      ) {
        if (event.key === "Escape") {
          onClose();
        }
      }

      document.addEventListener(
        "keydown",
        handleKeyDown,
      );

      const previousOverflow =
        document.body.style.overflow;

      document.body.style.overflow =
        "hidden";

      return () => {
        document.removeEventListener(
          "keydown",
          handleKeyDown,
        );

        document.body.style.overflow =
          previousOverflow;
      };
    },
    [
      open,
      onClose,
    ],
  );


  if (!open) {
    return null;
  }


  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close navigation menu"
        className="
          fixed
          inset-0
          z-40
          cursor-default
          bg-black/50
        "
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        className="
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-72
          bg-gray-900
          p-6
          shadow-xl
        "
      >
        <h2
          id="mobile-navigation-title"
          className="sr-only"
        >
          Navigation menu
        </h2>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="
            mb-8
            rounded-lg
            bg-gray-800
            px-4
            py-2
            text-white
            transition
            hover:bg-gray-700
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-blue-500
          "
        >
          <span aria-hidden="true">
            ✕
          </span>

          {" "}
          Close
        </button>

        <p className="text-gray-400">
          Sidebar coming next...
        </p>
      </aside>
    </>
  );
}