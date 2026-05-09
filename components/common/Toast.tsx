"use client";

import { useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const addToast = ({ message, type = "info", duration = 3000 }: ToastProps) => {
    const id = Date.now().toString();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  };

  return { toasts, addToast };
}

export function Toast({ message, type = "info" }: ToastProps) {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div className={`${bgColor} text-white px-4 py-2 rounded shadow-lg`}>
      {message}
    </div>
  );
}
