import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export type Category = {
  id?: string;
  name: string;
  subs: string[];
};

export async function getCategories() {
  const snap = await getDocs(collection(db, "categories"));

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Category),
  }));
}

export async function addCategory(data: Category) {
  await addDoc(collection(db, "categories"), data);
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, "categories", id));
}