import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

export type Cake = {
  id?: string;
  code: string;
  name: string;
  images: string[];
  categories: string[];
  subCategories: string[];
  flavours: string[];
  startingPrice: number;
  minWeight: string;
  serving: string;
  active: boolean;
  keywords: [],
};

function generateKeywords(data: Cake) {
  const words = [
    data.name,
    ...data.categories,
    ...data.subCategories,
  ]
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  return [...new Set(words)];
}

export async function addCake(data: Cake) {
  await addDoc(collection(db, "cakes"), {
    ...data,
    keywords: generateKeywords(data),
    createdAt: serverTimestamp(),
  });
}

export async function getCakes() {
  const q = query(
    collection(db, "cakes"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Cake),
  }));
}

export async function getCakeById(id: string) {
  const snap = await getDoc(doc(db, "cakes", id));

  return {
    id: snap.id,
    ...(snap.data() as Cake),
  };
}

export async function updateCake(
  id: string,
  data: Partial<Cake>
) {
  await setDoc(doc(db, "cakes", id), data, {
    merge: true,
  });
}

export async function deleteCake(id: string) {
  await deleteDoc(doc(db, "cakes", id));
}

export async function getNextCakeCode() {
  const q = query(
    collection(db, "cakes"),
    orderBy("code", "desc"),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return "JBF001";

  const last = snap.docs[0].data().code as string;

  const num = Number(last.replace("JBF", ""));

  return `JBF${String(num + 1).padStart(3, "0")}`;
}

export async function duplicateCake(cake: Cake) {
  const code = await getNextCakeCode();

  await addCake({
    ...cake,
    code,
    name: `${cake.name} Copy`,
    keywords: [],
  });

  return code;
}