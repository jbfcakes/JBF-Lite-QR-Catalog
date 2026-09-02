import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

async function convertToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => (img.src = reader.result as string);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Canvas Error");

      const MAX = 1200;

      let w = img.width;
      let h = img.height;

      if (w > h && w > MAX) {
        h *= MAX / w;
        w = MAX;
      }

      if (h > w && h > MAX) {
        w *= MAX / h;
        h = MAX;
      }

      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject("WebP Error");
        },
        "image/webp",
        0.82
      );
    };

    reader.onerror = reject;
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ===========================
   CAKE IMAGES
=========================== */

export async function uploadCakeImage(
  file: File,
  cakeCode: string,
  index: number
) {
  const webp = await convertToWebP(file);

  // First image = JBF001.webp
  // Second image (if any) = JBF001-02.webp
  const fileName =
    index === 0
      ? `${cakeCode}.webp`
      : `${cakeCode}-${String(index + 1).padStart(2, "0")}.webp`;

  const storageRef = ref(
    storage,
    `JbfCakes/${cakeCode}/${fileName}`
  );

  await uploadBytes(storageRef, webp, {
    contentType: "image/webp",
  });

  return await getDownloadURL(storageRef);
}

/* ===========================
   BANNER IMAGES
=========================== */

export async function uploadBannerImage(file: File) {
  const webp = await convertToWebP(file);

  const storageRef = ref(
    storage,
    `banners/BANNER-${Date.now()}.webp`
  );

  await uploadBytes(storageRef, webp, {
    contentType: "image/webp",
  });

  return await getDownloadURL(storageRef);
}

export async function deleteCakeImage(
  imageUrl: string
) {
  try {
    const path = decodeURIComponent(
      imageUrl.split("/o/")[1].split("?")[0]
    );

    const imageRef = ref(storage, path);

    await deleteObject(imageRef);
  } catch (error) {
    console.log("Image already deleted");
  }
}