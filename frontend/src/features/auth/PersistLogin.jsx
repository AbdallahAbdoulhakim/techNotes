import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";
import usePersist from "../../hooks/usePersist";
import Spinner from "../../components/Spinner";
import AlternativeAlertError from "../../components/Public/AlternativeAlertError";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (
      effectRan.current === true ||
      import.meta.env.VITE_NODE_ENV !== "development"
    ) {
      const verifyRefreshToken = async () => {
        try {
          //const response =
          await refresh();
          //const {accessToken} = response.data
          setTrueSuccess(true);
        } catch (error) {
          console.error(error);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;

  if (!persist) {
    content = <Outlet />;
  } else if (isLoading) {
    content = <Spinner />;
  } else if (isError) {
    content = (
      <div className="p-4 h-auto pt-20">
        <AlternativeAlertError
          code={error?.status}
          message={error?.data?.error}
          cancelText="Return to Home Page"
          cancelLink="/"
          resultLink="/login"
          resultText="Login again"
        />
      </div>
    );
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
