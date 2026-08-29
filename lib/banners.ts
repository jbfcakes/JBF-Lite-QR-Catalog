import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addBanner(data: any) {
  await addDoc(collection(db, "banners"), data);
}