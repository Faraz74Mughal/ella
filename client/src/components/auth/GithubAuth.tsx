import useGitAuth from '@/hooks/useGitAuth'
import { FaGithub } from 'react-icons/fa6'

const GithubAuth = () => {

const {login} = useGitAuth()



  return (
    <span onClick={login}>
        <FaGithub/>
    </span>
  )
}

export default GithubAuth