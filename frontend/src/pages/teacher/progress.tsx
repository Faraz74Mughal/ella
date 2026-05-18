import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { teacherService } from "@/api/teacher.service";

export default function TeacherProgressPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["teacher-users-progress"],
    queryFn: teacherService.fetchUsersProgress,
  });

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>All Users and Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading users progress...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">XP</th>
                    <th className="py-2 pr-4">Points</th>
                    <th className="py-2 pr-4">Lessons</th>
                    <th className="py-2 pr-4">Current Streak</th>
                    <th className="py-2 pr-4">Highest Streak</th>
                    <th className="py-2">Assignment Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.users || []).map((user) => (
                    <tr key={user._id} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="py-2 pr-4 uppercase">{user.role}</td>
                      <td className="py-2 pr-4">{user.progress.total_xp}</td>
                      <td className="py-2 pr-4">{user.progress.total_points}</td>
                      <td className="py-2 pr-4">{user.progress.completed_lessons_count}</td>
                      <td className="py-2 pr-4">{user.progress.current_streak}</td>
                      <td className="py-2 pr-4">{user.progress.highest_streak}</td>
                      <td className="py-2">{Number(user.progress.assignment_average || 0).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && (!data?.users || data.users.length === 0) && (
            <p className="text-sm text-muted-foreground">No users found.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
