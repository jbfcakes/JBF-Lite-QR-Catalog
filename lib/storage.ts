import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadCakeImage(file: File) {
  const fileName = `cakes/${Date.now()}-${file.name}`;

  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
}