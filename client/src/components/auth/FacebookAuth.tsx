import { FACEBOOK_AUTH_ID } from '@/config'
import { useFacebookSignIn } from '@/services/queries/teacherQueries/auth.queries';
import FacebookLogin from '@greatsumini/react-facebook-login'
import { FaFacebook } from 'react-icons/fa6';

const FacebookAuth = () => {
    const {mutate:facebookSignInMutate} =useFacebookSignIn()
  return (
    <>
    <FacebookLogin
    appId={FACEBOOK_AUTH_ID}
//     onSuccess={(response) => {
//     console.log('Login Success!', response);
//   }}
  onFail={(error) => {
    console.log('Login Failed!', error);
  }}
  onProfileSuccess={(response) => {
    const data ={firstName:response.name!.split(" ")[0],lastName:response.name!.split(" ")?.[1]||"",email:response.email!,picture:response.picture?.data?.url,role:"teacher"}
facebookSignInMutate(data)
    console.log('Get Profile Success!', response);
  }}
  render={({ onClick }) => (
    <span onClick={onClick}  >
        <FaFacebook/>
        </span>
  )}
    />
    </>
  )
}

export default FacebookAuth