import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export async function addBanner(data: any) {
  await addDoc(collection(db, "banners"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getBanners() {
  const snap = await getDocs(collection(db, "banners"));
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function deleteBanner(id: string) {
  await deleteDoc(doc(db, "banners", id));
}