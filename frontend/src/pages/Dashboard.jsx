
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  UserCheck,
  UserX,
  CheckCircle,
  RefreshCw
} from "lucide-react";

import API from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    applied: 0,
    shortlisted: 0,
    rejected: 0,
    selected: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/dashboard/stats");

      setStats(response.data);
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError("Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: BriefcaseBusiness,
      color: "blue"
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: Users,
      color: "purple"
    },
    {
      title: "Applied",
      value: stats.applied,
      icon: RefreshCw,
      color: "orange"
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted,
      icon: UserCheck,
      color: "green"
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: UserX,
      color: "red"
    },
    {
      title: "Selected",
      value: stats.selected,
      icon: CheckCircle,
      color: "teal"
    }
  ];

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your recruitment overview.</p>
        </div>

        <button className="refresh-btn" onClick={fetchStats}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="stat-card" key={card.title}>
              <div className={`stat-icon ${card.color}`}>
                <Icon size={23} />
              </div>

              <div className="stat-info">
                <p>{card.title}</p>

                <h2>
                  {loading ? "..." : card.value ?? 0}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-bottom">
        <div className="overview-card">
          <h3>Application Overview</h3>
          <p>Current status of all job applications.</p>

          {[
            { label: "Applied", value: stats.applied, color: "#f59e0b" },
            { label: "Shortlisted", value: stats.shortlisted, color: "#16a34a" },
            { label: "Rejected", value: stats.rejected, color: "#ef4444" },
            { label: "Selected", value: stats.selected, color: "#6366f1" }
          ].map((item) => {
            const percentage =
              stats.totalApplications > 0
                ? (item.value / stats.totalApplications) * 100
                : 0;

            return (
              <div className="progress-item" key={item.label}>
                <div className="progress-heading">
                  <span>{item.label}</span>
                  <strong>{loading ? "..." : item.value}</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="welcome-card">
          <div className="welcome-icon">
            <BriefcaseBusiness size={30} />
          </div>

          <h3>Manage Your Recruitment</h3>

          <p>
            Track job openings, monitor applications and manage
            candidate selection from one place.
          </p>

          <div className="welcome-stat">
            <span>Active job records</span>
            <strong>{loading ? "..." : stats.totalJobs}</strong>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
