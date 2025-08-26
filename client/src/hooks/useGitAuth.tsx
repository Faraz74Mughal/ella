import {  GITHUB_AUTH_ID } from "@/config";
// import { useGithubTokenExchange } from "@/services/queries/teacherQueries/auth.queries";
import axios from "axios";

const useGitAuth = () => {
  const CLIENT_ID = GITHUB_AUTH_ID;
  // const CLIENT_SECRET = GITHUB_AUTH_CLIENT_SECRET;

  // const { mutate: githubTokenExchangeMutate } = useGithubTokenExchange();

  const login = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      console.log("CODE",code);
      
      // githubTokenExchangeMutate(
      //   { code },
      //   {
      //     onSuccess: (response) => {
      //       console.log("Response", response);
      //     }
      //   }
      // );

      // const { access_token } = response.data;
      // if (access_token) {
      //   window.history.replaceState(
      //     {},
      //     document.title,
      //     window.location.pathname
      //   );
      // }
    } catch (error) {
      console.log("Code Error:", (error as Error).message);
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `token ${token}`
        }
      });
      console.log("Response", response);
    } catch (err) {
      localStorage.removeItem("github_token");
      console.error("User fetch error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("github_token");
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return {
    login,
    exchangeCodeForToken,
    fetchUserData,
    logout
  };
};

export default useGitAuth;
