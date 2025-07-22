import { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

interface RoleRouteProps {
  children: JSX.Element;
  allowedRoles: string[]; // ex: ["client", "provider"]
}

const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default RoleRoute;
