"use client";

import { useCallback, useSyncExternalStore } from "react";

/*
 * Valor guardado no navegador (localStorage), por chave. Mesmo comportamento de antes:
 * o servidor e a primeira pintura usam `initialValue` e, logo depois, entra o que estiver
 * salvo. Fica num store externo (useSyncExternalStore) para a leitura do localStorage não
 * ser um setState dentro de efeito. Use `initialValue` primitivo (texto/número).
 */
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function readValue<T>(key: string, initialValue: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // storage bloqueado (aba anônima, ITP): segue com o valor inicial
  }

  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value: T = initialValue;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = initialValue;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function subscribe(key: string, notify: () => void) {
  let set = listeners.get(key);
  if (!set) listeners.set(key, (set = new Set()));
  set.add(notify);

  // outra aba mudou o mesmo valor
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

const subscribeHydrated = () => () => {};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const storedValue = useSyncExternalStore(
    useCallback((notify: () => void) => subscribe(key, notify), [key]),
    () => readValue(key, initialValue),
    () => initialValue,
  );
  const hydrated = useSyncExternalStore(
    subscribeHydrated,
    () => true,
    () => false,
  );

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    const raw = JSON.stringify(valueToStore);
    cache.set(key, { raw, value: valueToStore });
    try {
      window.localStorage.setItem(key, raw);
    } catch {
      // sem localStorage o valor vale só nesta sessão
    }
    listeners.get(key)?.forEach((notify) => notify());
  };

  return [storedValue, setValue, hydrated] as const;
}
