import { GITHUB_AUTH_CLIENT_SECRET, GITHUB_AUTH_ID } from '@/config';
import axios from 'axios';
import { useEffect } from 'react';
import { FaGithub } from 'react-icons/fa6'

const GithubAuth = () => {

     const CLIENT_ID = GITHUB_AUTH_ID;
  const CLIENT_SECRET = GITHUB_AUTH_CLIENT_SECRET;

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const code  =urlParams.get('code')
    if(code){
        exchangeCodeForToken(code)
    }
  },[])

  const exchangeCodeForToken  = async(code:string)=>{
    try{
        const response = await axios.post('https://github.com/login/oauth/access_token',
             {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
        )
        const { access_token } = response.data;
      
      if (access_token) {
       console.log("ACCESS_TOKEN",access_token);
       
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }catch(error){
console.error('GitHub auth error:', (error as Error).message);
    }
  }

const login = ()=>{
const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user:email`;
window.location.href = githubAuthUrl;

}


  return (
    <span onClick={login}>
        <FaGithub/>
    </span>
  )
}

export default GithubAuth