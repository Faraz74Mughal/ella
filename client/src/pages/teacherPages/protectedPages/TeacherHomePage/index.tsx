import { Button } from "@/components/ui/button"
import { useFetchCurrentUser, useSignOut } from "@/services/queries/teacherQueries/user.queries"

const TeacherHomePage = () => {
  const {data:currentUserData} = useFetchCurrentUser()
  const {mutate:logoutMutate} = useSignOut()
  const logoutHandler = () => {
    logoutMutate()
  }
console.log("|currentUserData",currentUserData);

  return (
    <div>TeacherHomePage

      <Button onClick={logoutHandler}>Logout</Button>
    </div>
  )
}

export default TeacherHomePage