
"use client";

export const SHORTLIST_KEY = "jbf_shortlist";

export type ShortlistItem = {
  code: string;
  name: string;
  image: string;
  price: number;
};

export function getShortlist(): ShortlistItem[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(SHORTLIST_KEY);

  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveShortlist(items: ShortlistItem[]) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(items));
}

export function addToShortlist(item: ShortlistItem) {
  const list = getShortlist();

  const exists = list.find((i) => i.code === item.code);
  if (exists) return list;

  const updated = [...list, item];
  saveShortlist(updated);
  return updated;
}

export function removeFromShortlist(code: string) {
  const updated = getShortlist().filter((i) => i.code !== code);
  saveShortlist(updated);
  return updated;
}

export function isShortlisted(code: string) {
  return getShortlist().some((i) => i.code === code);
}

export function toggleShortlist(item: ShortlistItem) {
  if (isShortlisted(item.code)) {
    return removeFromShortlist(item.code);
  }
  return addToShortlist(item);
}

export function getShortlistCount() {
  return getShortlist().length;
}

export function clearShortlist() {
  localStorage.removeItem(SHORTLIST_KEY);
}