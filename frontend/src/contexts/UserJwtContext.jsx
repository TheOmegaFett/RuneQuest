import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { defaultUserJwt, UserJwtContext } from "../hooks/useUserJwt";
import { useSessionStorage } from "react-use";

export function UserJwtProvider({children}){
  let [userJwt, setUserJwt] = useState(defaultUserJwt);
  let [jwtsPersisted, setJwtPersisted] = useSessionStorage('jwt', defaultUserJwt);

  useEffect(() => {
    setJwtPersisted(userJwt);
  }, [setJwtPersisted, userJwt]); 

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