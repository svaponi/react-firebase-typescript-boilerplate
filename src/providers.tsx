import React, { PropsWithChildren } from "react";
import { AuthContextProvider } from "./firebase/AuthContext";

export const Providers = ({ children }: PropsWithChildren) => (
  <AuthContextProvider>{children}</AuthContextProvider>
);
