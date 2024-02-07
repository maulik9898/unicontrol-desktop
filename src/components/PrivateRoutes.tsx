import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children?: ReactNode;
}

const PrivateRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  console.log("Authstate", authStatus)
  if (authStatus == "authenticated") {
    return <>{children}</>
  }

  if (authStatus == "unauthenticated") {
    return <Navigate to={"/auth/login"} replace={true} />
  }

  if (authStatus == 'configuring') {
    return <div>Configuring </div>
  }
};

export default PrivateRoutes;
