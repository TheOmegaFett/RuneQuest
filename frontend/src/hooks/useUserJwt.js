import { createContext, useContext } from "react";

export  const defaultUserJwt = {
    accessToken: "",
};

export const UserJwtContext = createContext(defaultUserJwt);

export function useUserJwt() {
    return useContext(UserJwtContext);
};