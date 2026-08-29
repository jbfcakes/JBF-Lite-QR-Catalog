import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export async function getCategories() {
  const snap = await getDocs(collection(db, "categories"));

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function addCategory(title: string) {
  await addDoc(collection(db, "categories"), {
    title,
    subs: [],
  });
}

export async function addSubCategory(id: string, subs: string[]) {
  await updateDoc(doc(db, "categories", id), {
    subs,
  });
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, "categories", id));
}