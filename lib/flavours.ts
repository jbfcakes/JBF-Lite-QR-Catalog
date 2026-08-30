import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export type Flavour = {
  id?: string;
  name: string;
};

export async function getFlavours() {
  const snap = await getDocs(collection(db, "flavours"));

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Flavour),
  }));
}

export async function addFlavour(name: string) {
  await addDoc(collection(db, "flavours"), {
    name,
  });
}

export async function deleteFlavour(id: string) {
  await deleteDoc(doc(db, "flavours", id));
}