import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

export type Banner = {
  id?: string;
  title: string;
  image: string;
  active: boolean;
  createdAt?: number;
};

// Get all banners
export async function getBanners() {
  const q = query(
    collection(db, "banners"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Banner),
  }));
}

// Add banner
export async function addBanner(banner: Omit<Banner, "id">) {
  await addDoc(collection(db, "banners"), {
    ...banner,
    createdAt: Date.now(),
  });
}

// Active / Hide
export async function updateBanner(
  id: string,
  active: boolean
) {
  await updateDoc(doc(db, "banners", id), {
    active,
  });
}

// Delete
export async function deleteBanner(id: string) {
  await deleteDoc(doc(db, "banners", id));
}