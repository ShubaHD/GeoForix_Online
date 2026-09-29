"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { Locale } from "./config";
import { formatMessage, getMessages, type Messages } from "./messages";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  t: (
    pick: (m: Messages) => string,
    params?: Record<string, string | number>,
  ) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const messages = useMemo(() => getMessages(locale), [locale]);
  const t = useCallback(
    (pick: (m: Messages) => string, params?: Record<string, string | number>) => {
      try {
        const value = pick(messages);
        return formatMessage(typeof value === "string" ? value : "", params);
      } catch {
        return "";
      }
    },
    [messages],
  );
  const value = useMemo(
    () => ({ locale, messages, t }),
    [locale, messages, t],
  );
  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
