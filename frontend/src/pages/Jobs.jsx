
import { useEffect, useState } from "react";
import API from "../services/api";

const initialForm = {
  title: "",
  company: "",
  location: "",
  description: "",
  salary: "",
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchJobs = async (searchValue = search) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/jobs", {
        params: {
          page: 0,
          size: 100,
          sortBy: "id",
          direction: "desc",
          search: searchValue.trim() || undefined,
        },
      });

      setJobs(response.data.content || []);
    } catch (err) {
      setError("Unable to fetch jobs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs("");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchJobs("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const jobData = {
        ...form,
        salary: form.salary === "" ? null : Number(form.salary),
      };

      if (editingJobId !== null) {
        await API.put(`/jobs/${editingJobId}`, jobData);
        setSuccess("Job updated successfully!");
      } else {
        await API.post("/jobs", jobData);
        setSuccess("Job added successfully!");
      }

      setForm(initialForm);
      setEditingJobId(null);
      setShowForm(false);

      await fetchJobs();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Operation failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      description: job.description || "",
      salary: job.salary ?? "",
    });

    setEditingJobId(job.id);
    setShowForm(true);
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await API.delete(`/jobs/${id}`);
      setSuccess("Job deleted successfully!");
      await fetchJobs();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to delete job."
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingJobId(null);
    setForm(initialForm);
    setError("");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Jobs Management</h1>
          <p>Manage all available job openings.</p>
        </div>

        <div>
          <button className="refresh-btn" onClick={() => fetchJobs()}>
            Refresh
          </button>

          <button
            className="add-job-btn"
            onClick={() => {
              if (showForm) {
                handleCancel();
              } else {
                setForm(initialForm);
                setEditingJobId(null);
                setShowForm(true);
                setError("");
                setSuccess("");
              }
            }}
          >
            {showForm ? "Cancel" : "+ Add Job"}
          </button>
        </div>
      </div>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <div className="jobs-section">
          <h2>{editingJobId !== null ? "Edit Job" : "Add New Job"}</h2>

          <form className="job-form" onSubmit={handleSubmit}>
            <input name="title" placeholder="Job Title" value={form.title}
              onChange={handleChange} required />

            <input name="company" placeholder="Company Name" value={form.company}
              onChange={handleChange} required />

            <input name="location" placeholder="Location" value={form.location}
              onChange={handleChange} required />

            <input name="salary" type="number" min="0"
              placeholder="Annual Salary (₹)" value={form.salary}
              onChange={handleChange} />

            <textarea name="description" placeholder="Job Description"
              value={form.description} onChange={handleChange} rows="4" />

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." :
                editingJobId !== null ? "Update Job" : "Save Job"}
            </button>
          </form>
        </div>
      )}

      <div className="stat-card">
        <h3>Total Jobs</h3>
        <h2>{jobs.length}</h2>
      </div>

      <div className="jobs-section">
        <h2>All Jobs</h2>

        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search by title, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />

          <button type="submit" className="add-job-btn">
            Search
          </button>

          <button
            type="button"
            className="refresh-btn"
            onClick={handleClearSearch}
          >
            Clear
          </button>
        </form>

        {loading && <p>Loading jobs...</p>}

        {!loading && jobs.length === 0 && (
          <p>No jobs found.</p>
        )}

        {!loading && jobs.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>
                      {job.salary != null ? `₹${job.salary}` : "Not specified"}
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(job)}>
                        Edit
                      </button>

                      <button className="delete-btn" onClick={() => handleDelete(job.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;
