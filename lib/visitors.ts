import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export type Visitor = {
  id?: string;
  name: string;
  mobile: string;
  whatsapp: string;
  createdAt?: any;
  lastSeen?: any;
  totalSeconds: number;
  viewedCakes: string[];
  whatsappClicks: number;
};

export async function getVisitorByMobile(
  mobile: string
) {
  const q = query(
    collection(db, "visitors"),
    where("mobile", "==", mobile)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return {
    id: snap.docs[0].id,
    ...(snap.docs[0].data() as Visitor),
  };
}

export async function createVisitor(
  data: Visitor
) {
  const ref = await addDoc(
    collection(db, "visitors"),
    {
      ...data,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    }
  );

  return ref.id;
}

export async function updateVisitor(
  id: string,
  data: Partial<Visitor>
) {
  await updateDoc(doc(db, "visitors", id), {
    ...data,
    lastSeen: serverTimestamp(),
  });
}
import { arrayUnion, increment } from "firebase/firestore";

export async function addViewedCake(
  id: string,
  cakeCode: string
) {
  await updateDoc(doc(db, "visitors", id), {
    viewedCakes: arrayUnion(cakeCode),
  });
}

export async function addWhatsappClick(id: string) {
  await updateDoc(doc(db, "visitors", id), {
    whatsappClicks: increment(1),
  });
}

export async function addVisitSeconds(
  id: string,
  seconds: number
) {
  await updateDoc(doc(db, "visitors", id), {
    totalSeconds: increment(seconds),
    lastSeen: serverTimestamp(),
  });
}