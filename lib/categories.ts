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
    ...(d.data() as {
      name: string;
      subs: string[];
    }),
  }));
}

export async function addCategory(name: string) {
  await addDoc(collection(db, "categories"), {
    name,
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