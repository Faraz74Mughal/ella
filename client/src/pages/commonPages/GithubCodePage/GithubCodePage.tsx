import useGitAuth from "@/hooks/useGitAuth";
import { useEffect } from "react";

const GithubCodePage = () => {
 
  const {exchangeCodeForToken} = useGitAuth()
 
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  return (
    <div></div>
  )
}

export default GithubCodePage