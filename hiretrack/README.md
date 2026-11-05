# HireTrack – Job & Recruitment Management System

HireTrack is a Spring Boot-based REST API project designed to simplify job management and recruitment activities. It allows recruiters to manage job postings, track applications, search jobs, and view recruitment dashboard statistics.

##  Features

- **Job Management:** Create, view, update, and delete job postings.
- **Application Management:** Apply for jobs and manage application statuses.
- **Job Search & Filtering:** Search jobs by title, company, and location.
- **Recruiter Dashboard:** View total jobs, applications, and application status statistics.
- **Input Validation:** Validate job details, applicant names, and email addresses.

##  Tech Stack

- Java 21
- Spring Boot 4.1.2
- Spring Web MVC
- Spring Data JPA
- MySQL
- Maven
- Postman
- Git & GitHub

##  Project Structure

```text
src/main/java/com/hiretrack/
├── controller/
├── entity/
├── repository/
├── service/
└── HiretrackApplication.java
```

## ⚙️ Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/divya-mahawar/HireTrack.git
   ```

2. Open the project folder:

   ```bash
   cd HireTrack
   ```

3. Configure your MySQL database.

4. Update your local database credentials in:

   `src/main/resources/application.properties`

   Do not commit this file or share your database password publicly.

5. Run the application:

   **Windows:**
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

6. The application will start at:

   `http://localhost:8080`

## 🔗 API Endpoints

### Job Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/jobs` | Create a job |
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/{id}` | Get job by ID |
| PUT | `/api/jobs/{id}` | Update job |
| DELETE | `/api/jobs/{id}` | Delete job |

### Job Search & Filtering

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs/search/title?title=Backend` | Search by title |
| GET | `/api/jobs/search/company?company=Google` | Search by company |
| GET | `/api/jobs/search/location?location=Noida` | Filter by location |

### Application Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications?jobId=1` | Apply for a job |
| GET | `/api/applications` | Get all applications |
| GET | `/api/applications/{id}` | Get application by ID |
| PUT | `/api/applications/{id}/status?status=SHORTLISTED` | Update application status |
| DELETE | `/api/applications/{id}` | Delete an application |

### Recruiter Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Get recruitment statistics |

##  API Testing

All REST APIs were tested using Postman.

##  Author

**Divya Mahawar**

GitHub: [divya-mahawar](https://github.com/divya-mahawar)

---

 If you find this project interesting, feel free to explore the repository!
