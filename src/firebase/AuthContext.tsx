import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import Cookies from "universal-cookie";
import { auth, provider } from "./config";

const cookies = new Cookies();

export interface AuthContextProps {
  user: User | null;
  isSignedIn: boolean;
  isLoadingUser: boolean;
  logout: () => Promise<Error | undefined>;
  signInWithGoogle: () => Promise<Error | undefined>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuthContext = () => {
  const value = useContext(AuthContext);
  if (value === null) throw Error("No context, add <AuthContextProvider>");
  return value;
};

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(
    !!cookies.get("signed-in-user-email"),
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoadingUser(false);
      console.log("onAuthStateChanged", user);
      if (user) {
        cookies.set("signed-in-user-email", user.email);
        setIsSignedIn(true);
      } else {
        cookies.remove("signed-in-user-email");
        setIsSignedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useMemo(
    () => async () => {
      try {
        await signInWithPopup(auth, provider);
      } catch (e: Error) {
        return e;
      }
    },
    [],
  );

  const logout = useMemo(
    () => async () => {
      try {
        await signOut(auth);
      } catch (e: Error) {
        return e;
      }
    },
    [],
  );

  const value = useMemo(() => {
    return {
      user,
      isLoadingUser,
      isSignedIn,
      logout,
      signInWithGoogle,
    };
  }, [user, isLoadingUser, isSignedIn, logout, signInWithGoogle]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
