import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  parseLocale,
  type Locale,
} from "./config";
import { formatMessage, getMessages, type Messages } from "./messages";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return parseLocale(jar.get(LOCALE_COOKIE)?.value) ?? DEFAULT_LOCALE;
}

export async function getT() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  return {
    locale,
    messages,
    t: (
      pick: (m: Messages) => string,
      params?: Record<string, string | number>,
    ) => formatMessage(pick(messages), params),
  };
}
