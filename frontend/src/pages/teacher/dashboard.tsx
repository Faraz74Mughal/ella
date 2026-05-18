import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { teacherService } from "@/api/teacher.service";
import { useNavigate } from "react-router-dom";
import { Award, BookOpenText, ClipboardList, Users } from "lucide-react";

export default function TeacherDashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["teacher-dashboard-overview"],
    queryFn: teacherService.fetchDashboardOverview,
  });

  const dashboardCards = [
    {
      title: "Assignments Uploaded",
      value: data?.summary?.totalAssignments ?? 0,
      description: "Total assignments you uploaded",
      icon: ClipboardList,
    },
    {
      title: "Total Students",
      value: data?.summary?.totalStudents ?? 0,
      description: "Students in the platform",
      icon: Users,
    },
    {
      title: "Total Users",
      value: data?.summary?.totalUsers ?? 0,
      description: "All users in the platform",
      icon: BookOpenText,
    },
    {
      title: "Leaderboard Size",
      value: (data?.ranking || []).length,
      description: "Students ranked by XP",
      icon: Award,
    },
  ];

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Teacher analytics, students progress, and ranking insights.</p>
          </div>
          <Button onClick={() => navigate("/teacher/assignments")}>Create Assignment</Button>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <Card className="h-full border-indigo-100 shadow-sm transition hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <item.icon className="h-4 w-4 text-indigo-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-indigo-700">{isLoading ? "..." : item.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader>
            <CardTitle>Student Ranking by XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4">Rank</th>
                    <th className="py-2 pr-4">Student</th>
                    <th className="py-2 pr-4">XP</th>
                    <th className="py-2 pr-4">Points</th>
                    <th className="py-2 pr-4">Completed Lessons</th>
                    <th className="py-2">Current Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.ranking || []).map((student) => (
                    <tr key={student.studentId} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-semibold">#{student.rank}</td>
                      <td className="py-2 pr-4">{student.name}</td>
                      <td className="py-2 pr-4">{student.total_xp}</td>
                      <td className="py-2 pr-4">{student.total_points}</td>
                      <td className="py-2 pr-4">{student.completed_lessons_count}</td>
                      <td className="py-2">{student.current_streak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(!data?.ranking || data.ranking.length === 0) && (
              <p className="text-sm text-muted-foreground">No ranking data available yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
