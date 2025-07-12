import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

axios.defaults.withCredentials = true; 

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const background_url = import.meta.env.VITE_BACKEND_URL;
  const [loggedIn, setIsloggedin] = useState(false);
  const [userData, setUserdata] = useState();

  const getUserdata = async () => {
    try {
      const { data } = await axios.get(background_url + '/api/user/data');
      if (data?.success) {
        setUserdata(data.userData);
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching user data");
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(background_url + '/api/auth/is-auth');
      if (data?.success) {
        setIsloggedin(true);
        getUserdata();
      }
    }  catch (error) {
  toast.error(error.response?.data?.message || "Auth check failed", { toastId: "auth-error" });
}

  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    background_url,
    loggedIn,
    setIsloggedin,
    userData,
    setUserdata,
    getUserdata,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
