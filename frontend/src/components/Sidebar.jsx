import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <BriefcaseBusiness size={30} />
        <h2>HireTrack</h2>
      </div>

      <p className="menu-heading">MAIN MENU</p>

      <nav className="sidebar-nav">
        <Link to="/">
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link to="/jobs">
          <BriefcaseBusiness size={20} />
          Jobs
        </Link>

        <Link to="/applications">
          <Users size={20} />
          Applications
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <Link to="/settings">
          <Settings size={20} />
          Settings
        </Link>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;