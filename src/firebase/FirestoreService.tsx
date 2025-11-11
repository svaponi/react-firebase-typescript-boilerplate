import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./config";
import { Unsubscribe } from "firebase/compat";
import { QueryConstraint } from "@firebase/firestore";

export type Unsubscribe = () => void;
export type ObserveCallback<T> = (result: T) => void;

export interface IFirestoreService {
  add: (path: string, data: object) => Promise<void>;
  set: (path: string, data: object) => Promise<void>;
  merge: (path: string, data: object) => Promise<void>;
  get: (path: string) => Promise<object | undefined>;
  delete: (path: string) => Promise<void>;
  list: (
    path: string,
    queryConstraints: QueryConstraint[],
  ) => Promise<object[]>;
  observeList: (
    path: string,
    queryConstraints: QueryConstraint[],
    cb: ObserveCallback<object[]>,
  ) => Unsubscribe;
  observeDoc: (
    path: string,
    cb: ObserveCallback<object | undefined>,
  ) => Unsubscribe;
}

class FirestoreServiceImpl implements IFirestoreService {
  observeDoc(path: string, cb: ObserveCallback<object | undefined>) {
    const ref = doc(db, path);
    console.info("observeDoc", ref, auth.currentUser?.uid);
    const onNext = (snapshot) => {
      let result = undefined;
      if (snapshot.exists()) {
        result = { ...snapshot.data(), id: snapshot.id };
      }
      console.info("observeDoc result", result);
      cb(result);
    };
    const onError = (error) => {
      console.error("observeList error", error);
    };
    try {
      const unsubscribe = onSnapshot(ref, onNext, onError);
      return () => unsubscribe();
    } catch (e) {
      console.error("observeList catch e", e);
      return () => undefined;
    }
  }

  observeList(
    path: string,
    queryConstraints: QueryConstraint[],
    cb: ObserveCallback<object[]>,
  ) {
    const ref = collection(db, path);
    console.info("observeList", ref, auth.currentUser?.uid);
    const q = query(ref, ...queryConstraints);
    const onNext = (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        console.log(">>>", doc);
        results.push({ ...doc.data(), id: doc.id });
      });
      console.info("observeList results", results);
      cb(results);
    };
    const onError = (error) => {
      console.error("observeList error", error);
    };
    try {
      const unsubscribe = onSnapshot(q, onNext, onError);
      return () => unsubscribe();
    } catch (e) {
      console.error("observeList catch e", e);
      return () => undefined;
    }
  }

  async list(path: string, queryConstraints: QueryConstraint[]) {
    const ref = collection(db, path);
    console.info("list", ref, auth.currentUser?.uid);
    const q = query(ref, ...queryConstraints);
    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ ...doc.data(), id: doc.id });
    });
    console.info("list results", results);
    return results;
  }

  async get(path: string) {
    const ref = doc(db, path);
    console.info("get", ref, auth.currentUser?.uid);
    const snapshot = await getDoc(ref);
    let result = undefined;
    if (snapshot.exists()) {
      result = { ...snapshot.data(), id: snapshot.id };
    }
    console.info("get result", result);
    return result;
  }

  async add(path: string, data: object) {
    const ref = collection(db, path);
    const payload = {
      ...data,
      lastModifiedAt: serverTimestamp(),
      uid: auth.currentUser.uid,
    };
    console.info("add", ref, payload);
    const result = await addDoc(ref, payload);
    console.info("add result", result);
  }

  async set(path: string, data: object) {
    const ref = doc(db, path);
    const payload = {
      ...data,
      lastModifiedAt: serverTimestamp(),
      uid: auth.currentUser.uid,
    };
    console.info("set", ref, payload);
    return await setDoc(ref, payload);
  }

  async merge(path: string, data: object) {
    const ref = doc(db, path);
    const payload = {
      ...data,
      lastModifiedAt: serverTimestamp(),
      uid: auth.currentUser.uid,
    };
    console.info("merge", ref, payload);
    return await setDoc(ref, payload, { merge: true });
  }

  async delete(path: string) {
    const ref = doc(db, path);
    console.info("delete", ref, auth.currentUser?.uid);
    return await deleteDoc(ref);
  }
}

export const FirestoreService: IFirestoreService = new FirestoreServiceImpl();
