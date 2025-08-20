import { Button } from "@/components/ui/button"
import { useSignOut } from "@/services/queries/teacherQueries/user.queries"

const TeacherHomePage = () => {
  const {mutate:logoutMutate} = useSignOut()
  const logoutHandler = () => {
    logoutMutate()
  }

  return (
    <div>TeacherHomePage

      <Button onClick={logoutHandler}>Logout</Button>
    </div>
  )
}

export default TeacherHomePage