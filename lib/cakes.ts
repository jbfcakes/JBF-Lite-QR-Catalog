import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  setDoc,
} from "firebase/firestore";

export async function addCake(data: any) {
  await addDoc(collection(db, "cakes"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getCakes() {
  const snap = await getDocs(collection(db, "cakes"));

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function deleteCake(id: string) {
  await deleteDoc(doc(db, "cakes", id));
}

export async function getLastCakeCode() {
  const q = query(
    collection(db, "cakes"),
    orderBy("code", "desc"),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return "JBF000";

  return snap.docs[0].data().code as string;
}

export async function updateCake(id: string, data: any) {
  await setDoc(doc(db, "cakes", id), data, { merge: true });
}