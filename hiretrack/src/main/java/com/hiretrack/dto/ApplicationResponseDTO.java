
package com.hiretrack.dto;

import java.time.LocalDateTime;

public class ApplicationResponseDTO {

    private Long id;
    private String applicantName;
    private String email;
    private String status;
    private LocalDateTime appliedAt;
    private Long jobId;

    public ApplicationResponseDTO(Long id, String applicantName,
            String email, String status, LocalDateTime appliedAt,
            Long jobId) {

        this.id = id;
        this.applicantName = applicantName;
        this.email = email;
        this.status = status;
        this.appliedAt = appliedAt;
        this.jobId = jobId;
    }

    public Long getId() {
        return id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public String getEmail() {
        return email;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public Long getJobId() {
        return jobId;
    }
}

