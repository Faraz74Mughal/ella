import { GOOGLE_AUTH_USER_INFO_LINK } from '@/config';
import { useGoogleSignIn } from '@/services/queries/teacherQueries/auth.queries';
import { GoogleJwtPayload } from '@/types/userType';
import {  TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FaGoogle } from 'react-icons/fa6';
import { toast } from 'sonner';


const GoogleAuth = () => {

  const {mutate:googleSignInMutate}  =useGoogleSignIn()
 
  const handleGoogleLoginSuccess = async (tokenResponse:TokenResponse) => {
    try {
      const userResponse: GoogleJwtPayload =
      await axios.get(GOOGLE_AUTH_USER_INFO_LINK,{
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      }).then(res => res.data);
  
if(userResponse.email_verified===false){
  toast.warning('Google email not verified! Please verify your email with Google and try again.');
  return 
}
      if(userResponse){
        googleSignInMutate({...userResponse})
      }

    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleGoogleLoginFailure = (error:unknown) => {
    console.error('Google Login Failed:', error);
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginFailure,
  });

  return (

      <button onClick={() => login()}>
        <FaGoogle/>
      </button>
  );
};

export default GoogleAuth;