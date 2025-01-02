/* eslint-disable react/prop-types */
import Loader from "../components/Layout/Loader";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  if (loading === false) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }
};
export default ProtectedRoute;
