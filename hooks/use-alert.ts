"use client";

import { useState, useEffect } from "react";

interface AlertOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

let subscribers: ((alert: AlertOptions | null) => void)[] = [];
let currentAlert: AlertOptions | null = null;

const notify = () => {
  subscribers.forEach((callback) => callback(currentAlert));
};

export const alert = (options: AlertOptions) => {
  currentAlert = options;
  notify();
};

export const closeAlert = () => {
  currentAlert = null;
  notify();
};

export function useAlert() {
  const [alertState, setAlertState] = useState<AlertOptions | null>(currentAlert);

  useEffect(() => {
    const callback = (state: AlertOptions | null) => setAlertState(state);
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter((s) => s !== callback);
    };
  }, []);

  return { alertState, closeAlert };
}
