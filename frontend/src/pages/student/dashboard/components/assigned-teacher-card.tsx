import { Clock } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { assignmentService } from "@/api/assignment.service";

const AssignedTeacherCard = () => {
  const navigate = useNavigate();
  const { data: assignments = [] } = useQuery({
    queryKey: ["student-assignments"],
    queryFn: assignmentService.fetchStudentAssignments,
  });

  const activeAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.status === "active")
      .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
      .slice(0, 3);
  }, [assignments]);

  const getColorClasses = (index: number) => {
    const colors = [
      { bg: "bg-rose-50", text: "text-rose-500" },
      { bg: "bg-indigo-50", text: "text-indigo-500" },
      { bg: "bg-amber-50", text: "text-amber-500" },
    ];
    return colors[index % colors.length];
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-800">
          Assigned by Teacher
        </h2>
        <button
          onClick={() => navigate("/student/assignments")}
          className="text-xs font-bold text-indigo-600 underline hover:text-indigo-700"
        >
          View all
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
        {activeAssignments.length > 0 ? (
          activeAssignments.map((assignment, idx) => {
            const daysLeft = getDaysRemaining(assignment.end_date);
            const colors = getColorClasses(idx);

            return (
              <div key={assignment._id} className="p-5 flex items-center gap-4 hover:bg-slate-50 transition cursor-pointer group">
                <div className={`w-12 h-12 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center font-bold`}>
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">
                    {assignment.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Due in {daysLeft} day{daysLeft !== 1 ? "s" : ""} • {assignment.total_marks} marks
                  </p>
                </div>
                <button
                  onClick={() => navigate("/student/assignments")}
                  className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition"
                >
                  OPEN
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400">
            <p>No active assignments at the moment</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AssignedTeacherCard;
