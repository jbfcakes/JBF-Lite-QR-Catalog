import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function convertToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => (img.src = reader.result as string);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Canvas Error");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

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

// Cake Images
export async function uploadCakeImage(
  file: File,
  cakeCode: string,
  index: number
) {
  const webp = await convertToWebP(file);

  const storageRef = ref(
    storage,
    `cakes/${cakeCode}-${String(index + 1).padStart(2, "0")}.webp`
  );

  await uploadBytes(storageRef, webp, {
    contentType: "image/webp",
  });

  return await getDownloadURL(storageRef);
}

// Banner Images
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