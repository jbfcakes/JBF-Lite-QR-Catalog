import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAllCakes() {
  const snap = await getDocs(collection(db, "cakes"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getCategories() {
  const snap = await getDocs(collection(db, "categories"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getBanners() {
  const snap = await getDocs(collection(db, "banners"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}