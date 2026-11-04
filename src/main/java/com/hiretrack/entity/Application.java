
package com.hiretrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;

    private String email;

    private String status = "APPLIED";

    private LocalDateTime appliedAt;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    public Application() {
    }

    @PrePersist
    public void onApply() {
        appliedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }
}
