
import { useEffect, useState } from "react";
import API from "../services/api";

const initialForm = {
  applicantName: "",
  email: "",
  jobId: "",
};

const PAGE_SIZE = 5;

function Applications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [jobFilter, setJobFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [applicationResponse, jobResponse] = await Promise.all([
        API.get("/applications", {
          params: {
            page: 0,
            size: 100,
            sortBy: "id",
            direction: "desc",
          },
        }),
        API.get("/jobs", {
          params: {
            page: 0,
            size: 100,
            sortBy: "id",
            direction: "desc",
          },
        }),
      ]);

      setApplications(applicationResponse.data.content || []);
      setJobs(jobResponse.data.content || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load applications or jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await API.post(`/applications?jobId=${form.jobId}`, {
        applicantName: form.applicantName,
        email: form.email,
      });

      setSuccess("Application added successfully!");
      setForm(initialForm);
      setShowForm(false);
      setCurrentPage(1);

      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to add application."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setError("");
      setSuccess("");

      await API.put(`/applications/${id}/status`, null, {
        params: { status },
      });

      setSuccess("Application status updated!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update status."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await API.delete(`/applications/${id}`);

      setSuccess("Application deleted successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to delete application."
      );
    }
  };

  // Search and filters
  const filteredApplications = applications.filter((application) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      application.applicantName?.toLowerCase().includes(searchText) ||
      application.email?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      application.status === statusFilter;

    const matchesJob =
      jobFilter === "ALL" ||
      String(application.jobId) === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredApplications.length / PAGE_SIZE
  );

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const currentApplications = filteredApplications.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setJobFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Applications Management</h1>
          <p>Track and manage candidate applications.</p>
        </div>

        <div>
          <button className="refresh-btn" onClick={fetchData}>
            Refresh
          </button>

          <button
            className="add-job-btn"
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setSuccess("");

              if (showForm) setForm(initialForm);
            }}
          >
            {showForm ? "Cancel" : "+ Add Application"}
          </button>
        </div>
      </div>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <div className="jobs-section">
          <h2>Add New Application</h2>

          <form className="job-form" onSubmit={handleSubmit}>
            <input
              name="applicantName"
              placeholder="Applicant Name"
              value={form.applicantName}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <select
              name="jobId"
              value={form.jobId}
              onChange={handleChange}
              required
            >
              <option value="">Select a Job</option>

              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} - {job.company} (ID: {job.id})
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={saving || jobs.length === 0}
            >
              {saving ? "Saving..." : "Save Application"}
            </button>

            {jobs.length === 0 && (
              <p>Please add a job before creating an application.</p>
            )}
          </form>
        </div>
      )}

      <div className="stat-card">
        <h3>Total Applications</h3>
        <h2>{applications.length}</h2>
      </div>

      <div className="jobs-section">
        <h2>All Applications</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by applicant name or email..."
          value={search}
          onChange={(e) =>
            handleFilterChange(setSearch, e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        />

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <select
            value={statusFilter}
            onChange={(e) =>
              handleFilterChange(setStatusFilter, e.target.value)
            }
            style={{ padding: "10px", borderRadius: "8px" }}
          >
            <option value="ALL">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="REJECTED">Rejected</option>
            <option value="SELECTED">Selected</option>
          </select>

          <select
            value={jobFilter}
            onChange={(e) =>
              handleFilterChange(setJobFilter, e.target.value)
            }
            style={{ padding: "10px", borderRadius: "8px" }}
          >
            <option value="ALL">All Jobs</option>

            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>

          <button
            className="refresh-btn"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>

        <p>
          Showing {filteredApplications.length} of {applications.length} applications
        </p>

        {loading && <p>Loading applications...</p>}

        {!loading && filteredApplications.length === 0 && (
          <p>No applications found.</p>
        )}

        {!loading && currentApplications.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Job ID</th>
                  <th>Status</th>
                  <th>Applied At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.id}</td>
                    <td>{application.applicantName}</td>
                    <td>{application.email}</td>
                    <td>{application.jobId}</td>

                    <td>
                      <select
                        value={application.status}
                        onChange={(e) =>
                          handleStatusChange(
                            application.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="APPLIED">APPLIED</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="SELECTED">SELECTED</option>
                      </select>
                    </td>

                    <td>
                      {application.appliedAt
                        ? new Date(application.appliedAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(application.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <button
              className="refresh-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="refresh-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
