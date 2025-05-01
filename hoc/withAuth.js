// hoc/withAuth.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuthStore from "../store/store";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { token, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!token) {
        router.replace("/login");
      }
      console.log(user, "user"); // Log user object to console
      if (user?.role !== "admin") {
        router.replace("/"); // Redirect to home if not admin
      }
    }, [token]);

    if (!token) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
