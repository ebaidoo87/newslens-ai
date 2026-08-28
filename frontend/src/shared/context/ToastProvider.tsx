import {
  useState,
  type ReactNode,
} from "react";

import {
  ToastContext,
  type ToastType,
} from "./ToastContext";


interface Toast {
  id: number;
  message: string;
  type: ToastType;
}


export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    toasts,
    setToasts,
  ] = useState<Toast[]>([]);


  function showToast(
    message: string,
    type: ToastType = "info",
  ): void {
    const id = Date.now();

    setToasts(
      (current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ],
    );

    window.setTimeout(
      () => {
        setToasts(
          (current) =>
            current.filter(
              (toast) =>
                toast.id !== id,
            ),
        );
      },
      3500,
    );
  }


  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      <div
        className="
          fixed
          right-5
          top-5
          z-50
          flex
          w-[min(24rem,calc(100vw-2.5rem))]
          flex-col
          gap-3
        "
      >
        {toasts.map(
          (toast) => (
            <div
              key={toast.id}
              role="status"
              className={`
                rounded-xl
                border
                px-4
                py-3
                shadow-xl
                backdrop-blur
                ${
                  toast.type === "success"
                    ? "border-green-700 bg-white-950/95 text-green-200"
                    : toast.type === "error"
                      ? "border-red-700 bg-white-950/95 text-red-200"
                      : "border-blue-700 bg-white-950/95 text-blue-200"
                }
              `}
            >
              {toast.message}
            </div>
          ),
        )}
      </div>
    </ToastContext.Provider>
  );
}