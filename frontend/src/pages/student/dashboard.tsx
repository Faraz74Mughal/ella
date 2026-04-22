import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const StudentDashboardPage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return <div>StudentDashboardPage
    <button onClick={handleLogout}
    className="bg-white text-black rounded-lg px-3 py-2"
    >Logout</button>
  </div>;
};

export default StudentDashboardPage;
