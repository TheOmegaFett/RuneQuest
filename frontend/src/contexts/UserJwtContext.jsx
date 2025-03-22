import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { defaultUserJwt, UserJwtContext } from "../hooks/useUserJwt";
import { useSessionStorage } from "react-use";

export function UserJwtProvider({children}){
  let [userJwt, setUserJwt] = useState(defaultUserJwt);
  let [jwtsPersisted, setJwtsPersisted] = useSessionStorage('jwt', defaultUserJwt);

  useEffect(() => {
    setJwtsPersisted(userJwt);
  }, [setJwtsPersisted, userJwt]); 

  useEffect(() => {
    setUserJwt(jwtsPersisted);
  }, []);

  return(
    <UserJwtContext.Provider value={[userJwt, setUserJwt]}>
      {children}
    </UserJwtContext.Provider>
  )
}

UserJwtProvider.propTypes = {
  children: PropTypes.ReactNode
}